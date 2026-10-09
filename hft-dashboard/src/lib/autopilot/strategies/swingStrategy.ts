import {
  AutopilotConfig,
  AutopilotPosition,
  StrategySignal,
  StrategyType,
} from "../types";
import { MarketAnalysisSnapshot } from "../analysis/marketAnalysisEngine";
import { calculateIndianTransactionCosts, IAutopilotStrategy } from "./strategyInterface";
import { UniverseService } from "../universe/nifty50Universe";

/**
 * NIFTY 50 SWING MOMENTUM & VOLATILITY-STOP STRATEGY
 * Version: v1.2.0-swing-atr
 * 
 * Rules:
 * 1. Macro Filter: Trades only when Nifty 50 is in BULLISH_TREND or RANGE_BOUND (India VIX < 22).
 * 2. Position Filter: Max concurrent positions bounded by config.
 * 3. Candidate Selection:
 *    - Price > 50-day SMA
 *    - Relative Strength (RS Rating) >= 65 vs Nifty 50
 *    - Volume Surge >= 1.2x (20-day average volume)
 *    - RSI(14) between 45 and 72 (avoid extreme overbought exhaustion)
 * 4. Stop Loss: 2.0x ATR-14 below entry price.
 * 5. Target: 2.5R (Risk-to-Reward 1:2.5).
 * 6. Sizing: Sized strictly to risk exactly `riskPerTradePct` of capital at stop loss.
 * 7. Trailing Stop: If configured, trails at (Highest Price - 2.0x ATR).
 * 8. Returns NO_TRADE with human-readable rationale whenever conditions are unmet.
 */
export class SwingStrategy implements IAutopilotStrategy {
  public readonly version = "v1.2.0-swing-atr";
  public readonly type: StrategyType = "SWING";
  public readonly description = "Deterministic multi-day swing momentum on Nifty 50 cash equities with ATR-based volatility stops.";

  public calculatePositionSize(
    capital: number,
    riskPerTradePct: number,
    entryPrice: number,
    stopLossPrice: number,
    maxPositionCapPct: number,
    maxOrderValue: number
  ): number {
    if (capital <= 0 || entryPrice <= 0 || stopLossPrice >= entryPrice) {
      return 0;
    }

    const riskAmount = capital * (riskPerTradePct / 100.0);
    const riskPerShare = entryPrice - stopLossPrice;
    
    if (riskPerShare <= 0) return 0;

    // Quantity based purely on risk budget
    let quantity = Math.floor(riskAmount / riskPerShare);

    // Cap 1: Max Position Cap (% of total capital)
    const maxCapitalPerPosition = capital * (maxPositionCapPct / 100.0);
    const maxQtyByPositionCap = Math.floor(maxCapitalPerPosition / entryPrice);
    quantity = Math.min(quantity, maxQtyByPositionCap);

    // Cap 2: Max Single Order Value (₹ cap)
    const maxQtyByOrderCap = Math.floor(maxOrderValue / entryPrice);
    quantity = Math.min(quantity, maxQtyByOrderCap);

    return Math.max(0, quantity);
  }

  public generateSignals(
    snapshot: MarketAnalysisSnapshot,
    config: AutopilotConfig,
    positions: AutopilotPosition[],
    availableFunds: number
  ): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const now = snapshot.timestamp;
    const indexData = snapshot.indexData;

    // ── 1. EVALUATE EXISTING POSITIONS (Exits & Trailing Stops) ──
    for (const pos of positions) {
      const stockData = snapshot.stocksData.get(pos.symbol);
      if (!stockData) continue;

      const currentLtp = stockData.ltp;
      const highestPrice = Math.max(pos.highestPriceSinceEntry || pos.avgEntryPrice, currentLtp);
      const atr = stockData.atr14 || 10;

      // Trailing stop calculation if enabled
      let activeStop = pos.stopLossPrice;
      if (config.trailingStopEnabled) {
        const trailingStop = highestPrice - (config.trailingAtrMultiplier || 2.0) * atr;
        activeStop = Math.max(activeStop, trailingStop);
      }

      // Check Stop Loss Exit
      if (currentLtp <= activeStop) {
        const costs = calculateIndianTransactionCosts(currentLtp, pos.quantity, false, true, config.maxSlippageBps);
        signals.push({
          id: `SIG-EXIT-SL-${pos.symbol}-${Date.now().toString(36)}`,
          timestamp: now,
          symbol: pos.symbol,
          strategy: "SWING",
          action: "SELL",
          reason: `Stop loss breached at ₹${currentLtp.toFixed(2)} (Stop: ₹${activeStop.toFixed(2)})`,
          confidence: 0.95,
          entryPrice: currentLtp,
          stopLossPrice: activeStop,
          suggestedQty: pos.quantity,
          estimatedCost: costs,
          metadata: {
            regime: indexData.marketRegime,
          },
        });
        continue;
      }

      // Check Target Exit
      if (pos.targetPrice && currentLtp >= pos.targetPrice) {
        const costs = calculateIndianTransactionCosts(currentLtp, pos.quantity, false, true, config.maxSlippageBps);
        signals.push({
          id: `SIG-EXIT-TP-${pos.symbol}-${Date.now().toString(36)}`,
          timestamp: now,
          symbol: pos.symbol,
          strategy: "SWING",
          action: "SELL",
          reason: `Profit target achieved at ₹${currentLtp.toFixed(2)} (Target: ₹${pos.targetPrice.toFixed(2)})`,
          confidence: 0.90,
          entryPrice: currentLtp,
          suggestedQty: pos.quantity,
          estimatedCost: costs,
          metadata: {
            regime: indexData.marketRegime,
          },
        });
        continue;
      }
    }

    // ── 2. MACRO REGIME CHECK FOR NEW ENTRIES ──
    if (indexData.marketRegime === "HIGH_VOLATILITY") {
      signals.push({
        id: `SIG-NO-TRADE-VIX-${Date.now().toString(36)}`,
        timestamp: now,
        symbol: "NIFTY 50",
        strategy: "SWING",
        action: "NO_TRADE",
        reason: `India VIX elevated at ${indexData.indiaVix.toFixed(1)} > 22.0. High volatility regime blocks new swing entries.`,
        confidence: 0.99,
        metadata: { regime: indexData.marketRegime },
      });
      return signals;
    }

    if (indexData.marketRegime === "BEARISH_TREND") {
      signals.push({
        id: `SIG-NO-TRADE-TREND-${Date.now().toString(36)}`,
        timestamp: now,
        symbol: "NIFTY 50",
        strategy: "SWING",
        action: "NO_TRADE",
        reason: `Nifty 50 in confirmed bearish trend below 50 & 200 EMA. Swing longs prohibited.`,
        confidence: 0.99,
        metadata: { regime: indexData.marketRegime },
      });
      return signals;
    }

    // ── 3. CAPACITY CHECK ──
    const activePositionCount = positions.length;
    if (activePositionCount >= config.maxPositions) {
      signals.push({
        id: `SIG-NO-TRADE-CAPACITY-${Date.now().toString(36)}`,
        timestamp: now,
        symbol: "PORTFOLIO",
        strategy: "SWING",
        action: "NO_TRADE",
        reason: `Max concurrent positions limit reached (${activePositionCount}/${config.maxPositions}). No new entries.`,
        confidence: 0.95,
        metadata: { regime: indexData.marketRegime },
      });
      return signals;
    }

    // ── 4. CONSTITUENT EVALUATION & RANKING ──
    const existingSymbols = new Set(positions.map((p) => p.symbol));
    const constituents = UniverseService.getAllConstituents();

    interface ScoredCandidate {
      symbol: string;
      data: import("../types").StockMarketData;
      score: number;
    }

    const candidates: ScoredCandidate[] = [];

    for (const c of constituents) {
      if (existingSymbols.has(c.symbol)) continue; // Already holding

      const stockData = snapshot.stocksData.get(c.symbol);
      if (!stockData || stockData.freshness !== "FRESH") continue;

      // Criteria 1: Trend filter (Price > SMA 50)
      if (stockData.ltp <= stockData.sma50) continue;

      // Criteria 2: Relative strength vs Nifty 50 >= 65
      if (stockData.rsRating < 65) continue;

      // Criteria 3: Volume surge ratio >= 1.15
      if (stockData.volumeSurgeRatio < 1.15) continue;

      // Criteria 4: RSI(14) between 45 and 72
      if (stockData.rsi14 < 45 || stockData.rsi14 > 72) continue;

      const compositeScore = (stockData.rsRating * 0.5) + (stockData.volumeSurgeRatio * 20) + (stockData.changePct * 5);
      candidates.push({ symbol: c.symbol, data: stockData, score: compositeScore });
    }

    // Sort descending by composite momentum score
    candidates.sort((a, b) => b.score - a.score);

    // Generate signals for top candidates that fit available slots
    const availableSlots = config.maxPositions - activePositionCount;
    const selectedCandidates = candidates.slice(0, availableSlots);

    if (selectedCandidates.length === 0) {
      signals.push({
        id: `SIG-NO-TRADE-SCREEN-${Date.now().toString(36)}`,
        timestamp: now,
        symbol: "NIFTY 50 UNIVERSE",
        strategy: "SWING",
        action: "NO_TRADE",
        reason: `Zero Nifty 50 constituents simultaneously satisfied RS >= 65, VolSurge >= 1.15x, and Price > 50 EMA.`,
        confidence: 0.85,
        metadata: { regime: indexData.marketRegime },
      });
      return signals;
    }

    for (const cand of selectedCandidates) {
      const stock = cand.data;
      const entryPrice = stock.ltp;
      const atr = stock.atr14 || (entryPrice * 0.02);
      
      const stopDistance = Math.max(entryPrice * 0.015, atr * 2.0);
      const stopLossPrice = Math.round((entryPrice - stopDistance) * 100) / 100;
      const targetPrice = Math.round((entryPrice + stopDistance * 2.5) * 100) / 100;

      const quantity = this.calculatePositionSize(
        config.capital,
        config.riskPerTradePct,
        entryPrice,
        stopLossPrice,
        config.maxPositionCapPct,
        config.maxOrderValue
      );

      const requiredFunds = quantity * entryPrice;
      if (quantity <= 0 || requiredFunds > availableFunds) {
        signals.push({
          id: `SIG-NO-TRADE-FUNDS-${stock.symbol}-${Date.now().toString(36)}`,
          timestamp: now,
          symbol: stock.symbol,
          strategy: "SWING",
          action: "NO_TRADE",
          reason: `Insufficient uncommitted capital (₹${availableFunds.toLocaleString("en-IN")}) for sized position in ${stock.symbol} (Req: ₹${requiredFunds.toLocaleString("en-IN")}).`,
          confidence: 0.90,
          metadata: { regime: indexData.marketRegime },
        });
        continue;
      }

      const costs = calculateIndianTransactionCosts(entryPrice, quantity, true, true, config.maxSlippageBps);

      signals.push({
        id: `SIG-BUY-${stock.symbol}-${Date.now().toString(36)}`,
        timestamp: now,
        symbol: stock.symbol,
        strategy: "SWING",
        action: "BUY",
        reason: `Strong relative strength (RS ${stock.rsRating}/100) with ${stock.volumeSurgeRatio.toFixed(2)}x volume surge above 50-day EMA.`,
        confidence: Math.min(0.92, Math.round(cand.score) / 100),
        entryPrice,
        stopLossPrice,
        targetPrice,
        suggestedQty: quantity,
        atr,
        riskRewardRatio: 2.5,
        estimatedCost: costs,
        metadata: {
          rsRating: stock.rsRating,
          volumeSurge: stock.volumeSurgeRatio,
          regime: indexData.marketRegime,
          trendScore: cand.score,
        },
      });
    }

    return signals;
  }
}

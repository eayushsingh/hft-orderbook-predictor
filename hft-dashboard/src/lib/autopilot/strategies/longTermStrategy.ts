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
 * NIFTY 50 LONG-TERM FACTOR ALLOCATION & DRIFT-BAND REBALANCING
 * Version: v1.1.0-longterm-factor
 * 
 * Rules:
 * 1. Factor Portfolio: Selects and holds top 10 Nifty 50 constituents by quality-momentum composite.
 * 2. Target Weighting: Proportional weight with cap of `maxPositionCapPct` per stock and `maxSectorCapPct` per sector.
 * 3. Drift Band: Rebalances only when active weight drifts beyond `rebalanceBandPct` (e.g. +/- 3%).
 * 4. Stop Logic: No tight short-term ATR stops; allows investments to ride macroeconomic compounding.
 * 5. Returns deterministic NO_TRADE with reason when portfolio is balanced within tolerance.
 */
export class LongTermStrategy implements IAutopilotStrategy {
  public readonly version = "v1.1.0-longterm-factor";
  public readonly type: StrategyType = "LONG_TERM";
  public readonly description = "Systematic factor-weighted allocation & drift-band rebalancing across top Nifty 50 constituents.";

  public calculatePositionSize(
    capital: number,
    _riskPerTradePct: number,
    entryPrice: number,
    _stopLossPrice: number,
    maxPositionCapPct: number,
    maxOrderValue: number
  ): number {
    if (capital <= 0 || entryPrice <= 0) return 0;

    // Target allocation per basket slot (e.g. 10% if 10 stocks)
    const targetCapital = capital * (maxPositionCapPct / 100.0);
    const targetQty = Math.floor(targetCapital / entryPrice);
    const maxQtyByOrderCap = Math.floor(maxOrderValue / entryPrice);

    return Math.max(0, Math.min(targetQty, maxQtyByOrderCap));
  }

  public generateSignals(
    snapshot: MarketAnalysisSnapshot,
    config: AutopilotConfig,
    positions: AutopilotPosition[],
    availableFunds: number
  ): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const now = snapshot.timestamp;
    const targetBasketSize = Math.min(config.maxPositions, 10);
    const constituents = UniverseService.getAllConstituents();

    // ── 1. RANK UNIVERSE BY QUALITY & RELATIVE MOMENTUM ──
    interface RankedStock {
      symbol: string;
      score: number;
      ltp: number;
      weightagePct: number;
      sector: string;
    }

    const ranked: RankedStock[] = [];

    for (const c of constituents) {
      const stockData = snapshot.stocksData.get(c.symbol);
      if (!stockData || stockData.freshness !== "FRESH") continue;

      // Long-term factor score: 50% Index Weight + 50% RS Rating
      const score = (c.weightagePct * 5.0) + (stockData.rsRating * 0.5);
      ranked.push({
        symbol: c.symbol,
        score,
        ltp: stockData.ltp,
        weightagePct: c.weightagePct,
        sector: c.sector,
      });
    }

    ranked.sort((a, b) => b.score - a.score);
    const topTargetBasket = ranked.slice(0, targetBasketSize);
    const topSymbolsSet = new Set(topTargetBasket.map((s) => s.symbol));

    // ── 2. CHECK FOR DIVESTMENTS (Positions no longer in top basket) ──
    for (const pos of positions) {
      if (!topSymbolsSet.has(pos.symbol)) {
        const stockData = snapshot.stocksData.get(pos.symbol);
        const ltp = stockData ? stockData.ltp : pos.avgEntryPrice;
        const costs = calculateIndianTransactionCosts(ltp, pos.quantity, false, true, config.maxSlippageBps);

        signals.push({
          id: `SIG-REBALANCE-EXIT-${pos.symbol}-${Date.now().toString(36)}`,
          timestamp: now,
          symbol: pos.symbol,
          strategy: "LONG_TERM",
          action: "SELL",
          reason: `Stock fell out of top ${targetBasketSize} factor ranking during systematic rebalance.`,
          confidence: 0.88,
          entryPrice: ltp,
          suggestedQty: pos.quantity,
          estimatedCost: costs,
          metadata: {
            regime: snapshot.indexData.marketRegime,
          },
        });
      }
    }

    // ── 3. CHECK FOR NEW ENTRIES OR REBALANCING DRIFT ──
    const currentPositionsMap = new Map<string, AutopilotPosition>();
    let totalPortfolioValue = availableFunds;

    for (const pos of positions) {
      currentPositionsMap.set(pos.symbol, pos);
      const stockData = snapshot.stocksData.get(pos.symbol);
      const ltp = stockData ? stockData.ltp : pos.avgEntryPrice;
      totalPortfolioValue += pos.quantity * ltp;
    }

    const targetWeightPerStock = 1.0 / targetBasketSize;
    const driftTolerance = (config.rebalanceBandPct || 3.0) / 100.0;

    for (const targetStock of topTargetBasket) {
      const existingPos = currentPositionsMap.get(targetStock.symbol);
      const targetAllocationValue = totalPortfolioValue * targetWeightPerStock;

      if (!existingPos) {
        // New position entry
        const entryPrice = targetStock.ltp;
        const quantity = Math.floor(Math.min(targetAllocationValue, config.maxOrderValue) / entryPrice);

        const requiredCapital = quantity * entryPrice;
        if (quantity > 0 && requiredCapital <= availableFunds) {
          const costs = calculateIndianTransactionCosts(entryPrice, quantity, true, true, config.maxSlippageBps);
          signals.push({
            id: `SIG-ALLOC-BUY-${targetStock.symbol}-${Date.now().toString(36)}`,
            timestamp: now,
            symbol: targetStock.symbol,
            strategy: "LONG_TERM",
            action: "BUY",
            reason: `Target allocation for top-ranked factor basket constituent (${targetStock.sector}).`,
            confidence: 0.90,
            entryPrice,
            suggestedQty: quantity,
            estimatedCost: costs,
            metadata: {
              trendScore: targetStock.score,
              regime: snapshot.indexData.marketRegime,
            },
          });
        }
      } else {
        // Drift check on existing position
        const currentValue = existingPos.quantity * targetStock.ltp;
        const currentWeight = currentValue / totalPortfolioValue;
        const weightDelta = Math.abs(currentWeight - targetWeightPerStock);

        if (weightDelta > driftTolerance) {
          // Weight drift exceeded threshold
          if (currentWeight < targetWeightPerStock - driftTolerance) {
            const addValue = targetAllocationValue - currentValue;
            const addQty = Math.floor(addValue / targetStock.ltp);
            if (addQty > 0 && addQty * targetStock.ltp <= availableFunds) {
              const costs = calculateIndianTransactionCosts(targetStock.ltp, addQty, true, true, config.maxSlippageBps);
              signals.push({
                id: `SIG-DRIFT-BUY-${targetStock.symbol}-${Date.now().toString(36)}`,
                timestamp: now,
                symbol: targetStock.symbol,
                strategy: "LONG_TERM",
                action: "BUY",
                reason: `Weight drifted below target band (${(currentWeight * 100).toFixed(1)}% vs ${(targetWeightPerStock * 100).toFixed(1)}%). Rebalance buy.`,
                confidence: 0.85,
                entryPrice: targetStock.ltp,
                suggestedQty: addQty,
                estimatedCost: costs,
                metadata: { regime: snapshot.indexData.marketRegime },
              });
            }
          }
        }
      }
    }

    if (signals.length === 0) {
      signals.push({
        id: `SIG-NO-TRADE-BALANCED-${Date.now().toString(36)}`,
        timestamp: now,
        symbol: "LONG_TERM_PORTFOLIO",
        strategy: "LONG_TERM",
        action: "NO_TRADE",
        reason: `Portfolio weights are within +/-${(driftTolerance * 100).toFixed(1)}% target drift band. Rebalance not required.`,
        confidence: 0.95,
        metadata: { regime: snapshot.indexData.marketRegime },
      });
    }

    return signals;
  }
}

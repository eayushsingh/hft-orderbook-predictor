import {
  AutopilotConfig,
  AutopilotOrder,
  AutopilotPosition,
  RiskCheckResult,
  StockMarketData,
  StrategySignal,
} from "../types";
import { UniverseService } from "../universe/nifty50Universe";

export interface PortfolioRiskSnapshot {
  totalCapital: number;
  availableCash: number;
  investedValue: number;
  realizedDailyPnl: number;
  unrealizedPnl: number;
  totalDailyPnl: number;
  peakEquity: number;
  currentDrawdownPct: number;
  activePositions: AutopilotPosition[];
  openOrders: AutopilotOrder[];
}

export class RiskEngine {
  private static readonly DEBOUNCE_MS = 5000; // 5s debounce window for identical symbol orders
  private static lastOrderTimestamps = new Map<string, number>();

  /**
   * Evaluates all 12 independent risk barriers before an order can be submitted.
   * If ANY check fails, order is blocked immediately with a diagnostic reason.
   */
  public static evaluateRisk(
    signal: StrategySignal,
    stockData: StockMarketData | undefined,
    config: AutopilotConfig,
    portfolio: PortfolioRiskSnapshot
  ): RiskCheckResult[] {
    const results: RiskCheckResult[] = [];
    const now = new Date().toISOString();

    // ── 1. KILL SWITCH CHECK ──
    if (config.state === "KILL_SWITCH_ENGAGED") {
      results.push({
        passed: false,
        checkName: "KILL_SWITCH",
        rejectReason: "EMERGENCY KILL SWITCH IS ACTIVE. All new trading is strictly locked.",
        timestamp: now,
      });
      return results; // Immediate abort
    }

    if (config.state === "PAUSED" && signal.action === "BUY") {
      results.push({
        passed: false,
        checkName: "KILL_SWITCH",
        rejectReason: "Autopilot engine is PAUSED by operator. New entries blocked.",
        timestamp: now,
      });
      return results;
    }

    // Exits are always permitted for risk reduction, but we still validate basic sanity
    if (signal.action === "SELL") {
      results.push({
        passed: true,
        checkName: "UNIVERSE_ELIGIBILITY",
        timestamp: now,
      });
      return results;
    }

    // ── 2. UNIVERSE ELIGIBILITY BARRIER ──
    const universeValidation = UniverseService.validateUniverseSafety(signal.symbol);
    if (!universeValidation.eligible) {
      results.push({
        passed: false,
        checkName: "UNIVERSE_ELIGIBILITY",
        rejectReason: universeValidation.reason || "Symbol outside authorized Nifty 50 cash equity universe.",
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "UNIVERSE_ELIGIBILITY", timestamp: now });

    // ── 3. DATA FRESHNESS BARRIER ──
    if (!stockData || stockData.freshness !== "FRESH") {
      results.push({
        passed: false,
        checkName: "DATA_FRESHNESS",
        rejectReason: `Market data for ${signal.symbol} is ${stockData?.freshness || "UNAVAILABLE"}. Trading on stale quotes is forbidden.`,
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "DATA_FRESHNESS", timestamp: now });

    const entryPrice = signal.entryPrice || stockData.ltp;
    const quantity = signal.suggestedQty || 0;
    const orderValue = entryPrice * quantity;

    if (quantity <= 0 || entryPrice <= 0) {
      results.push({
        passed: false,
        checkName: "AVAILABLE_FUNDS",
        rejectReason: `Malformed order dimensions: quantity=${quantity}, price=${entryPrice}.`,
        timestamp: now,
      });
      return results;
    }

    // ── 4. AVAILABLE FUNDS BARRIER ──
    const totalRequiredCapital = orderValue + (signal.estimatedCost?.totalCharges || 0);
    if (totalRequiredCapital > portfolio.availableCash) {
      results.push({
        passed: false,
        checkName: "AVAILABLE_FUNDS",
        rejectReason: `Insufficient uncommitted cash (₹${portfolio.availableCash.toFixed(2)}) for order requirement ₹${totalRequiredCapital.toFixed(2)}.`,
        timestamp: now,
        diagnostics: { required: totalRequiredCapital, available: portfolio.availableCash },
      });
      return results;
    }
    results.push({ passed: true, checkName: "AVAILABLE_FUNDS", timestamp: now });

    // ── 5. MAX ORDER VALUE CAP BARRIER ──
    if (orderValue > config.maxOrderValue) {
      results.push({
        passed: false,
        checkName: "MAX_ORDER_VALUE",
        rejectReason: `Order value ₹${orderValue.toFixed(2)} exceeds configured single order cap of ₹${config.maxOrderValue.toFixed(2)}.`,
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "MAX_ORDER_VALUE", timestamp: now });

    // ── 6. PER-TRADE RISK BARRIER ──
    if (signal.strategy === "SWING" && signal.stopLossPrice) {
      const riskPerShare = entryPrice - signal.stopLossPrice;
      const totalOrderRisk = riskPerShare * quantity;
      const maxAllowedRisk = config.capital * (config.riskPerTradePct / 100.0);

      // Allow 5% tolerance for rounding lots
      if (totalOrderRisk > maxAllowedRisk * 1.05) {
        results.push({
          passed: false,
          checkName: "PER_TRADE_RISK",
          rejectReason: `Total trade risk ₹${totalOrderRisk.toFixed(2)} at stop ₹${signal.stopLossPrice.toFixed(2)} exceeds risk budget of ₹${maxAllowedRisk.toFixed(2)} (${config.riskPerTradePct}%).`,
          timestamp: now,
        });
        return results;
      }
    }
    results.push({ passed: true, checkName: "PER_TRADE_RISK", timestamp: now });

    // ── 7. MAX DAILY LOSS LIMIT BARRIER ──
    const maxDailyLossAllowed = config.capital * (config.maxDailyLossPct / 100.0);
    if (portfolio.totalDailyPnl < -maxDailyLossAllowed) {
      results.push({
        passed: false,
        checkName: "DAILY_LOSS_LIMIT",
        rejectReason: `Cumulative daily loss (₹${Math.abs(portfolio.totalDailyPnl).toFixed(2)}) breached max daily loss limit of ₹${maxDailyLossAllowed.toFixed(2)}.`,
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "DAILY_LOSS_LIMIT", timestamp: now });

    // ── 8. MAX PORTFOLIO DRAWDOWN BARRIER ──
    if (portfolio.currentDrawdownPct >= config.maxDrawdownPct) {
      results.push({
        passed: false,
        checkName: "DRAWDOWN_LIMIT",
        rejectReason: `Portfolio drawdown (${portfolio.currentDrawdownPct.toFixed(2)}%) reached max drawdown limit of ${config.maxDrawdownPct.toFixed(2)}%.`,
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "DRAWDOWN_LIMIT", timestamp: now });

    // ── 9. SINGLE STOCK CONCENTRATION CAP ──
    const constituent = UniverseService.getConstituent(signal.symbol);
    const existingPosition = portfolio.activePositions.find((p) => p.symbol === signal.symbol);
    const existingStockValue = existingPosition ? existingPosition.quantity * stockData.ltp : 0;
    const postTradeStockValue = existingStockValue + orderValue;
    const maxAllowedStockValue = config.capital * (config.maxPositionCapPct / 100.0);

    if (postTradeStockValue > maxAllowedStockValue * 1.02) {
      results.push({
        passed: false,
        checkName: "POSITION_CAP",
        rejectReason: `Resulting exposure in ${signal.symbol} (₹${postTradeStockValue.toFixed(2)}) breaches max position cap of ${config.maxPositionCapPct}% (₹${maxAllowedStockValue.toFixed(2)}).`,
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "POSITION_CAP", timestamp: now });

    // ── 10. SECTOR CONCENTRATION CAP ──
    if (constituent) {
      const sector = constituent.sector;
      let currentSectorValue = 0;

      for (const pos of portfolio.activePositions) {
        const c = UniverseService.getConstituent(pos.symbol);
        if (c && c.sector === sector) {
          currentSectorValue += pos.quantity * pos.currentLtp;
        }
      }

      const postTradeSectorValue = currentSectorValue + orderValue;
      const maxAllowedSectorValue = config.capital * (config.maxSectorCapPct / 100.0);

      if (postTradeSectorValue > maxAllowedSectorValue * 1.02) {
        results.push({
          passed: false,
          checkName: "SECTOR_CAP",
          rejectReason: `Resulting exposure in sector '${sector}' (₹${postTradeSectorValue.toFixed(2)}) breaches max sector cap of ${config.maxSectorCapPct}% (₹${maxAllowedSectorValue.toFixed(2)}).`,
          timestamp: now,
        });
        return results;
      }
    }
    results.push({ passed: true, checkName: "SECTOR_CAP", timestamp: now });

    // ── 11. DUPLICATE ORDER / RAPID-FIRE THROTTLING ──
    const lastTime = this.lastOrderTimestamps.get(signal.symbol) || 0;
    const elapsed = Date.now() - lastTime;
    if (elapsed < this.DEBOUNCE_MS) {
      results.push({
        passed: false,
        checkName: "DUPLICATE_THROTTLE",
        rejectReason: `Rapid duplicate order rejected for ${signal.symbol}. Throttling active (${Math.round((this.DEBOUNCE_MS - elapsed) / 1000)}s remaining).`,
        timestamp: now,
      });
      return results;
    }

    const hasPendingOrder = portfolio.openOrders.some(
      (o) => o.symbol === signal.symbol && (o.status === "PENDING_SUBMISSION" || o.status === "OPEN")
    );
    if (hasPendingOrder) {
      results.push({
        passed: false,
        checkName: "DUPLICATE_THROTTLE",
        rejectReason: `An active pending or open order already exists for ${signal.symbol}.`,
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "DUPLICATE_THROTTLE", timestamp: now });

    // ── 12. SLIPPAGE TOLERANCE BARRIER ──
    const estimatedSlippageBps = stockData.spreadBps ? stockData.spreadBps * 1.5 : 10;
    if (estimatedSlippageBps > config.maxSlippageBps) {
      results.push({
        passed: false,
        checkName: "SLIPPAGE_LIMIT",
        rejectReason: `Estimated spread/slippage (${estimatedSlippageBps.toFixed(1)} bps) exceeds tolerance (${config.maxSlippageBps} bps).`,
        timestamp: now,
      });
      return results;
    }
    results.push({ passed: true, checkName: "SLIPPAGE_LIMIT", timestamp: now });

    // Register timestamp for debounce
    this.lastOrderTimestamps.set(signal.symbol, Date.now());

    return results;
  }

  /**
   * Verifies if Indian cash market is currently open (09:15 to 15:30 IST Mon-Fri)
   */
  public static isMarketOpen(currentDate?: Date): { isOpen: boolean; istTime: string; reason?: string } {
    const d = currentDate || new Date();
    // Convert to IST
    const istString = d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istString);

    const day = istDate.getDay(); // 0 = Sun, 6 = Sat
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const marketOpenMinutes = 9 * 60 + 15; // 09:15 IST
    const marketCloseMinutes = 15 * 60 + 30; // 15:30 IST

    const timeFormatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} IST`;

    if (day === 0 || day === 6) {
      return { isOpen: false, istTime: timeFormatted, reason: "Market closed (Weekend)" };
    }

    if (currentMinutes < marketOpenMinutes) {
      return { isOpen: false, istTime: timeFormatted, reason: "Pre-market / Market not open yet (Opens 09:15 IST)" };
    }

    if (currentMinutes > marketCloseMinutes) {
      return { isOpen: false, istTime: timeFormatted, reason: "Market closed for the day (Closed 15:30 IST)" };
    }

    return { isOpen: true, istTime: timeFormatted };
  }
}

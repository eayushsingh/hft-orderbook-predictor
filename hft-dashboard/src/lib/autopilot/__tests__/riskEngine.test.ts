import { describe, it, expect } from "vitest";
import { PortfolioRiskSnapshot, RiskEngine } from "../risk/riskEngine";
import { AutopilotConfig, StockMarketData, StrategySignal } from "../types";

describe("Independent Risk Engine & Gatekeeper", () => {
  const config: AutopilotConfig = {
    id: "risk-test-cfg",
    strategy: "SWING",
    mode: "PAPER",
    state: "ACTIVE",
    capital: 500000,
    riskPerTradePct: 1.0, // ₹5,000 max risk
    maxDailyLossPct: 3.0, // ₹15,000 max daily loss
    maxDrawdownPct: 10.0, // 10% max DD
    maxPositions: 5,
    maxPositionCapPct: 20.0, // ₹1,00,000 max per stock
    maxSectorCapPct: 35.0, // ₹1,75,000 max per sector
    maxSlippageBps: 15,
    maxOrderValue: 100000,
    requireApproval: false,
    trailingStopEnabled: true,
    trailingAtrMultiplier: 2.0,
    rebalanceBandPct: 3.0,
    broker: "PAPER",
    version: 1,
    updatedAt: new Date().toISOString(),
    sebiDisclaimerAccepted: true,
  };

  const freshStockData: StockMarketData = {
    symbol: "RELIANCE",
    ltp: 2980.0,
    open: 2950.0,
    high: 3000.0,
    low: 2940.0,
    close: 2980.0,
    volume: 3000000,
    avgVolume20: 2500000,
    changePct: 1.02,
    atr14: 45.0,
    sma20: 2940.0,
    sma50: 2900.0,
    sma200: 2750.0,
    rsi14: 58.0,
    rsRating: 82,
    volumeSurgeRatio: 1.25,
    deliveryPct: 52.0,
    spreadBps: 3.5,
    orderBookDepthAvailable: true,
    dataTimestamp: new Date().toISOString(),
    freshness: "FRESH",
    source: "NSE Live Feed",
  };

  const baseSignal: StrategySignal = {
    id: "SIG-TEST-1",
    timestamp: new Date().toISOString(),
    symbol: "RELIANCE",
    strategy: "SWING",
    action: "BUY",
    reason: "Trend breakout with volume surge",
    confidence: 0.9,
    entryPrice: 2980.0,
    stopLossPrice: 2890.0, // ₹90 risk per share
    targetPrice: 3205.0,
    suggestedQty: 25, // 25 * 90 = ₹2,250 risk (< ₹5,000 budget), Value: 25 * 2980 = ₹74,500 (< ₹1,00,000 cap)
    metadata: {},
  };

  const healthyPortfolio: PortfolioRiskSnapshot = {
    totalCapital: 500000,
    availableCash: 350000,
    investedValue: 150000,
    realizedDailyPnl: 1200,
    unrealizedPnl: 2500,
    totalDailyPnl: 3700,
    peakEquity: 505000,
    currentDrawdownPct: 0.5,
    activePositions: [],
    openOrders: [],
  };

  it("should PASS all risk checks for a valid compliant order", () => {
    const checks = RiskEngine.evaluateRisk(baseSignal, freshStockData, config, healthyPortfolio);
    const failed = checks.find((c) => !c.passed);
    expect(failed).toBeUndefined();
    expect(checks.length).toBeGreaterThan(0);
  });

  it("should BLOCK immediately when Kill Switch is engaged", () => {
    const killConfig: AutopilotConfig = { ...config, state: "KILL_SWITCH_ENGAGED" };
    const checks = RiskEngine.evaluateRisk(baseSignal, freshStockData, killConfig, healthyPortfolio);
    expect(checks.length).toBe(1);
    expect(checks[0].passed).toBe(false);
    expect(checks[0].checkName).toBe("KILL_SWITCH");
  });

  it("should REJECT orders on non-Nifty 50 constituents", () => {
    const badSignal: StrategySignal = { ...baseSignal, symbol: "BANKNIFTY" };
    const checks = RiskEngine.evaluateRisk(badSignal, freshStockData, config, healthyPortfolio);
    const universeCheck = checks.find((c) => c.checkName === "UNIVERSE_ELIGIBILITY");
    expect(universeCheck?.passed).toBe(false);
  });

  it("should REJECT orders on stale market data", () => {
    const staleData: StockMarketData = { ...freshStockData, freshness: "STALE" };
    const checks = RiskEngine.evaluateRisk(baseSignal, staleData, config, healthyPortfolio);
    const freshnessCheck = checks.find((c) => c.checkName === "DATA_FRESHNESS");
    expect(freshnessCheck?.passed).toBe(false);
  });

  it("should REJECT orders when available cash is insufficient", () => {
    const brokePortfolio: PortfolioRiskSnapshot = { ...healthyPortfolio, availableCash: 10000 };
    const checks = RiskEngine.evaluateRisk(baseSignal, freshStockData, config, brokePortfolio);
    const fundsCheck = checks.find((c) => c.checkName === "AVAILABLE_FUNDS");
    expect(fundsCheck?.passed).toBe(false);
  });

  it("should REJECT orders when single order value exceeds cap", () => {
    const giantSignal: StrategySignal = { ...baseSignal, suggestedQty: 100 }; // 100 * 2980 = ₹2,98,000 > ₹1,00,000
    const checks = RiskEngine.evaluateRisk(giantSignal, freshStockData, config, healthyPortfolio);
    const maxOrderCheck = checks.find((c) => c.checkName === "MAX_ORDER_VALUE");
    expect(maxOrderCheck?.passed).toBe(false);
  });

  it("should REJECT orders when daily loss limit is breached", () => {
    const badLossPortfolio: PortfolioRiskSnapshot = {
      ...healthyPortfolio,
      totalDailyPnl: -20000, // Breached -₹15,000 limit
    };
    const checks = RiskEngine.evaluateRisk(baseSignal, freshStockData, config, badLossPortfolio);
    const lossCheck = checks.find((c) => c.checkName === "DAILY_LOSS_LIMIT");
    expect(lossCheck?.passed).toBe(false);
  });

  it("should REJECT orders when drawdown limit is breached", () => {
    const badDdPortfolio: PortfolioRiskSnapshot = {
      ...healthyPortfolio,
      currentDrawdownPct: 12.5, // Breached 10% limit
    };
    const checks = RiskEngine.evaluateRisk(baseSignal, freshStockData, config, badDdPortfolio);
    const ddCheck = checks.find((c) => c.checkName === "DRAWDOWN_LIMIT");
    expect(ddCheck?.passed).toBe(false);
  });

  it("should REJECT orders when single stock position cap is breached", () => {
    const highExposurePortfolio: PortfolioRiskSnapshot = {
      ...healthyPortfolio,
      activePositions: [
        {
          symbol: "RELIANCE",
          isin: "INE002A01018",
          sector: "Oil Gas & Consumable Fuels",
          product: "CNC",
          quantity: 30, // Already holding 30 * 2980 = ₹89,400
          avgEntryPrice: 2980,
          currentLtp: 2980,
          stopLossPrice: 2850,
          unrealizedPnl: 0,
          unrealizedPnlPct: 0,
          realizedPnl: 0,
          entryTimestamp: "",
          lastUpdatedTimestamp: "",
          highestPriceSinceEntry: 2980,
          strategy: "SWING",
          mode: "PAPER",
        },
      ],
    };
    // Additional 25 shares would push exposure to ₹1,63,900 > ₹1,00,000 (20%)
    const checks = RiskEngine.evaluateRisk(baseSignal, freshStockData, config, highExposurePortfolio);
    const posCapCheck = checks.find((c) => c.checkName === "POSITION_CAP");
    expect(posCapCheck?.passed).toBe(false);
  });
});

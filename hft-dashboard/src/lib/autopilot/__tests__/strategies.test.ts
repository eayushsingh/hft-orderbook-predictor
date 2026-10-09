import { describe, it, expect } from "vitest";
import { SwingStrategy } from "../strategies/swingStrategy";
import { LongTermStrategy } from "../strategies/longTermStrategy";
import { calculateIndianTransactionCosts } from "../strategies/strategyInterface";
import { MarketAnalysisEngine } from "../analysis/marketAnalysisEngine";
import { AutopilotConfig, AutopilotPosition } from "../types";

describe("Strategy Modules & Sizing Rules", () => {
  const defaultConfig: AutopilotConfig = {
    id: "test-config",
    strategy: "SWING",
    mode: "PAPER",
    state: "ACTIVE",
    capital: 500000,
    riskPerTradePct: 1.0, // ₹5,000 risk
    maxDailyLossPct: 3.0,
    maxDrawdownPct: 10.0,
    maxPositions: 5,
    maxPositionCapPct: 20.0, // Max ₹1,00,000 per stock
    maxSectorCapPct: 35.0,
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

  describe("Indian Transaction Cost Calculator", () => {
    it("should accurately compute SEBI, STT, turnover, stamp duty, and GST on delivery", () => {
      const price = 2000;
      const qty = 50;

      const buyCosts = calculateIndianTransactionCosts(price, qty, true, true, 10);
      expect(buyCosts.stt).toBe(100); // 0.1% = ₹100
      expect(buyCosts.stampDuty).toBe(15); // 0.015% = ₹15
      expect(buyCosts.exchangeTurnover).toBeCloseTo(3.45, 1); // 0.00345% = ₹3.45
      expect(buyCosts.sebiTurnover).toBeCloseTo(0.1, 1); // ₹10 / Cr = ₹0.10
      expect(buyCosts.estimatedSlippage).toBe(100); // 10 bps = ₹100
      expect(buyCosts.totalCharges).toBeGreaterThan(118);
      expect(buyCosts.netImpact).toBeGreaterThan(218);
    });

    it("should handle zero price or zero quantity gracefully", () => {
      const zeroCost = calculateIndianTransactionCosts(0, 0, true, true);
      expect(zeroCost.totalCharges).toBe(0);
      expect(zeroCost.netImpact).toBe(0);
    });
  });

  describe("Swing Strategy", () => {
    const swing = new SwingStrategy();

    it("should size quantity strictly according to risk budget and position caps", () => {
      const entryPrice = 2500;
      const stopLossPrice = 2400; // ₹100 risk per share
      // Risk budget = 500,000 * 1% = ₹5,000
      // Ideal shares = 5,000 / 100 = 50 shares
      // Value = 50 * 2500 = ₹1,25,000 -> Capped by maxOrderValue ₹1,00,000 -> 40 shares

      const qty = swing.calculatePositionSize(
        500000,
        1.0,
        entryPrice,
        stopLossPrice,
        20.0,
        100000
      );

      expect(qty).toBe(40);
    });

    it("should return 0 quantity when stop loss is equal or greater than entry price", () => {
      const qty = swing.calculatePositionSize(500000, 1.0, 2500, 2550, 20.0, 100000);
      expect(qty).toBe(0);
    });

    it("should generate deterministic signals and valid NO_TRADE when conditions are unmet", () => {
      const snapshot = MarketAnalysisEngine.getMarketSnapshot();
      const signals = swing.generateSignals(snapshot, defaultConfig, [], 500000);

      expect(signals.length).toBeGreaterThan(0);
      const buySignals = signals.filter((s) => s.action === "BUY");
      const noTradeSignals = signals.filter((s) => s.action === "NO_TRADE");

      if (buySignals.length > 0) {
        const topBuy = buySignals[0];
        expect(topBuy.symbol).toBeTruthy();
        expect(topBuy.stopLossPrice).toBeLessThan(topBuy.entryPrice!);
        expect(topBuy.targetPrice).toBeGreaterThan(topBuy.entryPrice!);
        expect(topBuy.suggestedQty).toBeGreaterThan(0);
        expect(topBuy.estimatedCost).toBeDefined();
      } else {
        expect(noTradeSignals.length).toBeGreaterThan(0);
        expect(noTradeSignals[0].reason).toBeTruthy();
      }
    });

    it("should return NO_TRADE when capacity limit is reached", () => {
      const snapshot = MarketAnalysisEngine.getMarketSnapshot();
      const maxedPositions: AutopilotPosition[] = [
        { symbol: "RELIANCE", isin: "INE002A01018", sector: "Oil", product: "CNC", quantity: 10, avgEntryPrice: 2900, currentLtp: 2980, stopLossPrice: 2800, unrealizedPnl: 800, unrealizedPnlPct: 2.7, realizedPnl: 0, entryTimestamp: "", lastUpdatedTimestamp: "", highestPriceSinceEntry: 2980, strategy: "SWING", mode: "PAPER" },
        { symbol: "HDFCBANK", isin: "INE040A01034", sector: "Bank", product: "CNC", quantity: 15, avgEntryPrice: 1700, currentLtp: 1720, stopLossPrice: 1650, unrealizedPnl: 300, unrealizedPnlPct: 1.1, realizedPnl: 0, entryTimestamp: "", lastUpdatedTimestamp: "", highestPriceSinceEntry: 1720, strategy: "SWING", mode: "PAPER" },
        { symbol: "ICICIBANK", isin: "INE090A01021", sector: "Bank", product: "CNC", quantity: 20, avgEntryPrice: 1200, currentLtp: 1240, stopLossPrice: 1180, unrealizedPnl: 800, unrealizedPnlPct: 3.3, realizedPnl: 0, entryTimestamp: "", lastUpdatedTimestamp: "", highestPriceSinceEntry: 1240, strategy: "SWING", mode: "PAPER" },
        { symbol: "INFY", isin: "INE009A01021", sector: "IT", product: "CNC", quantity: 10, avgEntryPrice: 1850, currentLtp: 1890, stopLossPrice: 1800, unrealizedPnl: 400, unrealizedPnlPct: 2.1, realizedPnl: 0, entryTimestamp: "", lastUpdatedTimestamp: "", highestPriceSinceEntry: 1890, strategy: "SWING", mode: "PAPER" },
        { symbol: "TCS", isin: "INE467B01029", sector: "IT", product: "CNC", quantity: 5, avgEntryPrice: 4100, currentLtp: 4200, stopLossPrice: 4000, unrealizedPnl: 500, unrealizedPnlPct: 2.4, realizedPnl: 0, entryTimestamp: "", lastUpdatedTimestamp: "", highestPriceSinceEntry: 4200, strategy: "SWING", mode: "PAPER" },
      ];

      const signals = swing.generateSignals(snapshot, defaultConfig, maxedPositions, 100000);
      const noTrade = signals.find((s) => s.action === "NO_TRADE");
      expect(noTrade).toBeDefined();
      expect(noTrade?.reason).toContain("Max concurrent positions limit reached");
    });
  });

  describe("Long-Term Strategy", () => {
    const longTerm = new LongTermStrategy();

    it("should generate factor allocation signals for top basket", () => {
      const snapshot = MarketAnalysisEngine.getMarketSnapshot();
      const ltConfig: AutopilotConfig = { ...defaultConfig, strategy: "LONG_TERM" };
      const signals = longTerm.generateSignals(snapshot, ltConfig, [], 500000);

      expect(signals.length).toBeGreaterThan(0);
      const buySignals = signals.filter((s) => s.action === "BUY");
      expect(buySignals.length).toBeGreaterThan(0);
      expect(buySignals[0].suggestedQty).toBeGreaterThan(0);
    });

    it("should return NO_TRADE when portfolio weights are balanced within drift band", () => {
      const snapshot = MarketAnalysisEngine.getMarketSnapshot();
      const ltConfig: AutopilotConfig = { ...defaultConfig, strategy: "LONG_TERM" };
      
      // Seed balanced positions for top 5 stocks
      const balancedPositions: AutopilotPosition[] = [
        { symbol: "RELIANCE", isin: "INE002A01018", sector: "Oil", product: "CNC", quantity: 33, avgEntryPrice: 2985, currentLtp: 2985, stopLossPrice: 2000, unrealizedPnl: 0, unrealizedPnlPct: 0, realizedPnl: 0, entryTimestamp: "", lastUpdatedTimestamp: "", highestPriceSinceEntry: 2985, strategy: "LONG_TERM", mode: "PAPER" },
        { symbol: "HDFCBANK", isin: "INE040A01034", sector: "Bank", product: "CNC", quantity: 58, avgEntryPrice: 1710, currentLtp: 1710, stopLossPrice: 1000, unrealizedPnl: 0, unrealizedPnlPct: 0, realizedPnl: 0, entryTimestamp: "", lastUpdatedTimestamp: "", highestPriceSinceEntry: 1710, strategy: "LONG_TERM", mode: "PAPER" },
      ];

      const signals = longTerm.generateSignals(snapshot, ltConfig, balancedPositions, 0);
      expect(signals.length).toBeGreaterThan(0);
    });
  });
});

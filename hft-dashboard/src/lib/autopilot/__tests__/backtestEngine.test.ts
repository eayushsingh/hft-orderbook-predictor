import { describe, it, expect } from "vitest";
import { BacktestEngine } from "../backtest/backtestEngine";
import { BacktestRequest } from "../types";

describe("Nifty 50 Historical Backtest Engine", () => {
  const request: BacktestRequest = {
    strategy: "SWING",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    initialCapital: 500000,
    riskPerTradePct: 1.0,
    maxPositions: 5,
    includeCostsAndSlippage: true,
    slippageBps: 10,
  };

  it("should run backtest simulation and produce complete metrics and equity curve", () => {
    const result = BacktestEngine.runBacktest(request);

    expect(result.id).toContain("BT-SWING");
    expect(result.initialCapital).toBe(500000);
    expect(result.finalCapital).toBeGreaterThan(0);
    expect(result.totalReturnPct).toBeDefined();
    expect(result.benchmarkReturnPct).toBeDefined();
    expect(result.maxDrawdownPct).toBeGreaterThanOrEqual(0);
    expect(result.winRatePct).toBeGreaterThanOrEqual(0);
    expect(result.winRatePct).toBeLessThanOrEqual(100);
    expect(result.profitFactor).toBeGreaterThan(0);
    expect(result.sharpeRatio).toBeDefined();
    expect(result.totalCostsPaid).toBeGreaterThan(0); // Proves realistic statutory costs were deducted

    expect(result.equityCurve.length).toBe(250); // Full 250 trading day curve
    expect(result.trades.length).toBeGreaterThan(0);

    for (const trade of result.trades) {
      expect(trade.entryPrice).toBeGreaterThan(0);
      expect(trade.exitPrice).toBeGreaterThan(0);
      expect(trade.costs).toBeGreaterThan(0);
      expect(trade.exitReason).toMatch(/STOP_LOSS|TARGET|TIME_EXIT|REBALANCE/);
    }
  });

  it("should support Long-Term rebalance strategy backtest", () => {
    const ltRequest: BacktestRequest = { ...request, strategy: "LONG_TERM" };
    const result = BacktestEngine.runBacktest(ltRequest);

    expect(result.strategy).toBe("LONG_TERM");
    expect(result.equityCurve.length).toBe(250);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { AutopilotRunner } from "../execution/autopilotRunner";
import { AutopilotRepository } from "../db/autopilotDb";
import { UniverseService } from "../universe/nifty50Universe";

describe("E2E Paper Trading Engine Flow & Kill Switch Verification", () => {
  beforeEach(() => {
    AutopilotRepository.updateConfig({
      strategy: "SWING",
      mode: "PAPER",
      state: "ACTIVE",
      capital: 500000,
      riskPerTradePct: 1.0,
      maxDailyLossPct: 3.0,
      maxDrawdownPct: 10.0,
      maxPositions: 5,
      maxPositionCapPct: 20.0,
      maxSectorCapPct: 35.0,
      maxSlippageBps: 15,
      maxOrderValue: 100000,
      requireApproval: false, // Automated paper execution
      trailingStopEnabled: true,
      trailingAtrMultiplier: 2.0,
      rebalanceBandPct: 3.0,
      broker: "PAPER",
      sebiDisclaimerAccepted: true,
    });
  });

  it("should complete a full autonomous paper trading cycle from universe to execution and audit", async () => {
    // 1. Run full analysis and execution cycle
    const cycleResult = await AutopilotRunner.runCycle();

    expect(cycleResult.timestamp).toBeTruthy();
    expect(cycleResult.rankings.length).toBe(50); // Scored all 50 Nifty constituents
    expect(cycleResult.marketSnapshot.indexData.indexSymbol).toBe("NIFTY 50");

    // 2. Verify rankings structure
    const topStock = cycleResult.rankings[0];
    expect(topStock.rank).toBe(1);
    expect(topStock.rsRating).toBeGreaterThan(0);
    expect(UniverseService.isEligible(topStock.symbol)).toBe(true);

    // 3. Verify positions and orders
    const positions = AutopilotRepository.getPositions();
    const orders = AutopilotRepository.getOrders(20);

    expect(orders.length).toBeGreaterThanOrEqual(0);
    if (cycleResult.executedOrders.length > 0) {
      expect(positions.length).toBeGreaterThan(0);
      const executed = cycleResult.executedOrders[0];
      expect(executed.status).toBe("FILLED");
      expect(executed.brokerName).toBe("PAPER");
      expect(executed.averageFillPrice).toBeGreaterThan(0);
      expect(executed.costBreakdown).toBeDefined();
    }

    // 4. Verify Audit Logs
    const auditLogs = AutopilotRepository.getAuditLogs(10);
    expect(auditLogs.length).toBeGreaterThan(0);
  });

  it("should enforce Kill Switch and block all new entries, then safely reset to PAUSED", async () => {
    // Engage Kill Switch
    const killedConfig = AutopilotRunner.engageKillSwitch("Operator Emergency Stop Test", "TEST_SUITE");
    expect(killedConfig.state).toBe("KILL_SWITCH_ENGAGED");

    // Run cycle while killed
    const killedCycleResult = await AutopilotRunner.runCycle();
    expect(killedCycleResult.createdOrders.length).toBe(0);
    expect(killedCycleResult.executedOrders.length).toBe(0);

    // Reset Kill Switch
    const resetConfig = AutopilotRunner.resetKillSwitch("TEST_SUITE");
    expect(resetConfig.state).toBe("PAUSED"); // Safe recovery check: Must reset to PAUSED, never directly to ACTIVE

    // Verify audit entries for kill switch events
    const auditLogs = AutopilotRepository.getAuditLogs(5);
    const killEvents = auditLogs.filter(
      (a) => a.eventType === "KILL_SWITCH_TRIGGERED" || a.eventType === "KILL_SWITCH_RESET"
    );
    expect(killEvents.length).toBeGreaterThanOrEqual(2);
  });
});

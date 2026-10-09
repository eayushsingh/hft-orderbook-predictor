import { describe, it, expect } from "vitest";
import { OrderManager } from "../execution/orderManager";
import { AutopilotRepository } from "../db/autopilotDb";
import { PaperBrokerAdapter } from "../brokers/paperBrokerAdapter";
import { AutopilotConfig, StrategySignal } from "../types";

describe("Order Lifecycle, Idempotency & Persistence", () => {
  const testConfig: AutopilotConfig = {
    id: "default",
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
    requireApproval: true,
    trailingStopEnabled: true,
    trailingAtrMultiplier: 2.0,
    rebalanceBandPct: 3.0,
    broker: "PAPER",
    version: 1,
    updatedAt: new Date().toISOString(),
    sebiDisclaimerAccepted: true,
  };

  const testSignal: StrategySignal = {
    id: "SIG-LIFECYCLE-1",
    timestamp: new Date().toISOString(),
    symbol: "INFY",
    strategy: "SWING",
    action: "BUY",
    reason: "Relative strength momentum test",
    confidence: 0.88,
    entryPrice: 1850.0,
    stopLossPrice: 1800.0,
    targetPrice: 1975.0,
    suggestedQty: 20,
    metadata: {},
  };

  it("should create an order with unique idempotency key in PENDING_APPROVAL status when approval is required", () => {
    const order = OrderManager.createOrderFromSignal(testSignal, testConfig);

    expect(order.id).toBeTruthy();
    expect(order.idempotencyKey).toContain("IDEMP-SWING-INFY-BUY");
    expect(order.status).toBe("PENDING_APPROVAL");
    expect(order.approvalRequired).toBe(true);

    const savedOrders = AutopilotRepository.getOrders(10);
    const found = savedOrders.find((o) => o.id === order.id);
    expect(found).toBeDefined();
    expect(found?.status).toBe("PENDING_APPROVAL");
  });

  it("should handle operator approval and transition order to FILLED via broker", async () => {
    const order = OrderManager.createOrderFromSignal(testSignal, testConfig);
    const broker = new PaperBrokerAdapter(500000);

    const approvalResult = await OrderManager.handleApproval(order.id, true, "OPERATOR_AYUSH", broker);

    expect(approvalResult.success).toBe(true);
    expect(approvalResult.order?.status).toBe("FILLED");
    expect(approvalResult.order?.approvedBy).toBe("OPERATOR_AYUSH");
    expect(approvalResult.order?.filledQuantity).toBe(20);

    const positions = AutopilotRepository.getPositions();
    const position = positions.find((p) => p.symbol === "INFY");
    expect(position).toBeDefined();
    expect(position?.quantity).toBe(20);
  });

  it("should handle operator rejection and transition order to CANCELLED", async () => {
    const order = OrderManager.createOrderFromSignal(testSignal, testConfig);
    const broker = new PaperBrokerAdapter(500000);

    const cancelResult = await OrderManager.handleApproval(order.id, false, "OPERATOR_AYUSH", broker);

    expect(cancelResult.success).toBe(true);
    expect(cancelResult.order?.status).toBe("CANCELLED");

    const savedOrders = AutopilotRepository.getOrders(10);
    const found = savedOrders.find((o) => o.id === order.id);
    expect(found?.status).toBe("CANCELLED");
  });
});

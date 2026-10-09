import { describe, it, expect, beforeEach } from "vitest";
import { PaperBrokerAdapter } from "../brokers/paperBrokerAdapter";
import { DemoBrokerAdapter } from "../brokers/demoBrokerAdapter";
import { AngelOneSmartApiAdapter } from "../brokers/angelOneAdapter";
import { ZerodhaKiteAdapter } from "../brokers/zerodhaAdapter";
import { AutopilotOrder } from "../types";

describe("Broker Adapters & Multi-Broker Engine", () => {
  describe("Paper Broker Adapter", () => {
    let paperBroker: PaperBrokerAdapter;

    beforeEach(() => {
      paperBroker = new PaperBrokerAdapter(500000);
    });

    it("should initialize with correct simulated funds", async () => {
      const funds = await paperBroker.getFunds();
      expect(funds.availableCash).toBe(500000);
      expect(funds.usedMargin).toBe(0);
      expect(funds.totalEquity).toBe(500000);
    });

    it("should execute BUY orders with realistic slippage and statutory costs deduction", async () => {
      const order: AutopilotOrder = {
        id: "TEST-ORD-1",
        idempotencyKey: "IDEMP-1",
        timestamp: new Date().toISOString(),
        symbol: "RELIANCE",
        isin: "INE002A01018",
        side: "BUY",
        product: "CNC",
        orderType: "MARKET",
        quantity: 20,
        filledQuantity: 0,
        limitPrice: 2900,
        status: "PENDING_SUBMISSION",
        brokerName: "PAPER",
        mode: "PAPER",
        strategy: "SWING",
        approvalRequired: false,
      };

      const result = await paperBroker.placeOrder(order);
      expect(result.success).toBe(true);
      expect(result.status).toBe("FILLED");
      expect(result.filledQty).toBe(20);
      expect(result.avgFillPrice).toBeGreaterThan(2900); // Slippage added on buy

      const fundsAfter = await paperBroker.getFunds();
      expect(fundsAfter.availableCash).toBeLessThan(500000);
      expect(fundsAfter.usedMargin).toBeGreaterThan(0);

      const positions = await paperBroker.getPositions();
      expect(positions.length).toBe(1);
      expect(positions[0].symbol).toBe("RELIANCE");
      expect(positions[0].quantity).toBe(20);
    });

    it("should execute SELL orders and credit cash back to ledger", async () => {
      // First buy
      const buyOrder: AutopilotOrder = {
        id: "TEST-BUY",
        idempotencyKey: "IDEMP-B",
        timestamp: new Date().toISOString(),
        symbol: "TCS",
        isin: "INE467B01029",
        side: "BUY",
        product: "CNC",
        orderType: "MARKET",
        quantity: 10,
        filledQuantity: 0,
        limitPrice: 4000,
        status: "PENDING_SUBMISSION",
        brokerName: "PAPER",
        mode: "PAPER",
        strategy: "SWING",
        approvalRequired: false,
      };
      await paperBroker.placeOrder(buyOrder);

      // Then sell
      const sellOrder: AutopilotOrder = {
        id: "TEST-SELL",
        idempotencyKey: "IDEMP-S",
        timestamp: new Date().toISOString(),
        symbol: "TCS",
        isin: "INE467B01029",
        side: "SELL",
        product: "CNC",
        orderType: "MARKET",
        quantity: 10,
        filledQuantity: 0,
        limitPrice: 4100,
        status: "PENDING_SUBMISSION",
        brokerName: "PAPER",
        mode: "PAPER",
        strategy: "SWING",
        approvalRequired: false,
      };

      const sellResult = await paperBroker.placeOrder(sellOrder);
      expect(sellResult.success).toBe(true);
      expect(sellResult.status).toBe("FILLED");

      const positions = await paperBroker.getPositions();
      expect(positions.length).toBe(0); // Position fully closed
    });

    it("should reconcile positions and detect discrepancies", async () => {
      const recon = await paperBroker.reconcilePositions([]);
      expect(recon.reconciled).toBe(true);
      expect(recon.discrepancies.length).toBe(0);
    });
  });

  describe("Demo Broker Adapter", () => {
    it("should provide sandbox mock responses offline", async () => {
      const demo = new DemoBrokerAdapter();
      const auth = await demo.authenticate();
      expect(auth.success).toBe(true);
      expect(auth.message).toContain("Demo Sandbox");

      const funds = await demo.getFunds();
      expect(funds.totalEquity).toBeGreaterThan(0);
    });
  });

  describe("Angel One & Zerodha Live Gateways", () => {
    it("should reject unauthenticated live order placement safely", async () => {
      const angel = new AngelOneSmartApiAdapter("LIVE");
      const unauthOrder: AutopilotOrder = {
        id: "LIVE-TEST",
        idempotencyKey: "IDEMP-L",
        timestamp: new Date().toISOString(),
        symbol: "RELIANCE",
        isin: "INE002A01018",
        side: "BUY",
        product: "CNC",
        orderType: "MARKET",
        quantity: 10,
        filledQuantity: 0,
        status: "PENDING_SUBMISSION",
        brokerName: "ANGEL_ONE",
        mode: "LIVE",
        strategy: "SWING",
        approvalRequired: false,
      };

      const angelRes = await angel.placeOrder(unauthOrder);
      expect(angelRes.success).toBe(false);
      expect(angelRes.rejectReason).toContain("authenticated session");

      const zerodha = new ZerodhaKiteAdapter("LIVE");
      const zeroRes = await zerodha.placeOrder(unauthOrder);
      expect(zeroRes.success).toBe(false);
      expect(zeroRes.rejectReason).toContain("Access Token required");
    });
  });
});

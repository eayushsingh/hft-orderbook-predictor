import {
  AutopilotOrder,
  AutopilotPosition,
  TradingMode,
} from "../types";
import {
  BrokerAuthResult,
  BrokerFundsResult,
  BrokerOrderResult,
  BrokerQuoteResult,
  IBrokerAdapter,
} from "./brokerInterface";
import { UniverseService } from "../universe/nifty50Universe";

/**
 * DEMO SANDBOX BROKER ADAPTER
 * 
 * Instant offline simulator for UI walkthroughs and visual inspection.
 * Labeled explicitly as "DEMO MODE (MOCK)".
 */
export class DemoBrokerAdapter implements IBrokerAdapter {
  public readonly brokerName = "DEMO";
  public readonly mode: TradingMode = "DEMO";

  private availableCash = 1000000.0;
  private positions: Map<string, AutopilotPosition> = new Map();
  private orders: AutopilotOrder[] = [];

  constructor() {
    // Seed initial demo state
    this.positions.set("RELIANCE", {
      symbol: "RELIANCE",
      isin: "INE002A01018",
      sector: "Oil Gas & Consumable Fuels",
      product: "CNC",
      quantity: 50,
      avgEntryPrice: 2920.0,
      currentLtp: 2985.4,
      stopLossPrice: 2840.0,
      targetPrice: 3120.0,
      unrealizedPnl: 3270.0,
      unrealizedPnlPct: 2.24,
      realizedPnl: 0,
      entryTimestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      lastUpdatedTimestamp: new Date().toISOString(),
      highestPriceSinceEntry: 2990.0,
      strategy: "SWING",
      mode: "DEMO",
    });
  }

  public async authenticate(): Promise<BrokerAuthResult> {
    return {
      success: true,
      message: "Demo Sandbox Active. No real funds or broker connections used.",
      sessionExpiry: new Date(Date.now() + 86400000).toISOString(),
    };
  }

  public async getFunds(): Promise<BrokerFundsResult> {
    let positionValue = 0;
    for (const pos of this.positions.values()) {
      positionValue += pos.quantity * pos.currentLtp;
    }

    return {
      availableCash: this.availableCash,
      usedMargin: positionValue,
      totalEquity: this.availableCash + positionValue,
      source: "Demo Sandbox Mock Ledger",
      timestamp: new Date().toISOString(),
    };
  }

  public async getPositions(): Promise<AutopilotPosition[]> {
    return Array.from(this.positions.values());
  }

  public async getOrders(): Promise<AutopilotOrder[]> {
    return [...this.orders];
  }

  public async getQuote(symbol: string): Promise<BrokerQuoteResult> {
    const c = UniverseService.getConstituent(symbol);
    const ltp = 2000.0;
    return {
      symbol: c?.symbol || symbol,
      ltp,
      bid: ltp - 0.05,
      ask: ltp + 0.05,
      open: ltp,
      high: ltp * 1.01,
      low: ltp * 0.99,
      close: ltp,
      volume: 1000000,
      timestamp: new Date().toISOString(),
    };
  }

  public async placeOrder(order: AutopilotOrder): Promise<BrokerOrderResult> {
    const brokerOrderId = `DEMO-ORD-${Date.now().toString(36).toUpperCase()}`;
    const fillPrice = order.limitPrice || 2500.0;

    const executedOrder: AutopilotOrder = {
      ...order,
      brokerOrderId,
      brokerName: "DEMO",
      status: "FILLED",
      filledQuantity: order.quantity,
      averageFillPrice: fillPrice,
      timestamp: new Date().toISOString(),
    };

    this.orders.unshift(executedOrder);

    const c = UniverseService.getConstituent(order.symbol);
    if (order.side === "BUY") {
      this.positions.set(order.symbol, {
        symbol: order.symbol,
        isin: c?.isin || "INE000000000",
        sector: c?.sector || "General",
        product: order.product,
        quantity: order.quantity,
        avgEntryPrice: fillPrice,
        currentLtp: fillPrice,
        stopLossPrice: order.stopLoss || fillPrice * 0.97,
        targetPrice: order.target,
        unrealizedPnl: 0,
        unrealizedPnlPct: 0,
        realizedPnl: 0,
        entryTimestamp: new Date().toISOString(),
        lastUpdatedTimestamp: new Date().toISOString(),
        highestPriceSinceEntry: fillPrice,
        strategy: order.strategy,
        mode: "DEMO",
      });
      this.availableCash -= fillPrice * order.quantity;
    } else {
      this.positions.delete(order.symbol);
      this.availableCash += fillPrice * order.quantity;
    }

    return {
      success: true,
      brokerOrderId,
      status: "FILLED",
      filledQty: order.quantity,
      avgFillPrice: fillPrice,
      message: `Demo order simulated for ${order.symbol} (${order.quantity} shares @ ₹${fillPrice.toFixed(2)})`,
    };
  }

  public async cancelOrder(brokerOrderId: string): Promise<{ success: boolean; message?: string }> {
    return { success: true, message: `Demo order ${brokerOrderId} cancelled.` };
  }

  public async reconcilePositions(): Promise<{
    reconciled: boolean;
    discrepancies: string[];
    brokerPositions: AutopilotPosition[];
  }> {
    return {
      reconciled: true,
      discrepancies: [],
      brokerPositions: Array.from(this.positions.values()),
    };
  }
}

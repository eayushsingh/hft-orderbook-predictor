import {
  AutopilotConfig,
  AutopilotOrder,
  StrategySignal,
} from "../types";
import { AutopilotRepository } from "../db/autopilotDb";
import { IBrokerAdapter } from "../brokers/brokerInterface";
import { UniverseService } from "../universe/nifty50Universe";

export class OrderManager {
  /**
   * Generates a deterministic idempotency key for an order
   */
  public static generateIdempotencyKey(signal: StrategySignal, configVersion: number): string {
    return `IDEMP-${signal.strategy}-${signal.symbol}-${signal.action}-${Math.floor(Date.now() / 60000)}-v${configVersion}`;
  }

  /**
   * Creates and registers a new order in persistent storage
   */
  public static createOrderFromSignal(
    signal: StrategySignal,
    config: AutopilotConfig
  ): AutopilotOrder {
    const constituent = UniverseService.getConstituent(signal.symbol);
    const now = new Date().toISOString();
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const idempotencyKey = this.generateIdempotencyKey(signal, config.version);

    const initialStatus = config.requireApproval ? "PENDING_APPROVAL" : "PENDING_SUBMISSION";

    const order: AutopilotOrder = {
      id: orderId,
      idempotencyKey,
      timestamp: now,
      symbol: signal.symbol,
      isin: constituent?.isin || "INE000000000",
      side: signal.action === "BUY" ? "BUY" : "SELL",
      product: "CNC", // Cash Equities delivery
      orderType: "MARKET",
      quantity: signal.suggestedQty || 1,
      filledQuantity: 0,
      limitPrice: signal.entryPrice,
      status: initialStatus,
      brokerName: config.broker,
      mode: config.mode,
      strategy: signal.strategy,
      stopLoss: signal.stopLossPrice,
      target: signal.targetPrice,
      costBreakdown: signal.estimatedCost,
      approvalRequired: config.requireApproval,
    };

    AutopilotRepository.saveOrder(order);

    AutopilotRepository.logAudit({
      id: `AUDIT-ORD-NEW-${Date.now().toString(36)}`,
      timestamp: now,
      eventType: "ORDER_SUBMITTED",
      severity: "INFO",
      actor: "AUTOPILOT_ENGINE",
      symbol: order.symbol,
      orderId: order.id,
      details: `New ${order.side} order created for ${order.quantity} shares of ${order.symbol} (${order.status})`,
      metadataJson: JSON.stringify(order),
    });

    return order;
  }

  /**
   * Executes an order through the broker adapter and updates local database state
   */
  public static async executeOrder(
    order: AutopilotOrder,
    broker: IBrokerAdapter
  ): Promise<{ success: boolean; updatedOrder: AutopilotOrder; message: string }> {
    const now = new Date().toISOString();

    if (order.status === "FILLED" || order.status === "CANCELLED" || order.status === "REJECTED") {
      return {
        success: false,
        updatedOrder: order,
        message: `Cannot execute order in final state: ${order.status}`,
      };
    }

    try {
      order.status = "PENDING_SUBMISSION";
      AutopilotRepository.saveOrder(order);

      const result = await broker.placeOrder(order);

      if (result.success && result.status === "FILLED") {
        order.status = "FILLED";
        order.filledQuantity = result.filledQty || order.quantity;
        order.averageFillPrice = result.avgFillPrice || order.limitPrice;
        order.brokerOrderId = result.brokerOrderId;

        AutopilotRepository.saveOrder(order);

        // Update local position in DB
        const constituent = UniverseService.getConstituent(order.symbol);
        if (order.side === "BUY") {
          const fillPrice = order.averageFillPrice || 0;
          AutopilotRepository.savePosition({
            symbol: order.symbol,
            isin: constituent?.isin || "INE000000000",
            sector: constituent?.sector || "General",
            product: order.product,
            quantity: order.filledQuantity,
            avgEntryPrice: fillPrice,
            currentLtp: fillPrice,
            stopLossPrice: order.stopLoss || fillPrice * 0.97,
            targetPrice: order.target,
            unrealizedPnl: 0,
            unrealizedPnlPct: 0,
            realizedPnl: 0,
            entryTimestamp: now,
            lastUpdatedTimestamp: now,
            highestPriceSinceEntry: fillPrice,
            strategy: order.strategy,
            mode: order.mode,
          });

          AutopilotRepository.logAudit({
            id: `AUDIT-POS-OPEN-${Date.now().toString(36)}`,
            timestamp: now,
            eventType: "POSITION_OPENED",
            severity: "INFO",
            actor: "AUTOPILOT_ENGINE",
            symbol: order.symbol,
            orderId: order.id,
            details: `Position opened: ${order.filledQuantity} ${order.symbol} @ ₹${fillPrice.toFixed(2)}`,
          });
        } else {
          // Sell order
          AutopilotRepository.deletePosition(order.symbol);
          AutopilotRepository.logAudit({
            id: `AUDIT-POS-CLOSE-${Date.now().toString(36)}`,
            timestamp: now,
            eventType: "POSITION_CLOSED",
            severity: "INFO",
            actor: "AUTOPILOT_ENGINE",
            symbol: order.symbol,
            orderId: order.id,
            details: `Position exited: ${order.symbol} (${order.filledQuantity} shares)`,
          });
        }

        AutopilotRepository.logAudit({
          id: `AUDIT-ORD-FILL-${Date.now().toString(36)}`,
          timestamp: now,
          eventType: "ORDER_FILLED",
          severity: "INFO",
          actor: "BROKER_ADAPTER",
          symbol: order.symbol,
          orderId: order.id,
          details: `Order ${order.id} filled @ ₹${order.averageFillPrice?.toFixed(2)} (Broker Ref: ${order.brokerOrderId})`,
        });

        return {
          success: true,
          updatedOrder: order,
          message: result.message || "Order filled successfully",
        };
      } else if (result.success && result.status === "OPEN") {
        order.status = "OPEN";
        order.brokerOrderId = result.brokerOrderId;
        AutopilotRepository.saveOrder(order);

        return {
          success: true,
          updatedOrder: order,
          message: `Order submitted and open on exchange. Ref: ${order.brokerOrderId}`,
        };
      } else {
        // Rejected
        order.status = "REJECTED";
        order.rejectReason = result.rejectReason || result.message || "Broker rejected order";
        AutopilotRepository.saveOrder(order);

        AutopilotRepository.logAudit({
          id: `AUDIT-ORD-REJ-${Date.now().toString(36)}`,
          timestamp: now,
          eventType: "ORDER_REJECTED",
          severity: "WARNING",
          actor: "BROKER_ADAPTER",
          symbol: order.symbol,
          orderId: order.id,
          details: `Order rejected: ${order.rejectReason}`,
        });

        return {
          success: false,
          updatedOrder: order,
          message: order.rejectReason,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Execution exception";
      order.status = "REJECTED";
      order.rejectReason = msg;
      AutopilotRepository.saveOrder(order);

      return {
        success: false,
        updatedOrder: order,
        message: `Execution failed: ${msg}`,
      };
    }
  }

  /**
   * User approval / rejection for manual-approval mode
   */
  public static async handleApproval(
    orderId: string,
    approved: boolean,
    approver: string,
    broker: IBrokerAdapter
  ): Promise<{ success: boolean; message: string; order?: AutopilotOrder }> {
    const orders = AutopilotRepository.getOrders(100);
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return { success: false, message: `Order ${orderId} not found.` };
    }

    if (order.status !== "PENDING_APPROVAL") {
      return { success: false, message: `Order ${orderId} is in status '${order.status}', not pending approval.` };
    }

    const now = new Date().toISOString();

    if (!approved) {
      order.status = "CANCELLED";
      order.rejectReason = `Cancelled by operator (${approver})`;
      AutopilotRepository.saveOrder(order);

      AutopilotRepository.logAudit({
        id: `AUDIT-ORD-CAN-${Date.now().toString(36)}`,
        timestamp: now,
        eventType: "ORDER_CANCELLED",
        severity: "INFO",
        actor: approver,
        symbol: order.symbol,
        orderId: order.id,
        details: `Order approval rejected by operator. Order cancelled.`,
      });

      return { success: true, message: "Order cancelled.", order };
    }

    order.approvedAt = now;
    order.approvedBy = approver;

    // Proceed to execute
    const execResult = await this.executeOrder(order, broker);
    return {
      success: execResult.success,
      message: execResult.message,
      order: execResult.updatedOrder,
    };
  }

  /**
   * System startup reconciliation & recovery
   */
  public static async reconcileBrokerState(broker: IBrokerAdapter): Promise<{
    reconciled: boolean;
    discrepancies: string[];
  }> {
    const localPositions = AutopilotRepository.getPositions();
    const result = await broker.reconcilePositions(localPositions);

    AutopilotRepository.logAudit({
      id: `AUDIT-RECON-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      eventType: "RECONCILIATION_EVENT",
      severity: result.reconciled ? "INFO" : "WARNING",
      actor: "AUTOPILOT_ENGINE",
      details: result.reconciled
        ? `Position reconciliation clean. Verified ${localPositions.length} positions with ${broker.brokerName}.`
        : `Reconciliation discrepancies detected: ${result.discrepancies.join("; ")}`,
      metadataJson: JSON.stringify(result),
    });

    return {
      reconciled: result.reconciled,
      discrepancies: result.discrepancies,
    };
  }
}

import { NextRequest, NextResponse } from "next/server";
import { AutopilotRepository } from "@/lib/autopilot/db/autopilotDb";
import { BrokerFactory } from "@/lib/autopilot/brokers/brokerFactory";
import { OrderManager } from "@/lib/autopilot/execution/orderManager";
import { StrategySignal } from "@/lib/autopilot/types";

export async function GET() {
  try {
    const positions = AutopilotRepository.getPositions();
    return NextResponse.json({ success: true, positions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch positions";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, symbol } = body;

    const config = AutopilotRepository.getConfig();
    const broker = BrokerFactory.getAdapter(config);
    const positions = AutopilotRepository.getPositions();

    if (action === "EXIT_POSITION" && symbol) {
      const targetPos = positions.find((p) => p.symbol === symbol);
      if (!targetPos) {
        return NextResponse.json({ success: false, error: `Position ${symbol} not found.` }, { status: 404 });
      }

      const exitSignal: StrategySignal = {
        id: `SIG-MANUAL-EXIT-${symbol}-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        symbol,
        strategy: targetPos.strategy,
        action: "SELL",
        reason: "Manual operator position exit",
        confidence: 1.0,
        suggestedQty: targetPos.quantity,
        metadata: {},
      };

      const order = OrderManager.createOrderFromSignal(exitSignal, { ...config, requireApproval: false });
      const execResult = await OrderManager.executeOrder(order, broker);

      return NextResponse.json({
        success: execResult.success,
        message: execResult.message,
        order: execResult.updatedOrder,
      });
    }

    if (action === "SQUARE_OFF_ALL") {
      const results = [];
      for (const pos of positions) {
        const exitSignal: StrategySignal = {
          id: `SIG-MANUAL-SQOFF-${pos.symbol}-${Date.now().toString(36)}`,
          timestamp: new Date().toISOString(),
          symbol: pos.symbol,
          strategy: pos.strategy,
          action: "SELL",
          reason: "Emergency / Manual square off all positions",
          confidence: 1.0,
          suggestedQty: pos.quantity,
          metadata: {},
        };

        const order = OrderManager.createOrderFromSignal(exitSignal, { ...config, requireApproval: false });
        const execResult = await OrderManager.executeOrder(order, broker);
        results.push(execResult);
      }

      return NextResponse.json({
        success: true,
        message: `Square-off triggered for ${positions.length} active positions.`,
        results,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Position action failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { AutopilotRepository } from "@/lib/autopilot/db/autopilotDb";
import { OrderManager } from "@/lib/autopilot/execution/orderManager";
import { BrokerFactory } from "@/lib/autopilot/brokers/brokerFactory";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const orders = AutopilotRepository.getOrders(limit);
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, action, approver = "OPERATOR" } = body;

    if (!orderId || !action) {
      return NextResponse.json({ success: false, error: "Missing orderId or action ('APPROVE' | 'CANCEL')" }, { status: 400 });
    }

    const config = AutopilotRepository.getConfig();
    const broker = BrokerFactory.getAdapter(config);

    if (action === "APPROVE") {
      const res = await OrderManager.handleApproval(orderId, true, approver, broker);
      return NextResponse.json(res);
    } else if (action === "CANCEL") {
      const res = await OrderManager.handleApproval(orderId, false, approver, broker);
      return NextResponse.json(res);
    } else {
      return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to handle order action";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

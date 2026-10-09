import { NextRequest, NextResponse } from "next/server";
import { BrokerFactory } from "@/lib/autopilot/brokers/brokerFactory";
import { AutopilotRepository } from "@/lib/autopilot/db/autopilotDb";
import { BrokerCredentials } from "@/lib/autopilot/brokers/brokerInterface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brokerName, credentials } = body as { brokerName: "ANGEL_ONE" | "ZERODHA" | "PAPER" | "DEMO"; credentials?: BrokerCredentials };

    const config = AutopilotRepository.getConfig();
    const adapter = BrokerFactory.getAdapter({ ...config, broker: brokerName, mode: brokerName === "PAPER" ? "PAPER" : brokerName === "DEMO" ? "DEMO" : "LIVE" });

    const authResult = await adapter.authenticate(credentials);
    const fundsResult = authResult.success ? await adapter.getFunds().catch(() => null) : null;

    return NextResponse.json({
      success: authResult.success,
      message: authResult.message,
      sessionExpiry: authResult.sessionExpiry,
      funds: fundsResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Broker connection test failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

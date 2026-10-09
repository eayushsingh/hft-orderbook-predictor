import { NextRequest, NextResponse } from "next/server";
import { AutopilotRunner } from "@/lib/autopilot/execution/autopilotRunner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, reason = "Operator emergency action", actor = "OPERATOR" } = body;

    if (action === "ENGAGE") {
      const updatedConfig = AutopilotRunner.engageKillSwitch(reason, actor);
      return NextResponse.json({
        success: true,
        message: "EMERGENCY KILL SWITCH ENGAGED. All new entries are blocked.",
        config: updatedConfig,
      });
    }

    if (action === "RESET") {
      const updatedConfig = AutopilotRunner.resetKillSwitch(actor);
      return NextResponse.json({
        success: true,
        message: "Kill switch reset to PAUSED. Manual review required before resuming trading.",
        config: updatedConfig,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action ('ENGAGE' | 'RESET')" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Kill switch operation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

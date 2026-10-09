import { NextResponse } from "next/server";
import { AutopilotRunner } from "@/lib/autopilot/execution/autopilotRunner";

export async function POST() {
  try {
    const cycleResult = await AutopilotRunner.runCycle();
    return NextResponse.json({
      success: true,
      data: cycleResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cycle execution failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

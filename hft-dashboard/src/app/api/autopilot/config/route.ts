import { NextRequest, NextResponse } from "next/server";
import { AutopilotRepository } from "@/lib/autopilot/db/autopilotDb";
import { AutopilotConfig } from "@/lib/autopilot/types";
import { SebiComplianceValidator } from "@/lib/autopilot/compliance/sebiCompliance";

export async function GET() {
  try {
    const config = AutopilotRepository.getConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error retrieving config";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── STRICT SERVER-SIDE VALIDATION ──
    const capital = typeof body.capital === "number" ? body.capital : undefined;
    if (capital !== undefined && (capital < 10000 || capital > 100000000)) {
      return NextResponse.json({ success: false, error: "Capital must be between ₹10,000 and ₹10,00,00,000" }, { status: 400 });
    }

    const riskPerTrade = typeof body.riskPerTradePct === "number" ? body.riskPerTradePct : undefined;
    if (riskPerTrade !== undefined && (riskPerTrade < 0.1 || riskPerTrade > 5.0)) {
      return NextResponse.json({ success: false, error: "Risk per trade must be between 0.1% and 5.0%" }, { status: 400 });
    }

    const maxDailyLoss = typeof body.maxDailyLossPct === "number" ? body.maxDailyLossPct : undefined;
    if (maxDailyLoss !== undefined && (maxDailyLoss < 0.5 || maxDailyLoss > 15.0)) {
      return NextResponse.json({ success: false, error: "Max daily loss must be between 0.5% and 15.0%" }, { status: 400 });
    }

    const maxDrawdown = typeof body.maxDrawdownPct === "number" ? body.maxDrawdownPct : undefined;
    if (maxDrawdown !== undefined && (maxDrawdown < 2.0 || maxDrawdown > 30.0)) {
      return NextResponse.json({ success: false, error: "Max drawdown must be between 2.0% and 30.0%" }, { status: 400 });
    }

    const maxPositions = typeof body.maxPositions === "number" ? body.maxPositions : undefined;
    if (maxPositions !== undefined && (maxPositions < 1 || maxPositions > 20)) {
      return NextResponse.json({ success: false, error: "Max concurrent positions must be between 1 and 20" }, { status: 400 });
    }

    const positionCap = typeof body.maxPositionCapPct === "number" ? body.maxPositionCapPct : undefined;
    if (positionCap !== undefined && (positionCap < 5.0 || positionCap > 50.0)) {
      return NextResponse.json({ success: false, error: "Max position cap must be between 5.0% and 50.0%" }, { status: 400 });
    }

    const sectorCap = typeof body.maxSectorCapPct === "number" ? body.maxSectorCapPct : undefined;
    if (sectorCap !== undefined && (sectorCap < 10.0 || sectorCap > 50.0)) {
      return NextResponse.json({ success: false, error: "Max sector cap must be between 10.0% and 50.0%" }, { status: 400 });
    }

    // Live mode safety barrier
    if (body.mode === "LIVE") {
      const hasCredentials = Boolean(
        (body.broker === "ANGEL_ONE" && process.env.ANGEL_ONE_API_KEY) ||
        (body.broker === "ZERODHA" && (process.env.ZERODHA_API_KEY || process.env.ZERODHA_ACCESS_TOKEN))
      );

      const readiness = SebiComplianceValidator.validateLiveTradingReadiness(
        Boolean(body.sebiDisclaimerAccepted),
        body.broker || "PAPER",
        hasCredentials
      );

      if (!readiness.ready) {
        return NextResponse.json({
          success: false,
          error: `Live trading activation blocked: ${readiness.blockers.join(" ")}`,
        }, { status: 403 });
      }
    }

    const updated = AutopilotRepository.updateConfig(body as Partial<AutopilotConfig>);
    return NextResponse.json({ success: true, config: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating config";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

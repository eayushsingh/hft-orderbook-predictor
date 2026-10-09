import { NextRequest, NextResponse } from "next/server";
import { BacktestEngine } from "@/lib/autopilot/backtest/backtestEngine";
import { AutopilotRepository } from "@/lib/autopilot/db/autopilotDb";
import { BacktestRequest } from "@/lib/autopilot/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const strategy = searchParams.get("strategy") || undefined;
    const latest = AutopilotRepository.getLatestBacktest(strategy);
    return NextResponse.json({ success: true, backtest: latest });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve backtest";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = AutopilotRepository.getConfig();

    const request: BacktestRequest = {
      strategy: body.strategy || config.strategy,
      startDate: body.startDate || "2025-01-01",
      endDate: body.endDate || "2026-01-01",
      initialCapital: body.initialCapital || config.capital,
      riskPerTradePct: body.riskPerTradePct || config.riskPerTradePct,
      maxPositions: body.maxPositions || config.maxPositions,
      includeCostsAndSlippage: true,
      slippageBps: body.slippageBps || config.maxSlippageBps || 10,
    };

    const result = BacktestEngine.runBacktest(request);
    AutopilotRepository.saveBacktest(result);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Backtest simulation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

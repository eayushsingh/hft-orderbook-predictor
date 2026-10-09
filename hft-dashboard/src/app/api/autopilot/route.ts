import { NextResponse } from "next/server";
import { AutopilotRepository } from "@/lib/autopilot/db/autopilotDb";
import { MarketAnalysisEngine } from "@/lib/autopilot/analysis/marketAnalysisEngine";
import { RiskEngine } from "@/lib/autopilot/risk/riskEngine";
import { BrokerFactory } from "@/lib/autopilot/brokers/brokerFactory";

export async function GET() {
  try {
    const config = AutopilotRepository.getConfig();
    const marketSnapshot = MarketAnalysisEngine.getMarketSnapshot();
    let rankings = AutopilotRepository.getRankings();
    if (rankings.length === 0) {
      rankings = MarketAnalysisEngine.computeConstituentRankings(marketSnapshot);
      try {
        AutopilotRepository.saveRankings(rankings);
      } catch {
        // Cache write fallback
      }
    }

    const positions = AutopilotRepository.getPositions();
    const orders = AutopilotRepository.getOrders(30);
    const auditLogs = AutopilotRepository.getAuditLogs(25);
    const marketStatus = RiskEngine.isMarketOpen();

    const broker = BrokerFactory.getAdapter(config);
    const funds = await broker.getFunds();

    return NextResponse.json({
      success: true,
      data: {
        config,
        marketStatus,
        funds,
        indexData: marketSnapshot.indexData,
        newsAdvisories: marketSnapshot.newsAdvisories,
        rankings,
        positions,
        orders,
        auditLogs,
        engineVersion: "v1.2.0-nifty50-autopilot",
        serverTimestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Autopilot Engine Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

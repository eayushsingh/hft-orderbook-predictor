import { computeAccumulationScore } from "../../src/lib/institutional/scoring/scoringEngine";
import { calculateAllSignals, ShareholdingTrendData, DealEvidenceData, IndividualInstitutionTrend, MarketMetricsData } from "../../src/lib/institutional/signals/signalCalculator";

describe("Data Quality & Integrity Engine Tests", () => {
  test("Gracefully handles missing data without fabricating numbers", () => {
    const emptyTrend: ShareholdingTrendData = {
      currentQuarter: "Q2-2025",
      currentInstPct: 0.0,
      prevQuarterInstPct: 0.0,
      fourQuartersAgoInstPct: 0.0,
      mutualFundCurrentPct: 0.0,
      mutualFundPrevPct: 0.0,
      fiiCurrentPct: 0.0,
      fiiPrevPct: 0.0,
      consecutiveQuarterGrowthCount: 0,
    };

    const emptyDeals: DealEvidenceData = {
      bulkBuyCount: 0, bulkSellCount: 0, bulkBuyValueCr: 0, bulkSellValueCr: 0,
      blockBuyCount: 0, blockSellCount: 0, blockBuyValueCr: 0, blockSellValueCr: 0,
      netValueCr: 0, daysAnalyzed: 90,
    };

    const emptyInd: IndividualInstitutionTrend = {
      accumulatingCount: 0, distributingCount: 0, topAccumulators: [], topDistributors: [],
    };

    const emptyMarket: MarketMetricsData = {
      latestDeliveryPct: 0, avgDeliveryPct20d: 0, deliveryAnomalyRatio: 0, volumeAnomalyRatio: 0, upDayVolumeRatio: 0,
    };

    const staleFreshness = { shareholdingAgeDays: 150, dealsAgeDays: 150, marketDataAgeDays: 150 };
    const missingSources = ["NSE_SHP_API", "BSE_DEALS_API"];

    const signals = calculateAllSignals(emptyTrend, emptyDeals, emptyInd, emptyMarket);
    const result = computeAccumulationScore("UNKNOWN_STOCK", signals, emptyTrend, emptyDeals, emptyInd, emptyMarket, staleFreshness, missingSources);

    expect(result.confidence).toBe("INSUFFICIENT_DATA");
    expect(result.missingSources).toEqual(missingSources);
  });
});

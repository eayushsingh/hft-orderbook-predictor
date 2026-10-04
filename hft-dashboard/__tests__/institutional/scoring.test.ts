import { computeAccumulationScore } from "../../src/lib/institutional/scoring/scoringEngine";
import { calculateAllSignals, ShareholdingTrendData, DealEvidenceData, IndividualInstitutionTrend, MarketMetricsData } from "../../src/lib/institutional/signals/signalCalculator";

describe("Institutional Accumulation Scoring Engine Tests", () => {
  const mockTrend: ShareholdingTrendData = {
    currentQuarter: "Q2-2025",
    currentInstPct: 35.5,
    prevQuarterInstPct: 33.0,
    fourQuartersAgoInstPct: 30.0,
    mutualFundCurrentPct: 12.0,
    mutualFundPrevPct: 10.5,
    fiiCurrentPct: 20.0,
    fiiPrevPct: 18.5,
    consecutiveQuarterGrowthCount: 3,
  };

  const mockDeals: DealEvidenceData = {
    bulkBuyCount: 3,
    bulkSellCount: 0,
    bulkBuyValueCr: 450.0,
    bulkSellValueCr: 0.0,
    blockBuyCount: 2,
    blockSellCount: 1,
    blockBuyValueCr: 300.0,
    blockSellValueCr: 50.0,
    netValueCr: 700.0,
    daysAnalyzed: 90,
  };

  const mockIndTrend: IndividualInstitutionTrend = {
    accumulatingCount: 4,
    distributingCount: 1,
    topAccumulators: [
      { name: "SBI Mutual Fund", category: "MUTUAL_FUND", prevPct: 2.0, currentPct: 2.5, changePct: 0.5 },
      { name: "HDFC Mutual Fund", category: "MUTUAL_FUND", prevPct: 1.8, currentPct: 2.2, changePct: 0.4 },
    ],
    topDistributors: [
      { name: "Norges Bank", category: "FII_FPI", prevPct: 1.2, currentPct: 1.0, changePct: -0.2 },
    ],
  };

  const mockMarket: MarketMetricsData = {
    latestDeliveryPct: 65.0,
    avgDeliveryPct20d: 50.0,
    deliveryAnomalyRatio: 1.3,
    volumeAnomalyRatio: 1.4,
    upDayVolumeRatio: 1.5,
  };

  const dataFreshness = {
    shareholdingAgeDays: 10,
    dealsAgeDays: 2,
    marketDataAgeDays: 0,
  };

  test("Calculates Strong Accumulation Score (> 80)", () => {
    const signals = calculateAllSignals(mockTrend, mockDeals, mockIndTrend, mockMarket);
    const result = computeAccumulationScore("RELIANCE", signals, mockTrend, mockDeals, mockIndTrend, mockMarket, dataFreshness);

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.classification).toBe("STRONG_ACCUMULATION");
    expect(result.confidence).toBe("HIGH");
    expect(result.evidence.positive.length).toBeGreaterThan(3);
    expect(result.evidence.disclaimer).toContain("Publicly disclosed data indicates institutional accumulation");
  });

  test("Reduces confidence when data sources are stale or missing", () => {
    const staleFreshness = {
      shareholdingAgeDays: 75,
      dealsAgeDays: 40,
      marketDataAgeDays: 0,
    };
    const missing = ["BSE_BLOCK_DEAL_FEED"];

    const signals = calculateAllSignals(mockTrend, mockDeals, mockIndTrend, mockMarket);
    const result = computeAccumulationScore("RELIANCE", signals, mockTrend, mockDeals, mockIndTrend, mockMarket, staleFreshness, missing);

    expect(result.confidence).toBe("LOW");
    expect(result.evidence.negative).toContain("⚠ Data feed unavailable: BSE_BLOCK_DEAL_FEED");
  });
});

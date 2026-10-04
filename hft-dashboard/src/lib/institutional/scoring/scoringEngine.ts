import { CalculatedSignal, ShareholdingTrendData, DealEvidenceData, IndividualInstitutionTrend, MarketMetricsData } from "../signals/signalCalculator";

export type ClassificationType =
  | "STRONG_ACCUMULATION"
  | "MODERATE_ACCUMULATION"
  | "NEUTRAL_HOLD"
  | "MODERATE_DISTRIBUTION"
  | "STRONG_DISTRIBUTION";

export type ConfidenceType = "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_DATA";

export interface ScoreBreakdown {
  ownershipTrendScore: number;     // max 25
  bulkBlockDealsScore: number;     // max 20
  individualInstScore: number;     // max 15
  deliveryConfirmationScore: number; // max 15
  volumeAnomalyScore: number;      // max 10
  persistenceScore: number;        // max 10
  priceVolumeScore: number;        // max 5
}

export interface AccumulationScoreResult {
  symbol: string;
  score: number; // 0 to 100
  classification: ClassificationType;
  confidence: ConfidenceType;
  institutionalOwnership: {
    current: number;
    previousQuarter: number;
    change: number;
  };
  signals: CalculatedSignal[];
  breakdown: ScoreBreakdown;
  evidence: {
    positive: string[];
    negative: string[];
    disclaimer: string;
  };
  dataFreshness: {
    shareholdingAgeDays: number;
    dealsAgeDays: number;
    marketDataAgeDays: number;
  };
  missingSources: string[];
}

export function computeAccumulationScore(
  symbol: string,
  signals: CalculatedSignal[],
  trend: ShareholdingTrendData,
  deals: DealEvidenceData,
  indTrend: IndividualInstitutionTrend,
  market: MarketMetricsData,
  dataFreshness: { shareholdingAgeDays: number; dealsAgeDays: number; marketDataAgeDays: number },
  missingSources: string[] = []
): AccumulationScoreResult {
  // Extract module score contributions
  const getCategoryScore = (cat: string) =>
    signals
      .filter((s) => s.signalCategory === cat)
      .reduce((acc, s) => acc + s.scoreContribution, 0);

  const breakdown: ScoreBreakdown = {
    ownershipTrendScore: Math.round(getCategoryScore("OWNERSHIP_TREND") * 10) / 10,
    bulkBlockDealsScore: Math.round(getCategoryScore("BULK_BLOCK_DEALS") * 10) / 10,
    individualInstScore: Math.round(getCategoryScore("INDIVIDUAL_INSTITUTIONS") * 10) / 10,
    deliveryConfirmationScore: Math.round(getCategoryScore("DELIVERY_CONFIRMATION") * 10) / 10,
    volumeAnomalyScore: Math.round(getCategoryScore("VOLUME_ANOMALY") * 10) / 10,
    persistenceScore: Math.round(getCategoryScore("PERSISTENCE") * 10) / 10,
    priceVolumeScore: Math.round(getCategoryScore("PRICE_VOLUME") * 10) / 10,
  };

  const rawTotalScore =
    breakdown.ownershipTrendScore +
    breakdown.bulkBlockDealsScore +
    breakdown.individualInstScore +
    breakdown.deliveryConfirmationScore +
    breakdown.volumeAnomalyScore +
    breakdown.persistenceScore +
    breakdown.priceVolumeScore;

  const score = Math.min(100, Math.max(0, Math.round(rawTotalScore)));

  // Classify score
  let classification: ClassificationType = "NEUTRAL_HOLD";
  if (score >= 80) classification = "STRONG_ACCUMULATION";
  else if (score >= 60) classification = "MODERATE_ACCUMULATION";
  else if (score >= 40) classification = "NEUTRAL_HOLD";
  else if (score >= 20) classification = "MODERATE_DISTRIBUTION";
  else classification = "STRONG_DISTRIBUTION";

  // Determine Confidence level
  let confidence: ConfidenceType = "HIGH";
  if (missingSources.length > 2 || dataFreshness.shareholdingAgeDays > 120) {
    confidence = "INSUFFICIENT_DATA";
  } else if (missingSources.length > 0 || dataFreshness.shareholdingAgeDays > 60 || dataFreshness.dealsAgeDays > 30) {
    confidence = "LOW";
  } else if (dataFreshness.shareholdingAgeDays > 30 || dataFreshness.dealsAgeDays > 15) {
    confidence = "MEDIUM";
  }

  // Generate Positive Evidence Points
  const positive: string[] = [];
  if (trend.mutualFundCurrentPct > trend.mutualFundPrevPct) {
    positive.push(
      `✓ Mutual fund ownership increased from ${trend.mutualFundPrevPct.toFixed(2)}% → ${trend.mutualFundCurrentPct.toFixed(2)}%`
    );
  }
  if (trend.fiiCurrentPct > trend.fiiPrevPct) {
    positive.push(
      `✓ FPI ownership increased from ${trend.fiiPrevPct.toFixed(2)}% → ${trend.fiiCurrentPct.toFixed(2)}%`
    );
  }
  const totalBuyDeals = deals.bulkBuyCount + deals.blockBuyCount;
  if (totalBuyDeals > 0) {
    positive.push(`✓ ${totalBuyDeals} disclosed institutional purchase transactions`);
  }
  const totalBuyValueCr = deals.bulkBuyValueCr + deals.blockBuyValueCr;
  if (totalBuyValueCr > 0) {
    positive.push(`✓ ₹${totalBuyValueCr.toFixed(1)} crore disclosed buying`);
  }
  if (market.deliveryAnomalyRatio > 1.1) {
    const pctAbove = Math.round((market.deliveryAnomalyRatio - 1) * 100);
    positive.push(`✓ Delivery volume is ${pctAbove}% above 20-day average`);
  }
  if (trend.consecutiveQuarterGrowthCount >= 2) {
    positive.push(`✓ Accumulation persisted for ${trend.consecutiveQuarterGrowthCount} consecutive quarters`);
  }
  indTrend.topAccumulators.slice(0, 2).forEach((acc) => {
    positive.push(`✓ ${acc.name} increased holding (+${acc.changePct.toFixed(2)}% pts)`);
  });

  // Generate Negative / Warning Evidence Points
  const negative: string[] = [];
  indTrend.topDistributors.slice(0, 2).forEach((dist) => {
    negative.push(`⚠ ${dist.name} reduced holding (${dist.changePct.toFixed(2)}% pts)`);
  });
  const totalSellValueCr = deals.bulkSellValueCr + deals.blockSellValueCr;
  if (totalSellValueCr > 0) {
    negative.push(`⚠ ₹${totalSellValueCr.toFixed(1)} crore disclosed institutional selling`);
  }
  if (dataFreshness.shareholdingAgeDays > 15) {
    negative.push(`⚠ Shareholding data is ${dataFreshness.shareholdingAgeDays} days old`);
  }
  missingSources.forEach((src) => {
    negative.push(`⚠ Data feed unavailable: ${src}`);
  });

  const disclaimer =
    "Publicly disclosed data indicates institutional accumulation based on regulatory filings and market telemetry.";

  return {
    symbol,
    score,
    classification,
    confidence,
    institutionalOwnership: {
      current: Math.round(trend.currentInstPct * 100) / 100,
      previousQuarter: Math.round(trend.prevQuarterInstPct * 100) / 100,
      change: Math.round((trend.currentInstPct - trend.prevQuarterInstPct) * 100) / 100,
    },
    signals,
    breakdown,
    evidence: {
      positive,
      negative,
      disclaimer,
    },
    dataFreshness,
    missingSources,
  };
}

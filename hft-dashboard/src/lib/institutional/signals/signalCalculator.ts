export interface CalculatedSignal {
  signalName: string;
  signalCategory: string;
  weight: number;
  rawValue: number;
  normalizedValue: number; // 0.0 to 1.0 (or component score)
  scoreContribution: number; // raw pts awarded out of weight max
  calculationUsed: string;
  source: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ShareholdingTrendData {
  currentQuarter: string;
  currentInstPct: number;
  prevQuarterInstPct: number;
  fourQuartersAgoInstPct: number;
  mutualFundCurrentPct: number;
  mutualFundPrevPct: number;
  fiiCurrentPct: number;
  fiiPrevPct: number;
  consecutiveQuarterGrowthCount: number;
}

export interface DealEvidenceData {
  bulkBuyCount: number;
  bulkSellCount: number;
  bulkBuyValueCr: number;
  bulkSellValueCr: number;
  blockBuyCount: number;
  blockSellCount: number;
  blockBuyValueCr: number;
  blockSellValueCr: number;
  netValueCr: number;
  daysAnalyzed: number;
}

export interface IndividualInstitutionTrend {
  accumulatingCount: number;
  distributingCount: number;
  topAccumulators: Array<{ name: string; category: string; prevPct: number; currentPct: number; changePct: number }>;
  topDistributors: Array<{ name: string; category: string; prevPct: number; currentPct: number; changePct: number }>;
}

export interface MarketMetricsData {
  latestDeliveryPct: number;
  avgDeliveryPct20d: number;
  deliveryAnomalyRatio: number; // latest_delivery / avg_delivery_20d
  volumeAnomalyRatio: number;   // recent_vol / avg_vol_20d
  upDayVolumeRatio: number;     // total green day vol / total red day vol over 30d
}

/**
 * Calculates deterministic signals across all 7 scoring modules.
 */
export function calculateAllSignals(
  trend: ShareholdingTrendData,
  deals: DealEvidenceData,
  indTrend: IndividualInstitutionTrend,
  market: MarketMetricsData,
  asOfTimestamp: string = new Date().toISOString()
): CalculatedSignal[] {
  const signals: CalculatedSignal[] = [];

  // ==========================================
  // MODULE 1: Institutional Ownership Trend (0-25 pts)
  // ==========================================
  const qoqChange = trend.currentInstPct - trend.prevQuarterInstPct; // percentage points
  const yoyChange = trend.currentInstPct - trend.fourQuartersAgoInstPct; // percentage points

  // Signal 1.1: QoQ Institutional Stake Change (Max 12.5 pts)
  // +2.0% change gets full score; 0% gets 6.0 pts; -2% gets 0 pts
  const normQoQ = Math.max(0, Math.min(1, (qoqChange + 2.0) / 4.0));
  const scoreQoQ = Math.round(normQoQ * 12.5 * 100) / 100;
  signals.push({
    signalName: "INSTITUTIONAL_OWNERSHIP_QOQ_CHANGE",
    signalCategory: "OWNERSHIP_TREND",
    weight: 12.5,
    rawValue: Math.round(qoqChange * 100) / 100,
    normalizedValue: Math.round(normQoQ * 100) / 100,
    scoreContribution: scoreQoQ,
    calculationUsed: `QoQ Change = Current (${trend.currentInstPct.toFixed(2)}%) - Prev (${trend.prevQuarterInstPct.toFixed(2)}%) = ${qoqChange > 0 ? "+" : ""}${qoqChange.toFixed(2)}% pts`,
    source: "Quarterly Shareholding Snapshot (NSE/BSE Filings)",
    timestamp: asOfTimestamp,
  });

  // Signal 1.2: YoY 4-Quarter Ownership Trend (Max 12.5 pts)
  const normYoY = Math.max(0, Math.min(1, (yoyChange + 4.0) / 8.0));
  const scoreYoY = Math.round(normYoY * 12.5 * 100) / 100;
  signals.push({
    signalName: "INSTITUTIONAL_OWNERSHIP_4Q_TREND",
    signalCategory: "OWNERSHIP_TREND",
    weight: 12.5,
    rawValue: Math.round(yoyChange * 100) / 100,
    normalizedValue: Math.round(normYoY * 100) / 100,
    scoreContribution: scoreYoY,
    calculationUsed: `4-Quarter Trend = Current (${trend.currentInstPct.toFixed(2)}%) - 4Q Ago (${trend.fourQuartersAgoInstPct.toFixed(2)}%) = ${yoyChange > 0 ? "+" : ""}${yoyChange.toFixed(2)}% pts`,
    source: "Historical Shareholding Matrix",
    timestamp: asOfTimestamp,
  });

  // ==========================================
  // MODULE 2: Bulk / Block Deal Evidence (0-20 pts)
  // ==========================================
  const totalBuyValueCr = deals.bulkBuyValueCr + deals.blockBuyValueCr;
  const totalSellValueCr = deals.bulkSellValueCr + deals.blockSellValueCr;
  const netDealValueCr = deals.netValueCr;

  // Signal 2.1: Net Disclosed Institutional Deal Value (Max 12.0 pts)
  // Net +₹200 Cr buying gets 1.0; 0 gets 0.5; -₹200 Cr gets 0
  const normNetDeals = Math.max(0, Math.min(1, (netDealValueCr + 200) / 400));
  const scoreNetDeals = Math.round(normNetDeals * 12.0 * 100) / 100;
  signals.push({
    signalName: "NET_DISCLOSED_DEAL_VALUE",
    signalCategory: "BULK_BLOCK_DEALS",
    weight: 12.0,
    rawValue: Math.round(netDealValueCr * 100) / 100,
    normalizedValue: Math.round(normNetDeals * 100) / 100,
    scoreContribution: scoreNetDeals,
    calculationUsed: `Net Disclosed Deals = Buying (₹${totalBuyValueCr.toFixed(1)} Cr) - Selling (₹${totalSellValueCr.toFixed(1)} Cr) = ₹${netDealValueCr > 0 ? "+" : ""}${netDealValueCr.toFixed(1)} Cr`,
    source: "Exchange Disclosed Bulk & Block Filings",
    timestamp: asOfTimestamp,
  });

  // Signal 2.2: Deal Buy/Sell Ratio & Frequency (Max 8.0 pts)
  const totalDeals = deals.bulkBuyCount + deals.blockBuyCount + deals.bulkSellCount + deals.blockSellCount;
  const buyDeals = deals.bulkBuyCount + deals.blockBuyCount;
  const buyRatio = totalDeals > 0 ? buyDeals / totalDeals : 0.5;
  const scoreDealRatio = Math.round(buyRatio * 8.0 * 100) / 100;
  signals.push({
    signalName: "BULK_BLOCK_BUY_RATIO",
    signalCategory: "BULK_BLOCK_DEALS",
    weight: 8.0,
    rawValue: Math.round(buyRatio * 100) / 100,
    normalizedValue: Math.round(buyRatio * 100) / 100,
    scoreContribution: scoreDealRatio,
    calculationUsed: `Buy Deal Ratio = ${buyDeals} Buy Deals / ${totalDeals} Total Deals = ${(buyRatio * 100).toFixed(1)}%`,
    source: "Exchange Bulk & Block Transaction Registry",
    timestamp: asOfTimestamp,
  });

  // ==========================================
  // MODULE 3: Individual Institutional Accumulation (0-15 pts)
  // ==========================================
  const netAccCount = indTrend.accumulatingCount - indTrend.distributingCount;
  // Net +3 accumulators gives max 1.0; net 0 gives 0.5; net -3 gives 0.0
  const normIndAcc = Math.max(0, Math.min(1, (netAccCount + 3) / 6.0));
  const scoreIndAcc = Math.round(normIndAcc * 15.0 * 100) / 100;
  signals.push({
    signalName: "INDIVIDUAL_INSTITUTION_NET_ACCUMULATION",
    signalCategory: "INDIVIDUAL_INSTITUTIONS",
    weight: 15.0,
    rawValue: netAccCount,
    normalizedValue: Math.round(normIndAcc * 100) / 100,
    scoreContribution: scoreIndAcc,
    calculationUsed: `Net Named Institutions = ${indTrend.accumulatingCount} Accumulators - ${indTrend.distributingCount} Distributors = ${netAccCount > 0 ? "+" : ""}${netAccCount}`,
    source: "Quarterly Disclosed Major Holder Roster (>1% stake)",
    timestamp: asOfTimestamp,
  });

  // ==========================================
  // MODULE 4: Delivery-Volume Confirmation (0-15 pts)
  // ==========================================
  // High delivery percentage indicates genuine long-term position building
  const normDelivery = Math.max(0, Math.min(1, (market.deliveryAnomalyRatio - 0.7) / 0.8));
  const scoreDelivery = Math.round(normDelivery * 15.0 * 100) / 100;
  signals.push({
    signalName: "DELIVERY_VOLUME_CONFIRMATION",
    signalCategory: "DELIVERY_CONFIRMATION",
    weight: 15.0,
    rawValue: Math.round(market.deliveryAnomalyRatio * 100) / 100,
    normalizedValue: Math.round(normDelivery * 100) / 100,
    scoreContribution: scoreDelivery,
    calculationUsed: `Delivery Anomaly = Latest Delivery % (${market.latestDeliveryPct.toFixed(1)}%) / 20d Avg Delivery (${market.avgDeliveryPct20d.toFixed(1)}%) = ${market.deliveryAnomalyRatio.toFixed(2)}x`,
    source: "NSE/BSE Delivery Volume Stream",
    timestamp: asOfTimestamp,
  });

  // ==========================================
  // MODULE 5: Volume Anomaly (0-10 pts)
  // ==========================================
  // Volume ratio > 1.0 means active volume expansion
  const normVolAnomaly = Math.max(0, Math.min(1, (market.volumeAnomalyRatio - 0.5) / 1.5));
  const scoreVolAnomaly = Math.round(normVolAnomaly * 10.0 * 100) / 100;
  signals.push({
    signalName: "VOLUME_ANOMALY_RATIO",
    signalCategory: "VOLUME_ANOMALY",
    weight: 10.0,
    rawValue: Math.round(market.volumeAnomalyRatio * 100) / 100,
    normalizedValue: Math.round(normVolAnomaly * 100) / 100,
    scoreContribution: scoreVolAnomaly,
    calculationUsed: `Volume Anomaly Ratio = Traded Vol / 20d Avg Vol = ${market.volumeAnomalyRatio.toFixed(2)}x`,
    source: "Daily Tick & Volume Engine",
    timestamp: asOfTimestamp,
  });

  // ==========================================
  // MODULE 6: Persistence Across Periods (0-10 pts)
  // ==========================================
  // 4 quarters = 1.0; 3 quarters = 0.75; 2 quarters = 0.5; 1 quarter = 0.25; 0 = 0.0
  const normPersistence = Math.min(1.0, trend.consecutiveQuarterGrowthCount / 4.0);
  const scorePersistence = Math.round(normPersistence * 10.0 * 100) / 100;
  signals.push({
    signalName: "ACCUMULATION_PERSISTENCE_QUARTERS",
    signalCategory: "PERSISTENCE",
    weight: 10.0,
    rawValue: trend.consecutiveQuarterGrowthCount,
    normalizedValue: Math.round(normPersistence * 100) / 100,
    scoreContribution: scorePersistence,
    calculationUsed: `Persistence = ${trend.consecutiveQuarterGrowthCount} consecutive quarters of institutional stake growth`,
    source: "Multi-Quarter Shareholding History",
    timestamp: asOfTimestamp,
  });

  // ==========================================
  // MODULE 7: Price / Volume Relationship (0-5 pts)
  // ==========================================
  // Up-day volume ratio > 1.0 means buying occurs on heavy volume
  const normPriceVol = Math.max(0, Math.min(1, (market.upDayVolumeRatio - 0.5) / 1.5));
  const scorePriceVol = Math.round(normPriceVol * 5.0 * 100) / 100;
  signals.push({
    signalName: "PRICE_VOLUME_ACCUMULATION_RATIO",
    signalCategory: "PRICE_VOLUME",
    weight: 5.0,
    rawValue: Math.round(market.upDayVolumeRatio * 100) / 100,
    normalizedValue: Math.round(normPriceVol * 100) / 100,
    scoreContribution: scorePriceVol,
    calculationUsed: `Price/Volume Accumulation = Up-Day Vol / Down-Day Vol over 30 sessions = ${market.upDayVolumeRatio.toFixed(2)}x`,
    source: "Price & Volume Action Analyzer",
    timestamp: asOfTimestamp,
  });

  return signals;
}

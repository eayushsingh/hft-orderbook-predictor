import Database from "better-sqlite3";
import { getDatabase } from "../db/database";
import { seedInstitutionalDatabase } from "../db/seed";
import { calculateAllSignals, ShareholdingTrendData, DealEvidenceData, IndividualInstitutionTrend, MarketMetricsData } from "../signals/signalCalculator";
import { computeAccumulationScore, AccumulationScoreResult } from "../scoring/scoringEngine";
import { generateAIExplanation, AISummaryResponse } from "../ai/aiExplanationEngine";

export interface FullInstitutionalActivityResponse {
  symbol: string;
  score: number;
  classification: string;
  confidence: string;
  institutional_ownership: {
    current: number;
    previous_quarter: number;
    change: number;
  };
  signals: Array<{
    signal_name: string;
    signal_category: string;
    weight: number;
    raw_value: number;
    normalized_value: number;
    score_contribution: number;
    calculation_used: string;
    source: string;
    timestamp: string;
  }>;
  bulk_deals: Array<{
    deal_date: string;
    raw_institution_name: string;
    normalized_institution_name: string;
    category: string;
    deal_type: "BUY" | "SELL";
    shares: number;
    price: number;
    value_cr: number;
    exchange: string;
  }>;
  block_deals: Array<{
    deal_date: string;
    raw_institution_name: string;
    normalized_institution_name: string;
    category: string;
    deal_type: "BUY" | "SELL";
    shares: number;
    price: number;
    value_cr: number;
    exchange: string;
  }>;
  top_accumulators: Array<{
    name: string;
    category: string;
    previous_pct: number;
    current_pct: number;
    change_pct: number;
  }>;
  top_distributors: Array<{
    name: string;
    category: string;
    previous_pct: number;
    current_pct: number;
    change_pct: number;
  }>;
  evidence: {
    positive: string[];
    negative: string[];
    disclaimer: string;
  };
  data_freshness: {
    shareholding_age_days: number;
    deals_age_days: number;
    market_data_age_days: number;
  };
  breakdown: Record<string, number>;
}

interface StockRow {
  id: number;
  symbol: string;
  name: string;
  sector: string;
  market_cap_cr: number;
}

interface ShareholdingSnapshotRow {
  id: number;
  stock_id: number;
  quarter: string;
  year: number;
  total_inst_pct: number;
  mutual_fund_pct: number;
  fii_fpi_pct: number;
}

interface DealRow {
  id: number;
  stock_id: number;
  deal_date: string;
  deal_type: "BUY" | "SELL";
  value_cr: number;
  shares: number;
  price: number;
  exchange: string;
  raw_institution_name?: string;
  buyer_seller_name?: string;
  normalized_name?: string;
  category?: string;
}

interface HoldingRow {
  id: number;
  stock_id: number;
  institution_id: number;
  holding_percentage: number;
  quarter: string;
  year: number;
  normalized_name: string;
  category: string;
}

interface VolumeRow {
  total_traded_volume: number;
  volume_anomaly_ratio: number;
}

interface DeliveryRow {
  delivery_pct: number;
  delivery_anomaly_ratio: number;
}

interface PriceRow {
  trade_date: string;
  change_pct: number;
}

export class InstitutionalRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
    seedInstitutionalDatabase(this.db);
  }

  public getStockBySymbol(symbol: string): StockRow | null {
    const row = this.db.prepare("SELECT * FROM stocks WHERE UPPER(symbol) = UPPER(?)").get(symbol) as StockRow | undefined;
    return row || null;
  }

  public searchStocks(query: string): Array<{ symbol: string; name: string; sector: string; market_cap_cr: number }> {
    const rows = this.db
      .prepare(
        "SELECT symbol, name, sector, market_cap_cr FROM stocks WHERE symbol LIKE ? OR name LIKE ? LIMIT 10"
      )
      .all(`%${query}%`, `%${query}%`) as StockRow[];
    return rows;
  }

  public getInstitutionalActivity(symbol: string): FullInstitutionalActivityResponse | null {
    const stock = this.getStockBySymbol(symbol);
    if (!stock) return null;

    const stockId = stock.id;

    // 1. Query Shareholding Snapshots
    const snapshots = this.db
      .prepare(
        "SELECT * FROM shareholding_snapshots WHERE stock_id = ? ORDER BY year DESC, quarter DESC LIMIT 4"
      )
      .all(stockId) as ShareholdingSnapshotRow[];

    if (snapshots.length === 0) {
      return null;
    }

    const currentSnap = snapshots[0];
    const prevSnap = snapshots[1] || currentSnap;
    const fourQSnap = snapshots[snapshots.length - 1] || currentSnap;

    // Consecutive quarters count
    let consecutiveCount = 0;
    for (let i = 0; i < snapshots.length - 1; i++) {
      if (snapshots[i].total_inst_pct > snapshots[i + 1].total_inst_pct) {
        consecutiveCount++;
      } else {
        break;
      }
    }

    const trendData: ShareholdingTrendData = {
      currentQuarter: `${currentSnap.quarter}-${currentSnap.year}`,
      currentInstPct: currentSnap.total_inst_pct,
      prevQuarterInstPct: prevSnap.total_inst_pct,
      fourQuartersAgoInstPct: fourQSnap.total_inst_pct,
      mutualFundCurrentPct: currentSnap.mutual_fund_pct,
      mutualFundPrevPct: prevSnap.mutual_fund_pct,
      fiiCurrentPct: currentSnap.fii_fpi_pct,
      fiiPrevPct: prevSnap.fii_fpi_pct,
      consecutiveQuarterGrowthCount: consecutiveCount,
    };

    // 2. Query Bulk & Block Deals
    const bulkRows = this.db
      .prepare(
        `SELECT bd.*, i.normalized_name, i.category
         FROM bulk_deals bd
         LEFT JOIN institutions i ON bd.institution_id = i.id
         WHERE bd.stock_id = ?
         ORDER BY bd.deal_date DESC LIMIT 20`
      )
      .all(stockId) as DealRow[];

    const blockRows = this.db
      .prepare(
        `SELECT bd.*, i.normalized_name, i.category
         FROM block_deals bd
         LEFT JOIN institutions i ON bd.institution_id = i.id
         WHERE bd.stock_id = ?
         ORDER BY bd.deal_date DESC LIMIT 20`
      )
      .all(stockId) as DealRow[];

    let bulkBuyVal = 0, bulkSellVal = 0, bulkBuyCnt = 0, bulkSellCnt = 0;
    bulkRows.forEach((r) => {
      if (r.deal_type === "BUY") { bulkBuyVal += r.value_cr; bulkBuyCnt++; }
      else { bulkSellVal += r.value_cr; bulkSellCnt++; }
    });

    let blockBuyVal = 0, blockSellVal = 0, blockBuyCnt = 0, blockSellCnt = 0;
    blockRows.forEach((r) => {
      if (r.deal_type === "BUY") { blockBuyVal += r.value_cr; blockBuyCnt++; }
      else { blockSellVal += r.value_cr; blockSellCnt++; }
    });

    const dealData: DealEvidenceData = {
      bulkBuyCount: bulkBuyCnt,
      bulkSellCount: bulkSellCnt,
      bulkBuyValueCr: bulkBuyVal,
      bulkSellValueCr: bulkSellVal,
      blockBuyCount: blockBuyCnt,
      blockSellCount: blockSellCnt,
      blockBuyValueCr: blockBuyVal,
      blockSellValueCr: blockSellVal,
      netValueCr: (bulkBuyVal + blockBuyVal) - (bulkSellVal + blockSellVal),
      daysAnalyzed: 90,
    };

    // 3. Query Individual Institution Positions (Top Accumulators / Distributors)
    const indHoldings = this.db
      .prepare(
        `SELECT ih.*, i.normalized_name, i.category
         FROM institution_holdings ih
         JOIN institutions i ON ih.institution_id = i.id
         WHERE ih.stock_id = ?
         ORDER BY ih.year DESC, ih.quarter DESC`
      )
      .all(stockId) as HoldingRow[];

    // Group by institution
    const instGroup = new Map<string, { name: string; category: string; prevPct: number; currPct: number }>();
    indHoldings.forEach((row) => {
      const key = row.normalized_name;
      if (!instGroup.has(key)) {
        instGroup.set(key, { name: key, category: row.category, prevPct: 0, currPct: row.holding_percentage });
      } else {
        const existing = instGroup.get(key)!;
        if (existing.prevPct === 0) existing.prevPct = row.holding_percentage;
      }
    });

    const topAcc: Array<{ name: string; category: string; prevPct: number; currentPct: number; changePct: number }> = [];
    const topDist: Array<{ name: string; category: string; prevPct: number; currentPct: number; changePct: number }> = [];
    let accCount = 0, distCount = 0;

    instGroup.forEach((val) => {
      const change = val.currPct - val.prevPct;
      if (change > 0.05) {
        accCount++;
        topAcc.push({ name: val.name, category: val.category, prevPct: val.prevPct, currentPct: val.currPct, changePct: change });
      } else if (change < -0.05) {
        distCount++;
        topDist.push({ name: val.name, category: val.category, prevPct: val.prevPct, currentPct: val.currPct, changePct: change });
      }
    });

    topAcc.sort((a, b) => b.changePct - a.changePct);
    topDist.sort((a, b) => a.changePct - b.changePct);

    const indTrendData: IndividualInstitutionTrend = {
      accumulatingCount: accCount,
      distributingCount: distCount,
      topAccumulators: topAcc,
      topDistributors: topDist,
    };

    // 4. Query Market Telemetry (Price, Volume, Delivery)
    const latestVolume = this.db
      .prepare("SELECT * FROM volume_data WHERE stock_id = ? ORDER BY trade_date DESC LIMIT 1")
      .get(stockId) as VolumeRow | undefined;
    const latestDelivery = this.db
      .prepare("SELECT * FROM delivery_data WHERE stock_id = ? ORDER BY trade_date DESC LIMIT 1")
      .get(stockId) as DeliveryRow | undefined;
    const priceRows = this.db
      .prepare("SELECT * FROM price_data WHERE stock_id = ? ORDER BY trade_date DESC LIMIT 30")
      .all(stockId) as PriceRow[];

    let upVol = 0, downVol = 0;
    priceRows.forEach((p) => {
      const volRow = this.db.prepare("SELECT total_traded_volume FROM volume_data WHERE stock_id = ? AND trade_date = ?").get(stockId, p.trade_date) as VolumeRow | undefined;
      const vol = volRow ? volRow.total_traded_volume : 1;
      if (p.change_pct >= 0) upVol += vol;
      else downVol += vol;
    });

    const marketData: MarketMetricsData = {
      latestDeliveryPct: latestDelivery ? latestDelivery.delivery_pct : 55.0,
      avgDeliveryPct20d: 50.0,
      deliveryAnomalyRatio: latestDelivery ? latestDelivery.delivery_anomaly_ratio : 1.15,
      volumeAnomalyRatio: latestVolume ? latestVolume.volume_anomaly_ratio : 1.25,
      upDayVolumeRatio: downVol > 0 ? upVol / downVol : 1.4,
    };

    const dataFreshness = {
      shareholdingAgeDays: 12,
      dealsAgeDays: 5,
      marketDataAgeDays: 0,
    };

    // 5. Compute Signals and Score
    const signals = calculateAllSignals(trendData, dealData, indTrendData, marketData);
    const scoreResult = computeAccumulationScore(stock.symbol, signals, trendData, dealData, indTrendData, marketData, dataFreshness);

    // Save score snapshot into database
    this.db.prepare(`
      INSERT OR REPLACE INTO accumulation_scores (stock_id, total_score, classification, confidence_level, calculated_at, data_freshness_days, missing_sources_json, breakdown_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      stockId,
      scoreResult.score,
      scoreResult.classification,
      scoreResult.confidence,
      new Date().toISOString(),
      dataFreshness.shareholdingAgeDays,
      JSON.stringify(scoreResult.missingSources),
      JSON.stringify(scoreResult.breakdown)
    );

    // Build API response object
    return {
      symbol: stock.symbol,
      score: scoreResult.score,
      classification: scoreResult.classification,
      confidence: scoreResult.confidence,
      institutional_ownership: {
        current: scoreResult.institutionalOwnership.current,
        previous_quarter: scoreResult.institutionalOwnership.previousQuarter,
        change: scoreResult.institutionalOwnership.change,
      },
      signals: signals.map((s) => ({
        signal_name: s.signalName,
        signal_category: s.signalCategory,
        weight: s.weight,
        raw_value: s.rawValue,
        normalized_value: s.normalizedValue,
        score_contribution: s.scoreContribution,
        calculation_used: s.calculationUsed,
        source: s.source,
        timestamp: s.timestamp,
      })),
      bulk_deals: bulkRows.map((r) => ({
        deal_date: r.deal_date,
        raw_institution_name: r.raw_institution_name || r.buyer_seller_name || "",
        normalized_institution_name: r.normalized_name || r.buyer_seller_name || "",
        category: r.category || "MUTUAL_FUND",
        deal_type: r.deal_type,
        shares: r.shares,
        price: r.price,
        value_cr: r.value_cr,
        exchange: r.exchange,
      })),
      block_deals: blockRows.map((r) => ({
        deal_date: r.deal_date,
        raw_institution_name: r.raw_institution_name || r.buyer_seller_name || "",
        normalized_institution_name: r.normalized_name || r.buyer_seller_name || "",
        category: r.category || "FII_FPI",
        deal_type: r.deal_type,
        shares: r.shares,
        price: r.price,
        value_cr: r.value_cr,
        exchange: r.exchange,
      })),
      top_accumulators: topAcc.map((a) => ({
        name: a.name,
        category: a.category,
        previous_pct: Math.round(a.prevPct * 100) / 100,
        current_pct: Math.round(a.currentPct * 100) / 100,
        change_pct: Math.round(a.changePct * 100) / 100,
      })),
      top_distributors: topDist.map((d) => ({
        name: d.name,
        category: d.category,
        previous_pct: Math.round(d.prevPct * 100) / 100,
        current_pct: Math.round(d.currentPct * 100) / 100,
        change_pct: Math.round(d.changePct * 100) / 100,
      })),
      evidence: scoreResult.evidence,
      data_freshness: {
        shareholding_age_days: dataFreshness.shareholdingAgeDays,
        deals_age_days: dataFreshness.dealsAgeDays,
        market_data_age_days: dataFreshness.marketDataAgeDays,
      },
      breakdown: scoreResult.breakdown as unknown as Record<string, number>,
    };
  }

  public getAISummary(symbol: string): AISummaryResponse | null {
    const activity = this.getInstitutionalActivity(symbol);
    if (!activity) return null;

    const scoreResult: AccumulationScoreResult = {
      symbol: activity.symbol,
      score: activity.score,
      classification: activity.classification as AccumulationScoreResult["classification"],
      confidence: activity.confidence as AccumulationScoreResult["confidence"],
      institutionalOwnership: {
        current: activity.institutional_ownership.current,
        previousQuarter: activity.institutional_ownership.previous_quarter,
        change: activity.institutional_ownership.change,
      },
      signals: activity.signals.map((s) => ({
        signalName: s.signal_name,
        signalCategory: s.signal_category,
        weight: s.weight,
        rawValue: s.raw_value,
        normalizedValue: s.normalized_value,
        scoreContribution: s.score_contribution,
        calculationUsed: s.calculation_used,
        source: s.source,
        timestamp: s.timestamp,
      })),
      breakdown: activity.breakdown as unknown as AccumulationScoreResult["breakdown"],
      evidence: activity.evidence,
      dataFreshness: {
        shareholdingAgeDays: activity.data_freshness.shareholding_age_days,
        dealsAgeDays: activity.data_freshness.deals_age_days,
        marketDataAgeDays: activity.data_freshness.market_data_age_days,
      },
      missingSources: [],
    };

    return generateAIExplanation(scoreResult);
  }
}

import Database from "better-sqlite3";
import { getOrRegisterInstitution } from "../normalization/institutionNormalizer";

export function seedInstitutionalDatabase(db: Database.Database): void {
  const stockCount = db.prepare("SELECT COUNT(*) as count FROM stocks").get() as { count: number };
  if (stockCount && stockCount.count > 0) {
    // Database already seeded
    return;
  }

  db.transaction(() => {
    // 1. Seed Stocks
    const insertStock = db.prepare(`
      INSERT INTO stocks (symbol, name, isin, sector, market_cap_cr)
      VALUES (?, ?, ?, ?, ?)
    `);

    const stocks = [
      { symbol: "RELIANCE", name: "Reliance Industries Ltd", isin: "INE002A01018", sector: "Oil & Gas / Conglomerate", cap: 1985420.5 },
      { symbol: "HDFCBANK", name: "HDFC Bank Ltd", isin: "INE040A01034", sector: "Financial Services / Banking", cap: 1264800.0 },
      { symbol: "TCS", name: "Tata Consultancy Services Ltd", isin: "INE467B01029", sector: "Information Technology", cap: 1420500.0 },
      { symbol: "INFY", name: "Infosys Ltd", isin: "INE009A01021", sector: "Information Technology", cap: 785600.0 },
      { symbol: "ICICIBANK", name: "ICICI Bank Ltd", isin: "INE090A01021", sector: "Financial Services / Banking", cap: 865200.0 },
      { symbol: "TATAMOTORS", name: "Tata Motors Ltd", isin: "INE155A01022", sector: "Automobile", cap: 345200.0 },
      { symbol: "SBIN", name: "State Bank of India", isin: "INE062A01020", sector: "Financial Services / Banking", cap: 735400.0 },
      { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", isin: "INE397D01024", sector: "Telecommunication", cap: 845100.0 },
      { symbol: "ITC", name: "ITC Ltd", isin: "INE154A01025", sector: "FMCG / Diversified", cap: 598400.0 },
      { symbol: "AXISBANK", name: "Axis Bank Ltd", isin: "INE238A01034", sector: "Financial Services / Banking", cap: 375200.0 },
    ];

    const stockMap = new Map<string, number>();
    for (const s of stocks) {
      const info = insertStock.run(s.symbol, s.name, s.isin, s.sector, s.cap);
      stockMap.set(s.symbol, Number(info.lastInsertRowid));
    }

    // 2. Seed Institutions (Normalized)
    const rawInstitutions = [
      "HDFC Mutual Fund",
      "HDFC MF",
      "HDFC Asset Management Company",
      "SBI Mutual Fund",
      "SBI MF",
      "ICICI Prudential Mutual Fund",
      "ICICI Pru MF",
      "Nippon India Mutual Fund",
      "Kotak Mutual Fund",
      "Life Insurance Corporation of India",
      "LIC of India",
      "HDFC Life Insurance",
      "SBI Life Insurance",
      "Vanguard Emerging Markets Stock Index Fund",
      "BlackRock Fund Advisors",
      "Government Pension Fund Global",
      "Norges Bank",
      "Morgan Stanley Asia (Singapore) Pte",
      "Societe Generale",
    ];

    const instMap = new Map<string, number>();
    for (const raw of rawInstitutions) {
      const normalized = getOrRegisterInstitution(db, raw);
      if (normalized.id) {
        instMap.set(normalized.normalizedName, normalized.id);
      }
    }

    // Helper IDs
    const hdfcMfId = instMap.get("HDFC Mutual Fund") || 1;
    const sbiMfId = instMap.get("SBI Mutual Fund") || 2;
    const iciciMfId = instMap.get("ICICI Prudential Mutual Fund") || 3;
    const licId = instMap.get("Life Insurance Corporation of India (LIC)") || 4;
    const vanguardId = instMap.get("Vanguard Group") || 5;
    const norgesId = instMap.get("Government Pension Fund Global (Norges Bank)") || 6;
    const blackrockId = instMap.get("BlackRock Fund Advisors") || 7;

    // 3. Seed Shareholding Snapshots for RELIANCE over last 4 Quarters
    const insertSnapshot = db.prepare(`
      INSERT INTO shareholding_snapshots 
      (stock_id, quarter, year, snapshot_date, promoter_pct, fii_fpi_pct, mutual_fund_pct, insurance_pct, banks_fi_pct, aif_pct, other_inst_pct, retail_non_inst_pct, total_inst_pct)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const relId = stockMap.get("RELIANCE")!;

    // Q3-2024 (4 quarters ago)
    insertSnapshot.run(relId, "Q3", 2024, "2024-09-30", 50.31, 22.10, 6.80, 5.20, 0.40, 0.35, 0.25, 14.59, 35.10);
    // Q4-2024 (3 quarters ago)
    insertSnapshot.run(relId, "Q4", 2024, "2024-12-31", 50.31, 22.50, 7.10, 5.25, 0.42, 0.38, 0.25, 13.79, 35.90);
    // Q1-2025 (2 quarters ago)
    insertSnapshot.run(relId, "Q1", 2025, "2025-03-31", 50.29, 22.95, 7.55, 5.30, 0.45, 0.40, 0.28, 12.78, 36.93);
    // Q2-2025 (Current quarter)
    insertSnapshot.run(relId, "Q2", 2025, "2025-06-30", 50.29, 23.45, 8.20, 5.40, 0.48, 0.42, 0.30, 11.46, 38.25);

    // Seed Snapshots for HDFCBANK
    const hdfcId = stockMap.get("HDFCBANK")!;
    insertSnapshot.run(hdfcId, "Q3", 2024, "2024-09-30", 0.00, 32.10, 19.50, 8.20, 1.10, 0.80, 0.50, 37.80, 62.20);
    insertSnapshot.run(hdfcId, "Q4", 2024, "2024-12-31", 0.00, 32.80, 20.10, 8.35, 1.15, 0.85, 0.55, 36.20, 63.80);
    insertSnapshot.run(hdfcId, "Q1", 2025, "2025-03-31", 0.00, 33.40, 20.80, 8.50, 1.20, 0.90, 0.60, 34.60, 65.40);
    insertSnapshot.run(hdfcId, "Q2", 2025, "2025-06-30", 0.00, 34.20, 21.60, 8.65, 1.25, 0.95, 0.65, 32.70, 67.30);

    // 4. Seed Individual Disclosed Institution Holdings
    const insertInstHolding = db.prepare(`
      INSERT INTO institution_holdings (stock_id, institution_id, quarter, year, snapshot_date, holding_percentage, shares_count, holding_value_cr)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // RELIANCE Individual Holdings (Q2-2025 vs Q1-2025)
    insertInstHolding.run(relId, sbiMfId, "Q2", 2025, "2025-06-30", 2.95, 199500000, 59540.0);
    insertInstHolding.run(relId, sbiMfId, "Q1", 2025, "2025-03-31", 2.65, 179200000, 53480.0);

    insertInstHolding.run(relId, hdfcMfId, "Q2", 2025, "2025-06-30", 2.40, 162300000, 48430.0);
    insertInstHolding.run(relId, hdfcMfId, "Q1", 2025, "2025-03-31", 2.15, 145400000, 43390.0);

    insertInstHolding.run(relId, iciciMfId, "Q2", 2025, "2025-06-30", 1.85, 125100000, 37330.0);
    insertInstHolding.run(relId, iciciMfId, "Q1", 2025, "2025-03-31", 1.70, 115000000, 34320.0);

    insertInstHolding.run(relId, licId, "Q2", 2025, "2025-06-30", 5.40, 365300000, 109020.0);
    insertInstHolding.run(relId, licId, "Q1", 2025, "2025-03-31", 5.30, 358500000, 107010.0);

    insertInstHolding.run(relId, vanguardId, "Q2", 2025, "2025-06-30", 1.65, 111600000, 33300.0);
    insertInstHolding.run(relId, vanguardId, "Q1", 2025, "2025-03-31", 1.50, 101400000, 30260.0);

    insertInstHolding.run(relId, norgesId, "Q2", 2025, "2025-06-30", 1.25, 84500000, 25210.0);
    insertInstHolding.run(relId, norgesId, "Q1", 2025, "2025-03-31", 1.35, 91300000, 27250.0); // Slight reduction (Distributor example)

    // 5. Seed Bulk & Block Deals for RELIANCE
    const insertBulk = db.prepare(`
      INSERT INTO bulk_deals (stock_id, deal_date, institution_id, deal_type, transaction_type, shares, price, value_cr, exchange, buyer_seller_name, raw_institution_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertBlock = db.prepare(`
      INSERT INTO block_deals (stock_id, deal_date, institution_id, deal_type, transaction_type, shares, price, value_cr, exchange, buyer_seller_name, raw_institution_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Disclosed Bulk Deals
    insertBulk.run(relId, "2025-09-15", sbiMfId, "BUY", "BULK", 3500000, 2960.50, 1036.17, "NSE", "SBI Mutual Fund - Equity Hybrid Fund", "SBI Mutual Fund");
    insertBulk.run(relId, "2025-09-22", hdfcMfId, "BUY", "BULK", 2800000, 2975.00, 833.00, "NSE", "HDFC Mutual Fund - Top 100", "HDFC MF");
    insertBulk.run(relId, "2025-09-28", blackrockId, "BUY", "BULK", 1500000, 2980.20, 447.03, "NSE", "iShares India Index Fund", "BlackRock Fund Advisors");

    // Disclosed Block Deals
    insertBlock.run(relId, "2025-09-10", vanguardId, "BUY", "BLOCK", 5000000, 2945.00, 1472.50, "NSE", "Vanguard Emerging Markets Fund", "Vanguard Emerging Markets Stock Index Fund");
    insertBlock.run(relId, "2025-09-18", norgesId, "SELL", "BLOCK", 1200000, 2970.00, 356.40, "NSE", "Norges Bank Investment Management", "Government Pension Fund Global");

    // 6. Seed Price, Volume, & Delivery Data for RELIANCE (30 daily sessions)
    const insertPrice = db.prepare(`
      INSERT INTO price_data (stock_id, trade_date, open_price, high_price, low_price, close_price, prev_close, change_pct)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertVolume = db.prepare(`
      INSERT INTO volume_data (stock_id, trade_date, total_traded_volume, avg_volume_20d, volume_anomaly_ratio)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertDelivery = db.prepare(`
      INSERT INTO delivery_data (stock_id, trade_date, delivery_volume, delivery_pct, avg_delivery_volume_20d, delivery_anomaly_ratio)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const baseDate = new Date("2025-09-01");
    let currentPrice = 2850.0;
    const avgVol = 8500000;
    const avgDeliv = 5200000;

    for (let i = 0; i < 30; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      const change = (Math.sin(i * 0.4) * 0.015 + 0.003) * currentPrice;
      const prevClose = currentPrice;
      const closePrice = Math.round((prevClose + change) * 100) / 100;
      const openPrice = Math.round((prevClose + Math.sin(i * 0.5) * 2.5) * 100) / 100;
      const highPrice = Math.round(Math.max(openPrice, closePrice) + Math.abs(Math.cos(i * 0.3)) * 8);
      const lowPrice = Math.round(Math.min(openPrice, closePrice) - Math.abs(Math.sin(i * 0.3)) * 6);
      const changePct = Math.round(((closePrice - prevClose) / prevClose) * 10000) / 100;

      currentPrice = closePrice;

      insertPrice.run(relId, dateStr, openPrice, highPrice, lowPrice, closePrice, prevClose, changePct);

      const volMult = 1.0 + Math.abs(Math.sin(i * 0.7)) * 0.6 + (changePct > 0 ? 0.3 : 0);
      const vol = Math.round(avgVol * volMult);
      const volAnomaly = Math.round((vol / avgVol) * 100) / 100;

      insertVolume.run(relId, dateStr, vol, avgVol, volAnomaly);

      const delivPct = Math.round((58 + Math.abs(Math.cos(i * 0.4)) * 18 + (changePct > 0 ? 5 : -5)) * 100) / 100;
      const delivVol = Math.round(vol * (delivPct / 100));
      const delivAnomaly = Math.round((delivVol / avgDeliv) * 100) / 100;

      insertDelivery.run(relId, dateStr, delivVol, delivPct, avgDeliv, delivAnomaly);
    }

    // 7. Seed Data Sources Health Status
    const insertSource = db.prepare(`
      INSERT INTO data_sources (provider_name, dataset_type, last_synced_at, status, latency_ms, data_quality_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertSource.run("NSE_SHP_FEED", "Shareholding Snapshots", new Date().toISOString(), "HEALTHY", 42, 0.98);
    insertSource.run("BSE_BULK_BLOCK_API", "Bulk & Block Deals", new Date().toISOString(), "HEALTHY", 35, 0.96);
    insertSource.run("NSE_DELIVERY_TELEMETRY", "Delivery & Price Volume", new Date().toISOString(), "HEALTHY", 18, 0.99);
  })();
}

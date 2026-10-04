import Database from "better-sqlite3";

/**
 * Institutional Database Schema Definitions
 * Creates normalized tables for stocks, institutions, holdings, snapshots, deals, price/volume/delivery, signals, scores, and data sources.
 */

export function initializeDatabaseSchema(db: Database.Database): void {
  db.exec(`
    -- Enable Foreign Keys & Write-Ahead Logging
    PRAGMA foreign_keys = ON;

    -- 1. STOCKS TABLE
    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      isin TEXT UNIQUE,
      sector TEXT NOT NULL,
      market_cap_cr REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. INSTITUTIONS TABLE (Normalized Entities)
    CREATE TABLE IF NOT EXISTS institutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raw_name TEXT NOT NULL UNIQUE,
      normalized_name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('MUTUAL_FUND', 'FII_FPI', 'INSURANCE', 'BANK_FI', 'AIF', 'OTHER_INSTITUTION')),
      parent_entity TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. INSTITUTION HOLDINGS TABLE (Individual Disclosed Institutional Positions)
    CREATE TABLE IF NOT EXISTS institution_holdings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      institution_id INTEGER NOT NULL,
      quarter TEXT NOT NULL, -- e.g. "Q1-2025", "Q2-2025"
      year INTEGER NOT NULL,
      snapshot_date DATE NOT NULL,
      holding_percentage REAL NOT NULL,
      shares_count INTEGER,
      holding_value_cr REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      UNIQUE(stock_id, institution_id, quarter, year)
    );

    -- 4. SHAREHOLDING SNAPSHOTS TABLE (Quarterly Category Breakdown)
    CREATE TABLE IF NOT EXISTS shareholding_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      quarter TEXT NOT NULL,
      year INTEGER NOT NULL,
      snapshot_date DATE NOT NULL,
      promoter_pct REAL NOT NULL,
      fii_fpi_pct REAL NOT NULL,
      mutual_fund_pct REAL NOT NULL,
      insurance_pct REAL NOT NULL,
      banks_fi_pct REAL NOT NULL,
      aif_pct REAL NOT NULL DEFAULT 0.0,
      other_inst_pct REAL NOT NULL DEFAULT 0.0,
      retail_non_inst_pct REAL NOT NULL,
      total_inst_pct REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
      UNIQUE(stock_id, quarter, year)
    );

    -- 5. BULK DEALS TABLE
    CREATE TABLE IF NOT EXISTS bulk_deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      deal_date DATE NOT NULL,
      institution_id INTEGER,
      deal_type TEXT NOT NULL CHECK(deal_type IN ('BUY', 'SELL')),
      transaction_type TEXT NOT NULL DEFAULT 'BULK',
      shares INTEGER NOT NULL,
      price REAL NOT NULL,
      value_cr REAL NOT NULL,
      exchange TEXT NOT NULL, -- e.g. "NSE", "BSE"
      buyer_seller_name TEXT NOT NULL,
      raw_institution_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
    );

    -- 6. BLOCK DEALS TABLE
    CREATE TABLE IF NOT EXISTS block_deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      deal_date DATE NOT NULL,
      institution_id INTEGER,
      deal_type TEXT NOT NULL CHECK(deal_type IN ('BUY', 'SELL')),
      transaction_type TEXT NOT NULL DEFAULT 'BLOCK',
      shares INTEGER NOT NULL,
      price REAL NOT NULL,
      value_cr REAL NOT NULL,
      exchange TEXT NOT NULL,
      buyer_seller_name TEXT NOT NULL,
      raw_institution_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
    );

    -- 7. PRICE DATA TABLE
    CREATE TABLE IF NOT EXISTS price_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      trade_date DATE NOT NULL,
      open_price REAL NOT NULL,
      high_price REAL NOT NULL,
      low_price REAL NOT NULL,
      close_price REAL NOT NULL,
      prev_close REAL NOT NULL,
      change_pct REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
      UNIQUE(stock_id, trade_date)
    );

    -- 8. VOLUME DATA TABLE
    CREATE TABLE IF NOT EXISTS volume_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      trade_date DATE NOT NULL,
      total_traded_volume INTEGER NOT NULL,
      avg_volume_20d INTEGER NOT NULL,
      volume_anomaly_ratio REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
      UNIQUE(stock_id, trade_date)
    );

    -- 9. DELIVERY DATA TABLE
    CREATE TABLE IF NOT EXISTS delivery_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      trade_date DATE NOT NULL,
      delivery_volume INTEGER NOT NULL,
      delivery_pct REAL NOT NULL,
      avg_delivery_volume_20d INTEGER NOT NULL,
      delivery_anomaly_ratio REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
      UNIQUE(stock_id, trade_date)
    );

    -- 10. INSTITUTIONAL SIGNALS TABLE
    CREATE TABLE IF NOT EXISTS institutional_signals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      signal_name TEXT NOT NULL,
      signal_category TEXT NOT NULL,
      weight REAL NOT NULL,
      raw_value REAL NOT NULL,
      normalized_value REAL NOT NULL,
      score_contribution REAL NOT NULL,
      calculation_used TEXT NOT NULL,
      source TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
    );

    -- 11. ACCUMULATION SCORES TABLE
    CREATE TABLE IF NOT EXISTS accumulation_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL UNIQUE,
      total_score REAL NOT NULL,
      classification TEXT NOT NULL,
      confidence_level TEXT NOT NULL,
      calculated_at DATETIME NOT NULL,
      data_freshness_days INTEGER NOT NULL,
      missing_sources_json TEXT NOT NULL,
      breakdown_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
    );

    -- 12. DATA SOURCES TABLE
    CREATE TABLE IF NOT EXISTS data_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_name TEXT NOT NULL UNIQUE,
      dataset_type TEXT NOT NULL,
      last_synced_at DATETIME NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('HEALTHY', 'DEGRADED', 'UNAVAILABLE')),
      latency_ms INTEGER NOT NULL,
      data_quality_score REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create Indexes for High Performance Querying
    CREATE INDEX IF NOT EXISTS idx_inst_holdings_stock ON institution_holdings(stock_id);
    CREATE INDEX IF NOT EXISTS idx_snapshots_stock ON shareholding_snapshots(stock_id);
    CREATE INDEX IF NOT EXISTS idx_bulk_deals_stock ON bulk_deals(stock_id, deal_date);
    CREATE INDEX IF NOT EXISTS idx_block_deals_stock ON block_deals(stock_id, deal_date);
    CREATE INDEX IF NOT EXISTS idx_price_stock_date ON price_data(stock_id, trade_date);
    CREATE INDEX IF NOT EXISTS idx_volume_stock_date ON volume_data(stock_id, trade_date);
    CREATE INDEX IF NOT EXISTS idx_delivery_stock_date ON delivery_data(stock_id, trade_date);
    CREATE INDEX IF NOT EXISTS idx_signals_stock ON institutional_signals(stock_id);
  `);
}

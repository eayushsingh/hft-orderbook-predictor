import Database from 'better-sqlite3';
import path from 'path';

export { getDefaultSamplePortfolio, getSampleTaxLots } from './sampleData';

const dbPath = path.join(process.cwd(), 'data', 'hft.db');

export function getDb() {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Ensure tables exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS robo_risk_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      category TEXT NOT NULL,
      equity_target_pct REAL NOT NULL,
      fixed_income_target_pct REAL NOT NULL,
      alternatives_target_pct REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS robo_goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      target_amount REAL NOT NULL,
      time_horizon_years INTEGER NOT NULL,
      initial_investment REAL NOT NULL,
      monthly_contribution REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS robo_portfolios (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      goal_id TEXT NOT NULL,
      total_value REAL NOT NULL,
      cash_balance REAL NOT NULL,
      risk_score INTEGER NOT NULL,
      last_rebalanced_at TEXT
    );
  `);

  return db;
}

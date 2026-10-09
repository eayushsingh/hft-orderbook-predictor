import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import {
  AutopilotAuditLog,
  AutopilotConfig,
  AutopilotOrder,
  AutopilotPosition,
  BacktestResult,
  ConstituentRanking,
} from "../types";

let autopilotDbInstance: Database.Database | null = null;

export function getAutopilotDatabase(): Database.Database {
  if (autopilotDbInstance) {
    return autopilotDbInstance;
  }

  let dbPath = process.env.AUTOPILOT_DB_PATH;
  if (!dbPath) {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      dbPath = path.join("/tmp", "autopilot_engine.db");
    } else {
      const dbDir = path.join(process.cwd(), "data");
      try {
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        dbPath = path.join(dbDir, "autopilot_engine.db");
      } catch {
        dbPath = path.join("/tmp", "autopilot_engine.db");
      }
    }
  }

  try {
    autopilotDbInstance = new Database(dbPath);
  } catch {
    autopilotDbInstance = new Database(path.join("/tmp", "autopilot_engine.db"));
  }

  try {
    autopilotDbInstance.pragma("journal_mode = WAL");
    autopilotDbInstance.pragma("synchronous = NORMAL");
  } catch {
    // WAL fallback
  }

  initializeAutopilotSchema(autopilotDbInstance);

  return autopilotDbInstance;
}

export function initializeAutopilotSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS autopilot_config (
      id TEXT PRIMARY KEY,
      strategy TEXT NOT NULL,
      mode TEXT NOT NULL,
      state TEXT NOT NULL,
      capital REAL NOT NULL,
      risk_per_trade_pct REAL NOT NULL,
      max_daily_loss_pct REAL NOT NULL,
      max_drawdown_pct REAL NOT NULL,
      max_positions INTEGER NOT NULL,
      max_position_cap_pct REAL NOT NULL,
      max_sector_cap_pct REAL NOT NULL,
      max_slippage_bps INTEGER NOT NULL,
      max_order_value REAL NOT NULL,
      require_approval INTEGER NOT NULL,
      trailing_stop_enabled INTEGER NOT NULL,
      trailing_atr_multiplier REAL NOT NULL,
      rebalance_band_pct REAL NOT NULL,
      broker TEXT NOT NULL,
      version INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      sebi_disclaimer_accepted INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS autopilot_orders (
      id TEXT PRIMARY KEY,
      idempotency_key TEXT UNIQUE NOT NULL,
      timestamp TEXT NOT NULL,
      symbol TEXT NOT NULL,
      isin TEXT NOT NULL,
      side TEXT NOT NULL,
      product TEXT NOT NULL,
      order_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      filled_quantity INTEGER NOT NULL,
      limit_price REAL,
      trigger_price REAL,
      average_fill_price REAL,
      status TEXT NOT NULL,
      reject_reason TEXT,
      broker_order_id TEXT,
      broker_name TEXT NOT NULL,
      mode TEXT NOT NULL,
      strategy TEXT NOT NULL,
      stop_loss REAL,
      target REAL,
      cost_breakdown_json TEXT,
      approval_required INTEGER NOT NULL,
      approved_at TEXT,
      approved_by TEXT
    );

    CREATE TABLE IF NOT EXISTS autopilot_positions (
      symbol TEXT PRIMARY KEY,
      isin TEXT NOT NULL,
      sector TEXT NOT NULL,
      product TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      avg_entry_price REAL NOT NULL,
      current_ltp REAL NOT NULL,
      stop_loss_price REAL NOT NULL,
      target_price REAL,
      unrealized_pnl REAL NOT NULL,
      unrealized_pnl_pct REAL NOT NULL,
      realized_pnl REAL NOT NULL,
      entry_timestamp TEXT NOT NULL,
      last_updated_timestamp TEXT NOT NULL,
      highest_price_since_entry REAL NOT NULL,
      strategy TEXT NOT NULL,
      mode TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS autopilot_audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      event_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      actor TEXT NOT NULL,
      symbol TEXT,
      order_id TEXT,
      details TEXT NOT NULL,
      metadata_json TEXT
    );

    CREATE TABLE IF NOT EXISTS autopilot_rankings_cache (
      rank INTEGER PRIMARY KEY,
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      sector TEXT NOT NULL,
      ltp REAL NOT NULL,
      change_pct REAL NOT NULL,
      rs_rating REAL NOT NULL,
      trend TEXT NOT NULL,
      volume_surge REAL NOT NULL,
      composite_score REAL NOT NULL,
      signal TEXT NOT NULL,
      reason TEXT NOT NULL,
      weightage_pct REAL NOT NULL,
      freshness TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS autopilot_backtests (
      id TEXT PRIMARY KEY,
      strategy TEXT NOT NULL,
      result_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON autopilot_orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON autopilot_orders(timestamp);
    CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON autopilot_audit_logs(timestamp);
  `);

  // Ensure default configuration row exists
  const existing = db.prepare("SELECT id FROM autopilot_config WHERE id = 'default'").get();
  if (!existing) {
    const insertConfig = db.prepare(`
      INSERT INTO autopilot_config (
        id, strategy, mode, state, capital, risk_per_trade_pct,
        max_daily_loss_pct, max_drawdown_pct, max_positions, max_position_cap_pct,
        max_sector_cap_pct, max_slippage_bps, max_order_value, require_approval,
        trailing_stop_enabled, trailing_atr_multiplier, rebalance_band_pct,
        broker, version, updated_at, sebi_disclaimer_accepted
      ) VALUES (
        'default', 'SWING', 'PAPER', 'ACTIVE', 500000.0, 1.0,
        3.0, 10.0, 5, 20.0,
        35.0, 15, 100000.0, 1,
        1, 2.0, 3.0,
        'PAPER', 1, ?, 1
      )
    `);
    insertConfig.run(new Date().toISOString());
  }
}

export class AutopilotRepository {
  public static getConfig(): AutopilotConfig {
    const db = getAutopilotDatabase();
    const row = db.prepare("SELECT * FROM autopilot_config WHERE id = 'default'").get() as Record<string, unknown> | undefined;
    
    if (!row) {
      throw new Error("Autopilot configuration not found");
    }

    return {
      id: String(row.id),
      strategy: row.strategy as AutopilotConfig["strategy"],
      mode: row.mode as AutopilotConfig["mode"],
      state: row.state as AutopilotConfig["state"],
      capital: Number(row.capital),
      riskPerTradePct: Number(row.risk_per_trade_pct),
      maxDailyLossPct: Number(row.max_daily_loss_pct),
      maxDrawdownPct: Number(row.max_drawdown_pct),
      maxPositions: Number(row.max_positions),
      maxPositionCapPct: Number(row.max_position_cap_pct),
      maxSectorCapPct: Number(row.max_sector_cap_pct),
      maxSlippageBps: Number(row.max_slippage_bps),
      maxOrderValue: Number(row.max_order_value),
      requireApproval: Boolean(row.require_approval),
      trailingStopEnabled: Boolean(row.trailing_stop_enabled),
      trailingAtrMultiplier: Number(row.trailing_atr_multiplier),
      rebalanceBandPct: Number(row.rebalance_band_pct),
      broker: row.broker as AutopilotConfig["broker"],
      version: Number(row.version),
      updatedAt: String(row.updated_at),
      sebiDisclaimerAccepted: Boolean(row.sebi_disclaimer_accepted),
    };
  }

  public static updateConfig(config: Partial<AutopilotConfig>): AutopilotConfig {
    const db = getAutopilotDatabase();
    const current = this.getConfig();
    const newVersion = current.version + 1;
    const updatedAt = new Date().toISOString();

    const merged: AutopilotConfig = {
      ...current,
      ...config,
      version: newVersion,
      updatedAt,
    };

    const stmt = db.prepare(`
      UPDATE autopilot_config SET
        strategy = @strategy,
        mode = @mode,
        state = @state,
        capital = @capital,
        risk_per_trade_pct = @riskPerTradePct,
        max_daily_loss_pct = @maxDailyLossPct,
        max_drawdown_pct = @maxDrawdownPct,
        max_positions = @maxPositions,
        max_position_cap_pct = @maxPositionCapPct,
        max_sector_cap_pct = @maxSectorCapPct,
        max_slippage_bps = @maxSlippageBps,
        max_order_value = @maxOrderValue,
        require_approval = @requireApproval,
        trailing_stop_enabled = @trailingStopEnabled,
        trailing_atr_multiplier = @trailingAtrMultiplier,
        rebalance_band_pct = @rebalanceBandPct,
        broker = @broker,
        version = @version,
        updated_at = @updatedAt,
        sebi_disclaimer_accepted = @sebiDisclaimerAccepted
      WHERE id = 'default'
    `);

    stmt.run({
      strategy: merged.strategy,
      mode: merged.mode,
      state: merged.state,
      capital: merged.capital,
      riskPerTradePct: merged.riskPerTradePct,
      maxDailyLossPct: merged.maxDailyLossPct,
      maxDrawdownPct: merged.maxDrawdownPct,
      maxPositions: merged.maxPositions,
      maxPositionCapPct: merged.maxPositionCapPct,
      maxSectorCapPct: merged.maxSectorCapPct,
      maxSlippageBps: merged.maxSlippageBps,
      maxOrderValue: merged.maxOrderValue,
      requireApproval: merged.requireApproval ? 1 : 0,
      trailingStopEnabled: merged.trailingStopEnabled ? 1 : 0,
      trailingAtrMultiplier: merged.trailingAtrMultiplier,
      rebalanceBandPct: merged.rebalanceBandPct,
      broker: merged.broker,
      version: merged.version,
      updatedAt: merged.updatedAt,
      sebiDisclaimerAccepted: merged.sebiDisclaimerAccepted ? 1 : 0,
    });

    this.logAudit({
      id: `AUDIT-CFG-${Date.now().toString(36)}`,
      timestamp: updatedAt,
      eventType: "CONFIG_UPDATED",
      severity: "INFO",
      actor: "USER",
      details: `Config updated to v${newVersion} (${merged.strategy} / ${merged.mode} / ${merged.state})`,
      metadataJson: JSON.stringify(config),
    });

    return merged;
  }

  public static logAudit(entry: AutopilotAuditLog): void {
    try {
      const db = getAutopilotDatabase();
      const stmt = db.prepare(`
        INSERT INTO autopilot_audit_logs (
          id, timestamp, event_type, severity, actor, symbol, order_id, details, metadata_json
        ) VALUES (
          @id, @timestamp, @eventType, @severity, @actor, @symbol, @orderId, @details, @metadataJson
        )
      `);

      stmt.run({
        id: entry.id,
        timestamp: entry.timestamp,
        eventType: entry.eventType,
        severity: entry.severity,
        actor: entry.actor,
        symbol: entry.symbol || null,
        orderId: entry.orderId || null,
        details: entry.details,
        metadataJson: entry.metadataJson || null,
      });
    } catch {
      // Avoid recursive failure
    }
  }

  public static getAuditLogs(limit: number = 50): AutopilotAuditLog[] {
    const db = getAutopilotDatabase();
    const rows = db.prepare(`
      SELECT * FROM autopilot_audit_logs
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(limit) as Record<string, unknown>[];

    return rows.map((r) => ({
      id: String(r.id),
      timestamp: String(r.timestamp),
      eventType: r.event_type as AutopilotAuditLog["eventType"],
      severity: r.severity as AutopilotAuditLog["severity"],
      actor: String(r.actor),
      symbol: r.symbol ? String(r.symbol) : undefined,
      orderId: r.order_id ? String(r.order_id) : undefined,
      details: String(r.details),
      metadataJson: r.metadata_json ? String(r.metadata_json) : undefined,
    }));
  }

  public static saveOrder(order: AutopilotOrder): void {
    const db = getAutopilotDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO autopilot_orders (
        id, idempotency_key, timestamp, symbol, isin, side, product, order_type,
        quantity, filled_quantity, limit_price, trigger_price, average_fill_price,
        status, reject_reason, broker_order_id, broker_name, mode, strategy,
        stop_loss, target, cost_breakdown_json, approval_required, approved_at, approved_by
      ) VALUES (
        @id, @idempotencyKey, @timestamp, @symbol, @isin, @side, @product, @orderType,
        @quantity, @filledQuantity, @limitPrice, @triggerPrice, @averageFillPrice,
        @status, @rejectReason, @brokerOrderId, @brokerName, @mode, @strategy,
        @stopLoss, @target, @costBreakdownJson, @approvalRequired, @approvedAt, @approvedBy
      )
    `);

    stmt.run({
      id: order.id,
      idempotencyKey: order.idempotencyKey,
      timestamp: order.timestamp,
      symbol: order.symbol,
      isin: order.isin,
      side: order.side,
      product: order.product,
      orderType: order.orderType,
      quantity: order.quantity,
      filledQuantity: order.filledQuantity,
      limitPrice: order.limitPrice ?? null,
      triggerPrice: order.triggerPrice ?? null,
      averageFillPrice: order.averageFillPrice ?? null,
      status: order.status,
      rejectReason: order.rejectReason ?? null,
      brokerOrderId: order.brokerOrderId ?? null,
      brokerName: order.brokerName,
      mode: order.mode,
      strategy: order.strategy,
      stopLoss: order.stopLoss ?? null,
      target: order.target ?? null,
      costBreakdownJson: order.costBreakdown ? JSON.stringify(order.costBreakdown) : null,
      approvalRequired: order.approvalRequired ? 1 : 0,
      approvedAt: order.approvedAt ?? null,
      approvedBy: order.approvedBy ?? null,
    });
  }

  public static getOrders(limit: number = 50): AutopilotOrder[] {
    const db = getAutopilotDatabase();
    const rows = db.prepare(`
      SELECT * FROM autopilot_orders
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(limit) as Record<string, unknown>[];

    return rows.map((r) => ({
      id: String(r.id),
      idempotencyKey: String(r.idempotency_key),
      timestamp: String(r.timestamp),
      symbol: String(r.symbol),
      isin: String(r.isin),
      side: r.side as AutopilotOrder["side"],
      product: r.product as AutopilotOrder["product"],
      orderType: r.order_type as AutopilotOrder["orderType"],
      quantity: Number(r.quantity),
      filledQuantity: Number(r.filled_quantity),
      limitPrice: r.limit_price !== null && r.limit_price !== undefined ? Number(r.limit_price) : undefined,
      triggerPrice: r.trigger_price !== null && r.trigger_price !== undefined ? Number(r.trigger_price) : undefined,
      averageFillPrice: r.average_fill_price !== null && r.average_fill_price !== undefined ? Number(r.average_fill_price) : undefined,
      status: r.status as AutopilotOrder["status"],
      rejectReason: r.reject_reason ? String(r.reject_reason) : undefined,
      brokerOrderId: r.broker_order_id ? String(r.broker_order_id) : undefined,
      brokerName: String(r.broker_name),
      mode: r.mode as AutopilotOrder["mode"],
      strategy: r.strategy as AutopilotOrder["strategy"],
      stopLoss: r.stop_loss !== null && r.stop_loss !== undefined ? Number(r.stop_loss) : undefined,
      target: r.target !== null && r.target !== undefined ? Number(r.target) : undefined,
      costBreakdown: r.cost_breakdown_json ? JSON.parse(String(r.cost_breakdown_json)) : undefined,
      approvalRequired: Boolean(r.approval_required),
      approvedAt: r.approved_at ? String(r.approved_at) : undefined,
      approvedBy: r.approved_by ? String(r.approved_by) : undefined,
    }));
  }

  public static savePosition(pos: AutopilotPosition): void {
    const db = getAutopilotDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO autopilot_positions (
        symbol, isin, sector, product, quantity, avg_entry_price, current_ltp,
        stop_loss_price, target_price, unrealized_pnl, unrealized_pnl_pct,
        realized_pnl, entry_timestamp, last_updated_timestamp, highest_price_since_entry,
        strategy, mode
      ) VALUES (
        @symbol, @isin, @sector, @product, @quantity, @avgEntryPrice, @currentLtp,
        @stopLossPrice, @targetPrice, @unrealizedPnl, @unrealizedPnlPct,
        @realizedPnl, @entryTimestamp, @lastUpdatedTimestamp, @highestPriceSinceEntry,
        @strategy, @mode
      )
    `);

    stmt.run({
      symbol: pos.symbol,
      isin: pos.isin,
      sector: pos.sector,
      product: pos.product,
      quantity: pos.quantity,
      avgEntryPrice: pos.avgEntryPrice,
      currentLtp: pos.currentLtp,
      stopLossPrice: pos.stopLossPrice,
      targetPrice: pos.targetPrice ?? null,
      unrealizedPnl: pos.unrealizedPnl,
      unrealizedPnlPct: pos.unrealizedPnlPct,
      realizedPnl: pos.realizedPnl,
      entryTimestamp: pos.entryTimestamp,
      lastUpdatedTimestamp: pos.lastUpdatedTimestamp,
      highestPriceSinceEntry: pos.highestPriceSinceEntry,
      strategy: pos.strategy,
      mode: pos.mode,
    });
  }

  public static deletePosition(symbol: string): void {
    const db = getAutopilotDatabase();
    db.prepare("DELETE FROM autopilot_positions WHERE symbol = ?").run(symbol);
  }

  public static getPositions(): AutopilotPosition[] {
    const db = getAutopilotDatabase();
    const rows = db.prepare("SELECT * FROM autopilot_positions").all() as Record<string, unknown>[];

    return rows.map((r) => ({
      symbol: String(r.symbol),
      isin: String(r.isin),
      sector: String(r.sector),
      product: r.product as AutopilotPosition["product"],
      quantity: Number(r.quantity),
      avgEntryPrice: Number(r.avg_entry_price),
      currentLtp: Number(r.current_ltp),
      stopLossPrice: Number(r.stop_loss_price),
      targetPrice: r.target_price !== null && r.target_price !== undefined ? Number(r.target_price) : undefined,
      unrealizedPnl: Number(r.unrealized_pnl),
      unrealizedPnlPct: Number(r.unrealized_pnl_pct),
      realizedPnl: Number(r.realized_pnl),
      entryTimestamp: String(r.entry_timestamp),
      lastUpdatedTimestamp: String(r.last_updated_timestamp),
      highestPriceSinceEntry: Number(r.highest_price_since_entry),
      strategy: r.strategy as AutopilotPosition["strategy"],
      mode: r.mode as AutopilotPosition["mode"],
    }));
  }

  public static saveRankings(rankings: ConstituentRanking[]): void {
    const db = getAutopilotDatabase();
    const now = new Date().toISOString();
    
    db.transaction(() => {
      db.prepare("DELETE FROM autopilot_rankings_cache").run();
      const stmt = db.prepare(`
        INSERT INTO autopilot_rankings_cache (
          rank, symbol, name, sector, ltp, change_pct, rs_rating,
          trend, volume_surge, composite_score, signal, reason,
          weightage_pct, freshness, updated_at
        ) VALUES (
          @rank, @symbol, @name, @sector, @ltp, @changePct, @rsRating,
          @trend, @volumeSurge, @compositeScore, @signal, @reason,
          @weightagePct, @freshness, @updatedAt
        )
      `);

      for (const r of rankings) {
        stmt.run({
          rank: r.rank,
          symbol: r.symbol,
          name: r.name,
          sector: r.sector,
          ltp: r.ltp,
          changePct: r.changePct,
          rsRating: r.rsRating,
          trend: r.trend,
          volumeSurge: r.volumeSurge,
          compositeScore: r.compositeScore,
          signal: r.signal,
          reason: r.reason,
          weightagePct: r.weightagePct,
          freshness: r.freshness,
          updatedAt: now,
        });
      }
    })();
  }

  public static getRankings(): ConstituentRanking[] {
    const db = getAutopilotDatabase();
    const rows = db.prepare("SELECT * FROM autopilot_rankings_cache ORDER BY rank ASC").all() as Record<string, unknown>[];

    return rows.map((r) => ({
      rank: Number(r.rank),
      symbol: String(r.symbol),
      name: String(r.name),
      sector: String(r.sector),
      ltp: Number(r.ltp),
      changePct: Number(r.change_pct),
      rsRating: Number(r.rs_rating),
      trend: r.trend as ConstituentRanking["trend"],
      volumeSurge: Number(r.volume_surge),
      compositeScore: Number(r.composite_score),
      signal: r.signal as ConstituentRanking["signal"],
      reason: String(r.reason),
      weightagePct: Number(r.weightage_pct),
      freshness: r.freshness as ConstituentRanking["freshness"],
    }));
  }

  public static saveBacktest(result: BacktestResult): void {
    const db = getAutopilotDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO autopilot_backtests (id, strategy, result_json, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(result.id, result.strategy, JSON.stringify(result), new Date().toISOString());
  }

  public static getLatestBacktest(strategy?: string): BacktestResult | null {
    const db = getAutopilotDatabase();
    let row: Record<string, unknown> | undefined;

    if (strategy) {
      row = db.prepare("SELECT result_json FROM autopilot_backtests WHERE strategy = ? ORDER BY created_at DESC LIMIT 1").get(strategy) as Record<string, unknown> | undefined;
    } else {
      row = db.prepare("SELECT result_json FROM autopilot_backtests ORDER BY created_at DESC LIMIT 1").get() as Record<string, unknown> | undefined;
    }

    if (!row) return null;
    return JSON.parse(String(row.result_json));
  }
}

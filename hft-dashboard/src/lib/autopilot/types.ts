/**
 * NIFTY 50 AUTOPILOT - DOMAIN TYPE DEFINITIONS
 * 
 * Strict type contracts for Universe, Strategies, Risk Engine,
 * Broker Adapters, Order Lifecycle, Backtesting, and Audit Telemetry.
 */

export type TradingMode = "DEMO" | "PAPER" | "LIVE";
export type StrategyType = "SWING" | "LONG_TERM";
export type EngineState = "ACTIVE" | "PAUSED" | "KILL_SWITCH_ENGAGED";
export type DataFreshness = "FRESH" | "STALE" | "UNAVAILABLE";
export type MarketRegime = "BULLISH_TREND" | "BEARISH_TREND" | "HIGH_VOLATILITY" | "RANGE_BOUND" | "UNKNOWN";

export type OrderSide = "BUY" | "SELL";
export type OrderProductType = "CNC" | "MIS"; // Delivery vs Intraday
export type OrderType = "MARKET" | "LIMIT" | "STOP_LOSS";
export type OrderStatus = 
  | "PENDING_APPROVAL"
  | "PENDING_SUBMISSION"
  | "OPEN"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELLED"
  | "REJECTED"
  | "EXPIRED";

export interface UniverseConstituent {
  symbol: string;         // e.g. "RELIANCE"
  name: string;           // e.g. "Reliance Industries Ltd"
  isin: string;           // e.g. "INE002A01018"
  sector: string;         // e.g. "Oil & Gas" / "Energy"
  weightagePct: number;   // Official weight in Nifty 50 (e.g. 9.12%)
  angelOneToken: string;  // Angel One SmartAPI instrument token
  zerodhaToken: string;   // Zerodha Kite Connect instrument token
  lotSize: number;        // Equity lot size (1)
  isActive: boolean;
  lastVerifiedAt: string; // ISO string
}

export interface AutopilotConfig {
  id: string;
  strategy: StrategyType;
  mode: TradingMode;
  state: EngineState;
  capital: number;              // Total allocated capital (₹)
  riskPerTradePct: number;      // Risk per trade (e.g. 1.0 = 1%)
  maxDailyLossPct: number;      // Max allowed portfolio daily loss (e.g. 3.0 = 3%)
  maxDrawdownPct: number;       // Max portfolio drawdown from peak (e.g. 10.0 = 10%)
  maxPositions: number;         // Max simultaneous positions (e.g. 5 to 15)
  maxPositionCapPct: number;    // Max single stock allocation % (e.g. 15.0 = 15%)
  maxSectorCapPct: number;      // Max sector allocation % (e.g. 30.0 = 30%)
  maxSlippageBps: number;       // Max slippage tolerance in basis points (e.g. 15 bps)
  maxOrderValue: number;        // Max single order value cap in INR (e.g. ₹1,00,000)
  requireApproval: boolean;     // If true, signals require user confirmation before placement
  trailingStopEnabled: boolean; // Swing: whether ATR trailing stop is active
  trailingAtrMultiplier: number;// e.g. 2.5 * ATR
  rebalanceBandPct: number;     // Long-Term: rebalancing drift threshold (e.g. 3%)
  broker: "ANGEL_ONE" | "ZERODHA" | "PAPER" | "DEMO";
  version: number;
  updatedAt: string;
  sebiDisclaimerAccepted: boolean;
}

export interface MetricWithProvenance<T> {
  value: T;
  source: string;
  timestamp: string;
  validity: DataFreshness;
  reason?: string;
}

export interface StockMarketData {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  avgVolume20: number;
  changePct: number;
  atr14: number;
  sma20: number;
  sma50: number;
  sma200: number;
  rsi14: number;
  rsRating: number;           // Relative strength vs Nifty 50 (0 - 100)
  volumeSurgeRatio: number;   // Current vol vs 20d avg vol
  deliveryPct?: number;       // Delivery percentage if available
  bid?: number;
  ask?: number;
  spreadBps?: number;
  orderBookDepthAvailable: boolean;
  dataTimestamp: string;
  freshness: DataFreshness;
  source: string;
}

export interface IndexMarketData {
  indexSymbol: "NIFTY 50";
  ltp: number;
  changePct: number;
  sma20: number;
  sma50: number;
  sma200: number;
  indiaVix: number;
  vixChangePct: number;
  advancers: number;
  decliners: number;
  marketRegime: MarketRegime;
  timestamp: string;
  freshness: DataFreshness;
  source: string;
}

export interface NewsAdvisoryItem {
  id: string;
  symbol: string;
  headline: string;
  source: string;
  timestamp: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  confidenceScore: number;
  validityWindowHours: number;
  isAdvisoryOnly: boolean; // Strictly informational, cannot trigger orders directly
}

export interface StrategySignal {
  id: string;
  timestamp: string;
  symbol: string;
  strategy: StrategyType;
  action: "BUY" | "SELL" | "NO_TRADE";
  reason: string;
  confidence: number;
  entryPrice?: number;
  stopLossPrice?: number;
  targetPrice?: number;
  suggestedQty?: number;
  atr?: number;
  riskRewardRatio?: number;
  estimatedCost?: TransactionCostBreakdown;
  metadata: {
    rsRating?: number;
    volumeSurge?: number;
    regime?: MarketRegime;
    trendScore?: number;
  };
}

export interface TransactionCostBreakdown {
  brokerage: number;
  stt: number;           // Securities Transaction Tax (0.1% delivery)
  exchangeTurnover: number; // NSE transaction charges (0.00345%)
  sebiTurnover: number;  // SEBI turnover fee (0.0001%)
  stampDuty: number;     // Stamp duty (0.015% on buy)
  gst: number;           // 18% on (Brokerage + Exchange Charges)
  totalCharges: number;
  estimatedSlippage: number;
  netImpact: number;     // total charges + slippage
}

export interface RiskCheckResult {
  passed: boolean;
  rejectReason?: string;
  checkName: 
    | "UNIVERSE_ELIGIBILITY"
    | "DATA_FRESHNESS"
    | "AVAILABLE_FUNDS"
    | "PER_TRADE_RISK"
    | "DAILY_LOSS_LIMIT"
    | "DRAWDOWN_LIMIT"
    | "POSITION_CAP"
    | "SECTOR_CAP"
    | "DUPLICATE_THROTTLE"
    | "MAX_ORDER_VALUE"
    | "SLIPPAGE_LIMIT"
    | "MARKET_HOURS"
    | "KILL_SWITCH";
  timestamp: string;
  diagnostics?: Record<string, unknown>;
}

export interface AutopilotOrder {
  id: string;
  idempotencyKey: string;
  timestamp: string;
  symbol: string;
  isin: string;
  side: OrderSide;
  product: OrderProductType;
  orderType: OrderType;
  quantity: number;
  filledQuantity: number;
  limitPrice?: number;
  triggerPrice?: number;
  averageFillPrice?: number;
  status: OrderStatus;
  rejectReason?: string;
  brokerOrderId?: string;
  brokerName: string;
  mode: TradingMode;
  strategy: StrategyType;
  stopLoss?: number;
  target?: number;
  costBreakdown?: TransactionCostBreakdown;
  approvalRequired: boolean;
  approvedAt?: string;
  approvedBy?: string;
}

export interface AutopilotPosition {
  symbol: string;
  isin: string;
  sector: string;
  product: OrderProductType;
  quantity: number;
  avgEntryPrice: number;
  currentLtp: number;
  stopLossPrice: number;
  targetPrice?: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  realizedPnl: number;
  entryTimestamp: string;
  lastUpdatedTimestamp: string;
  highestPriceSinceEntry: number; // For trailing stop calculation
  strategy: StrategyType;
  mode: TradingMode;
}

export interface ConstituentRanking {
  rank: number;
  symbol: string;
  name: string;
  sector: string;
  ltp: number;
  changePct: number;
  rsRating: number;
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
  volumeSurge: number;
  compositeScore: number;
  signal: "BUY" | "SELL" | "NO_TRADE";
  reason: string;
  weightagePct: number;
  freshness: DataFreshness;
}

export interface AutopilotAuditLog {
  id: string;
  timestamp: string;
  eventType: 
    | "SIGNAL_GENERATED"
    | "RISK_CHECK_PASSED"
    | "RISK_CHECK_REJECTED"
    | "ORDER_SUBMITTED"
    | "ORDER_FILLED"
    | "ORDER_CANCELLED"
    | "ORDER_REJECTED"
    | "POSITION_OPENED"
    | "POSITION_CLOSED"
    | "CONFIG_UPDATED"
    | "KILL_SWITCH_TRIGGERED"
    | "KILL_SWITCH_RESET"
    | "RECONCILIATION_EVENT"
    | "SYSTEM_ALERT";
  severity: "INFO" | "WARNING" | "CRITICAL";
  actor: string; // "AUTOPILOT_ENGINE" | "USER" | "RISK_GATEKEEPER" | "BROKER_CALLBACK"
  symbol?: string;
  orderId?: string;
  details: string;
  metadataJson?: string;
}

export interface BacktestRequest {
  strategy: StrategyType;
  startDate: string;
  endDate: string;
  initialCapital: number;
  riskPerTradePct: number;
  maxPositions: number;
  includeCostsAndSlippage: boolean;
  slippageBps: number;
}

export interface BacktestTrade {
  tradeId: string;
  symbol: string;
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  side: "LONG";
  pnl: number;
  pnlPct: number;
  netPnl: number; // After costs
  costs: number;
  exitReason: "STOP_LOSS" | "TRAILING_STOP" | "TARGET" | "REBALANCE" | "TIME_EXIT";
  holdingPeriodDays: number;
}

export interface BacktestResult {
  id: string;
  strategy: StrategyType;
  period: { start: string; end: string };
  initialCapital: number;
  finalCapital: number;
  totalReturnPct: number;
  cagrPct: number;
  benchmarkReturnPct: number; // Nifty 50 Buy & Hold return
  alphaPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  profitFactor: number;
  sharpeRatio: number;
  averageTradePnlPct: number;
  totalCostsPaid: number;
  trades: BacktestTrade[];
  equityCurve: { date: string; equity: number; benchmarkEquity: number }[];
  assumptions: string[];
}

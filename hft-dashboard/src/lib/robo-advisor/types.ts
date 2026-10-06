/**
 * Robo-Advisor Core Domain Models & Interface Definitions
 * High-Performance Automated Portfolio Management System
 */

export type RiskCategory =
  | 'CONSERVATIVE'
  | 'MODERATELY_CONSERVATIVE'
  | 'BALANCED'
  | 'GROWTH'
  | 'AGGRESSIVE_GROWTH';

export type GoalType =
  | 'RETIREMENT'
  | 'WEALTH_ACCUMULATION'
  | 'MAJOR_PURCHASE'
  | 'EMERGENCY_FUND'
  | 'CUSTOM';

export type AssetCategory =
  | 'US_LARGE_CAP'
  | 'US_SMALL_CAP'
  | 'INTL_DEVELOPED'
  | 'EMERGING_MARKETS'
  | 'CORE_BONDS'
  | 'HIGH_YIELD_BONDS'
  | 'TIPS_INFLATION'
  | 'REAL_ESTATE'
  | 'COMMODITIES'
  | 'CASH_EQUIVALENTS';

export interface RiskQuestionnaire {
  age: number;
  investmentHorizonYears: number;
  liquidNetWorth: number;
  monthlySavings: number;
  riskToleranceLevel: 1 | 2 | 3 | 4 | 5; // 1 (Risk Averse) to 5 (High Risk Seeking)
  marketDropReaction: 'SELL_ALL' | 'SELL_SOME' | 'DO_NOTHING' | 'BUY_MORE';
  primaryObjective: 'CAPITAL_PRESERVATION' | 'BALANCED_GROWTH' | 'MAXIMIZE_RETURNS';
  priorLossExperience: boolean;
}

export interface RiskProfile {
  score: number; // 1 to 100 scale
  category: RiskCategory;
  equityTargetPct: number;
  fixedIncomeTargetPct: number;
  alternativesTargetPct: number;
  recommendedDuration: string;
  lossCapacityFactor: number;
}

export interface InvestorGoal {
  id: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  timeHorizonYears: number;
  initialInvestment: number;
  monthlyContribution: number;
  createdAt: string;
  isAchieved?: boolean;
}

export interface AssetClassInfo {
  id: AssetCategory;
  name: string;
  description: string;
  benchmarkSymbol: string;
  historicalReturnRate: number; // Annualized %
  volatilityRate: number; // Annualized standard deviation %
  expenseRatioPct: number;
  assetGroup: 'EQUITY' | 'FIXED_INCOME' | 'ALTERNATIVES' | 'CASH';
}

export interface TargetAllocation {
  assetClass: AssetCategory;
  targetWeightPct: number;
  minWeightPct: number;
  maxWeightPct: number;
  etfSymbol: string;
  etfName: string;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetCategory;
  shares: number;
  avgCostBasis: number;
  currentPrice: number;
  totalMarketValue: number;
  currentWeightPct: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPct: number;
  lastUpdated: string;
}

export interface PortfolioSummary {
  id: string;
  userId: string;
  goalId: string;
  totalPortfolioValue: number;
  totalCostBasis: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPct: number;
  cashBalance: number;
  riskScore: number;
  holdings: PortfolioHolding[];
  targetAllocations: TargetAllocation[];
  driftScore: number; // Average weight deviation %
  rebalanceRequired: boolean;
  lastRebalancedAt: string | null;
}

export interface RebalanceTradeOrder {
  id: string;
  symbol: string;
  assetClass: AssetCategory;
  action: 'BUY' | 'SELL';
  shares: number;
  estimatedPrice: number;
  estimatedTotalValue: number;
  currentWeightPct: number;
  targetWeightPct: number;
  postTradeWeightPct: number;
  reasoning: string;
}

export interface RebalanceExecutionPlan {
  portfolioId: string;
  generatedAt: string;
  totalTradeVolume: number;
  estimatedCommissionFee: number;
  driftBeforeRebalance: number;
  driftAfterRebalance: number;
  orders: RebalanceTradeOrder[];
}

export interface TaxLot {
  id: string;
  holdingSymbol: string;
  assetClass: AssetCategory;
  purchaseDate: string;
  shares: number;
  costBasisPerShare: number;
  currentPrice: number;
  unrealizedLoss: number;
}

export interface TaxHarvestOpportunity {
  id: string;
  holdingSymbol: string;
  assetClass: AssetCategory;
  harvestableLoss: number;
  taxLotId: string;
  sharesToHarvest: number;
  estimatedTaxSavings: number;
  replacementSymbol: string;
  replacementName: string;
  washSaleWarning: boolean;
}

export interface SimulationTrajectory {
  year: number;
  p10: number; // 10th percentile (Pessimistic)
  p50: number; // 50th percentile (Median)
  p90: number; // 90th percentile (Optimistic)
  contributionsAccumulated: number;
}

export interface SimulationResult {
  goalId: string;
  goalTargetAmount: number;
  probabilityOfSuccessPct: number;
  projectedEndingMedianValue: number;
  trajectories: SimulationTrajectory[];
  inflationAdjusted: boolean;
}

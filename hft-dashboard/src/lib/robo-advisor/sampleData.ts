import { generateTargetAllocation } from './allocationEngine';
import { calculatePortfolioDrift } from './driftEngine';
import { calculateRiskProfile } from './riskEngine';
import {
  InvestorGoal,
  PortfolioHolding,
  PortfolioSummary,
  RiskQuestionnaire,
  TaxLot,
} from './types';

/**
 * Returns default sample portfolio summary for client rendering & quick demo usage.
 */
export function getDefaultSamplePortfolio(): PortfolioSummary {
  const defaultQuestionnaire: RiskQuestionnaire = {
    age: 32,
    investmentHorizonYears: 15,
    liquidNetWorth: 250000,
    monthlySavings: 2500,
    riskToleranceLevel: 4,
    marketDropReaction: 'BUY_MORE',
    primaryObjective: 'MAXIMIZE_RETURNS',
    priorLossExperience: true,
  };

  const riskProfile = calculateRiskProfile(defaultQuestionnaire);
  const goal: InvestorGoal = {
    id: 'goal-retirement-01',
    name: 'Early Retirement Fund',
    type: 'RETIREMENT',
    targetAmount: 1500000,
    timeHorizonYears: 15,
    initialInvestment: 100000,
    monthlyContribution: 2500,
    createdAt: new Date().toISOString(),
  };

  const targetAllocations = generateTargetAllocation(riskProfile, goal.type);

  // Sample holdings with slight drift applied to demonstrate rebalancer and TLH
  const holdings: PortfolioHolding[] = [
    {
      id: 'h-voo',
      symbol: 'VOO',
      name: 'Vanguard S&P 500 ETF',
      assetClass: 'US_LARGE_CAP',
      shares: 110,
      avgCostBasis: 410.0,
      currentPrice: 485.5,
      totalMarketValue: 53405,
      currentWeightPct: 53.4,
      unrealizedGainLoss: 8305,
      unrealizedGainLossPct: 18.3,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'h-vb',
      symbol: 'VB',
      name: 'Vanguard Small-Cap ETF',
      assetClass: 'US_SMALL_CAP',
      shares: 40,
      avgCostBasis: 220.0,
      currentPrice: 195.0,
      totalMarketValue: 7800,
      currentWeightPct: 7.8,
      unrealizedGainLoss: -1000,
      unrealizedGainLossPct: -11.4,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'h-vea',
      symbol: 'VEA',
      name: 'Vanguard FTSE Developed Markets ETF',
      assetClass: 'INTL_DEVELOPED',
      shares: 160,
      avgCostBasis: 48.0,
      currentPrice: 51.2,
      totalMarketValue: 8192,
      currentWeightPct: 8.2,
      unrealizedGainLoss: 512,
      unrealizedGainLossPct: 6.6,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'h-vwo',
      symbol: 'VWO',
      name: 'Vanguard FTSE Emerging Markets ETF',
      assetClass: 'EMERGING_MARKETS',
      shares: 90,
      avgCostBasis: 42.0,
      currentPrice: 44.5,
      totalMarketValue: 4005,
      currentWeightPct: 4.0,
      unrealizedGainLoss: 225,
      unrealizedGainLossPct: 5.9,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'h-bnd',
      symbol: 'BND',
      name: 'Vanguard Total Bond Market ETF',
      assetClass: 'CORE_BONDS',
      shares: 140,
      avgCostBasis: 78.0,
      currentPrice: 72.5,
      totalMarketValue: 10150,
      currentWeightPct: 10.15,
      unrealizedGainLoss: -770,
      unrealizedGainLossPct: -7.05,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'h-vnq',
      symbol: 'VNQ',
      name: 'Vanguard Real Estate ETF',
      assetClass: 'REAL_ESTATE',
      shares: 60,
      avgCostBasis: 82.0,
      currentPrice: 86.0,
      totalMarketValue: 5160,
      currentWeightPct: 5.16,
      unrealizedGainLoss: 240,
      unrealizedGainLossPct: 4.88,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'h-iau',
      symbol: 'IAU',
      name: 'iShares Gold Trust',
      assetClass: 'COMMODITIES',
      shares: 100,
      avgCostBasis: 38.0,
      currentPrice: 42.8,
      totalMarketValue: 4280,
      currentWeightPct: 4.28,
      unrealizedGainLoss: 480,
      unrealizedGainLossPct: 12.63,
      lastUpdated: new Date().toISOString(),
    },
  ];

  const cashBalance = 7008; // Total portfolio value = $100,000
  const totalPortfolioValue = holdings.reduce((s, h) => s + h.totalMarketValue, 0) + cashBalance;
  const totalCostBasis = holdings.reduce((s, h) => s + h.shares * h.avgCostBasis, 0);
  const totalUnrealizedPnL = holdings.reduce((s, h) => s + h.unrealizedGainLoss, 0);
  const totalUnrealizedPnLPct = Math.round((totalUnrealizedPnL / totalCostBasis) * 1000) / 10;

  const driftAnalysis = calculatePortfolioDrift(holdings, targetAllocations, cashBalance);

  return {
    id: 'port-main-001',
    userId: 'usr-default',
    goalId: goal.id,
    totalPortfolioValue,
    totalCostBasis,
    totalUnrealizedPnL,
    totalUnrealizedPnLPct,
    cashBalance,
    riskScore: riskProfile.score,
    holdings,
    targetAllocations,
    driftScore: driftAnalysis.totalDriftScore,
    rebalanceRequired: driftAnalysis.isRebalanceRequired,
    lastRebalancedAt: '2026-09-15T10:30:00Z',
  };
}

/**
 * Provides tax lots for tax loss harvesting analysis.
 */
export function getSampleTaxLots(): TaxLot[] {
  return [
    {
      id: 'tl-vb-01',
      holdingSymbol: 'VB',
      assetClass: 'US_SMALL_CAP',
      purchaseDate: '2026-03-12',
      shares: 40,
      costBasisPerShare: 220.0,
      currentPrice: 195.0,
      unrealizedLoss: 1000.0,
    },
    {
      id: 'tl-bnd-01',
      holdingSymbol: 'BND',
      assetClass: 'CORE_BONDS',
      purchaseDate: '2026-01-20',
      shares: 140,
      costBasisPerShare: 78.0,
      currentPrice: 72.5,
      unrealizedLoss: 770.0,
    },
  ];
}

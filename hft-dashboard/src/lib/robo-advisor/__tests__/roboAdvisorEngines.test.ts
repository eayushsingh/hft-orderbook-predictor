import { describe, expect, it } from 'vitest';
import { generateTargetAllocation } from '../allocationEngine';
import { calculateExpectedMetrics } from '../assetUniverse';
import { calculatePortfolioDrift } from '../driftEngine';
import { generateRebalancePlan } from '../rebalanceEngine';
import { calculateRiskProfile } from '../riskEngine';
import { runMonteCarloSimulation } from '../simulationEngine';
import { detectTaxLossHarvestingOpportunities } from '../taxHarvestingEngine';

describe('Robo-Advisor Algorithmic Engines Suite', () => {
  describe('Risk Profile Engine', () => {
    it('should calculate aggressive risk score for young investor with high risk tolerance', () => {
      const profile = calculateRiskProfile({
        age: 25,
        investmentHorizonYears: 25,
        liquidNetWorth: 500000,
        monthlySavings: 5000,
        riskToleranceLevel: 5,
        marketDropReaction: 'BUY_MORE',
        primaryObjective: 'MAXIMIZE_RETURNS',
        priorLossExperience: true,
      });

      expect(profile.score).toBeGreaterThanOrEqual(80);
      expect(profile.category).toBe('AGGRESSIVE_GROWTH');
      expect(profile.equityTargetPct).toBe(90);
    });

    it('should calculate conservative risk score for older investor seeking capital preservation', () => {
      const profile = calculateRiskProfile({
        age: 70,
        investmentHorizonYears: 2,
        liquidNetWorth: 200000,
        monthlySavings: 500,
        riskToleranceLevel: 1,
        marketDropReaction: 'SELL_ALL',
        primaryObjective: 'CAPITAL_PRESERVATION',
        priorLossExperience: false,
      });

      expect(profile.score).toBeLessThanOrEqual(25);
      expect(profile.category).toBe('CONSERVATIVE');
      expect(profile.fixedIncomeTargetPct).toBe(70);
    });
  });

  describe('Allocation Engine & Asset Metrics', () => {
    it('should generate target allocation summing to exactly 100%', () => {
      const sampleRisk = calculateRiskProfile({
        age: 35,
        investmentHorizonYears: 15,
        liquidNetWorth: 100000,
        monthlySavings: 1000,
        riskToleranceLevel: 4,
        marketDropReaction: 'DO_NOTHING',
        primaryObjective: 'BALANCED_GROWTH',
        priorLossExperience: true,
      });

      const allocations = generateTargetAllocation(sampleRisk, 'WEALTH_ACCUMULATION');
      const totalPct = allocations.reduce((sum, item) => sum + item.targetWeightPct, 0);

      expect(Math.round(totalPct * 10) / 10).toBe(100.0);
    });

    it('should calculate expected portfolio metrics correctly', () => {
      const dummyAllocations = [
        { assetClass: 'US_LARGE_CAP' as const, targetWeightPct: 60 },
        { assetClass: 'CORE_BONDS' as const, targetWeightPct: 40 },
      ];

      const metrics = calculateExpectedMetrics(dummyAllocations);

      expect(metrics.expectedReturnPct).toBeGreaterThan(0);
      expect(metrics.expectedVolatilityPct).toBeGreaterThan(0);
      expect(metrics.sharpeRatio).toBeGreaterThan(0);
    });
  });

  describe('Drift Engine & Automated Rebalancing', () => {
    it('should detect portfolio weight drift and trigger rebalance', () => {
      const targetAllocations = generateTargetAllocation({
        score: 60,
        category: 'BALANCED',
        equityTargetPct: 60,
        fixedIncomeTargetPct: 35,
        alternativesTargetPct: 5,
        recommendedDuration: '5-10 years',
        lossCapacityFactor: 1.0,
      });

      // Holdings heavily skewed towards US Large Cap
      const holdings = [
        {
          id: 'h1',
          symbol: 'VOO',
          name: 'Vanguard S&P 500',
          assetClass: 'US_LARGE_CAP' as const,
          shares: 200,
          avgCostBasis: 400,
          currentPrice: 500,
          totalMarketValue: 100000, // 90.9% of portfolio
          currentWeightPct: 90.9,
          unrealizedGainLoss: 20000,
          unrealizedGainLossPct: 25,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'h2',
          symbol: 'BND',
          name: 'Total Bond Market',
          assetClass: 'CORE_BONDS' as const,
          shares: 100,
          avgCostBasis: 80,
          currentPrice: 100,
          totalMarketValue: 10000, // 9.1% of portfolio
          currentWeightPct: 9.1,
          unrealizedGainLoss: 2000,
          unrealizedGainLossPct: 25,
          lastUpdated: new Date().toISOString(),
        },
      ];

      const drift = calculatePortfolioDrift(holdings, targetAllocations, 0);

      expect(drift.isRebalanceRequired).toBe(true);
      expect(drift.totalDriftScore).toBeGreaterThan(10);
    });

    it('should generate buy/sell orders that reduce portfolio drift after execution', () => {
      const targetAllocations = generateTargetAllocation({
        score: 60,
        category: 'BALANCED',
        equityTargetPct: 60,
        fixedIncomeTargetPct: 35,
        alternativesTargetPct: 5,
        recommendedDuration: '5-10 years',
        lossCapacityFactor: 1.0,
      });

      const holdings = [
        {
          id: 'h1',
          symbol: 'VOO',
          name: 'Vanguard S&P 500',
          assetClass: 'US_LARGE_CAP' as const,
          shares: 200,
          avgCostBasis: 400,
          currentPrice: 500,
          totalMarketValue: 100000,
          currentWeightPct: 90.9,
          unrealizedGainLoss: 20000,
          unrealizedGainLossPct: 25,
          lastUpdated: new Date().toISOString(),
        },
      ];

      const rebalancePlan = generateRebalancePlan('p1', holdings, targetAllocations, 10000);

      expect(rebalancePlan.orders.length).toBeGreaterThan(0);
      expect(rebalancePlan.driftAfterRebalance).toBeLessThan(rebalancePlan.driftBeforeRebalance);
    });
  });

  describe('Tax-Loss Harvesting Engine', () => {
    it('should identify tax loss harvest opportunities and replacement symbols', () => {
      const taxLots = [
        {
          id: 'tl1',
          holdingSymbol: 'VOO',
          assetClass: 'US_LARGE_CAP' as const,
          purchaseDate: '2026-01-01',
          shares: 50,
          costBasisPerShare: 500,
          currentPrice: 450, // Loss of $50/share * 50 = $2500
          unrealizedLoss: 2500,
        },
      ];

      const summary = detectTaxLossHarvestingOpportunities(taxLots, 24, 100);

      expect(summary.opportunitiesCount).toBe(1);
      expect(summary.totalHarvestableLoss).toBe(2500);
      expect(summary.totalEstimatedTaxSavings).toBe(600); // 24% of 2500
      expect(summary.opportunities[0].replacementSymbol).toBe('SCHX');
    });
  });

  describe('Monte Carlo Simulation Engine', () => {
    it('should generate valid percentile trajectories and probability of success', () => {
      const dummyGoal = {
        id: 'g1',
        name: 'Test Goal',
        type: 'RETIREMENT' as const,
        targetAmount: 500000,
        timeHorizonYears: 10,
        initialInvestment: 50000,
        monthlyContribution: 2000,
        createdAt: new Date().toISOString(),
      };

      const dummyAllocations = [
        {
          assetClass: 'US_LARGE_CAP' as const,
          targetWeightPct: 70,
          minWeightPct: 50,
          maxWeightPct: 90,
          etfSymbol: 'VOO',
          etfName: 'Vanguard S&P 500',
        },
        {
          assetClass: 'CORE_BONDS' as const,
          targetWeightPct: 30,
          minWeightPct: 10,
          maxWeightPct: 50,
          etfSymbol: 'BND',
          etfName: 'Total Bond Market',
        },
      ];

      const result = runMonteCarloSimulation(dummyGoal, dummyAllocations, { numSimulations: 100 });

      expect(result.trajectories.length).toBe(11); // Year 0 to Year 10
      expect(result.probabilityOfSuccessPct).toBeGreaterThanOrEqual(0);
      expect(result.probabilityOfSuccessPct).toBeLessThanOrEqual(100);
      expect(result.projectedEndingMedianValue).toBeGreaterThan(dummyGoal.initialInvestment);
    });
  });
});

import { calculateExpectedMetrics } from './assetUniverse';
import { InvestorGoal, SimulationResult, SimulationTrajectory, TargetAllocation } from './types';

export interface SimulationOptions {
  numSimulations?: number;
  annualInflationRatePct?: number;
}

/**
 * Executes a stochastic Monte Carlo simulation to project future wealth trajectories and goal success probability.
 */
export function runMonteCarloSimulation(
  goal: InvestorGoal,
  allocations: TargetAllocation[],
  options: SimulationOptions = {}
): SimulationResult {
  const numSims = options.numSimulations ?? 1000;
  const inflationRate = (options.annualInflationRatePct ?? 2.5) / 100;

  const { expectedReturnPct, expectedVolatilityPct } = calculateExpectedMetrics(allocations);

  const mu = expectedReturnPct / 100;
  const sigma = expectedVolatilityPct / 100;
  const years = Math.max(1, Math.min(40, goal.timeHorizonYears));
  const initialCap = goal.initialInvestment;
  const annualContribution = goal.monthlyContribution * 12;

  // Store ending values for each run
  const endingValues: number[] = new Array(numSims);
  // Store yearly values per trajectory run: trajectoryValues[yearIndex][simIndex]
  const yearlyValues: number[][] = Array.from({ length: years + 1 }, () => new Array(numSims));

  for (let s = 0; s < numSims; s++) {
    let currentVal = initialCap;
    yearlyValues[0][s] = currentVal;

    for (let y = 1; y <= years; y++) {
      // Geometric Brownian Motion sample: return = exp((mu - 0.5 * sigma^2) + sigma * Z)
      const z = gaussianRandom();
      const annualReturn = Math.exp(mu - 0.5 * Math.pow(sigma, 2) + sigma * z) - 1;

      // Compound current capital and add annual savings contribution
      currentVal = (currentVal + annualContribution) * (1 + annualReturn);
      yearlyValues[y][s] = currentVal;
    }
    endingValues[s] = currentVal;
  }

  // Calculate percentiles per year
  const trajectories: SimulationTrajectory[] = [];
  let totalContrib = initialCap;

  for (let y = 0; y <= years; y++) {
    const sortedYearVals = yearlyValues[y].slice().sort((a, b) => a - b);
    const p10Idx = Math.floor(numSims * 0.1);
    const p50Idx = Math.floor(numSims * 0.5);
    const p90Idx = Math.floor(numSims * 0.9);

    // Apply inflation discount factor: (1 + inflation)^y
    const discountFactor = Math.pow(1 + inflationRate, y);

    trajectories.push({
      year: y,
      p10: Math.round(sortedYearVals[p10Idx] / discountFactor),
      p50: Math.round(sortedYearVals[p50Idx] / discountFactor),
      p90: Math.round(sortedYearVals[p90Idx] / discountFactor),
      contributionsAccumulated: Math.round(totalContrib / discountFactor),
    });

    totalContrib += annualContribution;
  }

  // Calculate probability of goal success
  const targetGoalNominal = goal.targetAmount * Math.pow(1 + inflationRate, years);
  const successCount = endingValues.filter((val) => val >= goal.targetAmount).length;
  const probabilityOfSuccessPct = Math.round((successCount / numSims) * 100);

  const medianEndingValue = trajectories[years].p50;

  return {
    goalId: goal.id,
    goalTargetAmount: goal.targetAmount,
    probabilityOfSuccessPct,
    projectedEndingMedianValue: medianEndingValue,
    trajectories,
    inflationAdjusted: true,
  };
}

/**
 * Standard Normal Box-Muller transformation for gaussian random variables.
 */
function gaussianRandom(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

import { AssetCategory, PortfolioHolding, TargetAllocation } from './types';

export interface AssetDriftDetail {
  assetClass: AssetCategory;
  symbol: string;
  targetWeightPct: number;
  currentWeightPct: number;
  absoluteDriftPct: number;
  minWeightPct: number;
  maxWeightPct: number;
  status: 'OPTIMAL' | 'DRIFTED_HIGH' | 'DRIFTED_LOW';
}

export interface PortfolioDriftAnalysis {
  totalPortfolioValue: number;
  cashBalance: number;
  totalDriftScore: number; // Sum of absolute weight deviations / 2
  maxSingleAssetDriftPct: number;
  isRebalanceRequired: boolean;
  driftSeverity: 'BALANCED' | 'MODERATE_DRIFT' | 'SEVERE_DRIFT';
  assetDrifts: AssetDriftDetail[];
}

/**
 * Evaluates current portfolio holdings against target allocation model to compute drift metrics.
 */
export function calculatePortfolioDrift(
  holdings: PortfolioHolding[],
  targetAllocations: TargetAllocation[],
  cashBalance: number = 0
): PortfolioDriftAnalysis {
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.totalMarketValue, 0);
  const totalPortfolioValue = totalHoldingsValue + cashBalance;

  if (totalPortfolioValue <= 0) {
    return {
      totalPortfolioValue: 0,
      cashBalance: 0,
      totalDriftScore: 0,
      maxSingleAssetDriftPct: 0,
      isRebalanceRequired: false,
      driftSeverity: 'BALANCED',
      assetDrifts: [],
    };
  }

  // Map holdings to current asset class total values
  const currentAssetValues: Partial<Record<AssetCategory, { value: number; symbol: string }>> = {};
  holdings.forEach((h) => {
    const existing = currentAssetValues[h.assetClass] || { value: 0, symbol: h.symbol };
    currentAssetValues[h.assetClass] = {
      value: existing.value + h.totalMarketValue,
      symbol: h.symbol,
    };
  });

  let totalAbsoluteDeviations = 0;
  let maxSingleAssetDriftPct = 0;
  let isRebalanceRequired = false;

  const assetDrifts: AssetDriftDetail[] = targetAllocations.map((target) => {
    const assetData = currentAssetValues[target.assetClass];
    const assetValue = assetData ? assetData.value : 0;
    const currentWeightPct = Math.round((assetValue / totalPortfolioValue) * 1000) / 10;
    const absoluteDriftPct = Math.round(Math.abs(currentWeightPct - target.targetWeightPct) * 10) / 10;

    totalAbsoluteDeviations += absoluteDriftPct;
    if (absoluteDriftPct > maxSingleAssetDriftPct) {
      maxSingleAssetDriftPct = absoluteDriftPct;
    }

    let status: 'OPTIMAL' | 'DRIFTED_HIGH' | 'DRIFTED_LOW' = 'OPTIMAL';
    if (currentWeightPct > target.maxWeightPct) {
      status = 'DRIFTED_HIGH';
      isRebalanceRequired = true;
    } else if (currentWeightPct < target.minWeightPct && target.targetWeightPct > 0) {
      status = 'DRIFTED_LOW';
      isRebalanceRequired = true;
    }

    return {
      assetClass: target.assetClass,
      symbol: assetData?.symbol || target.etfSymbol,
      targetWeightPct: target.targetWeightPct,
      currentWeightPct,
      absoluteDriftPct,
      minWeightPct: target.minWeightPct,
      maxWeightPct: target.maxWeightPct,
      status,
    };
  });

  const totalDriftScore = Math.round((totalAbsoluteDeviations / 2) * 10) / 10;

  // Global threshold trigger: total drift score > 5.0% forces rebalance even if individual bounds haven't breached
  if (totalDriftScore >= 5.0) {
    isRebalanceRequired = true;
  }

  let driftSeverity: 'BALANCED' | 'MODERATE_DRIFT' | 'SEVERE_DRIFT' = 'BALANCED';
  if (totalDriftScore >= 8.0 || maxSingleAssetDriftPct >= 7.0) {
    driftSeverity = 'SEVERE_DRIFT';
  } else if (totalDriftScore >= 3.5 || maxSingleAssetDriftPct >= 3.5) {
    driftSeverity = 'MODERATE_DRIFT';
  }

  return {
    totalPortfolioValue,
    cashBalance,
    totalDriftScore,
    maxSingleAssetDriftPct,
    isRebalanceRequired,
    driftSeverity,
    assetDrifts,
  };
}

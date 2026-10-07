import { AssetCategory, GoalType, RiskProfile, TargetAllocation } from './types';

export interface ETFMapping {
  symbol: string;
  name: string;
}

export const DEFAULT_ETF_MAPPINGS: Record<AssetCategory, ETFMapping> = {
  US_LARGE_CAP: { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
  US_SMALL_CAP: { symbol: 'VB', name: 'Vanguard Small-Cap ETF' },
  INTL_DEVELOPED: { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF' },
  EMERGING_MARKETS: { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF' },
  CORE_BONDS: { symbol: 'BND', name: 'Vanguard Total Bond Market ETF' },
  HIGH_YIELD_BONDS: { symbol: 'JNK', name: 'SPDR Bloomberg High Yield Bond ETF' },
  TIPS_INFLATION: { symbol: 'TIP', name: 'iShares TIPS Bond ETF' },
  REAL_ESTATE: { symbol: 'VNQ', name: 'Vanguard Real Estate ETF' },
  COMMODITIES: { symbol: 'IAU', name: 'iShares Gold Trust' },
  CASH_EQUIVALENTS: { symbol: 'BIL', name: 'SPDR Bloomberg 1-3 Month T-Bill ETF' },
};

/**
 * Generates an optimal target portfolio allocation array given an investor's risk profile and financial goal.
 * 
 * Humanized Explanation for Maintainers:
 * This function takes the high-level equity/bond/alternatives target split computed by `riskEngine.ts`
 * and breaks it down into 10 granular asset classes (US Large Cap, Emerging Markets, TIPS, REITs, Gold, etc.).
 * It adjusts weights based on goal priorities (e.g., Emergency Fund vs Retirement vs Wealth Accumulation)
 * and normalizes the final portfolio weights to sum to exactly 100.0%.
 * 
 * @param riskProfile The computed risk profile containing high-level target asset split.
 * @param goalType The investor's primary financial goal.
 * @returns Array of TargetAllocation objects detailing exact target weights and ETF tickers.
 */
export function generateTargetAllocation(
  riskProfile: RiskProfile,
  goalType: GoalType = 'WEALTH_ACCUMULATION'
): TargetAllocation[] {
  const { equityTargetPct, fixedIncomeTargetPct, alternativesTargetPct } = riskProfile;

  // -------------------------------------------------------------------------
  // Base asset breakdown proportions within categories
  // -------------------------------------------------------------------------
  let usLargePct = equityTargetPct * 0.50;
  let usSmallPct = equityTargetPct * 0.20;
  let intlDevPct = equityTargetPct * 0.20;
  let emergingPct = equityTargetPct * 0.10;

  let coreBondPct = fixedIncomeTargetPct * 0.70;
  let highYieldPct = fixedIncomeTargetPct * 0.15;
  let tipsPct = fixedIncomeTargetPct * 0.15;

  let reitPct = alternativesTargetPct * 0.60;
  let goldPct = alternativesTargetPct * 0.40;
  let cashPct = 0;

  // -------------------------------------------------------------------------
  // Adjust allocation based on specific financial goal requirements
  // -------------------------------------------------------------------------
  if (goalType === 'EMERGENCY_FUND') {
    // For emergency funds, cash & short-term core bonds dominate for capital preservation
    cashPct = 40;
    coreBondPct = 40;
    tipsPct = 20;
    usLargePct = 0;
    usSmallPct = 0;
    intlDevPct = 0;
    emergingPct = 0;
    highYieldPct = 0;
    reitPct = 0;
    goldPct = 0;
  } else if (goalType === 'RETIREMENT') {
    // Boost inflation-protected assets (TIPS) & steady dividend REITs
    tipsPct += 5;
    reitPct += 3;
    if (coreBondPct >= 8) coreBondPct -= 8;
  } else if (goalType === 'MAJOR_PURCHASE') {
    // Reduce extreme volatility, shift weight from small cap to liquid T-Bills
    const shift = usSmallPct * 0.5;
    usSmallPct -= shift;
    cashPct += shift;
  }

  const rawAllocations: Record<AssetCategory, number> = {
    US_LARGE_CAP: usLargePct,
    US_SMALL_CAP: usSmallPct,
    INTL_DEVELOPED: intlDevPct,
    EMERGING_MARKETS: emergingPct,
    CORE_BONDS: coreBondPct,
    HIGH_YIELD_BONDS: highYieldPct,
    TIPS_INFLATION: tipsPct,
    REAL_ESTATE: reitPct,
    COMMODITIES: goldPct,
    CASH_EQUIVALENTS: cashPct,
  };

  // -------------------------------------------------------------------------
  // Normalize to ensure total sums to exactly 100.0% without rounding drift
  // -------------------------------------------------------------------------
  const totalRaw = Object.values(rawAllocations).reduce((sum, val) => sum + val, 0);
  const normalizedAllocations: TargetAllocation[] = [];

  const categories = Object.keys(rawAllocations) as AssetCategory[];
  const unadjustedAllocations: { cat: AssetCategory; weight: number }[] = [];

  categories.forEach((cat) => {
    let weight = totalRaw > 0 ? (rawAllocations[cat] / totalRaw) * 100 : 0;
    weight = Math.round(weight * 10) / 10; // Round to 1 decimal place
    unadjustedAllocations.push({ cat, weight });
  });

  let currentSum = unadjustedAllocations.reduce((sum, item) => sum + item.weight, 0);
  currentSum = Math.round(currentSum * 10) / 10;
  const diff = Math.round((100.0 - currentSum) * 10) / 10;

  // Assign any remaining fraction of a percent to the largest asset class
  if (diff !== 0 && unadjustedAllocations.length > 0) {
    let maxIdx = 0;
    for (let i = 1; i < unadjustedAllocations.length; i++) {
      if (unadjustedAllocations[i].weight > unadjustedAllocations[maxIdx].weight) {
        maxIdx = i;
      }
    }
    unadjustedAllocations[maxIdx].weight = Math.round((unadjustedAllocations[maxIdx].weight + diff) * 10) / 10;
  }

  categories.forEach((cat, index) => {
    const weight = unadjustedAllocations[index].weight;
    const etf = DEFAULT_ETF_MAPPINGS[cat];
    // Dynamic rebalance tolerance bands based on target weight size
    const tolerancePct = Math.max(2.0, weight * 0.25);

    normalizedAllocations.push({
      assetClass: cat,
      targetWeightPct: weight,
      minWeightPct: Math.max(0, Math.round((weight - tolerancePct) * 10) / 10),
      maxWeightPct: Math.round((weight + tolerancePct) * 10) / 10,
      etfSymbol: etf.symbol,
      etfName: etf.name,
    });
  });

  return normalizedAllocations;
}

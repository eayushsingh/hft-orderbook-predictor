import { AssetCategory, AssetClassInfo } from './types';

export const ASSET_UNIVERSE: Record<AssetCategory, AssetClassInfo> = {
  US_LARGE_CAP: {
    id: 'US_LARGE_CAP',
    name: 'U.S. Large Cap Equity',
    description: 'Tracks top 500 U.S. market-cap blue-chip companies providing foundational growth.',
    benchmarkSymbol: 'VOO',
    historicalReturnRate: 10.5,
    volatilityRate: 15.2,
    expenseRatioPct: 0.03,
    assetGroup: 'EQUITY',
  },
  US_SMALL_CAP: {
    id: 'US_SMALL_CAP',
    name: 'U.S. Small Cap Equity',
    description: 'High-growth potential U.S. small cap equities with elevated return potential.',
    benchmarkSymbol: 'VB',
    historicalReturnRate: 11.8,
    volatilityRate: 19.8,
    expenseRatioPct: 0.05,
    assetGroup: 'EQUITY',
  },
  INTL_DEVELOPED: {
    id: 'INTL_DEVELOPED',
    name: 'International Developed Equity',
    description: 'Broad diversification across mature global markets in Europe, Asia, and Australasia.',
    benchmarkSymbol: 'VEA',
    historicalReturnRate: 7.8,
    volatilityRate: 16.5,
    expenseRatioPct: 0.05,
    assetGroup: 'EQUITY',
  },
  EMERGING_MARKETS: {
    id: 'EMERGING_MARKETS',
    name: 'Emerging Market Equity',
    description: 'Exposure to high-growth emerging global economies (India, Brazil, Taiwan, etc.).',
    benchmarkSymbol: 'VWO',
    historicalReturnRate: 9.2,
    volatilityRate: 22.4,
    expenseRatioPct: 0.08,
    assetGroup: 'EQUITY',
  },
  CORE_BONDS: {
    id: 'CORE_BONDS',
    name: 'U.S. Investment Grade Bonds',
    description: 'Broad, investment-grade fixed income providing steady yield and capital stability.',
    benchmarkSymbol: 'BND',
    historicalReturnRate: 4.5,
    volatilityRate: 5.8,
    expenseRatioPct: 0.03,
    assetGroup: 'FIXED_INCOME',
  },
  HIGH_YIELD_BONDS: {
    id: 'HIGH_YIELD_BONDS',
    name: 'High Yield Corporate Bonds',
    description: 'Higher-yielding corporate debt offering increased income stream.',
    benchmarkSymbol: 'JNK',
    historicalReturnRate: 6.8,
    volatilityRate: 10.4,
    expenseRatioPct: 0.40,
    assetGroup: 'FIXED_INCOME',
  },
  TIPS_INFLATION: {
    id: 'TIPS_INFLATION',
    name: 'Inflation-Protected Securities (TIPS)',
    description: 'U.S. Treasury securities indexed to inflation to protect purchasing power.',
    benchmarkSymbol: 'TIP',
    historicalReturnRate: 4.1,
    volatilityRate: 6.2,
    expenseRatioPct: 0.19,
    assetGroup: 'FIXED_INCOME',
  },
  REAL_ESTATE: {
    id: 'REAL_ESTATE',
    name: 'Real Estate Investment Trusts (REITs)',
    description: 'Commercial and residential real estate equities generating income and inflation hedge.',
    benchmarkSymbol: 'VNQ',
    historicalReturnRate: 8.9,
    volatilityRate: 17.6,
    expenseRatioPct: 0.12,
    assetGroup: 'ALTERNATIVES',
  },
  COMMODITIES: {
    id: 'COMMODITIES',
    name: 'Physical Gold & Commodities',
    description: 'Physical commodities and precious metals offering non-correlated tail-risk hedging.',
    benchmarkSymbol: 'IAU',
    historicalReturnRate: 6.2,
    volatilityRate: 14.8,
    expenseRatioPct: 0.25,
    assetGroup: 'ALTERNATIVES',
  },
  CASH_EQUIVALENTS: {
    id: 'CASH_EQUIVALENTS',
    name: 'Cash & Short-Term Money Market',
    description: 'Ultra-short U.S. Treasury bills providing maximum liquidity and zero principal risk.',
    benchmarkSymbol: 'BIL',
    historicalReturnRate: 4.2,
    volatilityRate: 0.5,
    expenseRatioPct: 0.14,
    assetGroup: 'CASH',
  },
};

/**
 * Calculates weighted expected return and volatility for a given asset allocation.
 */
export function calculateExpectedMetrics(allocations: { assetClass: AssetCategory; targetWeightPct: number }[]): {
  expectedReturnPct: number;
  expectedVolatilityPct: number;
  blendedExpenseRatioPct: number;
  sharpeRatio: number;
} {
  let expectedReturnPct = 0;
  let varianceSum = 0;
  let blendedExpenseRatioPct = 0;

  allocations.forEach((item) => {
    const asset = ASSET_UNIVERSE[item.assetClass];
    const weight = item.targetWeightPct / 100;
    if (asset && weight > 0) {
      expectedReturnPct += weight * asset.historicalReturnRate;
      varianceSum += Math.pow(weight * asset.volatilityRate, 2);
      blendedExpenseRatioPct += weight * asset.expenseRatioPct;
    }
  });

  const expectedVolatilityPct = Math.sqrt(varianceSum);
  const riskFreeRate = ASSET_UNIVERSE.CASH_EQUIVALENTS.historicalReturnRate;
  const sharpeRatio =
    expectedVolatilityPct > 0 ? (expectedReturnPct - riskFreeRate) / expectedVolatilityPct : 0;

  return {
    expectedReturnPct: Math.round(expectedReturnPct * 100) / 100,
    expectedVolatilityPct: Math.round(expectedVolatilityPct * 100) / 100,
    blendedExpenseRatioPct: Math.round(blendedExpenseRatioPct * 1000) / 1000,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
  };
}

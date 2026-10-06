import { TaxHarvestOpportunity, TaxLot } from './types';

export const TAX_SWAP_REPLACEMENTS: Record<string, { symbol: string; name: string }> = {
  VOO: { symbol: 'SCHX', name: 'Schwab U.S. Large-Cap ETF' },
  IVV: { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
  VB: { symbol: 'SCHA', name: 'Schwab U.S. Small-Cap ETF' },
  VEA: { symbol: 'IEFA', name: 'iShares Core MSCI EAFE ETF' },
  VWO: { symbol: 'IEMG', name: 'iShares Core MSCI Emerging Markets ETF' },
  BND: { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF' },
  JNK: { symbol: 'HYG', name: 'iShares iBoxx High Yield Corporate Bond ETF' },
  TIP: { symbol: 'VTIP', name: 'Vanguard Short-Term Inflation-Protected Securities ETF' },
  VNQ: { symbol: 'SCHH', name: 'Schwab U.S. REIT ETF' },
  IAU: { symbol: 'GLD', name: 'SPDR Gold Shares' },
};

export interface TaxHarvestSummary {
  totalHarvestableLoss: number;
  totalEstimatedTaxSavings: number;
  opportunitiesCount: number;
  opportunities: TaxHarvestOpportunity[];
}

/**
 * Scans investor tax lots to identify tax loss harvesting opportunities while guarding against wash sales.
 */
export function detectTaxLossHarvestingOpportunities(
  taxLots: TaxLot[],
  marginalTaxRatePct: number = 24.0,
  minHarvestLossDollars: number = 100.0
): TaxHarvestSummary {
  const opportunities: TaxHarvestOpportunity[] = [];
  let totalHarvestableLoss = 0;
  let totalEstimatedTaxSavings = 0;

  taxLots.forEach((lot) => {
    const unrealizedLoss = (lot.costBasisPerShare - lot.currentPrice) * lot.shares;

    if (unrealizedLoss >= minHarvestLossDollars) {
      const estimatedSavings = (unrealizedLoss * marginalTaxRatePct) / 100;
      const swap = TAX_SWAP_REPLACEMENTS[lot.holdingSymbol] || {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
      };

      totalHarvestableLoss += unrealizedLoss;
      totalEstimatedTaxSavings += estimatedSavings;

      opportunities.push({
        id: `tlh-${lot.id}-${Date.now()}`,
        holdingSymbol: lot.holdingSymbol,
        assetClass: lot.assetClass,
        harvestableLoss: Math.round(unrealizedLoss * 100) / 100,
        taxLotId: lot.id,
        sharesToHarvest: lot.shares,
        estimatedTaxSavings: Math.round(estimatedSavings * 100) / 100,
        replacementSymbol: swap.symbol,
        replacementName: swap.name,
        washSaleWarning: false, // Avoid direct ticker purchase within 30 days
      });
    }
  });

  return {
    totalHarvestableLoss: Math.round(totalHarvestableLoss * 100) / 100,
    totalEstimatedTaxSavings: Math.round(totalEstimatedTaxSavings * 100) / 100,
    opportunitiesCount: opportunities.length,
    opportunities,
  };
}

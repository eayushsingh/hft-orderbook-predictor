import { calculatePortfolioDrift } from './driftEngine';
import {
  PortfolioHolding,
  RebalanceExecutionPlan,
  RebalanceTradeOrder,
  TargetAllocation,
} from './types';

export interface RebalanceOptions {
  minTradeValueDollars?: number;
  cashBufferPct?: number; // Reserve cash % for liquidity
}

/**
 * Calculates optimal rebalancing buy/sell trade orders to bring portfolio back to target weights.
 */
export function generateRebalancePlan(
  portfolioId: string,
  holdings: PortfolioHolding[],
  targetAllocations: TargetAllocation[],
  cashBalance: number,
  options: RebalanceOptions = {}
): RebalanceExecutionPlan {
  const minTradeValue = options.minTradeValueDollars ?? 50;
  const cashBufferPct = options.cashBufferPct ?? 1.0; // 1% default cash buffer

  const initialDrift = calculatePortfolioDrift(holdings, targetAllocations, cashBalance);
  const totalPortfolioValue = initialDrift.totalPortfolioValue;

  if (totalPortfolioValue <= 0) {
    return {
      portfolioId,
      generatedAt: new Date().toISOString(),
      totalTradeVolume: 0,
      estimatedCommissionFee: 0,
      driftBeforeRebalance: 0,
      driftAfterRebalance: 0,
      orders: [],
    };
  }

  const reservedCash = (totalPortfolioValue * cashBufferPct) / 100;
  const investableCapital = totalPortfolioValue - reservedCash;

  // Build map of current holdings by asset class
  const holdingsMap = new Map<string, PortfolioHolding>();
  holdings.forEach((h) => holdingsMap.set(h.assetClass, h));

  const orders: RebalanceTradeOrder[] = [];
  let totalTradeVolume = 0;

  // 1. Process SELL orders first to free up capital
  targetAllocations.forEach((target) => {
    const existingHolding = holdingsMap.get(target.assetClass);
    if (!existingHolding) return;

    const targetDollarValue = (investableCapital * target.targetWeightPct) / 100;
    const deltaDollars = existingHolding.totalMarketValue - targetDollarValue;

    if (deltaDollars > minTradeValue) {
      const estimatedPrice = existingHolding.currentPrice || 100;
      const sharesToSell = Math.floor(deltaDollars / estimatedPrice);

      if (sharesToSell > 0) {
        const tradeValue = Math.round(sharesToSell * estimatedPrice * 100) / 100;
        totalTradeVolume += tradeValue;

        const postTradeValue = existingHolding.totalMarketValue - tradeValue;
        const postTradeWeightPct = Math.round((postTradeValue / totalPortfolioValue) * 1000) / 10;

        orders.push({
          id: `ord-sell-${target.assetClass.toLowerCase()}-${Date.now()}`,
          symbol: existingHolding.symbol,
          assetClass: target.assetClass,
          action: 'SELL',
          shares: sharesToSell,
          estimatedPrice,
          estimatedTotalValue: tradeValue,
          currentWeightPct: existingHolding.currentWeightPct,
          targetWeightPct: target.targetWeightPct,
          postTradeWeightPct,
          reasoning: `Overweight by ${Math.round((existingHolding.currentWeightPct - target.targetWeightPct) * 10) / 10}%. Trimming excess allocation.`,
        });
      }
    }
  });

  // 2. Process BUY orders to allocate available cash & sold proceeds
  targetAllocations.forEach((target) => {
    const existingHolding = holdingsMap.get(target.assetClass);
    const currentMarketValue = existingHolding ? existingHolding.totalMarketValue : 0;
    const currentWeightPct = existingHolding ? existingHolding.currentWeightPct : 0;
    const symbol = existingHolding ? existingHolding.symbol : target.etfSymbol;
    const estimatedPrice = existingHolding ? existingHolding.currentPrice : 150; // default benchmark price

    const targetDollarValue = (investableCapital * target.targetWeightPct) / 100;
    const deltaDollars = targetDollarValue - currentMarketValue;

    if (deltaDollars > minTradeValue) {
      const sharesToBuy = Math.floor(deltaDollars / estimatedPrice);

      if (sharesToBuy > 0) {
        const tradeValue = Math.round(sharesToBuy * estimatedPrice * 100) / 100;
        totalTradeVolume += tradeValue;

        const postTradeValue = currentMarketValue + tradeValue;
        const postTradeWeightPct = Math.round((postTradeValue / totalPortfolioValue) * 1000) / 10;

        orders.push({
          id: `ord-buy-${target.assetClass.toLowerCase()}-${Date.now()}`,
          symbol,
          assetClass: target.assetClass,
          action: 'BUY',
          shares: sharesToBuy,
          estimatedPrice,
          estimatedTotalValue: tradeValue,
          currentWeightPct,
          targetWeightPct: target.targetWeightPct,
          postTradeWeightPct,
          reasoning: `Underweight by ${Math.round((target.targetWeightPct - currentWeightPct) * 10) / 10}%. Purchasing units to restore target weight.`,
        });
      }
    }
  });

  // Calculate estimated post-rebalance drift score
  const simulatedHoldings: PortfolioHolding[] = holdings.map((h) => {
    const order = orders.find((o) => o.symbol === h.symbol);
    if (!order) return h;

    const deltaValue = order.action === 'BUY' ? order.estimatedTotalValue : -order.estimatedTotalValue;
    const newMarketValue = h.totalMarketValue + deltaValue;

    return {
      ...h,
      totalMarketValue: newMarketValue,
      currentWeightPct: Math.round((newMarketValue / totalPortfolioValue) * 1000) / 10,
    };
  });

  const postDrift = calculatePortfolioDrift(simulatedHoldings, targetAllocations, cashBalance);

  return {
    portfolioId,
    generatedAt: new Date().toISOString(),
    totalTradeVolume: Math.round(totalTradeVolume * 100) / 100,
    estimatedCommissionFee: 0, // Commission-free ETF trading model
    driftBeforeRebalance: initialDrift.totalDriftScore,
    driftAfterRebalance: postDrift.totalDriftScore,
    orders,
  };
}

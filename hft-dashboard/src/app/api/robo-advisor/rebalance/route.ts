import { NextResponse } from 'next/server';
import { generateRebalancePlan } from '@/lib/robo-advisor/rebalanceEngine';
import { getDefaultSamplePortfolio } from '@/lib/robo-advisor/sampleData';

export async function GET() {
  const samplePortfolio = getDefaultSamplePortfolio();
  const rebalancePlan = generateRebalancePlan(
    samplePortfolio.id,
    samplePortfolio.holdings,
    samplePortfolio.targetAllocations,
    samplePortfolio.cashBalance
  );

  return NextResponse.json({
    success: true,
    portfolioId: samplePortfolio.id,
    driftScore: samplePortfolio.driftScore,
    rebalancePlan,
  });
}

export async function POST() {
  // Simulates executing the generated rebalance plan
  const samplePortfolio = getDefaultSamplePortfolio();
  const rebalancePlan = generateRebalancePlan(
    samplePortfolio.id,
    samplePortfolio.holdings,
    samplePortfolio.targetAllocations,
    samplePortfolio.cashBalance
  );

  return NextResponse.json({
    success: true,
    message: 'Rebalance orders successfully submitted to market routing core.',
    executedOrdersCount: rebalancePlan.orders.length,
    postDriftScore: rebalancePlan.driftAfterRebalance,
    rebalancedAt: new Date().toISOString(),
  });
}

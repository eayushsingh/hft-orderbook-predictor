import { NextResponse } from 'next/server';
import { runMonteCarloSimulation } from '@/lib/robo-advisor/simulationEngine';
import { getDefaultSamplePortfolio } from '@/lib/robo-advisor/storage';
import { InvestorGoal } from '@/lib/robo-advisor/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      goal?: Partial<InvestorGoal>;
    };

    const samplePortfolio = getDefaultSamplePortfolio();
    const goal: InvestorGoal = {
      id: 'goal-retirement-01',
      name: body?.goal?.name || 'Retirement Accumulation',
      type: body?.goal?.type || 'RETIREMENT',
      targetAmount: body?.goal?.targetAmount || 1500000,
      timeHorizonYears: body?.goal?.timeHorizonYears || 15,
      initialInvestment: body?.goal?.initialInvestment || 100000,
      monthlyContribution: body?.goal?.monthlyContribution || 2500,
      createdAt: new Date().toISOString(),
    };

    const simulationResult = runMonteCarloSimulation(goal, samplePortfolio.targetAllocations);

    return NextResponse.json({
      success: true,
      simulationResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

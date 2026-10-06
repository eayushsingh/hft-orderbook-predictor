import { NextResponse } from 'next/server';
import { generateTargetAllocation } from '@/lib/robo-advisor/allocationEngine';
import { calculateRiskProfile } from '@/lib/robo-advisor/riskEngine';
import { getDefaultSamplePortfolio } from '@/lib/robo-advisor/storage';
import { GoalType, RiskQuestionnaire } from '@/lib/robo-advisor/types';

export async function GET() {
  const samplePortfolio = getDefaultSamplePortfolio();
  return NextResponse.json({ success: true, portfolio: samplePortfolio });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      questionnaire: RiskQuestionnaire;
      goalType?: GoalType;
      initialCapital?: number;
    };

    if (!body || !body.questionnaire) {
      return NextResponse.json({ error: 'Questionnaire missing' }, { status: 400 });
    }

    const riskProfile = calculateRiskProfile(body.questionnaire);
    const targetAllocations = generateTargetAllocation(riskProfile, body.goalType || 'WEALTH_ACCUMULATION');

    return NextResponse.json({
      success: true,
      riskProfile,
      targetAllocations,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

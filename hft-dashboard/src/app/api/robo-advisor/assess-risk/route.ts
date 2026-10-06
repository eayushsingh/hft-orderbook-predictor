import { NextResponse } from 'next/server';
import { calculateRiskProfile } from '@/lib/robo-advisor/riskEngine';
import { RiskQuestionnaire } from '@/lib/robo-advisor/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RiskQuestionnaire;
    if (!body || typeof body.age !== 'number') {
      return NextResponse.json(
        { error: 'Invalid questionnaire payload' },
        { status: 400 }
      );
    }

    const riskProfile = calculateRiskProfile(body);
    return NextResponse.json({ success: true, riskProfile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

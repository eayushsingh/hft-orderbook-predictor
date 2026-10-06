import { NextResponse } from 'next/server';
import { getSampleTaxLots } from '@/lib/robo-advisor/sampleData';
import { detectTaxLossHarvestingOpportunities } from '@/lib/robo-advisor/taxHarvestingEngine';

export async function GET() {
  const taxLots = getSampleTaxLots();
  const summary = detectTaxLossHarvestingOpportunities(taxLots);

  return NextResponse.json({
    success: true,
    summary,
  });
}

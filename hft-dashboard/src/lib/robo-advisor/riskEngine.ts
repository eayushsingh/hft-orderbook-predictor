import { RiskCategory, RiskProfile, RiskQuestionnaire } from './types';

/**
 * Calculates a comprehensive Risk Profile based on investor questionnaire metrics.
 * 
 * Humanized Explanation for Maintainers:
 * This function translates raw user survey inputs (age, investment horizon, loss tolerance, drop reaction)
 * into a single quantitative Risk Score (1 - 100). That score maps directly into standard asset allocation
 * buckets ranging from CONSERVATIVE (20% equity / 70% fixed income) up to AGGRESSIVE GROWTH (90% equity / 5% fixed income).
 * 
 * @param answers The completed risk questionnaire from the investor.
 * @returns A computed RiskProfile detailing target asset class percentages and risk factors.
 */
export function calculateRiskProfile(answers: RiskQuestionnaire): RiskProfile {
  // -------------------------------------------------------------------------
  // 1. Time Horizon Score (0 - 25 points)
  // Longer investment horizons allow investors to recover from market downturns.
  // -------------------------------------------------------------------------
  let horizonScore = 0;
  if (answers.investmentHorizonYears >= 20) horizonScore = 25;
  else if (answers.investmentHorizonYears >= 10) horizonScore = 20;
  else if (answers.investmentHorizonYears >= 5) horizonScore = 15;
  else if (answers.investmentHorizonYears >= 3) horizonScore = 10;
  else horizonScore = 5;

  // -------------------------------------------------------------------------
  // 2. Risk Tolerance Self-Rating Score (0 - 25 points)
  // User's self-assessed comfort level scaled linearly (1 to 5 stars * 5).
  // -------------------------------------------------------------------------
  const toleranceScore = answers.riskToleranceLevel * 5;

  // -------------------------------------------------------------------------
  // 3. Market Drop Reaction Score (0 - 25 points)
  // Behavioral psychology metric: How the investor reacts when markets crash by 20%.
  // -------------------------------------------------------------------------
  let dropScore = 5;
  switch (answers.marketDropReaction) {
    case 'BUY_MORE':
      dropScore = 25; // Opportunistic buyer -> High risk capacity
      break;
    case 'DO_NOTHING':
      dropScore = 18; // Disciplined holder -> Moderate/High risk capacity
      break;
    case 'SELL_SOME':
      dropScore = 10; // Loss averse -> Lower risk capacity
      break;
    case 'SELL_ALL':
      dropScore = 3;  // Panic seller -> Very low risk capacity
      break;
  }

  // -------------------------------------------------------------------------
  // 4. Objective & Financial Capacity Score (0 - 25 points)
  // Primary investment goal weighting.
  // -------------------------------------------------------------------------
  let objectiveScore = 10;
  if (answers.primaryObjective === 'MAXIMIZE_RETURNS') objectiveScore = 25;
  else if (answers.primaryObjective === 'BALANCED_GROWTH') objectiveScore = 18;
  else objectiveScore = 8;

  // -------------------------------------------------------------------------
  // 5. Age & Prior Experience Adjustments
  // Younger investors have higher human capital; prior loss experience reduces panic probability.
  // -------------------------------------------------------------------------
  let adjustment = 0;
  if (answers.age < 35) adjustment += 3;
  else if (answers.age > 65) adjustment -= 5;

  if (answers.priorLossExperience) adjustment += 2;

  // Aggregate raw score and clamp to valid range [1, 100]
  const rawScore = horizonScore + toleranceScore + dropScore + objectiveScore + adjustment;
  const score = Math.max(1, Math.min(100, Math.round(rawScore)));

  // -------------------------------------------------------------------------
  // Map score to Risk Categories & Asset Class Breakdown
  // -------------------------------------------------------------------------
  let category: RiskCategory = 'BALANCED';
  let equityTargetPct = 60;
  let fixedIncomeTargetPct = 35;
  let alternativesTargetPct = 5;
  let recommendedDuration = '5 - 10 Years';
  let lossCapacityFactor = 1.0;

  if (score <= 25) {
    category = 'CONSERVATIVE';
    equityTargetPct = 20;
    fixedIncomeTargetPct = 70;
    alternativesTargetPct = 10;
    recommendedDuration = '1 - 3 Years';
    lossCapacityFactor = 0.5;
  } else if (score <= 45) {
    category = 'MODERATELY_CONSERVATIVE';
    equityTargetPct = 40;
    fixedIncomeTargetPct = 50;
    alternativesTargetPct = 10;
    recommendedDuration = '3 - 5 Years';
    lossCapacityFactor = 0.75;
  } else if (score <= 65) {
    category = 'BALANCED';
    equityTargetPct = 60;
    fixedIncomeTargetPct = 35;
    alternativesTargetPct = 5;
    recommendedDuration = '5 - 10 Years';
    lossCapacityFactor = 1.0;
  } else if (score <= 85) {
    category = 'GROWTH';
    equityTargetPct = 80;
    fixedIncomeTargetPct = 15;
    alternativesTargetPct = 5;
    recommendedDuration = '10 - 15 Years';
    lossCapacityFactor = 1.35;
  } else {
    category = 'AGGRESSIVE_GROWTH';
    equityTargetPct = 90;
    fixedIncomeTargetPct = 5;
    alternativesTargetPct = 5;
    recommendedDuration = '15+ Years';
    lossCapacityFactor = 1.75;
  }

  return {
    score,
    category,
    equityTargetPct,
    fixedIncomeTargetPct,
    alternativesTargetPct,
    recommendedDuration,
    lossCapacityFactor,
  };
}

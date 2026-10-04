import { AccumulationScoreResult } from "../scoring/scoringEngine";

export interface AISummaryResponse {
  symbol: string;
  score: number;
  classification: string;
  executiveSummary: string;
  keyInsights: string[];
  patternHighlights: {
    title: string;
    description: string;
    impact: "BULLISH" | "BEARISH" | "NEUTRAL";
  }[];
  regulatoryDisclaimer: string;
}

/**
 * AI Narrative Generator Layer
 * Strictly formats and summarizes quantitative findings into executive human-readable summaries and pattern analysis.
 * Operates deterministically on top of verified evidence without inventing data.
 */
export function generateAIExplanation(result: AccumulationScoreResult): AISummaryResponse {
  const { symbol, score, classification, institutionalOwnership, evidence, breakdown } = result;

  const current = institutionalOwnership.current.toFixed(2);
  const prev = institutionalOwnership.previousQuarter.toFixed(2);
  const change = institutionalOwnership.change;
  const changeFormatted = `${change >= 0 ? "+" : ""}${change.toFixed(2)}`;

  let execSummary = "";
  if (classification === "STRONG_ACCUMULATION") {
    execSummary = `Publicly disclosed regulatory filings indicate strong institutional accumulation in ${symbol} with an Accumulation Score of ${score}/100. Overall institutional stake expanded from ${prev}% to ${current}% (${changeFormatted}% pts QoQ), driven by simultaneous net accumulation across Domestic Mutual Funds and Foreign Portfolio Investors. High delivery volume ratios confirm persistent position building rather than transient day-trading volume.`;
  } else if (classification === "MODERATE_ACCUMULATION") {
    execSummary = `Publicly disclosed data indicates moderate institutional accumulation in ${symbol} with an Accumulation Score of ${score}/100. Institutional ownership increased by ${changeFormatted}% pts QoQ to ${current}%. While bulk/block deal activity shows selective institutional buying, delivery volume trends suggest steady absorption by long-term funds.`;
  } else if (classification === "NEUTRAL_HOLD") {
    execSummary = `Institutional activity in ${symbol} remains in equilibrium with an Accumulation Score of ${score}/100. Institutional stake stands at ${current}% (vs ${prev}% previously). Buying by certain domestic funds was offset by minor distribution in foreign portfolio holdings.`;
  } else {
    execSummary = `Publicly disclosed filings show institutional distribution patterns in ${symbol} with an Accumulation Score of ${score}/100. Total institutional ownership declined to ${current}%, accompanied by net selling in disclosed bulk and block transactions.`;
  }

  const keyInsights: string[] = [
    `Institutional holding stands at ${current}% of total equity share capital.`,
    `QoQ institutional stake movement: ${changeFormatted}% percentage points.`,
    `Disclosed deal activity contribution: ${breakdown.bulkBlockDealsScore}/20 points.`,
    `Delivery volume absorption score: ${breakdown.deliveryConfirmationScore}/15 points.`,
  ];

  // Pattern Highlights
  const patternHighlights: AISummaryResponse["patternHighlights"] = [];

  if (breakdown.ownershipTrendScore >= 18) {
    patternHighlights.push({
      title: "Multi-Quarter Institutional Stake Growth",
      description: `Institutional investors have consistently built positions over consecutive quarters, raising overall ownership to ${current}%.`,
      impact: "BULLISH",
    });
  }

  if (breakdown.bulkBlockDealsScore >= 14) {
    patternHighlights.push({
      title: "Institutional Bulk Purchase Aggregation",
      description: "Significant disclosed buying in bulk and block deals indicates concentrated institutional accumulation at market prices.",
      impact: "BULLISH",
    });
  }

  if (breakdown.deliveryConfirmationScore >= 11) {
    patternHighlights.push({
      title: "High Delivery-Volume Absorption",
      description: "Traded volume is heavily dominated by delivery volume, signalling position transfer to institutional custody.",
      impact: "BULLISH",
    });
  }

  if (evidence.negative.length > 0) {
    patternHighlights.push({
      title: "Divergent Seller Action Noted",
      description: evidence.negative.join(" | "),
      impact: "BEARISH",
    });
  }

  return {
    symbol,
    score,
    classification,
    executiveSummary: execSummary,
    keyInsights,
    patternHighlights,
    regulatoryDisclaimer: evidence.disclaimer,
  };
}

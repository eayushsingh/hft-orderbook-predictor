import { normalizeInstitutionName } from "../src/lib/institutional/normalization/institutionNormalizer";
import { InstitutionalRepository } from "../src/lib/institutional/repository/institutionalRepository";

function runTests() {
  console.log("==========================================");
  console.log("RUNNING INSTITUTIONAL ENGINE TEST SUITE");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, title: string) {
    if (condition) {
      console.log(`[PASS] ${title}`);
      passed++;
    } else {
      console.error(`[FAIL] ${title}`);
      failed++;
    }
  }

  // 1. Normalization Tests
  const hdfcNorm = normalizeInstitutionName("HDFC MF");
  assert(hdfcNorm.normalizedName === "HDFC Mutual Fund", "Normalizes 'HDFC MF' to 'HDFC Mutual Fund'");
  assert(hdfcNorm.category === "MUTUAL_FUND", "Assigns 'MUTUAL_FUND' category to HDFC MF");

  const vanguardNorm = normalizeInstitutionName("Vanguard Emerging Markets Stock Index Fund");
  assert(vanguardNorm.normalizedName === "Vanguard Group", "Normalizes Vanguard variations to 'Vanguard Group'");
  assert(vanguardNorm.category === "FII_FPI", "Assigns 'FII_FPI' category to Vanguard");

  const licNorm = normalizeInstitutionName("Life Insurance Corporation of India");
  assert(licNorm.normalizedName === "Life Insurance Corporation of India (LIC)", "Normalizes LIC");
  assert(licNorm.category === "INSURANCE", "Assigns 'INSURANCE' category to LIC");

  // 2. Scoring Tests
  const repo = new InstitutionalRepository();
  const relActivity = repo.getInstitutionalActivity("RELIANCE");
  assert(relActivity !== null, "Fetches institutional activity for RELIANCE");
  assert(relActivity?.score !== undefined && relActivity.score >= 0 && relActivity.score <= 100, "Accumulation Score is within 0-100");
  assert(relActivity?.classification === "STRONG_ACCUMULATION", "Classifies RELIANCE as STRONG_ACCUMULATION");
  assert(relActivity?.confidence === "HIGH", "Determines HIGH confidence level for fresh data");
  assert((relActivity?.evidence.positive.length ?? 0) > 0, "Generates positive evidence array");
  assert(relActivity?.signals.length === 9, "Computes all 9 granular signals across 7 scoring modules");

  // 3. AI Explanation Engine Tests
  const aiSummary = repo.getAISummary("RELIANCE");
  assert(aiSummary !== null, "Generates AI Explanation summary for RELIANCE");
  assert(Boolean(aiSummary?.executiveSummary.includes("Publicly disclosed")), "Executive summary contains required regulatory phrasing");
  assert((aiSummary?.keyInsights.length ?? 0) > 0, "Key insights generated correctly");

  console.log("==========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) process.exit(1);
}

runTests();

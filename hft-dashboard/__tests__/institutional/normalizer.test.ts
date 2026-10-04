import { normalizeInstitutionName } from "../../src/lib/institutional/normalization/institutionNormalizer";

describe("Institution Normalization Engine Tests", () => {
  test("Normalizes HDFC Mutual Fund variations correctly", () => {
    const v1 = normalizeInstitutionName("HDFC Mutual Fund");
    const v2 = normalizeInstitutionName("HDFC MF");
    const v3 = normalizeInstitutionName("HDFC Asset Management Company");

    expect(v1.normalizedName).toBe("HDFC Mutual Fund");
    expect(v2.normalizedName).toBe("HDFC Mutual Fund");
    expect(v3.normalizedName).toBe("HDFC Mutual Fund");

    expect(v1.category).toBe("MUTUAL_FUND");
    expect(v2.category).toBe("MUTUAL_FUND");
    expect(v3.category).toBe("MUTUAL_FUND");
  });

  test("Normalizes SBI Mutual Fund variations correctly", () => {
    const v1 = normalizeInstitutionName("SBI Mutual Fund");
    const v2 = normalizeInstitutionName("SBIMUTUALFUND");
    const v3 = normalizeInstitutionName("SBI MF");

    expect(v1.normalizedName).toBe("SBI Mutual Fund");
    expect(v2.normalizedName).toBe("SBI Mutual Fund");
    expect(v3.normalizedName).toBe("SBI Mutual Fund");
    expect(v1.category).toBe("MUTUAL_FUND");
  });

  test("Normalizes International FPIs and Pension Funds", () => {
    const v1 = normalizeInstitutionName("Vanguard Emerging Markets Stock Index Fund");
    const v2 = normalizeInstitutionName("Government Pension Fund Global");
    const v3 = normalizeInstitutionName("BlackRock Fund Advisors");

    expect(v1.normalizedName).toBe("Vanguard Group");
    expect(v1.category).toBe("FII_FPI");

    expect(v2.normalizedName).toBe("Government Pension Fund Global (Norges Bank)");
    expect(v2.category).toBe("FII_FPI");

    expect(v3.normalizedName).toBe("BlackRock Fund Advisors");
    expect(v3.category).toBe("FII_FPI");
  });

  test("Normalizes Insurance Companies", () => {
    const lic = normalizeInstitutionName("Life Insurance Corporation of India");
    expect(lic.normalizedName).toBe("Life Insurance Corporation of India (LIC)");
    expect(lic.category).toBe("INSURANCE");
  });
});

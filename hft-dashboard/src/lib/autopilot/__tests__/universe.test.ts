import { describe, it, expect } from "vitest";
import { UniverseService, NIFTY_50_CONSTITUENTS } from "../universe/nifty50Universe";

describe("Nifty 50 Universe Master & Safety Validator", () => {
  it("should contain exactly 50 active constituents", () => {
    expect(NIFTY_50_CONSTITUENTS.length).toBe(50);
    expect(UniverseService.getUniverseCount()).toBe(50);
  });

  it("should have valid ISIN, tokens, and weightage for every constituent", () => {
    const constituents = UniverseService.getAllConstituents();
    for (const c of constituents) {
      expect(c.symbol).toBeTruthy();
      expect(c.isin).toMatch(/^INE[A-Z0-9]{9}$/);
      expect(c.weightagePct).toBeGreaterThan(0);
      expect(c.angelOneToken).toBeTruthy();
      expect(c.zerodhaToken).toBeTruthy();
      expect(c.lotSize).toBe(1);
      expect(c.isActive).toBe(true);
    }
  });

  it("should verify valid Nifty 50 cash equities", () => {
    expect(UniverseService.isEligible("RELIANCE")).toBe(true);
    expect(UniverseService.isEligible("HDFCBANK")).toBe(true);
    expect(UniverseService.isEligible("TCS")).toBe(true);
    expect(UniverseService.isEligible("INFY")).toBe(true);
    expect(UniverseService.isEligible("reliance")).toBe(true); // Case-insensitive
  });

  it("should strictly reject non-Nifty stocks, derivatives, and crypto", () => {
    // Prohibited asset classes
    expect(UniverseService.isEligible("BANKNIFTY")).toBe(false);
    expect(UniverseService.isEligible("NIFTY24OCTFUT")).toBe(false);
    expect(UniverseService.isEligible("NIFTY25000CE")).toBe(false);
    expect(UniverseService.isEligible("NIFTY24000PE")).toBe(false);
    expect(UniverseService.isEligible("BTC/USDT")).toBe(false);
    expect(UniverseService.isEligible("ETH")).toBe(false);
    expect(UniverseService.isEligible("SUZLON")).toBe(false);
    expect(UniverseService.isEligible("YESBANK")).toBe(false);
    expect(UniverseService.isEligible("")).toBe(false);
  });

  it("should provide descriptive safety validation error reasons", () => {
    const valDeriv = UniverseService.validateUniverseSafety("NIFTY24OCT25000CE");
    expect(valDeriv.eligible).toBe(false);
    expect(valDeriv.reason).toContain("Derivatives");

    const valCrypto = UniverseService.validateUniverseSafety("BTC/USDT");
    expect(valCrypto.eligible).toBe(false);
    expect(valCrypto.reason).toContain("Crypto");

    const valNonNifty = UniverseService.validateUniverseSafety("ZOMATO");
    expect(valNonNifty.eligible).toBe(false);
    expect(valNonNifty.reason).toContain("not in the verified NSE Nifty 50");

    const valValid = UniverseService.validateUniverseSafety("ICICIBANK");
    expect(valValid.eligible).toBe(true);
    expect(valValid.reason).toBeUndefined();
  });
});

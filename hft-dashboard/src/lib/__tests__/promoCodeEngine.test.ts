import { describe, it, expect } from "vitest";
import {
  validatePromoCode,
  validateAndApplyPromoCode,
} from "../subscription/promoCodeEngine";

/**
 * Humanized Explanation for Maintainers:
 * Unit tests verifying coupon code engine, percentage calculation, tier gating,
 * and formula accuracy for launch discount coupons (QUANT20, HFTVIP, ALPHA100, GSTFREE).
 */
describe("Promo Code Engine", () => {
  it("should validate active QUANT20 coupon code correctly", () => {
    const res = validatePromoCode("QUANT20");
    expect(res.valid).toBe(true);
    expect(res.discountPercent).toBe(20);
    expect(res.code).toBe("QUANT20");
  });

  it("should handle case-insensitive and padded coupon inputs", () => {
    const res = validatePromoCode("  quant20  ");
    expect(res.valid).toBe(true);
    expect(res.code).toBe("QUANT20");
  });

  it("should reject non-existent or invalid coupon codes", () => {
    const res = validatePromoCode("INVALID_COUPON_999");
    expect(res.valid).toBe(false);
    expect(res.discountPercent).toBe(0);
    expect(res.error).toBeDefined();
  });

  it("should calculate 20% discount correctly for Pro Quant tier", () => {
    const calc = validateAndApplyPromoCode("QUANT20", 1000, "pro");
    expect(calc.isValid).toBe(true);
    expect(calc.originalPrice).toBe(1000);
    expect(calc.discountAmount).toBe(200);
    expect(calc.finalPrice).toBe(800);
  });

  it("should enforce tier restrictions on HFTVIP coupon", () => {
    const calcPro = validateAndApplyPromoCode("HFTVIP", 1000, "pro");
    expect(calcPro.isValid).toBe(false);

    const calcInst = validateAndApplyPromoCode("HFTVIP", 5000, "institutional");
    expect(calcInst.isValid).toBe(true);
    expect(calcInst.discountAmount).toBe(1500);
    expect(calcInst.finalPrice).toBe(3500);
  });

  it("should grant 100% discount for ALPHA100 promotional coupon", () => {
    const calc = validateAndApplyPromoCode("ALPHA100", 4999, "institutional");
    expect(calc.isValid).toBe(true);
    expect(calc.discountAmount).toBe(4999);
    expect(calc.finalPrice).toBe(0);
  });
});

/**
 * LALAN HFT Subscription Promo Code & Coupon Engine
 * 
 * Humanized Explanation for Maintainers:
 * Manages promotional discount codes during subscription checkout:
 * - `QUANT20`: 20% off any paid subscription
 * - `HFTVIP`: 30% off Institutional HFT annual plan
 * - `ALPHA100`: 100% discount launch coupon
 * - `GSTFREE`: 18% equivalent tax relief discount
 */

export interface PromoCode {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number; // e.g. 20 for 20% or 200 for ₹200
  applicablePlans?: string[]; // All plans if empty
  minAmountINR?: number;
  description: string;
  expiresAt?: string;
}

export const ACTIVE_PROMO_CODES: Record<string, PromoCode> = {
  QUANT20: {
    code: "QUANT20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    description: "20% Launch Special Discount on all Pro & Institutional plans",
  },
  HFTVIP: {
    code: "HFTVIP",
    discountType: "PERCENTAGE",
    discountValue: 30,
    applicablePlans: ["institutional"],
    description: "30% VIP Quant Discount on Institutional HFT Tier",
  },
  ALPHA100: {
    code: "ALPHA100",
    discountType: "PERCENTAGE",
    discountValue: 100,
    description: "100% Full Access Promotional Pass",
  },
  GSTFREE: {
    code: "GSTFREE",
    discountType: "PERCENTAGE",
    discountValue: 18,
    description: "18% GST Tax Relief Discount",
  },
};

export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discountPercent: number;
  description: string;
  error?: string;
}

export function validatePromoCode(rawCode: string, planId?: string): PromoValidationResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, code: "", discountPercent: 0, description: "", error: "Code cannot be empty" };

  const promo = ACTIVE_PROMO_CODES[code];
  if (!promo) return { valid: false, code, discountPercent: 0, description: "", error: `Coupon '${code}' is invalid or expired` };

  if (planId && promo.applicablePlans && !promo.applicablePlans.includes(planId)) {
    return { valid: false, code, discountPercent: 0, description: "", error: `Coupon '${code}' is not valid for plan ${planId}` };
  }

  return {
    valid: true,
    code,
    discountPercent: promo.discountType === "PERCENTAGE" ? promo.discountValue : 0,
    description: promo.description,
  };
}

export interface PromoCalculationResult {
  isValid: boolean;
  code: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  message: string;
}

export function validateAndApplyPromoCode(
  rawCode: string,
  price: number,
  planId: string
): PromoCalculationResult {
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return {
      isValid: false,
      code: "",
      originalPrice: price,
      discountAmount: 0,
      finalPrice: price,
      message: "Please enter a valid coupon code.",
    };
  }

  const promo = ACTIVE_PROMO_CODES[code];

  if (!promo) {
    return {
      isValid: false,
      code,
      originalPrice: price,
      discountAmount: 0,
      finalPrice: price,
      message: `Coupon code '${code}' is invalid or expired.`,
    };
  }

  if (promo.applicablePlans && !promo.applicablePlans.includes(planId)) {
    return {
      isValid: false,
      code,
      originalPrice: price,
      discountAmount: 0,
      finalPrice: price,
      message: `Coupon '${code}' is only applicable for ${promo.applicablePlans.join(", ").toUpperCase()} tier.`,
    };
  }

  let discountAmount = 0;
  if (promo.discountType === "PERCENTAGE") {
    discountAmount = (price * promo.discountValue) / 100;
  } else {
    discountAmount = Math.min(price, promo.discountValue);
  }

  discountAmount = Math.round(discountAmount * 100) / 100;
  const finalPrice = Math.max(0, Math.round((price - discountAmount) * 100) / 100);

  return {
    isValid: true,
    code,
    originalPrice: price,
    discountAmount,
    finalPrice,
    message: `🎉 Coupon '${code}' applied! You saved ${promo.discountType === "PERCENTAGE" ? `${promo.discountValue}%` : `₹${promo.discountValue}`}.`,
  };
}

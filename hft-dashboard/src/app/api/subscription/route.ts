import { NextResponse } from "next/server";
import { validateAndApplyPromoCode, validatePromoCode } from "@/lib/subscription/promoCodeEngine";
import { calculateGST, validateGSTIN } from "@/lib/subscription/invoiceGenerator";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    launchSpecial: {
      freeTrialAvailable: true,
      trialDurationDays: 14,
      message: "Launch Special: 14-Day Free Unlimited Trial Enabled for All New Accounts.",
    },
    pricingPlans: [
      { id: "retail", name: "Retail Trader", priceINR: 0, trialDays: 0 },
      { id: "pro", name: "Pro Quant Trader", priceINR: 999, trialDays: 14 },
      { id: "institutional", name: "Institutional HFT", priceINR: 4999, trialDays: 14 },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, planId, durationDays = 14, paymentMethod, amount, currency, promoCode, gstin } = body;

    // Validate Coupon / Promo Code endpoint
    if (action === "validate-promo") {
      const res = validatePromoCode(promoCode || "", planId);
      return NextResponse.json({
        success: res.valid,
        code: res.code,
        discountPercent: res.discountPercent,
        description: res.description,
        error: res.error,
      });
    }

    // Start 14-Day Free Trial
    if (action === "start-trial") {
      const trialStartDate = new Date();
      const trialEndDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

      return NextResponse.json({
        success: true,
        action: "start-trial",
        planId,
        isTrialActive: true,
        trialStartDate: trialStartDate.toISOString(),
        trialEndDate: trialEndDate.toISOString(),
        message: `14-Day Free Trial activated for ${planId.toUpperCase()} tier!`,
      });
    }

    // Razorpay / UPI Mock Order Initializer
    if (action === "create-order") {
      const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      const gstBreakdown = calculateGST(amount || 999);

      return NextResponse.json({
        success: true,
        orderId,
        amount: amount || 999,
        currency: currency || "INR",
        gstBreakdown,
        key: "rzp_test_lalan_hft_quant_2026",
      });
    }

    // Paid Upgrade Confirmation
    if (action === "upgrade") {
      let validGSTIN: string | undefined = undefined;
      if (gstin && validateGSTIN(gstin)) {
        validGSTIN = gstin.trim().toUpperCase();
      }

      let finalPrice = amount || 999;
      if (promoCode) {
        const promoRes = validateAndApplyPromoCode(promoCode, finalPrice, planId || "pro");
        if (promoRes.isValid) {
          finalPrice = promoRes.finalPrice;
        }
      }

      const invoiceNum = `INV-LHFT-${Date.now().toString(36).toUpperCase()}`;
      const gstBreakdown = calculateGST(finalPrice);

      return NextResponse.json({
        success: true,
        action: "upgrade",
        planId,
        isTrialActive: false,
        paymentMethod: paymentMethod || "card",
        amountPaid: finalPrice,
        currency: currency || "INR",
        invoiceNumber: invoiceNum,
        gstin: validGSTIN,
        gstBreakdown,
        message: `Successfully upgraded to ${planId.toUpperCase()}!`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid subscription action" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process subscription request" },
      { status: 500 }
    );
  }
}


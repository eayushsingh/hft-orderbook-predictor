import { NextResponse } from "next/server";

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
    const { action, planId, durationDays = 14, paymentMethod, amount, currency } = body;

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

    if (action === "upgrade") {
      return NextResponse.json({
        success: true,
        action: "upgrade",
        planId,
        isTrialActive: false,
        paymentMethod: paymentMethod || "card",
        amount,
        currency,
        message: `Successfully upgraded to ${planId.toUpperCase()}!`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid subscription action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process subscription request" },
      { status: 500 }
    );
  }
}

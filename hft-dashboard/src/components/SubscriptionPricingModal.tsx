"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Crown,
  X,
  ArrowRight,
  CheckCircle2,
  Gift,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Tag,
  FileText,
  Download,
} from "lucide-react";
import { useSubscription, SubscriptionPlanId } from "@/context/SubscriptionContext";
import { printOrDownloadInvoice, calculateGST, validateGSTIN, InvoiceDetails } from "@/lib/subscription/invoiceGenerator";
import { validatePromoCode } from "@/lib/subscription/promoCodeEngine";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  badge?: string;
  popular?: boolean;
  monthlyPriceINR: number;
  annualPriceINR: number;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  description: string;
  features: string[];
  cta: string;
  trialCta: string;
  color: string;
  borderColor: string;
}

export const PRICING_PLANS: SubscriptionPlan[] = [
  {
    id: "retail",
    name: "Retail Trader",
    monthlyPriceINR: 0,
    annualPriceINR: 0,
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    description: "Essential market depth & L1 order book analysis for retail Indian traders.",
    features: [
      "L1 Order Book Depth (5 levels)",
      "Binance Live Tick Stream",
      "Basic Order Book Imbalance (OBI)",
      "Single Watchlist (10 instruments)",
      "Community Discord Support",
    ],
    cta: "Current Free Plan",
    trialCta: "Current Free Plan",
    color: "text-zinc-300",
    borderColor: "border-[#262634]",
  },
  {
    id: "pro",
    name: "Pro Quant Trader",
    popular: true,
    badge: "14-DAY FREE TRIAL AVAILABLE",
    monthlyPriceINR: 999,
    annualPriceINR: 799,
    monthlyPriceUSD: 14,
    annualPriceUSD: 11,
    description: "Sub-millisecond L2 depth, LALAN HFT feeds, and AI microstructure signals.",
    features: [
      "Sub-millisecond L2 Depth Stream",
      "NSE/BSE L2 Direct Feed & DhanHQ API",
      "AI Microstructure Directional Signals",
      "Multi-Broker Liquidity Matrix (Dhan, Groww, Angel)",
      "Unlimited Watchlists & Custom Alerts",
      "Simulated Order Execution Engine (MIS / CNC)",
      "Priority Email & Telegram Alpha Channel",
    ],
    cta: "Upgrade to Pro Quant",
    trialCta: "Start 14-Day Free Trial",
    color: "text-[#387ed1]",
    borderColor: "border-[#387ed1]",
  },
  {
    id: "institutional",
    name: "Institutional HFT",
    badge: "ZERO-GC ENGINE • FREE TRIAL",
    monthlyPriceINR: 4999,
    annualPriceINR: 3999,
    monthlyPriceUSD: 65,
    annualPriceUSD: 52,
    description: "Zero-allocation LMAX Disruptor pipeline for ultra-low latency quant teams.",
    features: [
      "Lock-Free LMAX Disruptor Ring-Buffer Pipeline",
      "Zero Java GC Pause Memory Architecture",
      "O(1) Order Matching & Micro-Price Drift Telemetry",
      "API Access for Custom Python & C++ HFT Execution",
      "NSE / BSE Co-Location Standby Gateway",
      "Full Microstructure Analytics & Historical Replay",
      "1-on-1 Dedicated Quant Engineer Support",
    ],
    cta: "Upgrade to Institutional",
    trialCta: "Start 14-Day Institutional Trial",
    color: "text-[#10b981]",
    borderColor: "border-[#10b981]",
  },
];

interface SubscriptionPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId?: string;
  onSelectPlan?: (planId: string) => void;
}

export default function SubscriptionPricingModal({
  isOpen,
  onClose,
  onSelectPlan,
}: SubscriptionPricingModalProps) {
  const {
    activePlanId,
    isTrialActive,
    daysRemainingInTrial,
    startFreeTrial,
    upgradePlan,
  } = useSubscription();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [isTrialCheckout, setIsTrialCheckout] = useState<boolean>(true);
  const [paymentStep, setPaymentStep] = useState<"select" | "checkout" | "success">("select");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string>("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number; msg: string } | null>(null);
  const [gstinInput, setGstinInput] = useState("");
  const [gstinError, setGstinError] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = validatePromoCode(promoInput, checkoutPlan?.id);
    if (res.valid) {
      setAppliedPromo({ code: res.code, percent: res.discountPercent, msg: res.description });
    } else {
      setAppliedPromo({ code: "", percent: 0, msg: res.error || "Invalid code" });
    }
  };

  const handleStartCheckout = (plan: SubscriptionPlan, isTrial = true) => {
    if (plan.id === activePlanId && !isTrialActive) return;
    setCheckoutPlan(plan);
    setIsTrialCheckout(isTrial);
    setPaymentStep("checkout");
  };

  const handleConfirmAction = async () => {
    if (!checkoutPlan) return;

    if (gstinInput.trim() && !validateGSTIN(gstinInput)) {
      setGstinError("Invalid GSTIN format (e.g. 27AABCL8899Z1Z5)");
      return;
    }
    setGstinError("");
    setIsProcessing(true);

    if (isTrialCheckout && checkoutPlan.id !== "retail") {
      const res = await startFreeTrial(checkoutPlan.id, 14);
      setIsProcessing(false);
      if (res.success) {
        setActionMessage(res.message);
        setPaymentStep("success");
        if (onSelectPlan) onSelectPlan(checkoutPlan.id);
      }
    } else {
      let price =
        currency === "INR"
          ? billingCycle === "annual"
            ? checkoutPlan.annualPriceINR
            : checkoutPlan.monthlyPriceINR
          : billingCycle === "annual"
          ? checkoutPlan.annualPriceUSD
          : checkoutPlan.monthlyPriceUSD;

      if (appliedPromo && appliedPromo.percent > 0) {
        price = Math.round(price * (1 - appliedPromo.percent / 100));
      }

      const invNum = `INV-LHFT-${Date.now().toString(36).toUpperCase()}`;
      const gstDetails = calculateGST(price);
      
      const inv: InvoiceDetails = {
        invoiceNumber: invNum,
        invoiceDate: new Date().toLocaleDateString("en-IN"),
        planName: checkoutPlan.name,
        customerName: "Valued Quant Trader",
        customerEmail: "trader@lalan-quant.com",
        customerGSTIN: gstinInput.trim() || undefined,
        paymentMethod: paymentMethod.toUpperCase(),
        currency: currency,
        amountPaid: price,
        gstBreakdown: gstDetails,
      };
      setInvoiceDetails(inv);

      const res = await upgradePlan(
        checkoutPlan.id,
        paymentMethod,
        price,
        currency,
        appliedPromo?.code || undefined,
        gstinInput.trim() || undefined
      );
      setIsProcessing(false);
      if (res.success) {
        setActionMessage(res.message);
        setPaymentStep("success");
        if (onSelectPlan) onSelectPlan(checkoutPlan.id);
      }
    }
  };

  const resetAndClose = () => {
    setPaymentStep("select");
    setCheckoutPlan(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl rounded-2xl bg-[#14141a] border border-[#282836] shadow-2xl overflow-hidden my-auto text-[#e0e0e0]"
        >
          {/* ── HEADER ── */}
          <div className="p-5 border-b border-[#262634] bg-[#0f0f14] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/30">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
                  LALAN HFT Subscription Tiers
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold uppercase flex items-center gap-1">
                    <Gift className="h-3 w-3" /> 14-Day Free Trial Launch Offer
                  </span>
                </h2>
                <p className="text-xs text-[#747888] font-mono mt-0.5">
                  Start for free today without upfront payment or credit card commitments.
                </p>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="p-1.5 rounded-lg text-[#747888] hover:text-white hover:bg-[#1f1f28] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── ACTIVE TRIAL STATUS BANNER ── */}
          {isTrialActive && (
            <div className="bg-gradient-to-r from-[#387ed1]/20 via-[#10b981]/20 to-[#387ed1]/20 border-b border-[#387ed1]/30 px-5 py-2.5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2 text-white">
                <Clock className="h-4 w-4 text-[#10b981] animate-pulse" />
                <span>
                  <strong>Active Trial:</strong> You currently have full access to{" "}
                  <strong className="text-[#10b981] uppercase">{activePlanId}</strong> tier.
                </span>
              </div>
              <span className="bg-[#10b981] text-black font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                {daysRemainingInTrial} DAYS REMAINING
              </span>
            </div>
          )}

          {/* ── STEP 1: PLAN SELECTION ── */}
          {paymentStep === "select" && (
            <div className="p-5 sm:p-8 space-y-6">
              {/* Billing Cycle & Currency Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e0e13] p-3 rounded-xl border border-[#242432]">
                {/* Billing Cycle Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#747888] font-mono font-bold">Billing Cycle:</span>
                  <div className="flex items-center space-x-1 bg-[#181822] p-1 rounded-lg border border-[#282838]">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                        billingCycle === "monthly"
                          ? "bg-[#387ed1] text-white shadow"
                          : "text-[#747888] hover:text-white"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                        billingCycle === "annual"
                          ? "bg-[#387ed1] text-white shadow"
                          : "text-[#747888] hover:text-white"
                      }`}
                    >
                      <span>Annual</span>
                      <span className="bg-[#10b981] text-black text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                        20% OFF
                      </span>
                    </button>
                  </div>
                </div>

                {/* Currency Switcher */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#747888] font-mono font-bold">Currency:</span>
                  <div className="flex items-center space-x-1 bg-[#181822] p-1 rounded-lg border border-[#282838]">
                    <button
                      onClick={() => setCurrency("INR")}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                        currency === "INR"
                          ? "bg-[#ff5722] text-white shadow"
                          : "text-[#747888] hover:text-white"
                      }`}
                    >
                      ₹ INR
                    </button>
                    <button
                      onClick={() => setCurrency("USD")}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                        currency === "USD"
                          ? "bg-[#ff5722] text-white shadow"
                          : "text-[#747888] hover:text-white"
                      }`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRICING_PLANS.map((plan) => {
                  const isCurrent = activePlanId === plan.id;
                  const price =
                    currency === "INR"
                      ? billingCycle === "annual"
                        ? plan.annualPriceINR
                        : plan.monthlyPriceINR
                      : billingCycle === "annual"
                      ? plan.annualPriceUSD
                      : plan.monthlyPriceUSD;

                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col justify-between rounded-2xl p-5 bg-[#101016] border transition-all ${
                        plan.popular
                          ? "border-[#387ed1] shadow-xl shadow-[#387ed1]/10 bg-[#12121c]"
                          : "border-[#242432] hover:border-[#387ed1]/40"
                      }`}
                    >
                      {/* Badge */}
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#387ed1] text-white font-mono font-extrabold text-[9px] uppercase px-3 py-0.5 rounded-full shadow border border-white/20 whitespace-nowrap">
                          {plan.badge}
                        </div>
                      )}

                      <div>
                        {/* Title & Price */}
                        <div className="border-b border-[#22222f] pb-4 mb-4">
                          <h3 className={`text-lg font-bold font-mono ${plan.color}`}>
                            {plan.name}
                          </h3>
                          <p className="text-[11px] text-[#747888] mt-1 min-h-[32px]">
                            {plan.description}
                          </p>

                          <div className="mt-4 flex items-baseline space-x-1 font-mono">
                            <span className="text-3xl font-black text-white">
                              {price === 0
                                ? "Free"
                                : currency === "INR"
                                ? `₹${price.toLocaleString("en-IN")}`
                                : `$${price}`}
                            </span>
                            {price > 0 && (
                              <span className="text-xs text-[#747888]">/ month</span>
                            )}
                          </div>
                          {price > 0 && (
                            <p className="text-[10px] text-[#10b981] font-mono mt-1 font-semibold">
                              ✨ 14-Day Free Trial ($0 today)
                            </p>
                          )}
                        </div>

                        {/* Features List */}
                        <div className="space-y-2 mb-6">
                          <p className="text-[10px] font-mono uppercase font-bold text-[#747888]">
                            Included Features:
                          </p>
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs text-[#b0b3c0]">
                              <Check className="h-3.5 w-3.5 text-[#10b981] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {plan.id !== "retail" && (
                          <button
                            onClick={() => handleStartCheckout(plan, true)}
                            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#0da673] hover:to-[#047857] text-black font-extrabold flex items-center justify-center space-x-1.5"
                          >
                            <Gift className="h-4 w-4 text-black" />
                            <span>{isCurrent && isTrialActive ? `Trial Active (${daysRemainingInTrial}d left)` : plan.trialCta}</span>
                          </button>
                        )}

                        {plan.id === "retail" ? (
                          <button
                            disabled={isCurrent}
                            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-[#242432] text-[#747888]"
                          >
                            {isCurrent ? "Active Current Plan" : "Switch to Free Retail"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartCheckout(plan, false)}
                            className="w-full py-2 rounded-xl font-mono text-[11px] font-semibold text-[#747888] hover:text-white hover:bg-[#1a1a24] transition-all border border-[#242432]"
                          >
                            Buy Subscription Directly
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: CHECKOUT / TRIAL ACTIVATION MODAL ── */}
          {paymentStep === "checkout" && checkoutPlan && (
            <div className="p-5 sm:p-8 space-y-5">
              <div className="bg-[#0e0e13] p-4 rounded-xl border border-[#242432] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#747888]">
                    {isTrialCheckout ? "Free Trial Activation" : "Selected Subscription"}
                  </span>
                  <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    {checkoutPlan.name}
                    {isTrialCheckout && (
                      <span className="text-xs bg-[#10b981]/20 text-[#10b981] px-2.5 py-0.5 rounded-full border border-[#10b981]/40 font-bold">
                        14 DAYS FREE
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#747888]">
                    {isTrialCheckout
                      ? "Zero upfront payment required. Full access enabled immediately."
                      : billingCycle === "annual"
                      ? "Annual Billing (20% Savings)"
                      : "Monthly Billing"}
                  </p>
                </div>

                <div className="text-right font-mono">
                  {isTrialCheckout ? (
                    <div>
                      <span className="text-2xl font-black text-[#10b981]">₹0 / $0</span>
                      <p className="text-[10px] text-[#747888]">For 14 Days</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-black text-[#10b981]">
                        {currency === "INR"
                          ? `₹${(billingCycle === "annual" ? checkoutPlan.annualPriceINR : checkoutPlan.monthlyPriceINR).toLocaleString("en-IN")}`
                          : `$${billingCycle === "annual" ? checkoutPlan.annualPriceUSD : checkoutPlan.monthlyPriceUSD}`}
                      </span>
                      <span className="text-xs text-[#747888]">/mo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trial Vs Paid Details */}
              {isTrialCheckout ? (
                <div className="p-5 rounded-2xl bg-[#0f0f16] border border-[#10b981]/30 space-y-4">
                  <div className="flex items-center space-x-3 text-[#10b981]">
                    <Sparkles className="h-6 w-6 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold font-mono text-white">
                        Production-Grade 14-Day Free Trial
                      </h4>
                      <p className="text-xs text-[#9a9db0] mt-0.5">
                        Experience institutional L2 order book streaming, OBI telemetry, and DhanHQ integration with zero credit card entry.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                    <div className="bg-[#161622] p-3 rounded-xl border border-[#262638] flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                      <span>No Credit Card Needed</span>
                    </div>
                    <div className="bg-[#161622] p-3 rounded-xl border border-[#262638] flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-[#387ed1]" />
                      <span>Sub-ms L2 Telemetry</span>
                    </div>
                    <div className="bg-[#161622] p-3 rounded-xl border border-[#262638] flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span>14 Days Access</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Payment Method Tabs for Paid Upgrade */
                <div className="space-y-3">
                  <label className="text-xs font-mono font-bold text-[#747888]">Select Payment Gateway:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded-xl border text-center font-mono text-xs font-bold transition-all ${
                        paymentMethod === "upi"
                          ? "bg-[#387ed1]/20 border-[#387ed1] text-white"
                          : "bg-[#101016] border-[#242432] text-[#747888]"
                      }`}
                    >
                      BHIM UPI / GPay
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-xl border text-center font-mono text-xs font-bold transition-all ${
                        paymentMethod === "card"
                          ? "bg-[#387ed1]/20 border-[#387ed1] text-white"
                          : "bg-[#101016] border-[#242432] text-[#747888]"
                      }`}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-3 rounded-xl border text-center font-mono text-xs font-bold transition-all ${
                        paymentMethod === "netbanking"
                          ? "bg-[#387ed1]/20 border-[#387ed1] text-white"
                          : "bg-[#101016] border-[#242432] text-[#747888]"
                      }`}
                    >
                      NetBanking (SBI/HDFC)
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0f0f14] border border-[#242432] space-y-3">
                    {paymentMethod === "upi" && (
                      <div>
                        <label className="text-[10px] text-[#747888] font-mono block mb-1">Enter VPA / UPI ID</label>
                        <input
                          type="text"
                          defaultValue="trader@upi"
                          className="w-full bg-[#181822] text-xs font-mono text-white p-2.5 rounded border border-[#282838] focus:outline-none focus:border-[#387ed1]"
                        />
                      </div>
                    )}
                    {paymentMethod === "card" && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Card Number (4532 •••• •••• 8899)"
                          defaultValue="4532 8901 2234 8899"
                          className="w-full bg-[#181822] text-xs font-mono text-white p-2.5 rounded border border-[#282838]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            defaultValue="11/28"
                            className="bg-[#181822] text-xs font-mono text-white p-2.5 rounded border border-[#282838]"
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            defaultValue="889"
                            className="bg-[#181822] text-xs font-mono text-white p-2.5 rounded border border-[#282838]"
                          />
                        </div>
                      </div>
                    )}
                    {paymentMethod === "netbanking" && (
                      <select className="w-full bg-[#181822] text-xs font-mono text-white p-2.5 rounded border border-[#282838]">
                        <option>HDFC Bank Direct Portal</option>
                        <option>ICICI Bank Retail Gateway</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank Netbanking</option>
                      </select>
                    )}

                    {/* Promo Code Input Box */}
                    <div className="pt-2 border-t border-[#242432]">
                      <label className="text-[10px] text-[#747888] font-mono block mb-1">Have a Promo / Coupon Code?</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. QUANT20, GSTFREE, ALPHA100"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 bg-[#181822] text-xs font-mono text-white p-2 rounded border border-[#282838] uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-3 py-2 bg-[#387ed1]/20 border border-[#387ed1] text-[#387ed1] font-mono text-xs font-bold rounded hover:bg-[#387ed1]/30"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedPromo && (
                        <p className={`text-[11px] font-mono mt-1 ${appliedPromo.percent > 0 ? "text-[#10b981]" : "text-red-400"}`}>
                          {appliedPromo.msg}
                        </p>
                      )}
                    </div>

                    {/* GSTIN Field (B2B Tax Credit) */}
                    <div className="pt-2 border-t border-[#242432]">
                      <label className="text-[10px] text-[#747888] font-mono block mb-1">Company GSTIN (Optional B2B Tax Invoice)</label>
                      <input
                        type="text"
                        placeholder="27AABCL8899Z1Z5"
                        value={gstinInput}
                        onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                        className="w-full bg-[#181822] text-xs font-mono text-white p-2 rounded border border-[#282838] uppercase"
                      />
                      {gstinError && <p className="text-[11px] font-mono text-red-400 mt-1">{gstinError}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Checkout Action Buttons */}
              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={() => setPaymentStep("select")}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#747888] hover:text-white"
                >
                  Back to Plans
                </button>

                <button
                  onClick={handleConfirmAction}
                  disabled={isProcessing}
                  className={`font-mono text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center space-x-2 ${
                    isTrialCheckout
                      ? "bg-[#10b981] hover:bg-[#0da673] text-black"
                      : "bg-[#387ed1] hover:bg-[#306ec0] text-white"
                  }`}
                >
                  {isProcessing ? (
                    <span>Activating Plan...</span>
                  ) : (
                    <>
                      <span>{isTrialCheckout ? "Activate 14-Day Free Trial" : "Pay & Activate Plan"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: SUCCESS CONFIRMATION ── */}
          {paymentStep === "success" && (
            <div className="p-8 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white">
                {isTrialCheckout ? "14-Day Free Trial Activated! 🎉" : "Subscription Activated!"}
              </h3>
              <p className="text-xs text-[#b0b3c0] max-w-md mx-auto leading-relaxed">
                {actionMessage ||
                  `Your account has been upgraded to ${checkoutPlan?.name}. Zero-GC LMAX Disruptor stream and direct LALAN HFT telemetry unlocked.`}
              </p>

              {invoiceDetails && (
                <div className="pt-2">
                  <button
                    onClick={() => printOrDownloadInvoice(invoiceDetails)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1b26] border border-[#387ed1] text-[#387ed1] hover:bg-[#387ed1] hover:text-white font-mono text-xs font-bold transition-all shadow"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download GST Tax Invoice</span>
                  </button>
                </div>
              )}

              <button
                onClick={resetAndClose}
                className="bg-[#387ed1] hover:bg-[#306ec0] text-white font-mono text-xs font-bold px-8 py-3 rounded-xl transition-all shadow-lg mt-2"
              >
                Return to Terminal
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

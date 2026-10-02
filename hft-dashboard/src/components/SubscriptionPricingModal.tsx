"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  ShieldCheck,
  Crown,
  Sparkles,
  X,
  CreditCard,
  Building2,
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Activity,
  Layers,
} from "lucide-react";

export interface SubscriptionPlan {
  id: string;
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
    color: "text-zinc-300",
    borderColor: "border-[#262634]",
  },
  {
    id: "pro",
    name: "Pro Quant Trader",
    popular: true,
    badge: "MOST POPULAR IN INDIA",
    monthlyPriceINR: 999,
    annualPriceINR: 799,
    monthlyPriceUSD: 14,
    annualPriceUSD: 11,
    description: "Sub-millisecond L2 depth, Kite & DhanHQ feeds, and AI microstructure signals.",
    features: [
      "Sub-millisecond L2 Depth Stream",
      "Zerodha Kite Connect & DhanHQ L2 Direct Feed",
      "AI Microstructure Directional Signals",
      "Multi-Broker Liquidity Matrix (Zerodha, Groww, Angel)",
      "Unlimited Watchlists & Custom Alerts",
      "Simulated Order Execution Engine (MIS / CNC)",
      "Priority Email & Telegram Alpha Channel",
    ],
    cta: "Upgrade to Pro Quant",
    color: "text-[#387ed1]",
    borderColor: "border-[#387ed1]",
  },
  {
    id: "institutional",
    name: "Institutional HFT",
    badge: "ZERO-GC ENGINE",
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
    cta: "Start Institutional Trial",
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
  currentPlanId = "pro",
  onSelectPlan,
}: SubscriptionPricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentStep, setPaymentStep] = useState<"select" | "checkout" | "success">("select");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStartCheckout = (plan: SubscriptionPlan) => {
    if (plan.id === currentPlanId && plan.id === "retail") return;
    setCheckoutPlan(plan);
    setPaymentStep("checkout");
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep("success");
      if (onSelectPlan && checkoutPlan) {
        onSelectPlan(checkoutPlan.id);
      }
    }, 1200);
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
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold uppercase">
                    INR &amp; USD Plans
                  </span>
                </h2>
                <p className="text-xs text-[#747888] font-mono mt-0.5">
                  Institutional market microstructure &amp; order book predictor engine for Indian quants.
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
                  const isCurrent = currentPlanId === plan.id;
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
                      {/* Popular Badge */}
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#387ed1] text-white font-mono font-extrabold text-[9px] uppercase px-3 py-0.5 rounded-full shadow border border-white/20">
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
                          {billingCycle === "annual" && price > 0 && (
                            <p className="text-[10px] text-[#10b981] font-mono mt-0.5">
                              Billed annually ({currency === "INR" ? `₹${(price * 12).toLocaleString("en-IN")}` : `$${price * 12}`}/yr)
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

                      {/* Action Button */}
                      <button
                        onClick={() => handleStartCheckout(plan)}
                        disabled={isCurrent && plan.id === "retail"}
                        className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95 ${
                          isCurrent
                            ? "bg-[#242432] text-[#10b981] border border-[#10b981]/40"
                            : plan.popular
                            ? "bg-[#387ed1] hover:bg-[#306ec0] text-white"
                            : "bg-[#1f1f2a] hover:bg-[#387ed1] text-white border border-[#2c2c3e]"
                        }`}
                      >
                        {isCurrent ? "Active Current Plan" : plan.cta}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: CHECKOUT MODAL ── */}
          {paymentStep === "checkout" && checkoutPlan && (
            <div className="p-5 sm:p-8 space-y-5">
              <div className="bg-[#0e0e13] p-4 rounded-xl border border-[#242432] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#747888]">Selected Plan</span>
                  <h3 className="text-xl font-bold font-mono text-white">{checkoutPlan.name}</h3>
                  <p className="text-xs text-[#747888]">{billingCycle === "annual" ? "Annual Billing (20% Savings)" : "Monthly Billing"}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-[#10b981]">
                    {currency === "INR"
                      ? `₹${(billingCycle === "annual" ? checkoutPlan.annualPriceINR : checkoutPlan.monthlyPriceINR).toLocaleString("en-IN")}`
                      : `$${billingCycle === "annual" ? checkoutPlan.annualPriceUSD : checkoutPlan.monthlyPriceUSD}`}
                  </span>
                  <span className="text-xs text-[#747888]">/mo</span>
                </div>
              </div>

              {/* Payment Method Tabs for India */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-[#747888]">Select Payment Gateway (India / Global):</label>
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

                {/* Simulated Payment Input */}
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
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={() => setPaymentStep("select")}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#747888] hover:text-white"
                >
                  Back to Plans
                </button>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="bg-[#10b981] hover:bg-[#0da673] text-black font-mono text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Authenticating Gateway...</span>
                  ) : (
                    <>
                      <span>Pay &amp; Activate Plan</span>
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
              <h3 className="text-2xl font-bold font-mono text-white">Subscription Activated!</h3>
              <p className="text-xs text-[#b0b3c0] max-w-md mx-auto">
                Your account has been upgraded to <strong className="text-white">{checkoutPlan?.name}</strong>. Zero-GC LMAX Disruptor stream and direct Kite Connect telemetry unlocked.
              </p>
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

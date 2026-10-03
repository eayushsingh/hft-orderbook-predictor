"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LalanSiteHeader from "@/components/LalanSiteHeader";
import LalanSiteFooter from "@/components/LalanSiteFooter";
import SubscriptionPricingModal, { PRICING_PLANS } from "@/components/SubscriptionPricingModal";
import { Check, ArrowRight, IndianRupee, Gift, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const { activePlanId, isTrialActive, daysRemainingInTrial } = useSubscription();

  return (
    <div className="min-h-screen bg-[#060609] text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col">
      <LalanSiteHeader />

      <main className="flex-1">
        {/* ── HERO BANNER WITH LAUNCH FREE TRIAL OFFER ── */}
        <section className="py-16 sm:py-20 px-4 sm:px-8 border-b border-[#181824] bg-gradient-to-b from-[#0a0a0f] via-[#0b0f19] to-[#060609] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] text-xs font-mono font-bold uppercase tracking-wider shadow-inner">
              <Gift className="h-4 w-4 text-[#10b981] animate-bounce" />
              Launch Special: 14-Day Free Unlimited Trial Enabled
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Transparent Pricing &amp; 14-Day Free Trial
            </h1>
            <p className="text-sm sm:text-lg text-[#8a8d9b] max-w-2xl mx-auto leading-relaxed">
              We are starting the site with <strong className="text-white">100% Free Access for 14 Days</strong>. Test institutional L2 depth, OBI signals, and DhanHQ integration with zero credit card entry.
            </p>

            <div className="pt-2 flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-[#10b981]">
                <ShieldCheck className="h-4 w-4" /> No Credit Card Required
              </span>
              <span className="text-[#262638]">•</span>
              <span className="flex items-center gap-1 text-[#387ed1]">
                <Sparkles className="h-4 w-4" /> Full Pro &amp; Institutional Features
              </span>
              <span className="text-[#262638]">•</span>
              <span className="flex items-center gap-1 text-purple-400">
                <Clock className="h-4 w-4" /> Instant 1-Click Activation
              </span>
            </div>
          </div>
        </section>

        {/* ── LALAN 3 HIGHLIGHT CARDS ── */}
        <section className="py-16 px-4 sm:px-8 max-w-[1100px] mx-auto border-b border-[#181824]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Card 1 */}
            <div className="bg-[#0f0f16] border border-[#1f1f2b] p-8 rounded-2xl space-y-4 shadow-xl">
              <div className="text-5xl font-black font-mono text-[#10b981]">₹0</div>
              <h3 className="text-lg font-bold text-white">Free equity delivery</h3>
              <p className="text-xs text-[#8a8d9b] leading-relaxed">
                All equity delivery investments (NSE, BSE) &amp; basic L1 depth are 100% free — ₹0 brokerage.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0f0f16] border-2 border-[#387ed1] p-8 rounded-2xl space-y-4 shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#387ed1] text-white text-[9px] font-mono font-bold px-3 py-0.5 rounded-full uppercase">
                Flat Pricing
              </div>
              <div className="text-5xl font-black font-mono text-[#387ed1]">₹20</div>
              <h3 className="text-lg font-bold text-white">Intraday &amp; F&amp;O trades</h3>
              <p className="text-xs text-[#8a8d9b] leading-relaxed">
                Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on F&amp;O options.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0f0f16] border border-[#1f1f2b] p-8 rounded-2xl space-y-4 shadow-xl">
              <div className="text-5xl font-black font-mono text-[#ff5722]">₹0</div>
              <h3 className="text-lg font-bold text-white">Free direct MF &amp; Telemetry</h3>
              <p className="text-xs text-[#8a8d9b] leading-relaxed">
                All direct mutual fund investments and live Order Book Imbalance (OBI) telemetry are 100% free — ₹0 commissions.
              </p>
            </div>
          </div>
        </section>

        {/* ── SUBSCRIPTION TIERS FOR QUANTS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1200px] mx-auto border-b border-[#181824]">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">
              Quantitative Subscription Tiers (14-Day Free Trial)
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Flexible Plans for Indian Algorithmic Traders
            </h2>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex items-center space-x-1 bg-[#12121c] p-1 rounded-xl border border-[#242434]">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#387ed1] text-white shadow"
                    : "text-[#747888] hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  billingCycle === "annual"
                    ? "bg-[#387ed1] text-white shadow"
                    : "text-[#747888] hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-[#10b981] text-black text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                  SAVE 20%
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-1 bg-[#12121c] p-1 rounded-xl border border-[#242434]">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  currency === "INR" ? "bg-[#ff5722] text-white shadow" : "text-[#747888] hover:text-white"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  currency === "USD" ? "bg-[#ff5722] text-white shadow" : "text-[#747888] hover:text-white"
                }`}
              >
                $ USD
              </button>
            </div>
          </div>

          {/* Plans Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => {
              const price =
                currency === "INR"
                  ? billingCycle === "annual"
                    ? plan.annualPriceINR
                    : plan.monthlyPriceINR
                  : billingCycle === "annual"
                  ? plan.annualPriceUSD
                  : plan.monthlyPriceUSD;

              const isCurrent = activePlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col justify-between rounded-2xl p-6 bg-[#0e0e14] border transition-all ${
                    plan.popular
                      ? "border-[#387ed1] bg-[#10101b] shadow-2xl shadow-[#387ed1]/10"
                      : "border-[#1f1f2c] hover:border-[#387ed1]/40"
                  }`}
                >
                  <div>
                    <h3 className={`text-xl font-bold font-mono ${plan.color}`}>{plan.name}</h3>
                    <p className="text-xs text-[#747888] mt-1 min-h-[36px]">{plan.description}</p>

                    <div className="mt-6 border-b border-[#1f1f2c] pb-6 mb-6">
                      <span className="text-4xl font-black font-mono text-white">
                        {price === 0
                          ? "Free"
                          : currency === "INR"
                          ? `₹${price.toLocaleString("en-IN")}`
                          : `$${price}`}
                      </span>
                      {price > 0 && <span className="text-xs text-[#747888] font-mono"> / month</span>}
                      {price > 0 && (
                        <p className="text-xs text-[#10b981] font-mono font-bold mt-1">
                          🎁 14 Days Free ($0 Today)
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-[#a0a3b0]">
                          <Check className="h-4 w-4 text-[#10b981] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setPricingModalOpen(true)}
                    className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all shadow ${
                      plan.id !== "retail"
                        ? "bg-[#10b981] hover:bg-[#0da673] text-black font-extrabold"
                        : "bg-[#1f1f2c] hover:bg-[#387ed1] text-white"
                    }`}
                  >
                    {plan.id !== "retail"
                      ? isCurrent && isTrialActive
                        ? `Trial Active (${daysRemainingInTrial}d left)`
                        : plan.trialCta
                      : plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CHARGES BREAKDOWN TABLE ── */}
        <section className="py-16 px-4 sm:px-8 max-w-[1100px] mx-auto font-mono text-xs space-y-6">
          <h2 className="text-xl font-bold text-white">Detailed Statutory &amp; Regulatory Charges</h2>
          
          <div className="overflow-x-auto rounded-2xl border border-[#1f1f2c] bg-[#0e0e14]">
            <table className="w-full text-left text-[#a0a3b0]">
              <thead>
                <tr className="border-b border-[#1f1f2c] bg-[#09090e] text-[#747888] text-[11px] uppercase">
                  <th className="py-3 px-4">Charge Type</th>
                  <th className="py-3 px-4">Equity Delivery</th>
                  <th className="py-3 px-4">Equity Intraday</th>
                  <th className="py-3 px-4">F&amp;O Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181824]">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Brokerage</td>
                  <td className="py-3 px-4 text-[#10b981]">Zero Brokerage (₹0)</td>
                  <td className="py-3 px-4">0.03% or ₹20/order</td>
                  <td className="py-3 px-4">Flat ₹20 per executed order</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">STT / CTT</td>
                  <td className="py-3 px-4">0.1% on buy &amp; sell</td>
                  <td className="py-3 px-4">0.025% on sell side</td>
                  <td className="py-3 px-4">0.0625% on sell (on premium)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Transaction Charges</td>
                  <td className="py-3 px-4">NSE: 0.00375%</td>
                  <td className="py-3 px-4">NSE: 0.00375%</td>
                  <td className="py-3 px-4">NSE: 0.05% (on premium)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">GST</td>
                  <td className="py-3 px-4">18% on (Brokerage + SEBI + Transaction)</td>
                  <td className="py-3 px-4">18% on (Brokerage + SEBI + Transaction)</td>
                  <td className="py-3 px-4">18% on (Brokerage + SEBI + Transaction)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">SEBI Charges</td>
                  <td className="py-3 px-4">₹10 / crore</td>
                  <td className="py-3 px-4">₹10 / crore</td>
                  <td className="py-3 px-4">₹10 / crore</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <LalanSiteFooter />

      <SubscriptionPricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
      />
    </div>
  );
}

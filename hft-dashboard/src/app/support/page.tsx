"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import LalanSiteHeader from "@/components/LalanSiteHeader";
import LalanSiteFooter from "@/components/LalanSiteFooter";
import { Search, HelpCircle, BookOpen, Terminal, ShieldCheck, Mail, ChevronDown, ChevronRight, Zap, Lock, DollarSign, Activity, Sparkles } from "lucide-react";

interface FAQItem {
  id: string;
  category: "general" | "terminal" | "auth" | "hft" | "pricing";
  categoryLabel: string;
  q: string;
  a: string;
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");

  const faqs: FAQItem[] = [
    // General & Platform
    {
      id: "faq-1",
      category: "general",
      categoryLabel: "General & Platform",
      q: "What is LALAN HFT Predictor and how does it differ from traditional charting tools?",
      a: "Traditional charting tools like Zerodha Kite or TradingView render historical candlestick output (what already occurred). LALAN connects directly to exchange Level-2 WebSocket streams, running a zero-allocation LMAX Disruptor engine to compute Order Book Imbalance (OBI), VWAP Micro-Price drift, and VPIN liquidity toxicity in sub-millisecond real time. This exposes institutional liquidity input before price moves.",
    },
    {
      id: "faq-2",
      category: "general",
      categoryLabel: "General & Platform",
      q: "Can retail traders use institutional HFT signals without coding experience?",
      a: "Yes! LALAN provides pre-built, visual HFT predictor signals (STRONG BUY, STRONG SELL, OBI Drift, Micro-Price trend) with real-time confidence percentages so retail options and intraday traders can trade alongside institutional sweeps with zero programming required.",
    },
    {
      id: "faq-3",
      category: "general",
      categoryLabel: "General & Platform",
      q: "Which stock exchanges and crypto markets does LALAN support?",
      a: "LALAN natively supports Indian equity indices (NIFTY 50, BANK NIFTY), top NSE/BSE stocks (RELIANCE, HDFCBANK, TATAMOTORS, INFY, TCS), and Binance Crypto feeds (BTC/USDT, ETH/USDT).",
    },

    // Trading & Terminal
    {
      id: "faq-4",
      category: "terminal",
      categoryLabel: "Trading & Terminal",
      q: "What is Order Book Imbalance (OBI) and how is it calculated?",
      a: "OBI measures immediate top-5 level liquidity imbalance: OBI = (V_bid - V_ask) / (V_bid + V_ask). Values above +0.35 trigger a STRONG BUY signal indicating heavy bid accumulation, while values below -0.35 signal heavy ask liquidity walls.",
    },
    {
      id: "faq-5",
      category: "terminal",
      categoryLabel: "Trading & Terminal",
      q: "What is Volume-Weighted Micro-Price and why is it better than Mid-Price?",
      a: "Standard mid-price assumes equal weight between bid and ask. Micro-price weights quote prices by opposite volume density: Micro-Price = (P_bid * V_ask + P_ask * V_bid) / (V_bid + V_ask). If bid volume is 10x ask volume, Micro-Price shifts toward the ask, accurately predicting the next tick sweep.",
    },
    {
      id: "faq-6",
      category: "terminal",
      categoryLabel: "Trading & Terminal",
      q: "How does the Multi-Source Intelligence Hub work?",
      a: "The Screener & NSE Hub aggregates live metrics from Screener.in (P/E, ROCE, Shareholding), NSE India (SEBI Reg 30 disclosures & block deals), TradingView (technical rating consensus), Moneycontrol (FII/DII net flows), and Trendlyne (delivery volume %) into a single zero-context-switch workspace.",
    },
    {
      id: "faq-7",
      category: "terminal",
      categoryLabel: "Trading & Terminal",
      q: "How do I execute instant buy and sell orders from the L2 Depth Ladder?",
      a: "Click 'B' or 'S' on any stock in the Marketwatch sidebar or use the quick Buy/Sell action buttons in the top navbar. The order ticket modal allows you to configure MIS (Intraday), CNC (Delivery), or Limit/Market parameters with instant fill confirmation.",
    },

    // OAuth & Security
    {
      id: "faq-8",
      category: "auth",
      categoryLabel: "OAuth & Security",
      q: "How does Google 1-Click Sign-In work on LALAN?",
      a: "LALAN uses Google Identity Services (GSI) Client SDK for 1-click Google OAuth authentication. Your session is securely hashed and stored locally with JWT token support, ensuring zero password storage vulnerabilities.",
    },
    {
      id: "faq-9",
      category: "auth",
      categoryLabel: "OAuth & Security",
      q: "Are my broker API keys and personal credentials safe?",
      a: "Yes! Your API keys (e.g. DhanHQ, LALAN Direct) are encrypted locally using AES-256 in your browser environment and are never transmitted to third-party tracking servers.",
    },
    {
      id: "faq-10",
      category: "auth",
      categoryLabel: "OAuth & Security",
      q: "How do I access the Admin Telemetry & User Audit Panel (/admin)?",
      a: "Authorized administrators can access the /admin route by clicking 'Admin Telemetry Panel' in the profile dropdown or navigating to /admin. The panel provides live sub-millisecond latency monitoring, user subscription upgrades, access suspensions, and SEBI compliance CSV export.",
    },

    // HFT Engine & Latency
    {
      id: "faq-11",
      category: "hft",
      categoryLabel: "HFT Engine & Latency",
      q: "How does LALAN achieve sub-millisecond engine execution latency?",
      a: "Built on Java 17 primitives and the LMAX Disruptor lock-free circular ring buffer (1,048,576 slots with 64-byte cache-line padding), LALAN processes raw WebSocket ticks with O(1) memory allocation to eliminate JVM garbage collection pauses.",
    },
    {
      id: "faq-12",
      category: "hft",
      categoryLabel: "HFT Engine & Latency",
      q: "What is the average stream latency for Indian market feeds?",
      a: "Standard stream latency averages between 0.65ms and 1.2ms for WebSocket level-2 depth feeds, providing real-time quote updates refreshed every 100ms.",
    },

    // Pricing & Billing
    {
      id: "faq-13",
      category: "pricing",
      categoryLabel: "Pricing & Billing",
      q: "Is there a Free Trial available for new traders?",
      a: "Yes! Every new account automatically gets a 14-Day Free Trial of the PRO QUANT plan with $0 required today and zero credit card required.",
    },
    {
      id: "faq-14",
      category: "pricing",
      categoryLabel: "Pricing & Billing",
      q: "What happens when my 14-day Free Trial finishes?",
      a: "When your trial finishes, your account safely transitions to the free RETAIL plan (₹0/mo forever) with zero interruption to basic trading capabilities unless you choose to upgrade.",
    },
    {
      id: "faq-15",
      category: "pricing",
      categoryLabel: "Pricing & Billing",
      q: "Are there any hidden brokerage charges for equity delivery?",
      a: "None! Equity delivery investments are 100% free with ₹0 brokerage. Intraday and F&O option trades are charged at flat ₹20 per executed order.",
    },
  ];

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General & Platform" },
    { id: "terminal", label: "Trading & Terminal" },
    { id: "auth", label: "OAuth & Security" },
    { id: "hft", label: "HFT Engine & Latency" },
    { id: "pricing", label: "Pricing & Billing" },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const qLower = faq.q.toLowerCase();
      const aLower = faq.a.toLowerCase();
      const sLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !sLower || qLower.includes(sLower) || aLower.includes(sLower);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#060609] text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col transition-colors duration-200">
      <LalanSiteHeader />

      <main className="flex-1 py-12 px-4 sm:px-8 max-w-[1150px] mx-auto space-y-10">
        {/* Search Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#387ed1]/15 border border-[#387ed1]/35 text-[#387ed1] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer &amp; Trader Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#8a8d9b] leading-relaxed">
            Search our quantitative engine documentation, OBI signal formulas, Google OAuth setup, and trading FAQs.
          </p>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#747888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search eg: OBI formula, Google sign-in, free trial, disruptor ring buffer..."
              className="w-full bg-[#0e0e14] dark:bg-[#0e0e14] text-xs sm:text-sm text-slate-900 dark:text-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-[#1f1f2c] focus:outline-none focus:border-[#387ed1] transition-colors font-mono shadow-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#387ed1] text-white shadow-md font-extrabold"
                  : "bg-slate-200 dark:bg-[#0e0e14] text-slate-800 dark:text-[#8a8d9b] hover:bg-slate-300 dark:hover:bg-[#161622] hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-[#1f1f2c]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs Accordion Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-[#747888] px-1">
            <span>SHOWING {filteredFaqs.length} OF {faqs.length} QUESTIONS</span>
            <span className="text-[#387ed1] font-bold">LALAN FAQ REPOSITORY</span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] text-xs font-mono text-slate-500 dark:text-[#747888]">
              No questions found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? "bg-slate-50 dark:bg-[#0e0e16] border-[#387ed1] shadow-lg"
                        : "bg-white dark:bg-[#0e0e14] border-slate-200 dark:border-[#1f1f2c] hover:border-[#387ed1]/50 shadow-sm"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 font-sans"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className={`h-5 w-5 shrink-0 mt-0.5 ${isExpanded ? "text-[#387ed1]" : "text-slate-400 dark:text-[#747888]"}`} />
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-[#161622] text-[#0284c7] dark:text-[#387ed1] mb-1.5 inline-block">
                            {faq.categoryLabel}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {faq.q}
                          </h3>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#387ed1]" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-[#1f1f2e] mt-1">
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-[#a0a3b0] leading-relaxed pt-3 pl-8 font-medium">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Direct Support Contact Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#387ed1]/10 border border-[#387ed1]/20 text-[#387ed1] mb-2">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Have more questions or need HFT algorithm support?</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8a8d9b] max-w-lg mx-auto leading-relaxed">
            Our quant infrastructure engineering team provides 1-on-1 co-location server setup, API integration assistance, and priority support.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:ayushsinghe07@gmail.com"
              className="inline-flex items-center space-x-2.5 bg-[#387ed1] hover:bg-[#306ec0] text-white font-mono text-xs sm:text-sm font-bold px-7 py-3 rounded-xl shadow-lg shadow-[#387ed1]/25 transition-all border border-[#387ed1]/40"
            >
              <Mail className="h-4 w-4 text-white" />
              <span>ayushsinghe07@gmail.com</span>
            </a>
          </div>
        </div>
      </main>

      <LalanSiteFooter />
    </div>
  );
}

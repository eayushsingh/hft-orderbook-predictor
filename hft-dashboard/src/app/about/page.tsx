"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LalanSiteHeader from "@/components/LalanSiteHeader";
import LalanSiteFooter from "@/components/LalanSiteFooter";
import { ArchitectureDiagram } from "@/components/presentation/ArchitectureDiagram";
import { BenchmarkTable } from "@/components/presentation/BenchmarkTable";
import { MathFoundations } from "@/components/presentation/MathFoundations";
import { InstitutionalTechStack } from "@/components/presentation/InstitutionalTechStack";
import { Zap, Cpu, ShieldCheck, Activity, Users, ArrowRight, Award, Globe, Building2, BarChart3, Newspaper, PieChart, ExternalLink, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060609] text-slate-900 dark:text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col transition-colors duration-200">
      <LalanSiteHeader />

      <main className="flex-1 space-y-16 py-8">
        {/* ── HERO BANNER ── */}
        <section className="py-20 px-4 sm:px-8 border-b border-slate-200 dark:border-[#181824] bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#0a0a0f] dark:via-[#08080c] dark:to-[#060609]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Institutional Market Microstructure Engine</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                We pioneered high-frequency market microstructure &amp; order book forecasting in India.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-[#a0a3b0] font-normal leading-relaxed max-w-3xl mx-auto">
                LALAN was born out of a single goal: to break down the technical barriers between institutional co-location HFT firms and Indian retail option traders.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── PRESENTATION 1: ARCHITECTURE DIAGRAM ── */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <ArchitectureDiagram />
        </section>

        {/* ── PRESENTATION 2: BENCHMARK TABLE ── */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <BenchmarkTable />
        </section>

        {/* ── PRESENTATION 3: MATH FOUNDATIONS ── */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <MathFoundations />
        </section>

        {/* ── PRESENTATION 4: INSTITUTIONAL TECH STACK ── */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <InstitutionalTechStack />
        </section>

        {/* ── TWO-COLUMN STORY SECTION ── */}
        <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-[1100px] mx-auto border-t border-slate-200 dark:border-[#181824]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-[#b0b3c0]">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Engineered for Micro-Second Advantage</h3>
              <p>
                We set out in 2024 to create a zero-allocation, lock-free matching engine capable of streaming live L2 depth across LALAN Engine, DhanHQ, Groww, and Upstox with sub-millisecond precision.
              </p>
              <p>
                Today, our LMAX Disruptor ring-buffer pipeline processes over <strong className="text-slate-900 dark:text-white font-bold">1,000,000 order events per second</strong> without a single JVM garbage collection pause.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quantitative Transparency</h3>
              <p>
                Over <strong className="text-slate-900 dark:text-white font-bold">₹500+ Cr of daily liquidity</strong> is analyzed through our Order Book Imbalance (OBI) and VWAP Micro-Price drift models, giving retail traders unfair institutional alpha.
              </p>
              <p>
                And yet, we stay true to our founding principle: providing clean, trustworthy, production-grade tools for retail investors and quant developers alike.
              </p>
            </div>
          </div>
        </section>

        {/* ── ALL-IN-ONE MULTI-SOURCE INTELLIGENCE HUB SECTION ── */}
        <section className="py-16 sm:py-20 px-4 sm:px-8 bg-slate-100/70 dark:bg-[#08080d] border-y border-slate-200 dark:border-[#181824]">
          <div className="max-w-[1100px] mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#387ed1]/10 border border-[#387ed1]/30 text-[#387ed1] text-xs font-mono font-bold uppercase">
                <Globe className="w-3.5 h-3.5 animate-pulse" />
                <span>All-In-One Unified Research Terminal</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                No More Switching Between 10 Different Websites
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8a8d9b]">
                Traders and quants check multiple sites before making an investment decision. LALAN aggregates Screener.in, NSE India, TradingView, Moneycontrol, and Trendlyne directly inside a single interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f0f17] border border-slate-200 dark:border-[#1f1f2e] space-y-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Screener.in Financials</h3>
                <p className="text-xs text-slate-600 dark:text-[#8a8d9b] leading-relaxed">
                  Instant Stock P/E, ROCE %, ROE %, FII &amp; DII quarterly shareholding patterns, and balance sheet metrics for any Indian stock.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f0f17] border border-slate-200 dark:border-[#1f1f2e] space-y-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">NSE Official Disclosures</h3>
                <p className="text-xs text-slate-600 dark:text-[#8a8d9b] leading-relaxed">
                  Real-time SEBI Regulation 30 corporate announcements, board meeting outcomes, bulk &amp; block deal streams, and derivative open interest (OI).
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f0f17] border border-slate-200 dark:border-[#1f1f2e] space-y-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">TradingView Technicals</h3>
                <p className="text-xs text-slate-600 dark:text-[#8a8d9b] leading-relaxed">
                  Multi-indicator technical consensus ratings (RSI 14, MACD, 200 DMA, Pivots) alongside interactive TradingView charts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS COUNTER GRID ── */}
        <section className="py-16 px-4 sm:px-8 bg-slate-200/50 dark:bg-[#0a0a0f] border-b border-slate-200 dark:border-[#181824]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#387ed1]">1M+</p>
              <p className="text-xs text-slate-500 dark:text-[#747888] uppercase tracking-wider mt-2">Ticks / Sec</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#10b981]">0.42 µs</p>
              <p className="text-xs text-slate-500 dark:text-[#747888] uppercase tracking-wider mt-2">p50 Engine Latency</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#ff5722]">₹500Cr+</p>
              <p className="text-xs text-slate-500 dark:text-[#747888] uppercase tracking-wider mt-2">Daily Liquidity</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-black text-purple-600 dark:text-[#a855f7]">0 MB</p>
              <p className="text-xs text-slate-500 dark:text-[#747888] uppercase tracking-wider mt-2">GC Pause Overhead</p>
            </div>
          </div>
        </section>

        {/* ── CORE TEAM / FOUNDERS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1100px] mx-auto border-b border-slate-200 dark:border-[#181824]">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">People behind LALAN</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#747888] font-mono mt-2">Quant Engineers &amp; Systems Architects</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Person 1 */}
            <div className="bg-white dark:bg-[#0f0f16] border border-slate-200 dark:border-[#1f1f2b] p-6 rounded-2xl text-center space-y-3 shadow-lg">
              <div className="h-24 w-24 rounded-full bg-[#387ed1]/20 border-2 border-[#387ed1] flex items-center justify-center text-2xl font-black text-[#387ed1] mx-auto">
                AS
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ayush Singh</h3>
              <p className="text-xs text-[#387ed1] font-mono font-bold">Founder &amp; Chief Quant Architect</p>
              <p className="text-xs text-slate-600 dark:text-[#8a8d9b] leading-relaxed">
                Specialized in low-latency C++/Java ring buffers, matching engine design, and market microstructure.
              </p>
            </div>

            {/* Person 2 */}
            <div className="bg-white dark:bg-[#0f0f16] border border-slate-200 dark:border-[#1f1f2b] p-6 rounded-2xl text-center space-y-3 shadow-lg">
              <div className="h-24 w-24 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center text-2xl font-black text-[#10b981] mx-auto">
                VS
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vikram Sharma</h3>
              <p className="text-xs text-[#10b981] font-mono font-bold">Head of Machine Learning</p>
              <p className="text-xs text-slate-600 dark:text-[#8a8d9b] leading-relaxed">
                Focuses on Order Book Imbalance (OBI) drift and deep learning models for directional tick prediction.
              </p>
            </div>

            {/* Person 3 */}
            <div className="bg-white dark:bg-[#0f0f16] border border-slate-200 dark:border-[#1f1f2b] p-6 rounded-2xl text-center space-y-3 shadow-lg">
              <div className="h-24 w-24 rounded-full bg-[#ff5722]/20 border-2 border-[#ff5722] flex items-center justify-center text-2xl font-black text-[#ff5722] mx-auto">
                PK
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Priya Kulkarni</h3>
              <p className="text-xs text-[#ff5722] font-mono font-bold">Lead Infrastructure Engineer</p>
              <p className="text-xs text-slate-600 dark:text-[#8a8d9b] leading-relaxed">
                Architects binary WebSocket telemetry, LALAN Direct API adapters, and co-location servers.
              </p>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ── */}
        <section className="py-20 px-4 text-center bg-slate-100 dark:bg-[#0a0a0e]">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ready to eliminate risk?
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#8a8d9b]">
              Join thousands of Indian quants and option traders using LALAN HFT terminal today.
            </p>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-[#387ed1] hover:bg-[#306ec0] text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-[#387ed1]/25 active:scale-95"
              >
                <span>Launch Live Terminal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LalanSiteFooter />
    </div>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ZerodhaSiteHeader from "@/components/ZerodhaSiteHeader";
import ZerodhaSiteFooter from "@/components/ZerodhaSiteFooter";
import { Zap, Cpu, ShieldCheck, Activity, Users, ArrowRight, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060609] text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col">
      <ZerodhaSiteHeader />

      <main className="flex-1">
        {/* ── HERO BANNER ── */}
        <section className="py-20 px-4 sm:px-8 border-b border-[#181824] bg-gradient-to-b from-[#0a0a0f] via-[#08080c] to-[#060609]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                We pioneered high-frequency market microstructure &amp; order book forecasting in India.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#a0a3b0] font-normal leading-relaxed max-w-3xl mx-auto">
                LALAN was born out of a single goal: to break down the technical barriers between institutional co-location HFT firms and Indian retail option traders.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── TWO-COLUMN STORY SECTION ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1100px] mx-auto border-b border-[#181824]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm sm:text-base leading-relaxed text-[#b0b3c0]">
            <div className="space-y-4">
              <p>
                We set out in 2024 to create a zero-allocation, lock-free matching engine capable of streaming live L2 depth across Zerodha Kite, DhanHQ, Groww, and Upstox with sub-millisecond precision.
              </p>
              <p>
                Today, our LMAX Disruptor ring-buffer pipeline processes over <strong className="text-white font-bold">1,000,000 order events per second</strong> without single JVM garbage collection pause.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Over <strong className="text-white font-bold">₹500+ Cr of daily liquidity</strong> is analyzed through our Order Book Imbalance (OBI) and VWAP Micro-Price drift models, giving retail traders unfair institutional alpha.
              </p>
              <p>
                And yet, we stay true to our founding principle: providing clean, trustworthy, production-grade tools for retail investors and quant developers alike.
              </p>
            </div>
          </div>
        </section>

        {/* ── STATS COUNTER GRID ── */}
        <section className="py-16 px-4 sm:px-8 bg-[#0a0a0f] border-b border-[#181824]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#387ed1]">1M+</p>
              <p className="text-xs text-[#747888] uppercase tracking-wider mt-2">Ticks / Sec</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#10b981]">0.8 ms</p>
              <p className="text-xs text-[#747888] uppercase tracking-wider mt-2">Engine Latency</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#ff5722]">₹500Cr+</p>
              <p className="text-xs text-[#747888] uppercase tracking-wider mt-2">Daily Liquidity</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#a855f7]">0 MB</p>
              <p className="text-xs text-[#747888] uppercase tracking-wider mt-2">GC Pause Overhead</p>
            </div>
          </div>
        </section>

        {/* ── CORE TEAM / FOUNDERS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1100px] mx-auto border-b border-[#181824]">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">People behind LALAN</h2>
            <p className="text-xs sm:text-sm text-[#747888] font-mono mt-2">Quant Engineers &amp; Systems Architects</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Person 1 */}
            <div className="bg-[#0f0f16] border border-[#1f1f2b] p-6 rounded-2xl text-center space-y-3">
              <div className="h-24 w-24 rounded-full bg-[#387ed1]/20 border-2 border-[#387ed1] flex items-center justify-center text-2xl font-black text-[#387ed1] mx-auto">
                AS
              </div>
              <h3 className="text-lg font-bold text-white">Ayush Singh</h3>
              <p className="text-xs text-[#387ed1] font-mono font-bold">Founder &amp; Chief Quant Architect</p>
              <p className="text-xs text-[#8a8d9b] leading-relaxed">
                Specialized in low-latency C++/Java ring buffers, matching engine design, and market microstructure.
              </p>
            </div>

            {/* Person 2 */}
            <div className="bg-[#0f0f16] border border-[#1f1f2b] p-6 rounded-2xl text-center space-y-3">
              <div className="h-24 w-24 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center text-2xl font-black text-[#10b981] mx-auto">
                VS
              </div>
              <h3 className="text-lg font-bold text-white">Vikram Sharma</h3>
              <p className="text-xs text-[#10b981] font-mono font-bold">Head of Machine Learning</p>
              <p className="text-xs text-[#8a8d9b] leading-relaxed">
                Focuses on Order Book Imbalance (OBI) drift and deep learning models for directional tick prediction.
              </p>
            </div>

            {/* Person 3 */}
            <div className="bg-[#0f0f16] border border-[#1f1f2b] p-6 rounded-2xl text-center space-y-3">
              <div className="h-24 w-24 rounded-full bg-[#ff5722]/20 border-2 border-[#ff5722] flex items-center justify-center text-2xl font-black text-[#ff5722] mx-auto">
                PK
              </div>
              <h3 className="text-lg font-bold text-white">Priya Kulkarni</h3>
              <p className="text-xs text-[#ff5722] font-mono font-bold">Lead Infrastructure Engineer</p>
              <p className="text-xs text-[#8a8d9b] leading-relaxed">
                Architects binary WebSocket telemetry, Zerodha Kite API adapters, and co-location servers.
              </p>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ── */}
        <section className="py-20 px-4 text-center bg-[#0a0a0e]">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to eliminate risk?
            </h2>
            <p className="text-sm text-[#8a8d9b]">
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

      <ZerodhaSiteFooter />
    </div>
  );
}

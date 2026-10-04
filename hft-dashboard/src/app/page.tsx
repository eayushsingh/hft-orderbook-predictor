"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";
import { Zap, ShieldCheck, Cpu, Layers, ArrowRight, Sparkles, Activity } from "lucide-react";
import LalanSiteHeader from "@/components/LalanSiteHeader";
import LalanSiteFooter from "@/components/LalanSiteFooter";
import FloatingMoney from "@/components/FloatingMoney";

const featureCards = [
  {
    icon: Activity,
    color: "text-[#387ed1] bg-[#387ed1]/10 border-[#387ed1]/20",
    title: "Real-Time L2 Insights",
    description:
      "Stream live Binance and Indian exchange L2 order book data through a lock-free LMAX Disruptor pipeline. Every tick captured with sub-millisecond latency.",
  },
  {
    icon: Cpu,
    color: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20",
    title: "Zero GC Pause Latency",
    description:
      "Zero-allocation memory architecture eliminates Java garbage collection pauses. Execution paths stay deterministic under extreme market volatility.",
  },
  {
    icon: Layers,
    color: "text-[#ff5722] bg-[#ff5722]/10 border-[#ff5722]/20",
    title: "Indian Market Liquidity",
    description:
      "Real-time Order Book Imbalance (OBI) and buying/selling pressure matrix aggregated across DhanHQ, LALAN Engine, Groww, Angel One, and Upstox.",
  },
  {
    icon: ShieldCheck,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    title: "Institutional Precision",
    description:
      "O(1) order placement, matching, and cancellation backed by primitive lock-free ring buffers and doubly-linked price levels.",
  },
];

export default function LandingPage() {
  return (
    <div className="font-sans bg-[#060608] text-zinc-100 min-h-screen selection:bg-[#387ed1] selection:text-white relative overflow-x-hidden flex flex-col transition-colors duration-200">
      {/* Floating Money Background & Interactive Particle Stream */}
      <FloatingMoney />

      <LalanSiteHeader />

      <main className="flex-1">
        {/* Ambient background glow spheres */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] bg-[#387ed1]/[0.12] rounded-full blur-[140px]"
          />
        </div>

        {/* ════════════════════════════════════════════════
            SECTION 1 — HERO + LIVE TERMINAL MOCKUP
            ════════════════════════════════════════════════ */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative">
          
          {/* Headline */}
          <motion.div
            className="text-center max-w-4xl mx-auto z-10 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#387ed1]/10 border border-[#387ed1]/20 text-[#387ed1] text-[11px] sm:text-xs font-mono uppercase tracking-wider shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-[#387ed1] animate-pulse" />
              LALAN Enterprise HFT Order Book Engine
            </div>

            <h1 className="flex flex-col gap-2 sm:gap-4">
              <span className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-600 dark:text-zinc-400">
                Invest &amp; Trade in Everything
              </span>
              <span className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05] sm:leading-[0.98] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                We eliminate risk,<br className="hidden sm:inline" /> and alpha chases us.
              </span>
            </h1>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Institutional market microstructure analysis for retail &amp; options traders. Sub-millisecond latency. Live Order Book Imbalance (OBI).
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#387ed1] text-white text-xs sm:text-sm font-bold tracking-wider uppercase px-8 py-3.5 rounded-xl hover:bg-[#306ec0] transition-all text-center shadow-2xl shadow-[#387ed1]/30 border border-[#387ed1]/40"
                >
                  Sign Up For Free &amp; Open Terminal
                  <Zap className="h-4 w-4 text-white fill-white" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Responsive Terminal Mockup Window */}
          <motion.div
            className="w-full max-w-5xl mx-auto mt-10 sm:mt-16 z-10 px-0 sm:px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-[#0f0f13] border border-zinc-700/50 dark:border-white/[0.14] rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-black/10 hover:border-[#387ed1]/40 transition-colors">
              {/* Window Header */}
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-[#08080b] border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-red-600/40" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-amber-600/40" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840] border border-emerald-600/40" />
                </div>
                <div className="bg-[#14141c] border border-zinc-800 rounded-md px-3 py-1 text-zinc-300 text-[10px] sm:text-xs font-mono text-center max-w-[220px] sm:max-w-xs truncate">
                  lalan-hft.internal/dashboard
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold hidden sm:flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE LALAN HFT STREAM
                </div>
              </div>

              {/* iFrame Stream Container */}
              <div className="w-full h-[300px] xs:h-[360px] sm:h-[460px] md:h-[520px] overflow-hidden relative bg-[#08080a]">
                <iframe
                  src="/dashboard"
                  className="w-full h-full border-0"
                  title="LALAN Live HFT Terminal"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 2 — LOCK-FREE COUNTER STAT
            ════════════════════════════════════════════════ */}
        <section className="bg-[#08080c]/90 py-16 sm:py-24 px-4 sm:px-6 border-t border-b border-zinc-200 dark:border-white/[0.06] backdrop-blur-xl">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block bg-[#387ed1]/10 text-[#387ed1] text-[11px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#387ed1]/20 mb-6 font-mono">
                Lock-Free Ring Buffer Performance
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-zinc-100 dark:to-zinc-500 leading-none tracking-tight font-mono">
                <CountUp start={985536} end={1000000} duration={2.5} separator="," />
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-lg mt-4 sm:mt-6 max-w-md mx-auto leading-relaxed px-2 font-normal">
                Order events processed per second through our LMAX Disruptor ring buffer. Zero Garbage Collection pauses.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 3 — FEATURE CARDS GRID
            ════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className="bg-[#0e0e13] border border-zinc-200 dark:border-white/[0.08] hover:border-[#387ed1]/40 rounded-2xl p-6 sm:p-8 transition-all shadow-xl group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <LalanSiteFooter />
    </div>
  );
}

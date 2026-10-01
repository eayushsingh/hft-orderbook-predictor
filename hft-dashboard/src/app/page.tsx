"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";

const featureCards = [
  {
    title: "Real-Time L2 Insights",
    description:
      "Stream live Binance and Indian exchange L2 order book data through a lock-free LMAX Disruptor pipeline. Every tick captured in sub-millisecond latency.",
  },
  {
    title: "Zero GC Pause Latency",
    description:
      "Zero-allocation memory architecture eliminates Java garbage collection pauses. Your execution path stays deterministic under extreme market volatility.",
  },
  {
    title: "Indian Market Liquidity",
    description:
      "Real-time Order Book Imbalance (OBI) and buying/selling pressure matrix aggregated across DhanHQ, Zerodha, Groww, Angel One, and Upstox.",
  },
  {
    title: "Institutional Precision",
    description:
      "O(1) order placement, matching, and cancellation backed by primitive lock-free ring buffers and doubly-linked price levels.",
  },
];

export default function LandingPage() {
  return (
    <div className="font-sans bg-[#08080a] text-zinc-100 min-h-screen selection:bg-indigo-500 selection:text-white">

      {/* ════════════════════════════════════════════════
          NAVBAR — Sticky, Glassmorphic Mobile Header
          ════════════════════════════════════════════════ */}
      <nav className="sticky top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 md:px-12 py-4 bg-[#08080a]/80 backdrop-blur-xl border-b border-white/[0.08] z-50">
        <div className="flex items-center space-x-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="LALAN Logo" className="h-9 sm:h-12 w-auto object-contain" />
          <span className="font-black text-lg sm:text-xl tracking-[0.2em] uppercase text-white">LALAN</span>
        </div>
        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-[11px] sm:text-xs font-bold tracking-widest uppercase px-4 sm:px-6 py-2.5 rounded-full transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          Open Terminal →
        </Link>
      </nav>

      {/* ════════════════════════════════════════════════
          SECTION 1 — HERO + RESPONSIVE MOCKUP
          ════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#0f0f14] via-[#08080a] to-[#08080a] text-white min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden">
        
        {/* Glow backdrop effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Headline */}
        <motion.div
          className="text-center max-w-4xl mx-auto z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            HFT Order Book Predictor Engine
          </div>

          <h1 className="flex flex-col gap-2 sm:gap-4">
            <span className="text-xl sm:text-3xl md:text-4xl font-medium tracking-tight text-zinc-400">
              We don&apos;t chase alpha.
            </span>
            <span className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05] sm:leading-[0.98] bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              We eliminate risk,<br className="hidden sm:inline" /> and alpha chases us.
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-lg md:text-xl mt-5 sm:mt-8 max-w-2xl mx-auto leading-relaxed px-2">
            Institutional market microstructure analysis for retail &amp; options traders. Sub-millisecond latency. Live Order Book Imbalance (OBI).
          </p>

          {/* Mobile CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-white text-black text-xs font-bold tracking-wider uppercase px-8 py-3.5 rounded-xl hover:bg-zinc-200 transition-all text-center shadow-xl shadow-white/10 active:scale-95"
            >
              Launch Live Terminal
            </Link>
          </div>
        </motion.div>

        {/* Responsive Terminal Mockup */}
        <motion.div
          className="w-full max-w-5xl mx-auto mt-10 sm:mt-16 z-10 px-0 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="bg-[#121218] border border-white/[0.12] rounded-xl sm:rounded-2xl shadow-2xl shadow-black/80 overflow-hidden">
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#0a0a0d] border-b border-white/[0.08]">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="bg-[#16161e] border border-white/[0.06] rounded-md px-3 py-1 text-zinc-400 text-[10px] sm:text-xs font-mono text-center max-w-[200px] sm:max-w-xs truncate">
                lalan-hft.internal/dashboard
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:block">
                LIVE STREAM
              </div>
            </div>

            {/* iFrame Container */}
            <div className="w-full h-[280px] xs:h-[340px] sm:h-[440px] md:h-[500px] overflow-hidden relative bg-[#08080a]">
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
          SECTION 2 — TICKER & COUNTER
          ════════════════════════════════════════════════ */}
      <section className="bg-[#0c0c10] text-white py-16 sm:py-28 px-4 sm:px-6 border-t border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-block bg-indigo-500/10 text-indigo-400 text-[11px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-indigo-500/20 mb-6 sm:mb-8">
              Lock-Free Performance
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 leading-none tracking-tight font-mono">
              <CountUp start={985536} end={1000000} duration={3} separator="," />
            </div>
            <p className="text-zinc-400 text-sm sm:text-lg mt-4 sm:mt-6 max-w-md mx-auto leading-relaxed px-2">
              Order events processed per second through our LMAX Disruptor ring buffer. Zero Garbage Collection pauses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 3 — FEATURE GRID
          ════════════════════════════════════════════════ */}
      <section className="bg-[#08080a] text-white py-16 sm:py-24 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.title}
              className="bg-[#111116] border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl p-6 sm:p-8 group transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                {card.title}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════ */}
      <footer className="bg-[#060608] border-t border-white/[0.08] py-8 sm:py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-xs gap-3 text-center sm:text-left">
          <span className="font-black tracking-[0.2em] uppercase text-zinc-300 text-sm">LALAN</span>
          <span className="text-[11px] text-zinc-400">
            Market Microstructure &amp; Order Flow Engine — O(1) L2 Depth &amp; HFT Price Forecasting
          </span>
        </div>
      </footer>

    </div>
  );
}

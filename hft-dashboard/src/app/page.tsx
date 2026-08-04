"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";

const featureCards = [
  {
    title: "Real-Time Insights",
    description:
      "Stream live Binance L2 order book data through a lock-free LMAX Disruptor pipeline. Every tick, every shift — captured in sub-millisecond latency.",
  },
  {
    title: "Secure Trading",
    description:
      "Zero-allocation memory architecture eliminates garbage collection pauses. Your execution path stays deterministic, even under extreme market volatility.",
  },
  {
    title: "Tech Driven Precision",
    description:
      "O(1) order placement, matching, and cancellation backed by custom primitive hash maps and doubly-linked price levels. No compromises.",
  },
  {
    title: "Trading Community",
    description:
      "Built by quantitative engineers, for quantitative engineers. Open-source infrastructure designed to be extended, forked, and battle-tested.",
  },
];

export default function LandingPage() {
  return (
    <div className="font-sans">

      {/* ════════════════════════════════════════════════
          SECTION 1 — LIGHT HERO + MACBOOK MOCKUP
          ════════════════════════════════════════════════ */}
      <section className="bg-[#f4f4f5] text-black min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-6 z-20">
          <div className="flex items-center space-x-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="LALAN Logo" className="h-14 w-auto object-contain" />
            <span className="font-black text-xl tracking-[0.2em] uppercase text-black">LALAN</span>
          </div>
          <Link
            href="/dashboard"
            className="bg-black text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-colors"
          >
            Open Terminal →
          </Link>
        </nav>

        {/* Headline */}
        <motion.div
          className="text-center max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="flex flex-col gap-4">
            <span className="text-2xl md:text-4xl font-semibold tracking-tight text-zinc-500">
              We don&apos;t chase alpha.
            </span>
            <span className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] bg-gradient-to-r from-black to-zinc-600 bg-clip-text text-transparent">
              We eliminate risk,<br />and the alpha chases us.
            </span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Institutional-grade market microstructure intelligence. Sub-millisecond latency. Zero garbage collection.
          </p>
        </motion.div>

        {/* MacBook Mockup with Live Dashboard iframe */}
        <motion.div
          className="w-full max-w-4xl mx-auto mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {/* Screen bezel */}
          <div className="bg-zinc-800 rounded-t-2xl pt-3 pb-0 px-3 shadow-2xl shadow-black/30">
            {/* Browser chrome */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-zinc-900 rounded-t-lg">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <div className="flex-1 mx-4">
                <div className="bg-zinc-800 rounded-md px-3 py-1 text-zinc-500 text-[10px] font-mono text-center">
                  localhost:3000/dashboard
                </div>
              </div>
            </div>
            {/* Live iframe */}
            <div className="w-full h-[380px] overflow-hidden">
              <iframe
                src="/dashboard"
                className="w-full h-full border-0"
                title="AlphaLedger Live Terminal"
              />
            </div>
          </div>
          {/* MacBook base / hinge */}
          <div className="w-full h-4 bg-gradient-to-b from-zinc-700 to-zinc-600 rounded-b-lg" />
          <div className="w-[40%] h-2 bg-zinc-500/40 rounded-b-xl mx-auto" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 2 — DARK TRANSITION & TICKER
          ════════════════════════════════════════════════ */}
      <section className="bg-[#0a0a0c] text-white py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Blue pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full border border-indigo-500/20 mb-10">
              Transparent Selection
            </span>
          </motion.div>

          {/* Animated Counter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 leading-none">
              <CountUp start={985536} end={1000000} duration={3} separator="," />
            </div>
            <p className="text-zinc-500 text-lg mt-6 max-w-lg mx-auto">
              Orders processed per second through our lock-free Ring Buffer architecture. Zero allocation. Zero compromise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 3 — DARK FEATURE GRID
          ════════════════════════════════════════════════ */}
      <section className="bg-[#0a0a0c] text-white pb-32 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.title}
              className="bg-[#111115] border border-zinc-800 rounded-3xl p-10 group hover:border-zinc-700 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════ */}
      <footer className="bg-[#0a0a0c] border-t border-zinc-900 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-zinc-600 text-xs tracking-wide">
          <span className="font-black tracking-[0.2em] uppercase text-zinc-400">LALAN</span>
          <span className="mt-2 md:mt-0">Predictive Market Microstructure Engine — O(1) Limit Order Book &amp; HFT Price Forecasting</span>
        </div>
      </footer>

    </div>
  );
}

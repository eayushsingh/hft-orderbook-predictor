"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Zap,
  ShieldCheck,
  Layers,
  Activity,
  Terminal,
  BookOpen,
  Code2,
  Building2,
  X,
  Sparkles,
  ArrowRight,
  Gauge,
  Workflow,
  CheckCircle2,
  Globe,
} from "lucide-react";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const [activeSection, setActiveSection] = useState<
    "overview" | "disruptor" | "microstructure" | "multisource" | "brokers" | "engineers"
  >("overview");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="w-full max-w-4xl rounded-2xl bg-[#14141a] border border-[#282836] shadow-2xl overflow-hidden my-auto text-[#e0e0e0] flex flex-col max-h-[90vh] transform-gpu"
        >
          {/* ── HEADER ── */}
          <div className="p-5 border-b border-[#262634] bg-[#0f0f14] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/30">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
                  About LALAN HFT Predictor
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/40 font-bold uppercase">
                    Microstructure Spec
                  </span>
                </h2>
                <p className="text-xs text-[#747888] font-mono mt-0.5">
                  Institutional high-frequency quantitative matching &amp; price forecasting engine.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#747888] hover:text-white hover:bg-[#1f1f28] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── NAVIGATION TABS ── */}
          <div className="flex items-center space-x-1 border-b border-[#262634] bg-[#0d0d12] px-4 py-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: "overview", label: "Overview & Mission", icon: Activity },
              { id: "multisource", label: "Screener & NSE Hub", icon: Globe },
              { id: "disruptor", label: "Zero-GC LMAX Disruptor", icon: Cpu },
              { id: "microstructure", label: "Market Microstructure", icon: Gauge },
              { id: "brokers", label: "Indian Multi-Broker Feed", icon: Building2 },
              { id: "engineers", label: "Developer & Specs", icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as typeof activeSection)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                    isActive
                      ? "bg-[#387ed1] text-white shadow-md"
                      : "text-[#747888] hover:bg-[#181822] hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── CONTENT AREA ── */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#b0b3c0] leading-relaxed">
            
            {/* ── SECTION 1: OVERVIEW ── */}
            {activeSection === "overview" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#242432]">
                  <h3 className="text-base font-bold font-mono text-white mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#387ed1]" />
                    We don&apos;t chase alpha. We eliminate risk, and alpha chases us.
                  </h3>
                  <p className="text-xs text-[#9e9ea8]">
                    LALAN HFT is a ultra-low latency quantitative market microstructure engine engineered specifically for retail and institutional traders in India. By combining LMAX Disruptor ring-buffer concurrency, zero Garbage Collection memory layouts, and real-time Order Book Imbalance (OBI) signals, LALAN bridges retail trading terminals with institutional-grade price forecasting.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#387ed1]/20 text-[#387ed1] mb-2">
                      <Zap className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-white font-mono text-xs">Sub-Millisecond Speed</h4>
                    <p className="text-[11px] text-[#747888] mt-1">
                      Ticks captured with sub-millisecond execution latency over lock-free ring buffers.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10b981]/20 text-[#10b981] mb-2">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-white font-mono text-xs">Zero-GC Architecture</h4>
                    <p className="text-[11px] text-[#747888] mt-1">
                      Primitive arrays and re-usable event objects guarantee zero JVM garbage collection pauses.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff5722]/20 text-[#ff5722] mb-2">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-white font-mono text-xs">LALAN &amp; Multi-Broker Feeds</h4>
                    <p className="text-[11px] text-[#747888] mt-1">
                      Aggregated buying/selling liquidity matrix across LALAN Engine, DhanHQ, Groww, and Upstox.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECTION: MULTI-SOURCE INTELLIGENCE HUB ── */}
            {activeSection === "multisource" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0e0e13] border border-emerald-500/20">
                  <h3 className="text-base font-bold font-mono text-white mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-400" />
                    All-In-One Multi-Source Intelligence Hub
                  </h3>
                  <p className="text-xs text-[#9e9ea8]">
                    LALAN integrates trusted financial portals — Screener.in, NSE India, TradingView, Moneycontrol, and Trendlyne — into a single unified terminal so quants and option traders never have to leave the application.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432] space-y-1">
                    <div className="font-bold text-emerald-400">Screener.in Financials</div>
                    <p className="text-[11px] text-[#747888]">
                      P/E, ROCE %, ROE %, promoter/FII/DII shareholding patterns &amp; balance sheets.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432] space-y-1">
                    <div className="font-bold text-cyan-400">NSE Official Disclosures</div>
                    <p className="text-[11px] text-[#747888]">
                      SEBI Regulation 30 filings, corporate announcements, bulk/block deal streams, and OI.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432] space-y-1">
                    <div className="font-bold text-sky-400">TradingView Technicals</div>
                    <p className="text-[11px] text-[#747888]">
                      RSI 14, MACD, Moving Averages 200 DMA, Pivots &amp; combined technical gauge rating.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432] space-y-1">
                    <div className="font-bold text-amber-400">Moneycontrol &amp; Trendlyne</div>
                    <p className="text-[11px] text-[#747888]">
                      Breaking market news, FII/DII net daily cash flows (₹ Cr), &amp; delivery volume %.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECTION 2: LMAX DISRUPTOR ── */}
            {activeSection === "disruptor" && (
              <div className="space-y-4 font-mono">
                <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#242432]">
                  <h3 className="text-sm font-bold text-[#387ed1] mb-1 uppercase tracking-wider">
                    Lock-Free Ring Buffer Core
                  </h3>
                  <p className="text-xs text-[#b0b3c0] leading-relaxed">
                    Traditional multi-threaded matching engines rely on mutex locks, causing thread contention and unpredictable tail latency. LALAN uses a circular LMAX Disruptor ring buffer pre-allocated to 1,048,576 slots. Single-writer sequences eliminate lock overhead entirely.
                  </p>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-3 rounded-lg bg-[#101016] border border-[#22222f] flex justify-between items-center">
                    <span className="text-[#747888]">Cache-Line Padding (64 bytes):</span>
                    <span className="text-[#10b981] font-bold">Prevents False Sharing</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#101016] border border-[#22222f] flex justify-between items-center">
                    <span className="text-[#747888]">Numeric Encoding:</span>
                    <span className="text-white font-bold">Scaled Long Price Primitives (÷10,000)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#101016] border border-[#22222f] flex justify-between items-center">
                    <span className="text-[#747888]">Order Book Insertion / Match:</span>
                    <span className="text-[#387ed1] font-bold">O(1) Doubly-Linked Price Levels</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECTION 3: MARKET MICROSTRUCTURE ── */}
            {activeSection === "microstructure" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#242432]">
                  <h3 className="text-sm font-bold font-mono text-[#10b981] mb-1 uppercase tracking-wider">
                    Order Book Imbalance (OBI) &amp; Micro-Price
                  </h3>
                  <p className="text-xs text-[#b0b3c0]">
                    Standard price displays only show the mid-price. LALAN computes the VWAP Micro-Price and Order Book Imbalance (OBI) to predict price movement direction before market orders sweep the depth ladder.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432]">
                    <span className="text-[10px] text-[#747888] uppercase block mb-1">Micro-Price Formula</span>
                    <p className="text-white font-bold text-xs bg-[#08080c] p-2 rounded border border-[#1f1f2a]">
                      P_micro = (P_bid × Q_ask + P_ask × Q_bid) / (Q_bid + Q_ask)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101016] border border-[#242432]">
                    <span className="text-[10px] text-[#747888] uppercase block mb-1">OBI Formula</span>
                    <p className="text-white font-bold text-xs bg-[#08080c] p-2 rounded border border-[#1f1f2a]">
                      OBI = (Q_bid - Q_ask) / (Q_bid + Q_ask)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECTION 4: INDIAN BROKERS ── */}
            {activeSection === "brokers" && (
              <div className="space-y-4 font-mono">
                <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#242432]">
                  <h3 className="text-sm font-bold text-[#ff5722] mb-1 uppercase tracking-wider">
                    Aggregated Liquidity Across Indian Brokers
                  </h3>
                  <p className="text-xs text-[#b0b3c0]">
                    LALAN aggregates order book depth and buying/selling pressure from Indian broker APIs into a unified institutional view:
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-[#101016] border border-[#242432] text-center">
                    <span className="text-[#ff5722] font-bold block">LALAN Gateway</span>
                    <span className="text-[10px] text-[#747888]">LALAN Direct WebSocket</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#101016] border border-[#242432] text-center">
                    <span className="text-[#10b981] font-bold block">DhanHQ</span>
                    <span className="text-[10px] text-[#747888]">Direct L2 Feed</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#101016] border border-[#242432] text-center">
                    <span className="text-[#387ed1] font-bold block">Groww</span>
                    <span className="text-[10px] text-[#747888]">Order Engine API</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#101016] border border-[#242432] text-center">
                    <span className="text-[#a855f7] font-bold block">Upstox</span>
                    <span className="text-[10px] text-[#747888]">Developer Feed</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECTION 5: DEVELOPERS & SPECS ── */}
            {activeSection === "engineers" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#242432]">
                  <h3 className="text-sm font-bold text-white mb-2">Technical Specification</h3>
                  <ul className="space-y-1.5 text-[#b0b3c0]">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                      <span>Java 17 LMAX Disruptor 3.4.4 Core Engine</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                      <span>Next.js 16 + React 19 + Tailwind CSS + Framer Motion Frontend</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                      <span>TCP_NODELAY Sockets &amp; Binance Depth20 WebSocket @ 100ms</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                      <span>Built for Indian Market Quants &amp; High-Frequency Options Traders</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* ── FOOTER ── */}
          <div className="p-4 border-t border-[#262634] bg-[#0f0f14] flex justify-between items-center shrink-0">
            <span className="text-[11px] font-mono text-[#747888]">
              LALAN HFT Microstructure Engine v1.0
            </span>
            <button
              onClick={onClose}
              className="bg-[#387ed1] hover:bg-[#306ec0] text-white text-xs font-mono font-bold px-5 py-2 rounded-xl transition-all shadow"
            >
              Close Guide
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

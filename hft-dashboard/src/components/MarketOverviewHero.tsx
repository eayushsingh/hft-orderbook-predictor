"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Flame } from "lucide-react";

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
}

const INITIAL_INDICES: IndexData[] = [
  { symbol: "NIFTY 50", name: "NSE India Benchmark", price: 24850.45, change: 168.20, changePct: 0.68, high: 24890.10, low: 24710.30, sentiment: "BULLISH" },
  { symbol: "BANKNIFTY", name: "NSE Banking Index", price: 53210.15, change: 448.50, changePct: 0.85, high: 53350.00, low: 52890.50, sentiment: "BULLISH" },
  { symbol: "FINNIFTY", name: "NSE Financial Services", price: 23640.80, change: 184.30, changePct: 0.79, high: 23710.00, low: 23490.20, sentiment: "BULLISH" },
  { symbol: "SENSEX", name: "BSE 30 Index", price: 81450.80, change: 512.40, changePct: 0.63, high: 81580.20, low: 81020.10, sentiment: "BULLISH" },
  { symbol: "INDIA VIX", name: "Volatility Index", price: 13.42, change: -0.85, changePct: -5.95, high: 14.20, low: 13.10, sentiment: "BULLISH" },
  { symbol: "GIFT NIFTY", name: "Gift City Futures", price: 24895.00, change: 195.00, changePct: 0.79, high: 24920.00, low: 24740.00, sentiment: "BULLISH" },
];

export default function MarketOverviewHero() {
  const [indices, setIndices] = useState<IndexData[]>(INITIAL_INDICES);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((idx) => {
          const delta = (Math.random() - 0.48) * (idx.symbol === "INDIA VIX" ? 0.15 : 8.0);
          const newPrice = parseFloat((idx.price + delta).toFixed(2));
          const newChange = parseFloat((idx.change + delta * 0.5).toFixed(2));
          const newPct = parseFloat(((newChange / (idx.price - newChange)) * 100).toFixed(2));
          return {
            ...idx,
            price: newPrice,
            change: newChange,
            changePct: newPct,
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 rounded-3xl bg-[#0c0c12] border border-[#222234] shadow-2xl font-sans text-zinc-100 space-y-6 select-none transform-gpu">
      {/* Top Header & Market Vibe Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f1f30] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#387ed1]/15 text-[#387ed1] border border-[#387ed1]/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black font-mono text-white tracking-tight">
                Indian Market Overview &amp; Liquidity Pulse
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                LIVE NSE/BSE STREAM
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Real-time benchmark index telemetry, volatility risk status, and market regime tracking
            </p>
          </div>
        </div>

        {/* Market Mood Indicator */}
        <div className="flex items-center gap-2 bg-[#161624] px-3 py-1.5 rounded-xl border border-[#26263a] font-mono text-xs">
          <span className="text-zinc-400">Market Mood:</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>EXTREME BULLISH ACCUMULATION</span>
          </span>
        </div>
      </div>

      {/* Indices Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {indices.map((idx) => {
          const isPos = idx.changePct >= 0;
          return (
            <motion.div
              key={idx.symbol}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-[#13131c] border border-[#222234] hover:border-[#387ed1]/50 transition-all shadow-lg font-mono space-y-2 transform-gpu"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white font-extrabold tracking-wide">{idx.symbol}</span>
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-extrabold ${
                    isPos ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPos ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
                  <span>{isPos ? `+${idx.changePct}%` : `${idx.changePct}%`}</span>
                </span>
              </div>

              <div className="text-lg sm:text-xl font-black text-cyan-300">
                {idx.symbol === "INDIA VIX"
                  ? idx.price.toFixed(2)
                  : `₹${idx.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              </div>

              <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                <span>H: {idx.high.toLocaleString("en-IN")}</span>
                <span>L: {idx.low.toLocaleString("en-IN")}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

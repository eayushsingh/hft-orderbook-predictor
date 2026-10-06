"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, TrendingUp, TrendingDown } from "lucide-react";

interface SectorItem {
  sector: string;
  changePct: number;
  volumeRatio: number; // e.g. 1.45x average
  flowType: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL";
}

const INITIAL_SECTORS: SectorItem[] = [
  { sector: "NIFTY BANK", changePct: +1.28, volumeRatio: 1.62, flowType: "ACCUMULATION" },
  { sector: "NIFTY AUTO", changePct: +2.45, volumeRatio: 1.85, flowType: "ACCUMULATION" },
  { sector: "NIFTY IT", changePct: -0.45, volumeRatio: 0.92, flowType: "NEUTRAL" },
  { sector: "NIFTY ENERGY", changePct: +1.15, volumeRatio: 1.34, flowType: "ACCUMULATION" },
  { sector: "NIFTY PHARMA", changePct: +0.68, volumeRatio: 1.12, flowType: "ACCUMULATION" },
  { sector: "NIFTY FMCG", changePct: -0.82, volumeRatio: 0.88, flowType: "DISTRIBUTION" },
  { sector: "NIFTY REALTY", changePct: +3.12, volumeRatio: 2.15, flowType: "ACCUMULATION" },
];

export default function SectorPerformanceBar() {
  const [sectors, setSectors] = useState<SectorItem[]>(INITIAL_SECTORS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSectors((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.49) * 0.12;
          const newPct = parseFloat((s.changePct + delta).toFixed(2));
          return {
            ...s,
            changePct: newPct,
            flowType: newPct > 0.5 ? "ACCUMULATION" : newPct < -0.5 ? "DISTRIBUTION" : "NEUTRAL",
          };
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#0c0c12] border border-[#222234] shadow-2xl font-sans text-zinc-100 space-y-5 select-none transform-gpu">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f1f30] pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              NSE Sectoral Liquidity &amp; Institutional Momentum
            </h3>
            <p className="text-xs text-zinc-400">
              Sectoral volume anomaly density and directional institutional flow tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Leading Sector:</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase text-[11px]">
            NIFTY REALTY (+3.12%)
          </span>
        </div>
      </div>

      {/* Sector Bar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono">
        {sectors.map((s) => {
          const isPos = s.changePct >= 0;
          const barWidth = Math.min(100, Math.max(10, Math.abs(s.changePct) * 25));
          return (
            <div
              key={s.sector}
              className="p-3.5 rounded-xl bg-[#13131c] border border-[#222234] space-y-2 hover:border-[#387ed1]/40 transition-all shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{s.sector}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-semibold">{s.volumeRatio}x Vol</span>
                  <span
                    className={`flex items-center gap-0.5 font-bold text-xs ${
                      isPos ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPos ? `+${s.changePct}%` : `${s.changePct}%`}</span>
                  </span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden relative">
                <motion.div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPos ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

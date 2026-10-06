"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function MarketBreadthGauge() {
  const [advances, setAdvances] = useState(1480);
  const [declines, setDeclines] = useState(720);
  const [unchanged] = useState(110);
  const [fiiFlowCr, setFiiFlowCr] = useState(1842.5);
  const [diiFlowCr, setDiiFlowCr] = useState(2150.0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdvances((prev) => Math.min(1800, Math.max(1100, prev + Math.floor((Math.random() - 0.48) * 20))));
      setDeclines((prev) => Math.min(1100, Math.max(500, prev + Math.floor((Math.random() - 0.52) * 20))));
      setFiiFlowCr((prev) => parseFloat((prev + (Math.random() - 0.45) * 15).toFixed(1)));
      setDiiFlowCr((prev) => parseFloat((prev + (Math.random() - 0.45) * 12).toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const total = advances + declines + unchanged;
  const advancePct = Math.round((advances / total) * 100);
  const declinePct = Math.round((declines / total) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#0c0c12] border border-[#222234] shadow-2xl font-sans text-zinc-100 space-y-5 select-none transform-gpu">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f1f30] pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              NSE Market Breadth &amp; Institutional Capital Flow
            </h3>
            <p className="text-xs text-zinc-400">
              Advances/Declines ratio and FII/DII Net Cash Market Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Net Institutional Buying:</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase text-[11px]">
            +₹{(fiiFlowCr + diiFlowCr).toFixed(1)} Cr TODAY
          </span>
        </div>
      </div>

      {/* Advance / Decline Bar */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-bold">Advances: {advances} ({advancePct}%)</span>
          <span className="text-zinc-400">Unchanged: {unchanged}</span>
          <span className="text-rose-400 font-bold">Declines: {declines} ({declinePct}%)</span>
        </div>

        <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden flex">
          <motion.div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${advancePct}%` }}
          />
          <motion.div
            className="h-full bg-zinc-600 transition-all duration-500"
            style={{ width: `${Math.round((unchanged / total) * 100)}%` }}
          />
          <motion.div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${declinePct}%` }}
          />
        </div>
      </div>

      {/* FII vs DII Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono pt-2">
        <div className="p-4 rounded-2xl bg-[#13131c] border border-[#222234] flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold">FII / FPI Net Flow</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">+₹{fiiFlowCr.toLocaleString()} Cr</div>
            <span className="text-[10px] text-zinc-500">Foreign Portfolio Investors</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase">
            ACCUMULATING
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#13131c] border border-[#222234] flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold">DII Net Flow</span>
            <div className="text-xl font-black text-sky-400 mt-0.5">+₹{diiFlowCr.toLocaleString()} Cr</div>
            <span className="text-[10px] text-zinc-500">Domestic Mutual Funds &amp; LIC</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-bold border border-sky-500/30 uppercase">
            BUYING
          </span>
        </div>
      </div>
    </div>
  );
}

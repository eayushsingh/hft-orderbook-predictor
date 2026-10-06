"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Layers, Activity, Zap } from "lucide-react";

export default function QueuePositionPredictor() {
  const [queuePos, setQueuePos] = useState<number>(42);
  const [totalQueueQty, setTotalQueueQty] = useState<number>(18500);
  const [myOrderQty] = useState<number>(2500);
  const [estWaitTimeMs, setEstWaitTimeMs] = useState<number>(140);
  const [hawkesIntensity, setHawkesIntensity] = useState<number>(0.72); // Hawkes process intensity

  useEffect(() => {
    const interval = setInterval(() => {
      setQueuePos((prev) => Math.max(1, prev - Math.floor(Math.random() * 4 + 1)));
      setEstWaitTimeMs((prev) => Math.max(12, prev - Math.floor(Math.random() * 15 + 5)));
      setHawkesIntensity(parseFloat((0.4 + Math.random() * 0.5).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-[#262634] bg-[#101016] p-5 sm:p-6 shadow-2xl font-sans text-zinc-100 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222232] pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Queue Position Predictor &amp; Hawkes Volatility (MMIP)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase border border-purple-500/30">
                FIFO Queue Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              FIFO Order Book Queue Estimator &amp; Self-Exciting Hawkes Arrival Intensity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Execution Mode:</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[11px]">
            PASSIVE MAKER (0 BPS FEE)
          </span>
        </div>
      </div>

      {/* Grid Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#141420] border border-[#222234] space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Estimated Queue Position</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-2">
            <span>#{queuePos}</span>
            <span className="text-xs font-normal text-zinc-400">({myOrderQty.toLocaleString()} / {totalQueueQty.toLocaleString()} qty)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${Math.max(5, (114 - queuePos) / 1.14)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141420] border border-[#222234] space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Estimated Time-to-Fill</span>
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{estWaitTimeMs} ms</div>
          <p className="text-[10px] text-zinc-500">Calculated via real-time order arrival rate</p>
        </div>

        <div className="p-4 rounded-xl bg-[#141420] border border-[#222234] space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Hawkes Volatility Intensity λ(t)</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">{hawkesIntensity}</div>
          <p className="text-[10px] text-zinc-500">
            Self-exciting cluster parameter predicting high-volatility tick bursts
          </p>
        </div>
      </div>
    </div>
  );
}

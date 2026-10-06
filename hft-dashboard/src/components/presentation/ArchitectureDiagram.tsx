"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap } from "lucide-react";

export function ArchitectureDiagram() {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
    {
      id: 1,
      title: "1. Market Data Ingestion Feed",
      subtitle: "Binary WebSocket & TCP Feed Adapters",
      description: "Direct binary ticker feeds from NSE/BSE & Binance streamed via Zerodha Kite Connect & DhanHQ adapters into thread-affine worker cores.",
      metrics: "Sub-100µs Ingestion | Lock-Free Socket",
      color: "border-[#387ed1] text-[#387ed1] bg-[#387ed1]/10",
    },
    {
      id: 2,
      title: "2. Lock-Free LMAX Disruptor Ring Buffer",
      subtitle: "1,048,576 Circular Event Slots",
      description: "Pre-allocated Memory ByteBuffers eliminate Java JVM garbage collection pauses. Single-writer sequence barriers guarantee O(1) deterministic processing.",
      metrics: "0 MB GC Overhead | 1.04M Slots",
      color: "border-purple-500 text-purple-400 bg-purple-500/10",
    },
    {
      id: 3,
      title: "3. Microstructure & OBI Engine",
      subtitle: "Hawkes Volatility & VPIN Radar",
      description: "Calculates Order Book Imbalance (OBI), VWAP Micro-Price drift, and Volume-Synchronized Probability of Toxicity (VPIN) across 10 depth levels.",
      metrics: "94.8% OBI Accuracy | Hawkes λ(t)",
      color: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
    },
    {
      id: 4,
      title: "4. Direct Market Access (DMA) Execution",
      subtitle: "O(1) Matching & Order Routing",
      description: "Doubly-linked price level tree structures execute market sweeps, iceberg detection, and limit order queue tracking under 0.8ms tick-to-trade latency.",
      metrics: "< 0.8ms Latency | O(1) Execution",
      color: "border-amber-500 text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <div className="w-full rounded-3xl bg-[#0a0a10] border border-[#222234] p-6 sm:p-8 shadow-2xl font-sans text-zinc-100 space-y-8 select-none transform-gpu">
      {/* Title */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#387ed1]/10 border border-[#387ed1]/30 text-[#387ed1] text-xs font-mono font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>System Architecture &amp; Data Pipeline Spec</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          LMAX Disruptor Lock-Free Telemetry Pipeline
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono">
          High-performance, zero-allocation microsecond execution architecture for Indian Option Markets
        </p>
      </div>

      {/* Interactive Stage Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        {stages.map((stg) => {
          const isActive = activeStage === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => setActiveStage(stg.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? `${stg.color} shadow-lg scale-[1.02]`
                  : "bg-[#12121c] border-[#222232] text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              <div className="text-xs font-bold font-mono">{stg.title}</div>
              <div className="text-[10px] opacity-80 mt-1">{stg.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <motion.div
        key={activeStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-2xl bg-[#12121a] border border-[#222234] space-y-4 font-mono"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#387ed1]" />
            <h3 className="text-base font-bold text-white">
              {stages[activeStage - 1].title} — Technical Deep Dive
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#387ed1]/15 text-[#387ed1] border border-[#387ed1]/30 text-xs font-bold">
            {stages[activeStage - 1].metrics}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          {stages[activeStage - 1].description}
        </p>
      </motion.div>
    </div>
  );
}

export default ArchitectureDiagram;

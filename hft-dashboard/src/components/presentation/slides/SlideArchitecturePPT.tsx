'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sliders, Sparkles } from 'lucide-react';

export const SlideArchitecturePPT: React.FC = () => {
  const [eventRate, setEventRate] = useState(1000000);

  const bufferUtilizationPct = Math.min(98, Math.round((eventRate / 1500000) * 100));
  const estimatedLatencyUs = (0.42 * (1 + bufferUtilizationPct / 500)).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-2"
    >
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase">
          <Cpu className="w-3.5 h-3.5" /> Slide 02 &bull; High-Frequency System Architecture
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          Lock-Free LMAX Disruptor Ring Buffer &amp; Zero-Allocation Pipeline
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse hidden sm:inline-block" />
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Sub-microsecond end-to-end telemetry designed to prevent garbage collection pauses under peak 1M+ event loads.
        </p>
      </div>

      {/* Interactive Load Simulator */}
      <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> Interactive Disruptor Load Simulator
          </h3>
          <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
            P99 Latency: {estimatedLatencyUs} µs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                <span>Simulated Tick Rate:</span>
                <span className="text-cyan-400 font-bold font-mono">{eventRate.toLocaleString()} events/sec</span>
              </div>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={100000}
                value={eventRate}
                onChange={(e) => setEventRate(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-inner">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Ring Buffer Utilization:</span>
              <span className="font-mono font-bold text-cyan-400">{bufferUtilizationPct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${bufferUtilizationPct}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span>Garbage Collection Pauses:</span>
              <span className="text-emerald-400 font-bold">0.0 ms (ZERO-GC)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

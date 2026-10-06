'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, ArrowRight, Layers, ShieldCheck, Server } from 'lucide-react';

export const SlideArchitecturePPT: React.FC = () => {
  return (
    <div className="space-y-8 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase">
          <Cpu className="w-3.5 h-3.5" /> Slide 02 • High-Frequency System Architecture
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Lock-Free LMAX Disruptor Ring Buffer &amp; Zero-Allocation Pipeline
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Sub-microsecond end-to-end telemetry designed to prevent garbage collection pauses under peak 1M+ event loads.
        </p>
      </div>

      {/* Architecture Flowchart */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" /> End-to-End Co-Located Processing Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Exchange TCP', desc: 'Direct binary tick stream from NSE/BSE', time: '0.08 µs', color: 'border-slate-800 bg-slate-900' },
            { step: '02', title: 'Feed Normalizer', desc: 'Zero-copy binary struct parser', time: '0.10 µs', color: 'border-slate-800 bg-slate-900' },
            { step: '03', title: 'LMAX Ring Buffer', desc: 'Lock-free memory ring (1M+ events/s)', time: '0.06 µs', color: 'border-cyan-500/40 bg-cyan-500/10' },
            { step: '04', title: 'Alpha Predictor', desc: 'OBI & VPIN micro-price drift calculation', time: '0.12 µs', color: 'border-slate-800 bg-slate-900' },
            { step: '05', title: 'Broker Gateway', desc: 'Concurrent smart order router', time: '0.06 µs', color: 'border-emerald-500/40 bg-emerald-500/10' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border text-center space-y-2 relative ${item.color}`}>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">{item.step}</span>
              <div className="text-xs font-bold text-white">{item.title}</div>
              <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                {item.time}
              </div>
            </div>
          ))}
        </div>

        {/* Latency Budget Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Latency Budget Allocation (Total P99: <strong>0.42 µs</strong>)</span>
            <span className="text-emerald-400 font-bold">100x Faster than Retail REST APIs</span>
          </div>

          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            <div className="bg-cyan-500 h-full w-[19%]" title="Exchange Feed: 0.08µs" />
            <div className="bg-teal-500 h-full w-[24%]" title="Feed Normalizer: 0.10µs" />
            <div className="bg-emerald-400 h-full w-[14%]" title="Disruptor Ring: 0.06µs" />
            <div className="bg-amber-400 h-full w-[29%]" title="Alpha Predictor: 0.12µs" />
            <div className="bg-purple-500 h-full w-[14%]" title="Broker Gateway: 0.06µs" />
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const SlideVisionAndMission: React.FC = () => {
  return (
    <div className="space-y-8 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
          <Target className="w-3.5 h-3.5" /> Slide 01 • Vision &amp; Institutional Advantage
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Eliminating the Information &amp; Latency Gap for Retail Quant Traders
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Co-located high-frequency trading desks have historically dominated market liquidity. LALAN levels the playing field.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Retail Setup */}
        <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Traditional Retail Environment
            </h3>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono">
              High Latency / Asymmetric
            </span>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Delayed L2 Feeds:</strong> 250ms–500ms REST polling with missing L5 depth data.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Ad-Hoc Manual Trading:</strong> Emotional execution causing severe slippage and impulse trades.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Unmanaged Portfolio Drift:</strong> Passive un-rebalanced allocations suffering 15%+ drag.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Tax Drag:</strong> Taxable gains without systematic tax-loss harvesting offsets.</span>
            </li>
          </ul>
        </div>

        {/* LALAN Institutional Alpha Engine */}
        <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-xl shadow-emerald-500/5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> LALAN Institutional Advantage
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
              Sub-Microsecond Co-Located
            </span>
          </div>

          <ul className="space-y-3 text-xs text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>0.42µs Binary Feeds:</strong> Zero-allocation LMAX Disruptor streaming full L2 order book depth.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Predictive Order Flow:</strong> OBI &amp; VPIN toxicity scoring forecasting tick direction.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Autonomous Robo-Advisor:</strong> Black-Litterman model with dynamic threshold rebalancing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Automated Tax Harvester:</strong> 30-day wash-sale protected ETF swaps preserving capital.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Key Takeaways Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {[
          { label: 'Latency Advantage', val: '0.42 µs', sub: 'P99 Execution' },
          { label: 'Throughput', val: '1M+ req/sec', sub: 'Zero-GC Pipeline' },
          { label: 'Liquidity Analyzed', val: '₹500+ Cr', sub: 'NSE & BSE Depth' },
          { label: 'Broker Bridge', val: '5 Top Brokers', sub: 'Unified Router' },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{item.label}</div>
            <div className="text-base font-extrabold text-emerald-400">{item.val}</div>
            <div className="text-[10px] text-slate-500">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

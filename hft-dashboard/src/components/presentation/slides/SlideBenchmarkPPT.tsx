'use client';

import React from 'react';
import { Award, CheckCircle2, XCircle, Minus } from 'lucide-react';

export const SlideBenchmarkPPT: React.FC = () => {
  return (
    <div className="space-y-8 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
          <Award className="w-3.5 h-3.5" /> Slide 06 • Institutional Benchmark Comparison
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          LALAN Engine vs Institutional Terminals &amp; Retail Platforms
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Comparative feature evaluation across latency, market depth prediction, portfolio automation, and cost efficiency.
        </p>
      </div>

      {/* Benchmark Matrix Table */}
      <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
              <th className="p-3.5 font-bold">Feature / Metric</th>
              <th className="p-3.5 font-bold text-emerald-400">LALAN HFT Platform</th>
              <th className="p-3.5 font-bold text-slate-300">Bloomberg Terminal</th>
              <th className="p-3.5 font-bold text-slate-300">Refinitiv Eikon</th>
              <th className="p-3.5 font-bold text-slate-400">Standard Retail Web</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
            <tr>
              <td className="p-3.5 font-semibold text-white">Order Book Latency</td>
              <td className="p-3.5 text-emerald-400 font-bold font-mono">0.42 µs (Co-located)</td>
              <td className="p-3.5 font-mono">15.0 ms</td>
              <td className="p-3.5 font-mono">20.0 ms</td>
              <td className="p-3.5 font-mono text-rose-400">250.0 ms</td>
            </tr>
            <tr>
              <td className="p-3.5 font-semibold text-white">L2 Order Book Depth</td>
              <td className="p-3.5 text-emerald-400 font-bold">Full Depth + OBI</td>
              <td className="p-3.5">Full L2 Depth</td>
              <td className="p-3.5">Full L2 Depth</td>
              <td className="p-3.5 text-slate-400">Top 5 Depth Only</td>
            </tr>
            <tr>
              <td className="p-3.5 font-semibold text-white">Micro-Price Drift AI</td>
              <td className="p-3.5 text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Native Real-Time
              </td>
              <td className="p-3.5 text-slate-400 flex items-center gap-1">
                <Minus className="w-4 h-4" /> Custom Add-on
              </td>
              <td className="p-3.5 text-slate-400 flex items-center gap-1">
                <Minus className="w-4 h-4" /> Custom Add-on
              </td>
              <td className="p-3.5 text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Unavailable
              </td>
            </tr>
            <tr>
              <td className="p-3.5 font-semibold text-white">Autonomous Robo-Advisor</td>
              <td className="p-3.5 text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Black-Litterman
              </td>
              <td className="p-3.5 text-slate-400 flex items-center gap-1">
                <Minus className="w-4 h-4" /> API Integration
              </td>
              <td className="p-3.5 text-slate-400 flex items-center gap-1">
                <Minus className="w-4 h-4" /> API Integration
              </td>
              <td className="p-3.5 text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Unavailable
              </td>
            </tr>
            <tr>
              <td className="p-3.5 font-semibold text-white">Tax-Loss Harvesting (TLH)</td>
              <td className="p-3.5 text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 30-Day Wash Guard
              </td>
              <td className="p-3.5 text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Manual Setup
              </td>
              <td className="p-3.5 text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Manual Setup
              </td>
              <td className="p-3.5 text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Unavailable
              </td>
            </tr>
            <tr>
              <td className="p-3.5 font-semibold text-white">Monthly Subscription Cost</td>
              <td className="p-3.5 text-emerald-400 font-bold font-mono">₹0 / Included</td>
              <td className="p-3.5 font-mono text-rose-400">$2,400 / month</td>
              <td className="p-3.5 font-mono text-rose-400">$1,800 / month</td>
              <td className="p-3.5 font-mono">Free (Standard)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

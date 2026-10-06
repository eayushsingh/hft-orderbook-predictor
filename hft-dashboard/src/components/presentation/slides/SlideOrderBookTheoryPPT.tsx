'use client';

import React from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export const SlideOrderBookTheoryPPT: React.FC = () => {
  return (
    <div className="space-y-8 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
          <Activity className="w-3.5 h-3.5" /> Slide 03 • Quantitative Market Microstructure Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Micro-Price Drift &amp; Order Book Imbalance (OBI) Equations
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Mathematical foundations powering tick-level directional forecasting and institutional spoofing detection.
        </p>
      </div>

      {/* 4 Microstructure Equations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* OBI */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">1. Order Book Imbalance (OBI)</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
              Range: [-1.0, +1.0]
            </span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl font-mono text-center text-xs text-emerald-300 border border-slate-800">
            OBI = (Volume_Bid - Volume_Ask) / (Volume_Bid + Volume_Ask)
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Measures instantaneous pressure imbalance at top L2 depth levels to predict sub-second price drift.
          </p>
        </div>

        {/* Micro-Price */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">2. Micro-Price Drift Equation</h3>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">
              Fair Value Estimator
            </span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl font-mono text-center text-xs text-cyan-300 border border-slate-800">
            P_micro = (P_ask * V_bid + P_bid * V_ask) / (V_bid + V_ask)
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Weights bid and ask quotes by opposing liquidity depth, eliminating spread arbitrage noise.
          </p>
        </div>

        {/* VPIN Toxicity */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">3. VPIN Flow Toxicity Radar</h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
              Toxicity Alert
            </span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl font-mono text-center text-xs text-amber-300 border border-slate-800">
            VPIN = Sum(|V_buy - V_sell|) / Total_Bucket_Volume
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Detects informed institutional flow preceding sharp volatility spikes and liquidity crashes.
          </p>
        </div>

        {/* Iceberg Detection */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">4. Hidden Iceberg Detection</h3>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono font-bold">
              Hidden Order Radar
            </span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl font-mono text-center text-xs text-purple-300 border border-slate-800">
            Replenish_Ratio = Executed_Volume / Displayed_Size &gt; 3.5
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Identifies iceberg order slices hidden inside L2 book queues by tracking instant queue refills.
          </p>
        </div>
      </div>
    </div>
  );
};

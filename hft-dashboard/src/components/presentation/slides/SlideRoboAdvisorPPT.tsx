'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sliders, Sparkles, PieChart, ShieldCheck } from 'lucide-react';

export const SlideRoboAdvisorPPT: React.FC = () => {
  const [riskScore, setRiskScore] = useState(65);

  const equityTarget = Math.min(95, Math.max(10, Math.round(riskScore * 0.9)));
  const bondTarget = 100 - equityTarget;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-2"
    >
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold uppercase">
          <Bot className="w-3.5 h-3.5" /> Slide 04 &bull; Autonomous Robo-Advisor Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          Black-Litterman Target Allocations &amp; Tax-Loss Harvesting (TLH)
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse hidden sm:inline-block" />
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Hands-off algorithmic asset management, continuous drift tracking, and 30-day wash-sale protected tax optimization.
        </p>
      </div>

      {/* Interactive Risk Slider & Target Preview */}
      <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" /> Interactive Risk Profile Model Simulator
          </h3>
          <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
            Score: {riskScore} / 100
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                <span>Investor Risk Profile:</span>
                <span className="text-purple-400 font-bold font-mono">{riskScore} / 100</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={riskScore}
                onChange={(e) => setRiskScore(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-inner">
            <div className="flex justify-between text-xs font-medium font-mono">
              <span>Equity Target: <strong className="text-emerald-400">{equityTarget}%</strong></span>
              <span>Fixed Income: <strong className="text-cyan-400">{bondTarget}%</strong></span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <motion.div animate={{ width: `${equityTarget}%` }} className="h-full bg-emerald-400" />
              <motion.div animate={{ width: `${bondTarget}%` }} className="h-full bg-cyan-400" />
            </div>
            <div className="text-[11px] text-slate-400 pt-1 flex justify-between font-mono">
              <span>Dynamic Rebalance Drift:</span>
              <span className="text-emerald-400 font-bold">&plusmn;5.0% Trigger</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

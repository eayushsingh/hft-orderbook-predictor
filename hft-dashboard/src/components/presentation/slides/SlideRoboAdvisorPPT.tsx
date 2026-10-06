'use client';

import React from 'react';
import { Bot, RefreshCw, DollarSign, Activity, CheckCircle2 } from 'lucide-react';

export const SlideRoboAdvisorPPT: React.FC = () => {
  return (
    <div className="space-y-8 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold uppercase">
          <Bot className="w-3.5 h-3.5" /> Slide 04 • Autonomous Robo-Advisor Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Black-Litterman Target Allocations &amp; Tax-Loss Harvesting (TLH)
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Hands-off algorithmic asset management, continuous drift tracking, and 30-day wash-sale protected tax optimization.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Black-Litterman MPT Allocation</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
              10 Asset Classes
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Combines market equilibrium returns with investor risk tolerance (1–100 scale) to construct optimal ETF weights (VOO, VB, VEA, VWO, BND).
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Dynamic Drift Rebalancer</h3>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">
              Drift Threshold: 5.0%
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Monitors target weight deviations. Generates trade orders automatically to trim overweight assets and top up underweight buckets ($50 min slice).
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Tax-Loss Harvester (TLH)</h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
              Wash-Sale Guard
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Identifies tax lots with unrealized capital losses and executes correlated substitute ETF swaps (VOO → SCHX) to preserve market exposure.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Monte Carlo Forecast</h3>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono font-bold">
              1,000 Simulations
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Runs 1,000 Geometric Brownian Motion iterations with inflation discounting to project 10th, 50th, and 90th percentile wealth growth trajectories.
          </p>
        </div>
      </div>
    </div>
  );
};

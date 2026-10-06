'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Cpu,
  Bot,
  Globe,
  TrendingUp,
  ShieldCheck,
  Activity,
  Award,
  Sparkles,
  Layers,
} from 'lucide-react';
import { PlatformMetricItem } from './types';

export const PLATFORM_METRICS: PlatformMetricItem[] = [
  {
    id: 'throughput',
    label: 'Engine Throughput',
    value: '1,000,000+',
    change: 'Events / sec',
    isPositive: true,
    description: 'Zero-allocation LMAX ring buffer pipeline',
  },
  {
    id: 'latency',
    label: 'Order Book Latency',
    value: '0.42 µs',
    change: 'P99 Co-located',
    isPositive: true,
    description: 'Direct NSE/BSE TCP binary socket bridge',
  },
  {
    id: 'liquidity',
    label: 'Liquidity Analyzed',
    value: '₹500+ Cr',
    change: 'Daily Volume',
    isPositive: true,
    description: 'Real-time depth L2 OBI & VPIN tracking',
  },
  {
    id: 'uptime',
    label: 'System Availability',
    value: '99.999%',
    change: 'Five-Nines Uptime',
    isPositive: true,
    description: 'Hot-failover redundant broker gateways',
  },
];

export const WhatWeDoOverview: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Executive Summary Hero */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Executive Briefing • What We Do</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug max-w-3xl">
            Democratizing Institutional HFT Co-Location &amp; Autonomous Wealth Management
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            LALAN Engine is an ultra-low latency quantitative trading platform engineered to bridge the gap between institutional co-located high-frequency trading desks and active quantitative traders. By combining a lock-free LMAX Disruptor matching core with machine-learning order book prediction and an autonomous Black-Litterman Robo-Advisor, we empower investors with microsecond execution advantage and automated portfolio optimization.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/70 border border-slate-800/80 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">HFT Co-Location Core</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Sub-microsecond zero-GC ring buffer pipeline handling order book depth matching and ticket routing.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Quant AI Alpha Engine</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Order Book Imbalance (OBI), Micro-Price drift forecasting, and VPIN toxicity radar.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Autonomous Robo-Advisor</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Black-Litterman target allocations, dynamic drift rebalancer, and wash-sale protected Tax Loss Harvesting.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Multi-Broker API Bridge</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Unified low-latency bridge across Zerodha, DhanHQ, Upstox, Groww, and AngelOne APIs.
            </p>
          </div>
        </div>
      </div>

      {/* Live Platform Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORM_METRICS.map((metric) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2 backdrop-blur-xl"
          >
            <span className="text-xs text-slate-400 font-medium">{metric.label}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {metric.value}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {metric.change}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">{metric.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

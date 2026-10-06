'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const SlideRoadmapPPT: React.FC = () => {
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
          <Rocket className="w-3.5 h-3.5" /> Slide 11 &bull; Strategic Enterprise Roadmap
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          2026–2027 Innovation &amp; Expansion Vision
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse hidden sm:inline-block" />
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Continuous feature delivery roadmap expanding options delta hedging, crypto co-location, and institutional FIX protocol integration.
        </p>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            q: 'Q4 2026',
            title: 'Robo-Advisor & TLH Hub',
            status: 'DEPLOYED',
            desc: 'Autonomous Black-Litterman model, drift rebalancer & Tax-Loss Harvester.',
            isComplete: true,
          },
          {
            q: 'Q1 2027',
            title: 'Option Greeks Delta Radar',
            status: 'IN DEVELOPMENT',
            desc: 'Real-time gamma & vega risk surface modeling with automated delta-neutral hedging.',
            isComplete: false,
          },
          {
            q: 'Q2 2027',
            title: 'Crypto Perpetual Arbitrage',
            status: 'PLANNED',
            desc: 'Cross-exchange funding rate & spot-perpetual basis arbitrage co-location.',
            isComplete: false,
          },
          {
            q: 'Q3 2027',
            title: 'FIX 5.0 Engine Bridge',
            status: 'PLANNED',
            desc: 'Institutional FIX 4.4 / 5.0 protocol engine for prime broker direct execution.',
            isComplete: false,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`bg-slate-950 border rounded-2xl p-5 space-y-3 shadow-xl transition-all ${
              item.isComplete ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-slate-400">{item.q}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                  item.isComplete
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.isComplete ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {item.status}
              </span>
            </div>
            <h3 className="font-bold text-white text-sm">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

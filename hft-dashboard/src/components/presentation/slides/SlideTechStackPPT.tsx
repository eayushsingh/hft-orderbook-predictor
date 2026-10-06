'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Cpu, Server, Database } from 'lucide-react';

export const SlideTechStackPPT: React.FC = () => {
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
          <Layers className="w-3.5 h-3.5" /> Slide 07 &bull; Institutional Technology Stack
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          Modern Low-Latency Full-Stack Engineering Architecture
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse hidden sm:inline-block" />
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Built on lock-free memory ring buffers, reactive Next.js 16 server components, and SQLite WAL persistence.
        </p>
      </div>

      {/* Tech Stack Components */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 space-y-3 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">01. Backend Engine</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="font-bold text-white text-base">Java 21 LTS &amp; Disruptor</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Zero-allocation memory layout, LMAX Disruptor ring buffer, off-heap native memory buffers, and TCP socket co-location.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-3 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">02. Web Frontend Core</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-bold text-white text-base">Next.js 16 &amp; Turbopack</h3>
          <p className="text-xs text-slate-400 leading-normal">
            React 19 Server Components, Framer Motion micro-animations, Tailwind CSS v4 glassmorphic design system.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">03. Persistence &amp; QA</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-bold text-white text-base">SQLite WAL &amp; Vitest</h3>
          <p className="text-xs text-slate-400 leading-normal">
            High-concurrency Write-Ahead Logging (WAL) SQLite, Vitest quantitative engine tests, and Playwright E2E suite.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

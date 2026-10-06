'use client';

import React from 'react';
import { Layers } from 'lucide-react';

export const SlideTechStackPPT: React.FC = () => {
  return (
    <div className="space-y-8 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase">
          <Layers className="w-3.5 h-3.5" /> Slide 07 • Institutional Technology Stack
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Modern Low-Latency Full-Stack Engineering Architecture
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Built on lock-free memory ring buffers, reactive Next.js 16 server components, and SQLite WAL persistence.
        </p>
      </div>

      {/* Tech Stack Components */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">01. Low-Latency Backend</div>
          <h3 className="font-bold text-white text-base">Java 21 LTS &amp; Disruptor</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Zero-allocation memory layout, LMAX Disruptor ring buffer, off-heap native memory buffers, and TCP socket co-location.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">02. Web Frontend Core</div>
          <h3 className="font-bold text-white text-base">Next.js 16 &amp; Turbopack</h3>
          <p className="text-xs text-slate-400 leading-normal">
            React 19 Server Components, Framer Motion micro-animations, Tailwind CSS v4 glassmorphic design system.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">03. Persistence &amp; Testing</div>
          <h3 className="font-bold text-white text-base">SQLite WAL &amp; Playwright</h3>
          <p className="text-xs text-slate-400 leading-normal">
            High-concurrency Write-Ahead Logging (WAL) SQLite, Vitest quantitative engine tests, and Playwright E2E suite.
          </p>
        </div>
      </div>
    </div>
  );
};

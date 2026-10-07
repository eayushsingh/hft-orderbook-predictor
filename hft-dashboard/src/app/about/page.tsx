'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LalanSiteHeader from '@/components/LalanSiteHeader';
import LalanSiteFooter from '@/components/LalanSiteFooter';
import { WhatWeDoOverview } from '@/components/presentation/WhatWeDoOverview';
import { InteractivePresentationDeck } from '@/components/presentation/InteractivePresentationDeck';
import { Sparkles, Presentation, Info } from 'lucide-react';

/**
 * Platform Presentation & About Page Component (`/about`)
 * 
 * Humanized Explanation for Maintainers:
 * Dual-view presentation workspace:
 * 1. Slide Deck View: 11-slide interactive slide deck with keyboard controls (Arrow keys, J/K, Fullscreen).
 * 2. Executive Overview View: Platform metrics, architecture diagram, and capability matrix.
 */
export default function AboutPage() {
  const [viewMode, setViewMode] = useState<'OVERVIEW' | 'PRESENTATION'>('PRESENTATION');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      <LalanSiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header & Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Institutional Platform Briefing &amp; Presentation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              About LALAN Quantitative Platform
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('PRESENTATION')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'PRESENTATION'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-4 h-4" /> PPT Presentation Deck
            </button>
            <button
              type="button"
              onClick={() => setViewMode('OVERVIEW')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'OVERVIEW'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info className="w-4 h-4" /> What We Do Briefing
            </button>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === 'PRESENTATION' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <InteractivePresentationDeck />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <WhatWeDoOverview />
          </motion.div>
        )}
      </main>

      <LalanSiteFooter />
    </div>
  );
}

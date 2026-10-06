'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideVisionAndMission } from './slides/SlideVisionAndMission';
import { SlideArchitecturePPT } from './slides/SlideArchitecturePPT';
import { SlideOrderBookTheoryPPT } from './slides/SlideOrderBookTheoryPPT';
import { SlideRoboAdvisorPPT } from './slides/SlideRoboAdvisorPPT';
import { SlideMultiBrokerPPT } from './slides/SlideMultiBrokerPPT';
import { SlideBenchmarkPPT } from './slides/SlideBenchmarkPPT';
import { SlideTechStackPPT } from './slides/SlideTechStackPPT';
import { SlideRoadmapPPT } from './slides/SlideRoadmapPPT';
import { PresentationNavbarControls } from './PresentationNavbarControls';
import { SlideGridModal } from './SlideGridModal';
import { SpeakerNotesDrawer } from './SpeakerNotesDrawer';
import { exportPresentationSummaryMarkdown } from './presentationExporter';
import { usePresentationKeyboardNav } from './usePresentationKeyboardNav';
import { PresentationDeckState, PresentationSlide } from './types';

export const SLIDES_REGISTRY: PresentationSlide[] = [
  {
    id: 's1-vision',
    slideNumber: 1,
    title: 'Platform Vision & Institutional Advantage',
    subtitle: 'Democratizing ultra-low latency co-location and predictive AI order book telemetry.',
    category: 'OVERVIEW',
    iconName: 'Target',
    speakerNotes: 'Highlight the severe latency gap between traditional retail brokers (250ms+) vs LALAN co-located sub-microsecond architecture (0.42µs).',
    durationSeconds: 15,
    takeaways: [
      { title: 'Sub-Microsecond Latency', description: '0.42µs P99 co-located order book feed processing.' },
      { title: 'Predictive Alpha', description: 'Order Book Imbalance (OBI) & VPIN toxicity forecasting.' },
    ],
  },
  {
    id: 's2-arch',
    slideNumber: 2,
    title: 'High-Frequency System Architecture',
    subtitle: 'Lock-free LMAX Disruptor ring buffer and zero-allocation processing pipeline.',
    category: 'ARCHITECTURE',
    iconName: 'Cpu',
    speakerNotes: 'Explain zero garbage-collection allocation in Java 21, ring buffer ring size 1,048,576 slots, and 1M+ event throughput capability.',
    durationSeconds: 15,
    takeaways: [
      { title: 'Zero-GC Design', description: 'Eliminates Java garbage collection latency spikes.' },
      { title: 'Disruptor Core', description: 'Inter-thread ring buffer passing messages in nanoseconds.' },
    ],
  },
  {
    id: 's3-microstructure',
    slideNumber: 3,
    title: 'Quantitative Order Book Microstructure Engine',
    subtitle: 'Micro-Price drift equations, OBI metrics, and VPIN toxicity radar.',
    category: 'MICROSTRUCTURE',
    iconName: 'Activity',
    speakerNotes: 'Walk through the Order Book Imbalance equation OBI = (V_B - V_A)/(V_B + V_A) and explain how Micro-Price eliminates bid-ask spread noise.',
    durationSeconds: 15,
    takeaways: [
      { title: 'OBI Metric', description: 'Predicts directional tick drift over 1-10 tick horizons.' },
      { title: 'VPIN Radar', description: 'Alerts active traders before toxic volatility spikes.' },
    ],
  },
  {
    id: 's4-robo',
    slideNumber: 4,
    title: 'Autonomous Robo-Advisor Engine',
    subtitle: 'Black-Litterman MPT allocation model, dynamic rebalancing, and Tax-Loss Harvesting.',
    category: 'ROBO_ADVISOR',
    iconName: 'Bot',
    speakerNotes: 'Detail the 10 asset class ETF taxonomy, 5% drift threshold trigger, and 30-day wash-sale protected ETF swaps.',
    durationSeconds: 15,
    takeaways: [
      { title: 'Black-Litterman Allocation', description: 'Optimal risk-adjusted target weights across 10 asset buckets.' },
      { title: 'Tax Loss Harvesting', description: 'Harvests unrealized capital losses while maintaining exposure.' },
    ],
  },
  {
    id: 's5-multibroker',
    slideNumber: 5,
    title: 'Multi-Broker Low-Latency API Bridge',
    subtitle: 'Unified API gateway for Zerodha Kite, DhanHQ, Upstox, Groww, and AngelOne.',
    category: 'MULTI_BROKER',
    iconName: 'Globe',
    speakerNotes: 'Demonstrate automated OAuth session renewal and smart order routing with automatic hot-failover.',
    durationSeconds: 15,
    takeaways: [
      { title: '5 Top Brokerages', description: 'Zerodha, DhanHQ, Upstox, AngelOne, Groww.' },
      { title: 'Hot-Failover', description: 'Automatically reroutes order slices if broker API latency spikes.' },
    ],
  },
  {
    id: 's6-benchmark',
    slideNumber: 6,
    title: 'Institutional Benchmark Comparison Matrix',
    subtitle: 'Comprehensive evaluation against Bloomberg Terminal, Refinitiv Eikon, and retail platforms.',
    category: 'BENCHMARK',
    iconName: 'Award',
    speakerNotes: 'Highlight that LALAN offers co-located depth and autonomous portfolio engines at ₹0 cost compared to Bloomberg $2,400/mo.',
    durationSeconds: 15,
    takeaways: [
      { title: 'Cost Efficiency', description: '₹0 cost vs $2,400/mo institutional terminals.' },
      { title: 'Feature Parity', description: 'Full L2 depth, OBI prediction, and automated TLH.' },
    ],
  },
  {
    id: 's7-techstack',
    slideNumber: 7,
    title: 'High-Performance Technology Stack',
    subtitle: 'Modern low-latency architecture built with Java 21, Next.js 16 Turbopack, and SQLite WAL.',
    category: 'TECH_STACK',
    iconName: 'Layers',
    speakerNotes: 'Explain the separation between high-speed Java matching engine, Next.js 16 web interface, and Vitest/Playwright test suites.',
    durationSeconds: 15,
    takeaways: [
      { title: 'Full Stack Excellence', description: 'Java 21, Next.js 16, SQLite WAL, Vitest, Playwright.' },
    ],
  },
  {
    id: 's8-roadmap',
    slideNumber: 8,
    title: 'Strategic Enterprise Roadmap (2026-2027)',
    subtitle: 'Continuous delivery vision expanding option greeks delta hedging and FIX protocol bridges.',
    category: 'ROADMAP',
    iconName: 'Rocket',
    speakerNotes: 'Conclude presentation with 2026-2027 milestones: Delta-neutral hedging radar, crypto perpetuals co-location, and FIX 5.0 bridge.',
    durationSeconds: 15,
    takeaways: [
      { title: 'Option Greeks Radar', description: 'Automated delta-neutral option risk surface hedging.' },
      { title: 'FIX 5.0 Bridge', description: 'Direct prime brokerage institutional integration.' },
    ],
  },
];

export const InteractivePresentationDeck: React.FC = () => {
  const [deckState, setDeckState] = useState<PresentationDeckState>({
    currentSlideIndex: 0,
    isAutoPlaying: false,
    autoPlaySpeedSec: 10,
    showSpeakerNotes: false,
    showGridModal: false,
    isFullScreen: false,
    viewMode: 'PRESENTATION',
  });

  const totalSlides = SLIDES_REGISTRY.length;
  const currentSlide = SLIDES_REGISTRY[deckState.currentSlideIndex];

  // Auto-play slideshow timer
  useEffect(() => {
    if (!deckState.isAutoPlaying) return;

    const timer = setInterval(() => {
      setDeckState((prev) => ({
        ...prev,
        currentSlideIndex: (prev.currentSlideIndex + 1) % totalSlides,
      }));
    }, deckState.autoPlaySpeedSec * 1000);

    return () => clearInterval(timer);
  }, [deckState.isAutoPlaying, deckState.autoPlaySpeedSec, totalSlides]);

  const handlePrevSlide = () => {
    setDeckState((prev) => ({
      ...prev,
      currentSlideIndex: Math.max(0, prev.currentSlideIndex - 1),
    }));
  };

  const handleNextSlide = () => {
    setDeckState((prev) => ({
      ...prev,
      currentSlideIndex: Math.min(totalSlides - 1, prev.currentSlideIndex + 1),
    }));
  };

  const handleToggleAutoPlay = () => {
    setDeckState((prev) => ({ ...prev, isAutoPlaying: !prev.isAutoPlaying }));
  };

  const handleToggleFullScreen = () => {
    setDeckState((prev) => ({ ...prev, isFullScreen: !prev.isFullScreen }));
  };

  const handleToggleSpeakerNotes = () => {
    setDeckState((prev) => ({ ...prev, showSpeakerNotes: !prev.showSpeakerNotes }));
  };

  const handleToggleGridModal = () => {
    setDeckState((prev) => ({ ...prev, showGridModal: !prev.showGridModal }));
  };

  usePresentationKeyboardNav({
    onPrevSlide: handlePrevSlide,
    onNextSlide: handleNextSlide,
    onToggleFullScreen: handleToggleFullScreen,
    onCloseModals: () => setDeckState((prev) => ({ ...prev, showGridModal: false })),
  });

  return (
    <div
      className={`space-y-4 transition-all duration-300 ${
        deckState.isFullScreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto'
          : 'w-full'
      }`}
    >
      {/* Navigation Controls Bar */}
      <PresentationNavbarControls
        deckState={deckState}
        totalSlides={totalSlides}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
        onToggleAutoPlay={handleToggleAutoPlay}
        onToggleFullScreen={handleToggleFullScreen}
        onToggleSpeakerNotes={handleToggleSpeakerNotes}
        onToggleGridModal={handleToggleGridModal}
        onExportSummary={() => exportPresentationSummaryMarkdown(SLIDES_REGISTRY)}
      />

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          style={{ width: `${((deckState.currentSlideIndex + 1) / totalSlides) * 100}%` }}
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300"
        />
      </div>

      {/* Main Slide Card Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl min-h-[480px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {currentSlide.slideNumber === 1 && <SlideVisionAndMission />}
            {currentSlide.slideNumber === 2 && <SlideArchitecturePPT />}
            {currentSlide.slideNumber === 3 && <SlideOrderBookTheoryPPT />}
            {currentSlide.slideNumber === 4 && <SlideRoboAdvisorPPT />}
            {currentSlide.slideNumber === 5 && <SlideMultiBrokerPPT />}
            {currentSlide.slideNumber === 6 && <SlideBenchmarkPPT />}
            {currentSlide.slideNumber === 7 && <SlideTechStackPPT />}
            {currentSlide.slideNumber === 8 && <SlideRoadmapPPT />}
          </motion.div>
        </AnimatePresence>

        {/* Speaker Notes Overlay */}
        <SpeakerNotesDrawer slide={currentSlide} isOpen={deckState.showSpeakerNotes} />
      </div>

      {/* Grid Modal Overview */}
      <SlideGridModal
        slides={SLIDES_REGISTRY}
        currentSlideIndex={deckState.currentSlideIndex}
        isOpen={deckState.showGridModal}
        onClose={handleToggleGridModal}
        onSelectSlide={(index) => setDeckState((prev) => ({ ...prev, currentSlideIndex: index }))}
      />
    </div>
  );
};

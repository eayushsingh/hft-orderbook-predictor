"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Activity,
  Globe,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass,
  Layers,
  ShieldCheck,
  Award,
} from "lucide-react";

export interface OnboardingGuideModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface OnboardingStep {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
  gradient: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    badge: "STEP 1 OF 5 · WELCOME",
    title: "Welcome to LALAN HFT Terminal",
    subtitle: "Sub-Millisecond Level-2 Order Book Engine",
    description:
      "Unlike traditional charting platforms (Zerodha, TradingView) that render lagging historical outputs, LALAN streams live exchange Level-2 order book depth with sub-millisecond latency. You see institutional quote accumulation before market sweeps occur.",
    icon: Zap,
    highlights: [
      "Sub-millisecond L2 depth processing (<0.8ms stream latency)",
      "Zero-GC primitive LMAX Disruptor ring buffer engine",
      "Live order book imbalance (OBI) accumulation tracking",
    ],
    gradient: "from-[#387ed1] to-sky-500",
  },
  {
    id: 2,
    badge: "STEP 2 OF 5 · SIGNALS",
    title: "Understanding OBI & Micro-Price",
    subtitle: "Institutional Predictive Liquidity Telemetry",
    description:
      "Order Book Imbalance (OBI) measures bid vs. ask depth density across top-5 levels. An OBI > +0.35 triggers a STRONG BUY signal. Volume-Weighted Micro-Price predicts exact quote drift direction before executed ticks.",
    icon: Activity,
    highlights: [
      "OBI Formula: (Bid Vol - Ask Vol) / (Bid Vol + Ask Vol)",
      "Micro-Price VWAP drift calculation for next tick forecast",
      "VPIN Toxicity metric detecting institutional sweep walls",
    ],
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: 3,
    badge: "STEP 3 OF 5 · INTELLIGENCE",
    title: "Multi-Source Intelligence Hub",
    subtitle: "Screener.in, NSE, TradingView & Trendlyne All-In-One",
    description:
      "Eliminate context switching between multiple tabs. The Screener & NSE Hub embeds live P/E ratios, promoter shareholding, SEBI Reg 30 disclosures, block deals, FII net flows, and delivery volume % directly in your terminal window.",
    icon: Globe,
    highlights: [
      "Screener.in fundamentals (P/E, ROCE, ROE, DII/FII holding)",
      "NSE India corporate announcements & bulk deal feed",
      "TradingView technical ratings & Moneycontrol FII net flows",
    ],
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: 4,
    badge: "STEP 4 OF 5 · EXECUTION",
    title: "1-Click Order Execution & Multi-Broker",
    subtitle: "Instant Depth Ladder Orders & Position Tracking",
    description:
      "Click 'B' or 'S' on any ticker in the Marketwatch sidebar to launch the instant order ticket. Execute MIS (Intraday) or CNC (Delivery) orders with instant PnL tracking and multi-broker support (DhanHQ, Groww, Angel One, Upstox).",
    icon: BookOpen,
    highlights: [
      "Instant limit & market order execution ticket",
      "Live position PnL tracking & 1-click square off all",
      "Zero brokerage on equity delivery investments (₹0)",
    ],
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: 5,
    badge: "STEP 5 OF 5 · PRO ACCESS",
    title: "14-Day Pro Free Trial Activated",
    subtitle: "$0 Required Today · Full Unlocked Features",
    description:
      "Your account has been automatically upgraded to the PRO QUANT 14-Day Free Trial. Enjoy unlimited Level-2 depth streaming, AI microstructure summaries, and institutional scoring with zero credit card entry.",
    icon: Award,
    highlights: [
      "100% unlocked access for 14 full days",
      "No credit card or auto-debit required",
      "Seamless transition to free Retail plan upon trial finish",
    ],
    gradient: "from-rose-500 to-pink-500",
  },
];

export default function OnboardingGuideModal({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: OnboardingGuideModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isModalVisible = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Auto-trigger on first visit if not previously completed
  useEffect(() => {
    if (externalIsOpen !== undefined) return;
    try {
      const completed = localStorage.getItem("lalan_onboarding_completed");
      if (!completed) {
        // Small delay so user sees dashboard first
        const timer = setTimeout(() => {
          setInternalIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("Storage check fallback for onboarding guide", e);
    }
  }, [externalIsOpen]);

  const handleClose = () => {
    try {
      localStorage.setItem("lalan_onboarding_completed", "true");
    } catch (e) {}
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isModalVisible) return null;

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0d0d14] border border-slate-200 dark:border-[#222234] rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-zinc-100 font-sans"
        >
          {/* Header Progress Line */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-[#181824] relative">
            <motion.div
              className={`h-full bg-gradient-to-r ${currentStep.gradient}`}
              initial={{ width: "20%" }}
              animate={{ width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181824] transition-colors"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Step Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161622] border border-slate-200 dark:border-[#262638] text-[#387ed1] text-[11px] font-mono font-extrabold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>{currentStep.badge}</span>
              </span>

              {/* Progress Dots */}
              <div className="flex space-x-1.5">
                {ONBOARDING_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? "w-6 bg-[#387ed1]"
                        : "w-2 bg-slate-200 dark:bg-[#222234] hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Slide Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${currentStep.gradient} text-white shadow-lg shrink-0`}>
                    <StepIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {currentStep.title}
                    </h2>
                    <p className="text-xs font-mono font-semibold text-[#387ed1]">
                      {currentStep.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#a0a3b0] leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 pt-2 bg-slate-50 dark:bg-[#12121c] p-4 rounded-2xl border border-slate-200 dark:border-[#1f1f2e]">
                  <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#747888]">
                    Key Capabilities &amp; Benefits:
                  </p>
                  <div className="space-y-1.5">
                    {currentStep.highlights.map((h, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-800 dark:text-zinc-200 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer Navigation Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#1f1f2e]">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className={`flex items-center space-x-1.5 text-xs font-mono font-bold px-4 py-2.5 rounded-xl border transition-all ${
                  currentStepIndex === 0
                    ? "opacity-0 pointer-events-none"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-[#141420] dark:hover:bg-[#1f1f30] text-slate-800 dark:text-zinc-300 border-slate-300 dark:border-[#262638]"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs font-mono text-slate-500 dark:text-[#747888] hover:text-slate-900 dark:hover:text-white px-3 py-2"
                >
                  Skip Tour
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-[#387ed1] hover:bg-[#306ec0] text-white font-mono text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#387ed1]/25 border border-[#387ed1]/40 transition-all active:scale-95"
                >
                  <span>{currentStepIndex === ONBOARDING_STEPS.length - 1 ? "Start Trading" : "Next"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

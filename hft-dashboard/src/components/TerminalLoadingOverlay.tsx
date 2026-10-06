'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Radio } from 'lucide-react';

interface TerminalLoadingOverlayProps {
  message?: string;
  subtext?: string;
  fullscreen?: boolean;
}

export const TerminalLoadingOverlay: React.FC<TerminalLoadingOverlayProps> = ({
  message = "INITIALIZING HIGH-FREQUENCY TELEMETRY...",
  subtext = "Syncing LMAX Disruptor ring-buffer slots across NSE & BSE multicast feeds",
  fullscreen = true,
}) => {
  const [progress, setProgress] = useState<number>(18);
  const [activeStep, setActiveStep] = useState<number>(0);

  const STEPS = [
    "Allocating 1,048,576 ring buffer slots (Zero-GC)...",
    "Est. solarflare EF_VI kernel bypass socket...",
    "Calibrating Order Book Imbalance (OBI) models...",
    "Sub-microsecond tick telemetry active (0.42µs p50)...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 25) + 10;
        return next > 100 ? 100 : next;
      });
    }, 180);

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 450);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [STEPS.length]);

  const content = (
    <div className="flex flex-col items-center justify-center p-8 max-w-md w-full mx-auto select-none font-sans text-center">
      {/* Glowing Hexagon Logo Container */}
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-blue-500/30 blur-xl"
        />

        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-emerald-500/40 flex items-center justify-center shadow-2xl shadow-emerald-500/20 transform-gpu">
          {/* Animated Ring Spinner */}
          <svg className="absolute inset-0 w-full h-full p-1.5 animate-spin-slow" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#gradientLoader)"
              strokeWidth="3"
              strokeDasharray="60 180"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradientLoader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex items-center justify-center space-x-1">
            <Zap className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          </div>
        </div>
      </div>

      {/* Brand Title */}
      <div className="space-y-1 mb-6">
        <div className="flex items-center justify-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            LALAN TERMINAL L2 STREAM
          </span>
        </div>
        <h2 className="text-xl font-bold font-mono text-white tracking-tight mt-2">
          {message}
        </h2>
        <p className="text-xs text-slate-400 font-sans max-w-sm leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Laser Progress Bar */}
      <div className="w-full space-y-2 mb-6">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            {STEPS[activeStep]}
          </span>
          <span className="font-bold text-emerald-400">{progress}%</span>
        </div>

        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-sky-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
          />
        </div>
      </div>

      {/* Micro Metrics Chips */}
      <div className="grid grid-cols-3 gap-2 w-full font-mono text-[10px]">
        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
          <span className="text-slate-500 block uppercase">LATENCY</span>
          <span className="text-emerald-400 font-bold">0.42 µs</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
          <span className="text-slate-500 block uppercase">ENGINE</span>
          <span className="text-cyan-400 font-bold">LMAX RING</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
          <span className="text-slate-500 block uppercase">GC OVERHEAD</span>
          <span className="text-violet-400 font-bold">0.00 ms</span>
        </div>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060609]/95 backdrop-blur-xl transition-all duration-300">
        {content}
      </div>
    );
  }

  return content;
};

export default TerminalLoadingOverlay;

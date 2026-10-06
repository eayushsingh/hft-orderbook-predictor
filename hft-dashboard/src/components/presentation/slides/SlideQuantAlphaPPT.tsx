'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Activity, Calculator } from 'lucide-react';

export const SlideQuantAlphaPPT: React.FC = () => {
  const [activeModel, setActiveModel] = useState<'OBI' | 'HAWKES' | 'LOB_LSTM'>('OBI');

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Slide 08 &bull; Quantitative Alpha Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Microstructure Alpha Signals &amp; Stochastic Physics
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['OBI', 'HAWKES', 'LOB_LSTM'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setActiveModel(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeModel === m
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'OBI' ? 'OBI Signal' : m === 'HAWKES' ? 'Hawkes Process' : 'LOB Deep-Net'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-4">
        {/* Left Column: Model Math Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>
                {activeModel === 'OBI'
                  ? 'Level-2 Order Flow Imbalance (OBI) Model'
                  : activeModel === 'HAWKES'
                  ? 'Self-Exciting Hawkes Process Intensity'
                  : 'Deep Convolutional LSTM LOB Predictor'}
              </span>
            </div>

            {/* LaTeX Math Display Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto shadow-inner">
              {activeModel === 'OBI' && (
                <div className="space-y-2">
                  <div className="text-slate-400 text-[11px] font-sans">Continuous OBI Formulation:</div>
                  <div className="text-center py-2 text-white font-bold">
                    {'OBI_t = (V_t^b - V_t^a) / (V_t^b + V_t^a) * exp(-\\lambda * \\Delta t)'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Measures volume pressure asymmetry at best bid V_b vs best ask V_a with exponential decay factor.
                  </div>
                </div>
              )}

              {activeModel === 'HAWKES' && (
                <div className="space-y-2">
                  <div className="text-slate-400 text-[11px] font-sans">Hawkes Intensity Function &lambda;(t):</div>
                  <div className="text-center py-2 text-white font-bold">
                    {'\\lambda(t) = \\mu + \\sum_{t_i < t} \\alpha * exp(-\\beta * (t - t_i))'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Models order arrival clustering where past trade events trigger self-exciting cascading buy/sell waves.
                  </div>
                </div>
              )}

              {activeModel === 'LOB_LSTM' && (
                <div className="space-y-2">
                  <div className="text-slate-400 text-[11px] font-sans">LOB Spatial-Temporal State Mapping:</div>
                  <div className="text-center py-2 text-white font-bold">
                    {'y_hat_{t+k} = Softmax(W_o * LSTM(Conv2D(LOB_{t-n:t})))'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    2D Convolutions extract spatial order book depth profile, passing temporal hidden state into 10-tick price movement classifier.
                  </div>
                </div>
              )}
            </div>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-200">Execution Latency Sensitivity</span>
                <p className="text-slate-400 text-[11px]">Signals expire within 850 microseconds of LOB state update.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-200">Cross-Asset Information Flow</span>
                <p className="text-slate-400 text-[11px]">Correlates NIFTY Index Futures lead-lag indicators with stock options.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Model Performance Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Model Performance &amp; Hit-Ratio</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE TELEMETRY
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Directional Accuracy (10-tick)</span>
                  <span className="text-emerald-400 font-bold">78.4%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <motion.div initial={{ width: 0 }} animate={{ width: '78.4%' }} className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Information Ratio (IR)</span>
                  <span className="text-teal-400 font-bold">3.82</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Alpha Decay Half-Life</span>
                  <span className="text-indigo-400 font-bold">4.2 ms</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-emerald-400 font-mono font-bold uppercase">Quantitative Edge</span>
              <p className="text-xs text-slate-300">Continuous sub-millisecond alpha generation across NSE/BSE segments</p>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0 ml-3" />
          </div>
        </div>
      </div>

      {/* Footer Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Sampling Rate</span>
          <div className="text-sm font-extrabold text-white font-mono">1.2 GHz FPGA</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Historical LOB Data</span>
          <div className="text-sm font-extrabold text-emerald-400 font-mono">4.8 TB / day</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Model Retraining</span>
          <div className="text-sm font-extrabold text-teal-400 font-mono">Continuous Online</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Backtest Period</span>
          <div className="text-sm font-extrabold text-white font-mono">10 Years</div>
        </div>
      </div>
    </div>
  );
};

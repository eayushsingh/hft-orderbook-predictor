'use client';

import React, { useState } from 'react';
import { Activity, Sliders, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SlideOrderBookTheoryPPT: React.FC = () => {
  const [bidQty, setBidQty] = useState(15000);
  const [askQty, setAskQty] = useState(5000);

  const totalVol = bidQty + askQty;
  const obi = totalVol > 0 ? (bidQty - askQty) / totalVol : 0;
  const roundedObi = Math.round(obi * 100) / 100;

  const bidPrice = 24850.0;
  const askPrice = 24850.5;
  const microPrice =
    totalVol > 0
      ? (askPrice * bidQty + bidPrice * askQty) / totalVol
      : (bidPrice + askPrice) / 2;

  return (
    <div className="space-y-6 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
          <Activity className="w-3.5 h-3.5" /> Slide 03 • Quantitative Market Microstructure Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Micro-Price Drift &amp; Order Book Imbalance (OBI) Equations
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Mathematical foundations powering tick-level directional forecasting and institutional spoofing detection.
        </p>
      </div>

      {/* Interactive Calculator Simulator Widget */}
      <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" /> Live Interactive OBI &amp; Micro-Price Simulator
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            Real-Time Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bid Depth Volume: <span className="text-emerald-400 font-bold">{bidQty.toLocaleString()} qty</span>
              </label>
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={bidQty}
                onChange={(e) => setBidQty(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ask Depth Volume: <span className="text-rose-400 font-bold">{askQty.toLocaleString()} qty</span>
              </label>
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={askQty}
                onChange={(e) => setAskQty(parseInt(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Calculated OBI Metric:</span>
              <span
                className={`font-mono font-extrabold text-sm ${
                  roundedObi > 0 ? 'text-emerald-400' : roundedObi < 0 ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                {roundedObi > 0 ? `+${roundedObi}` : roundedObi}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Micro-Price Estimate:</span>
              <span className="font-mono font-bold text-cyan-400">
                ₹{microPrice.toFixed(2)}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>Predicted Tick Direction:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                {roundedObi > 0.2 ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> BULLISH DRIFT
                  </>
                ) : roundedObi < -0.2 ? (
                  <>
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" /> BEARISH DRIFT
                  </>
                ) : (
                  'NEUTRAL'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

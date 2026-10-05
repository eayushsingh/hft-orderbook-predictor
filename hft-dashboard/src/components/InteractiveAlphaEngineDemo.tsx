"use client";

import React, { useState, memo, useMemo } from "react";
import { Activity, Cpu, Layers, TrendingUp, Sparkles } from "lucide-react";

function InteractiveAlphaEngineDemoComponent() {
  const [activeTab, setActiveTab] = useState<"obi" | "microprice" | "disruptor" | "matrix">("obi");
  
  // Interactive OBI State
  const [bidVolume, setBidVolume] = useState<number>(85000);
  const [askVolume, setAskVolume] = useState<number>(32000);

  const { totalVolume, obiValue, signalText, signalColor, midPrice, microPrice } = useMemo(() => {
    const total = bidVolume + askVolume;
    const obi = total > 0 ? (bidVolume - askVolume) / total : 0;
    const signal = obi > 0.35 ? "STRONG BUY" : obi < -0.35 ? "STRONG SELL" : "NEUTRAL DRIFT";
    const color =
      obi > 0.35
        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
        : obi < -0.35
        ? "text-rose-500 bg-rose-500/10 border-rose-500/30"
        : "text-amber-500 bg-amber-500/10 border-amber-500/30";

    const bBid = 24850.0;
    const bAsk = 24850.5;
    const mPrice = (bBid + bAsk) / 2;
    const micro = total > 0 ? (bBid * askVolume + bAsk * bidVolume) / total : mPrice;

    return {
      totalVolume: total,
      obiValue: obi,
      signalText: signal,
      signalColor: color,
      midPrice: mPrice,
      microPrice: micro,
    };
  }, [bidVolume, askVolume]);

  const bestBid = 24850.0;
  const bestAsk = 24850.5;

  return (
    <div className="my-16 font-sans">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-mono font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Microstructure Engine Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Test Live HFT Signals &amp; Calculations
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8a8d9b] max-w-xl mx-auto">
          Explore how LALAN processes Level-2 order book depth in sub-millisecond real time.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-[#1f1f2e] rounded-2xl overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar bg-slate-100 dark:bg-[#08080c] border-b border-slate-200 dark:border-[#1f1f2e] p-2 gap-2">
          <button
            onClick={() => setActiveTab("obi")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
              activeTab === "obi"
                ? "bg-[#387ed1] text-white shadow-md font-extrabold"
                : "text-slate-700 dark:text-[#8a8d9b] hover:bg-slate-200 dark:hover:bg-[#14141f] hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Order Book Imbalance (OBI)</span>
          </button>

          <button
            onClick={() => setActiveTab("microprice")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
              activeTab === "microprice"
                ? "bg-[#387ed1] text-white shadow-md font-extrabold"
                : "text-slate-700 dark:text-[#8a8d9b] hover:bg-slate-200 dark:hover:bg-[#14141f] hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>VWAP Micro-Price Drift</span>
          </button>

          <button
            onClick={() => setActiveTab("disruptor")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
              activeTab === "disruptor"
                ? "bg-[#387ed1] text-white shadow-md font-extrabold"
                : "text-slate-700 dark:text-[#8a8d9b] hover:bg-slate-200 dark:hover:bg-[#14141f] hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>LMAX Disruptor Ring Buffer</span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
              activeTab === "matrix"
                ? "bg-[#387ed1] text-white shadow-md font-extrabold"
                : "text-slate-700 dark:text-[#8a8d9b] hover:bg-slate-200 dark:hover:bg-[#14141f] hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Multi-Broker Liquidity Matrix</span>
          </button>
        </div>

        {/* Tab 1: OBI Simulator */}
        {activeTab === "obi" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400">
                  <span>Top-5 Bid Volume (V_bid):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{bidVolume.toLocaleString()} qty</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="150000"
                  step="1000"
                  value={bidVolume}
                  onChange={(e) => setBidVolume(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400">
                  <span>Top-5 Ask Volume (V_ask):</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{askVolume.toLocaleString()} qty</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="150000"
                  step="1000"
                  value={askVolume}
                  onChange={(e) => setAskVolume(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234] text-xs text-slate-800 dark:text-zinc-300 space-y-1">
                  <div className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-bold">OBI Math Formula</div>
                  <div>OBI = (V_bid - V_ask) / (V_bid + V_ask)</div>
                  <div className="text-[#387ed1] font-bold pt-1">
                    = ({bidVolume.toLocaleString()} - {askVolume.toLocaleString()}) / {totalVolume.toLocaleString()} = {obiValue > 0 ? `+${obiValue.toFixed(4)}` : obiValue.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#101018] border border-slate-200 dark:border-[#1e1e2d] text-center space-y-4 shadow-inner">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase">Computed Alpha Signal</span>
                <div className={`text-2xl sm:text-3xl font-black font-mono px-4 py-2 rounded-xl border ${signalColor}`}>
                  {signalText}
                </div>
                <div className="text-sm font-mono text-slate-700 dark:text-zinc-300">
                  OBI Score: <strong className="text-slate-900 dark:text-white font-bold">{obiValue > 0 ? `+${obiValue.toFixed(4)}` : obiValue.toFixed(4)}</strong>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {obiValue > 0.35
                    ? "Heavy bid accumulation detected. Institutional sweeps likely to drive immediate price upside."
                    : obiValue < -0.35
                    ? "Heavy ask liquidity wall detected. Selling pressure likely to drive immediate downside."
                    : "Balanced order book pressure across depth levels."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Micro-Price Simulator */}
        {activeTab === "microprice" && (
          <div className="p-6 sm:p-8 space-y-6 font-mono">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234]">
                <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase">Best Bid Price (P_bid)</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{bestBid.toFixed(2)}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">Bid Volume: {bidVolume.toLocaleString()}</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234]">
                <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase">Standard Mid-Price</div>
                <div className="text-xl font-black text-slate-800 dark:text-white mt-1">₹{midPrice.toFixed(2)}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">(P_bid + P_ask) / 2</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#387ed1]/10 border border-[#387ed1]/30">
                <div className="text-xs text-[#387ed1] uppercase font-bold">LALAN Micro-Price</div>
                <div className="text-xl font-black text-[#387ed1] mt-1">₹{microPrice.toFixed(2)}</div>
                <div className="text-[11px] text-[#387ed1] font-bold mt-1">
                  Drift: {microPrice > midPrice ? `+₹${(microPrice - midPrice).toFixed(2)} (Bullish)` : `₹${(microPrice - midPrice).toFixed(2)} (Bearish)`}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-400 text-center leading-relaxed max-w-2xl mx-auto">
              Standard mid-price assumes equal weight between bid and ask. LALAN Micro-Price weights quote prices by opposite volume density, accurately forecasting tick drift before sweeps complete.
            </p>
          </div>
        )}

        {/* Tab 3: LMAX Ring Buffer */}
        {activeTab === "disruptor" && (
          <div className="p-6 sm:p-8 space-y-6 font-mono">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234]">
                <div className="text-xs text-slate-500 dark:text-zinc-400">Ring Capacity</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">1,048,576</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-500">2^20 Slots</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234]">
                <div className="text-xs text-slate-500 dark:text-zinc-400">JVM GC Overhead</div>
                <div className="text-lg font-black text-emerald-500 mt-1">0.00 MB</div>
                <div className="text-[10px] text-emerald-500">Zero GC Allocation</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234]">
                <div className="text-xs text-slate-500 dark:text-zinc-400">Cache Line Padding</div>
                <div className="text-lg font-black text-indigo-400 mt-1">64 Bytes</div>
                <div className="text-[10px] text-indigo-400">False Sharing Protection</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234]">
                <div className="text-xs text-slate-500 dark:text-zinc-400">Median Latency</div>
                <div className="text-lg font-black text-[#387ed1] mt-1">0.68 ms</div>
                <div className="text-[10px] text-[#387ed1]">Sub-Millisecond</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Multi-Broker Matrix */}
        {activeTab === "matrix" && (
          <div className="p-6 sm:p-8 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234] space-y-1">
                <span className="text-[#387ed1] font-bold">DhanHQ Feed</span>
                <div className="text-slate-900 dark:text-white font-bold">Direct API v2</div>
                <div className="text-[10px] text-emerald-500 font-bold">● Active Stream</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234] space-y-1">
                <span className="text-emerald-500 font-bold">LALAN Engine</span>
                <div className="text-slate-900 dark:text-white font-bold">L2 Disruptor Core</div>
                <div className="text-[10px] text-emerald-500 font-bold">● Active Stream</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234] space-y-1">
                <span className="text-purple-400 font-bold">Screener.in Hub</span>
                <div className="text-slate-900 dark:text-white font-bold">Reg 30 &amp; Financials</div>
                <div className="text-[10px] text-emerald-500 font-bold">● Synchronized</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#141420] border border-slate-200 dark:border-[#222234] space-y-1">
                <span className="text-amber-500 font-bold">TradingView Hub</span>
                <div className="text-slate-900 dark:text-white font-bold">Consensus Ratings</div>
                <div className="text-[10px] text-emerald-500 font-bold">● Synchronized</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(InteractiveAlphaEngineDemoComponent);

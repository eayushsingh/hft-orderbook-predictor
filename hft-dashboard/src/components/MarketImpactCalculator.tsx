"use client";

import React, { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

export default function MarketImpactCalculator() {
  const [orderSizeCr, setOrderSizeCr] = useState<number>(0.5); // Default ₹50 Lakhs (0.5 Cr)
  const [symbol, setSymbol] = useState<string>("RELIANCE");
  const [executionType, setExecutionType] = useState<"SWEEP" | "TWAP" | "VWAP">("SWEEP");

  // Market Impact Formula: Impact (bps) = gamma * (Order_Size / ADV)^0.5 * Volatility
  const calculation = useMemo(() => {
    const advCr = symbol === "RELIANCE" ? 1800 : symbol === "HDFCBANK" ? 1400 : 850;
    const volatilityPct = 1.45; // Daily volatility %
    
    // Immediate Market Impact Cost in basis points
    const sizeRatio = orderSizeCr / advCr;
    const impactBps = Math.round(18 * Math.sqrt(sizeRatio) * volatilityPct * 10) / 10;
    
    // Estimated Slippage (in ₹)
    const basePrice = symbol === "RELIANCE" ? 2940.5 : symbol === "HDFCBANK" ? 1685.2 : 978.6;
    const slippagePerShare = (basePrice * (impactBps / 10000));
    const totalShares = Math.round((orderSizeCr * 10000000) / basePrice);
    const totalSlippageCostRupees = Math.round(totalShares * slippagePerShare);

    // L2 Depth Consumption Levels
    const depthLevelsConsumed = Math.min(10, Math.max(1, Math.ceil(orderSizeCr * 3.2)));

    return {
      advCr,
      impactBps,
      basePrice,
      totalShares,
      slippagePerShare: parseFloat(slippagePerShare.toFixed(2)),
      totalSlippageCostRupees,
      depthLevelsConsumed,
    };
  }, [orderSizeCr, symbol]);

  return (
    <div className="w-full rounded-2xl border border-[#262634] bg-[#101016] p-5 sm:p-6 shadow-2xl font-sans text-zinc-100 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222232] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#387ed1]/15 text-[#387ed1] border border-[#387ed1]/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-mono text-white">
                Institutional Market Impact &amp; Slippage Calculator
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#387ed1]/20 text-[#387ed1] text-[10px] font-mono font-bold uppercase border border-[#387ed1]/30">
                Algos &amp; Quant Spec
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Square-Root Market Impact Model for Large Block Order Execution
            </p>
          </div>
        </div>

        {/* Stock Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-500">Asset:</span>
          {["RELIANCE", "HDFCBANK", "TATAMOTORS"].map((s) => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                symbol === s
                  ? "bg-[#387ed1] text-white shadow-md"
                  : "bg-[#161622] text-zinc-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Output Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-mono">
        {/* Slider Controls */}
        <div className="space-y-5 bg-[#141420] p-5 rounded-xl border border-[#222234]">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-bold text-white">Block Order Size:</span>
              <span className="text-sm font-bold text-[#387ed1]">
                ₹{(orderSizeCr * 100).toFixed(0)} Lakhs (₹{orderSizeCr.toFixed(2)} Cr)
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="5.0"
              step="0.05"
              value={orderSizeCr}
              onChange={(e) => setOrderSizeCr(Number(e.target.value))}
              className="w-full accent-[#387ed1] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>₹5 Lakhs</span>
              <span>₹1 Crore</span>
              <span>₹5 Crores</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs text-zinc-400 font-bold">Execution Strategy Algos:</span>
            <div className="grid grid-cols-3 gap-2">
              {(["SWEEP", "TWAP", "VWAP"] as const).map((strat) => (
                <button
                  key={strat}
                  onClick={() => setExecutionType(strat)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    executionType === strat
                      ? "bg-[#387ed1]/20 text-[#387ed1] border-[#387ed1]/50"
                      : "bg-[#181826] text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  {strat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#141420] border border-[#222234] space-y-1">
            <span className="text-[11px] text-zinc-400">Expected Market Impact</span>
            <div className="text-2xl font-black text-amber-400">{calculation.impactBps} bps</div>
            <div className="text-[10px] text-zinc-500">({(calculation.impactBps / 100).toFixed(3)}% Price Shift)</div>
          </div>

          <div className="p-4 rounded-xl bg-[#141420] border border-[#222234] space-y-1">
            <span className="text-[11px] text-zinc-400">Total Shares To Buy</span>
            <div className="text-2xl font-black text-white">{calculation.totalShares.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500">@ ~₹{calculation.basePrice.toFixed(2)}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#141420] border border-[#222234] space-y-1">
            <span className="text-[11px] text-zinc-400">L2 Depth Consumed</span>
            <div className="text-2xl font-black text-sky-400">{calculation.depthLevelsConsumed} Levels</div>
            <div className="text-[10px] text-zinc-500">Top L2 Order Book Depth</div>
          </div>

          <div className="p-4 rounded-xl bg-[#141420] border border-[#222234] space-y-1">
            <span className="text-[11px] text-zinc-400">Est. Total Slippage Cost</span>
            <div className="text-2xl font-black text-rose-400">₹{calculation.totalSlippageCostRupees.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500">(₹{calculation.slippagePerShare}/share)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

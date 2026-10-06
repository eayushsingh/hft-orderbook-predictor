"use client";

import React, { memo } from "react";
import { Check, X } from "lucide-react";

const COMPARISON_ITEMS = [
  {
    feature: "Order Book Latency",
    traditional: "1,000ms - 2,000ms (Historical Candles)",
    lalan: "0.68ms Sub-Millisecond Tick Stream",
    lalanAdvantage: "3,000x Faster Execution",
  },
  {
    feature: "Liquidity Insight",
    traditional: "L1 Top Bid/Ask Only (Delayed)",
    lalan: "L2 Depth (Top 5 Levels) + Aggregated OBI",
    lalanAdvantage: "Institutional Sweep Exposure",
  },
  {
    feature: "Micro-Price Calculation",
    traditional: "Basic Mid-Price (P_bid + P_ask) / 2",
    lalan: "Volume-Weighted Micro-Price Drift",
    lalanAdvantage: "Predicts Next Tick Movement",
  },
  {
    feature: "Memory Architecture",
    traditional: "Standard Heap Allocation (Frequent GC Pauses)",
    lalan: "LMAX Disruptor Ring Buffer (Zero-GC)",
    lalanAdvantage: "Zero GC Stalls Under Volatility",
  },
  {
    feature: "Multi-Source Intelligence",
    traditional: "Manual Context Switching Across 10 Tabs",
    lalan: "Screener.in + NSE Reg 30 + TradingView Hub",
    lalanAdvantage: "Single Zero-Switch Dashboard",
  },
  {
    feature: "Pricing & Equity Delivery",
    traditional: "Variable Brokerage & High Commission Fees",
    lalan: "100% Free Equity Delivery (₹0 Brokerage)",
    lalanAdvantage: "Zero Hidden Costs",
  },
];

function InstitutionalComparisonMatrixComponent() {
  return (
    <div className="my-16 font-sans">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#387ed1] bg-[#387ed1]/10 px-3.5 py-1.5 rounded-full border border-[#387ed1]/30">
          Institutional Microstructure Advantage
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Why Quants &amp; Traders Choose LALAN
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8a8d9b] max-w-xl mx-auto">
          See how LALAN compares to traditional charting tools like TradingView and Zerodha Kite.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1f1f2e] bg-white dark:bg-[#0e0e14] shadow-2xl">
        <table className="w-full min-w-[650px] text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#1f1f2e] bg-slate-100 dark:bg-[#09090e] text-slate-800 dark:text-slate-200 text-[11px] uppercase">
              <th className="py-4 px-5">Capability / Metric</th>
              <th className="py-4 px-5 text-slate-700 dark:text-zinc-300">Traditional Charting Tools</th>
              <th className="py-4 px-5 text-[#387ed1] bg-[#387ed1]/10 dark:bg-[#387ed1]/15 border-x border-slate-200 dark:border-[#1f1f2e]">
                LALAN Quantitative Engine
              </th>
              <th className="py-4 px-5 text-emerald-600 dark:text-emerald-400">Quantitative Edge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#181824]">
            {COMPARISON_ITEMS.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#12121c] transition-colors">
                <td className="py-4 px-5 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {item.feature}
                </td>
                <td className="py-4 px-5 text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{item.traditional}</span>
                </td>
                <td className="py-4 px-5 font-bold text-slate-900 dark:text-white bg-[#387ed1]/5 dark:bg-[#387ed1]/10 border-x border-slate-200 dark:border-[#1f1f2e]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#387ed1] shrink-0" />
                    <span>{item.lalan}</span>
                  </div>
                </td>
                <td className="py-4 px-5 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                    {item.lalanAdvantage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(InstitutionalComparisonMatrixComponent);

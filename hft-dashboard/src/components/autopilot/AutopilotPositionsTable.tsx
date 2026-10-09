"use client";

import React from "react";
import { Briefcase, AlertOctagon, XCircle } from "lucide-react";
import { AutopilotPosition } from "@/lib/autopilot/types";

interface AutopilotPositionsTableProps {
  positions: AutopilotPosition[];
  onExitPosition: (symbol: string) => void;
  onSquareOffAll: () => void;
}

export default function AutopilotPositionsTable({
  positions,
  onExitPosition,
  onSquareOffAll,
}: AutopilotPositionsTableProps) {
  const totalInvested = positions.reduce((acc, p) => acc + p.quantity * p.avgEntryPrice, 0);
  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalPnlPct = totalInvested > 0 ? (totalUnrealizedPnl / totalInvested) * 100 : 0;

  return (
    <div className="bg-[#121218] border border-[#222230] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-mono text-white flex items-center gap-2">
              ACTIVE POSITIONS & EXPOSURE
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#181824] text-zinc-300 border border-[#262638]">
                {positions.length} Open
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Real-time mark-to-market valuations and risk-managed exit rules.
            </p>
          </div>
        </div>

        {positions.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <div className="text-[10px] text-zinc-400">UNREALIZED P&L</div>
              <div
                className={`text-sm font-black ${
                  totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {totalUnrealizedPnl >= 0 ? "+" : ""}₹
                {totalUnrealizedPnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (
                {totalPnlPct.toFixed(2)}%)
              </div>
            </div>

            <button
              onClick={onSquareOffAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/40 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Square Off All</span>
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar rounded-xl border border-[#20202e]">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#0e0e14] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-[#20202e]">
            <tr>
              <th className="py-3 px-3">Symbol & Sector</th>
              <th className="py-3 px-3 text-right">Qty</th>
              <th className="py-3 px-3 text-right">Avg Price</th>
              <th className="py-3 px-3 text-right">LTP (₹)</th>
              <th className="py-3 px-3 text-right">Stop Loss</th>
              <th className="py-3 px-3 text-right">Target</th>
              <th className="py-3 px-3 text-right">Unrealized P&L</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c28] bg-[#121218]">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500 font-mono">
                  Zero active positions. Capital is currently 100% in safe cash.
                </td>
              </tr>
            ) : (
              positions.map((p) => (
                <tr key={p.symbol} className="hover:bg-[#161622] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-black text-white">{p.symbol}</div>
                    <div className="text-[10px] text-zinc-400 font-sans">{p.sector}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">{p.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-300">
                    ₹{p.avgEntryPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-white">
                    ₹{p.currentLtp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-rose-400">
                    ₹{p.stopLossPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400">
                    {p.targetPrice ? `₹${p.targetPrice.toFixed(2)}` : "—"}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-black ${
                      p.unrealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {p.unrealizedPnl >= 0 ? "+" : ""}₹
                    {p.unrealizedPnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    <div className="text-[10px]">
                      ({p.unrealizedPnlPct >= 0 ? "+" : ""}
                      {p.unrealizedPnlPct.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onExitPosition(p.symbol)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      <XCircle className="w-3 h-3 text-rose-400" />
                      <span>Exit</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

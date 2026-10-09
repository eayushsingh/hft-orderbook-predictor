"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ConstituentRanking } from "@/lib/autopilot/types";

interface AutopilotRankingsTableProps {
  rankings: ConstituentRanking[];
}

export default function AutopilotRankingsTable({
  rankings,
}: AutopilotRankingsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [selectedSignal, setSelectedSignal] = useState<string>("ALL");

  const sectors = useMemo(() => {
    const s = new Set<string>();
    rankings.forEach((r) => s.add(r.sector));
    return ["ALL", ...Array.from(s).sort()];
  }, [rankings]);

  const filteredRankings = useMemo(() => {
    return rankings.filter((r) => {
      const matchSearch =
        r.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSector = selectedSector === "ALL" || r.sector === selectedSector;
      const matchSignal = selectedSignal === "ALL" || r.signal === selectedSignal;
      return matchSearch && matchSector && matchSignal;
    });
  }, [rankings, searchTerm, selectedSector, selectedSignal]);

  const getSignalBadge = (signal: "BUY" | "SELL" | "NO_TRADE") => {
    switch (signal) {
      case "BUY":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
            <ArrowUpRight className="w-3 h-3" />
            BUY
          </span>
        );
      case "SELL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold">
            <ArrowDownRight className="w-3 h-3" />
            SELL
          </span>
        );
      case "NO_TRADE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono font-bold">
            NO TRADE
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#222230] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm dark:shadow-xl transition-colors">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white flex items-center gap-2">
            NIFTY 50 UNIVERSE RANKING MATRIX
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-slate-100 dark:bg-[#181824] text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-[#262638]">
              50 Constituents • NSE Master Verified
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans">
            Real-time quantitative momentum, Relative Strength (RS), and deterministic trade decisions.
          </p>
        </div>

        {/* Search & Sector Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-[#181824] border border-slate-300 dark:border-[#2a2a3c] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none w-36 sm:w-44 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors"
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-50 dark:bg-[#181824] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-zinc-300 font-mono focus:border-[#387ed1] outline-none transition-colors"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec} className="bg-white dark:bg-[#181824] text-slate-900 dark:text-white">
                {sec}
              </option>
            ))}
          </select>

          <select
            value={selectedSignal}
            onChange={(e) => setSelectedSignal(e.target.value)}
            className="bg-slate-50 dark:bg-[#181824] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-zinc-300 font-mono focus:border-[#387ed1] outline-none transition-colors"
          >
            <option value="ALL" className="bg-white dark:bg-[#181824] text-slate-900 dark:text-white">All Signals</option>
            <option value="BUY" className="bg-white dark:bg-[#181824] text-slate-900 dark:text-white">BUY</option>
            <option value="SELL" className="bg-white dark:bg-[#181824] text-slate-900 dark:text-white">SELL</option>
            <option value="NO_TRADE" className="bg-white dark:bg-[#181824] text-slate-900 dark:text-white">NO TRADE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200 dark:border-[#20202e] shadow-sm">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-100/90 dark:bg-[#0e0e14] text-slate-600 dark:text-zinc-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#20202e]">
            <tr>
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Symbol & Sector</th>
              <th className="py-3 px-3 text-right">LTP (₹)</th>
              <th className="py-3 px-3 text-right">Change</th>
              <th className="py-3 px-3 text-center">RS (0-100)</th>
              <th className="py-3 px-3 text-right">Vol Surge</th>
              <th className="py-3 px-3 text-center">Signal</th>
              <th className="py-3 px-3">Quantitative Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1c1c28] bg-white dark:bg-[#121218]">
            {filteredRankings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-zinc-500">
                  No constituents match the selected filters.
                </td>
              </tr>
            ) : (
              filteredRankings.map((r) => (
                <tr key={r.symbol} className="hover:bg-slate-50/90 dark:hover:bg-[#161622] transition-colors">
                  <td className="py-3 px-3 text-slate-400 dark:text-zinc-500 font-bold">{r.rank}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{r.symbol}</span>
                      <span className="text-[9px] px-1 rounded bg-slate-100 dark:bg-[#1c1c28] text-slate-500 dark:text-zinc-400 font-normal border border-slate-200 dark:border-transparent">
                        {r.weightagePct}% Wt
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate max-w-[150px] font-sans">
                      {r.sector}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-white">
                    ₹{r.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold ${
                      r.changePct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {r.changePct >= 0 ? "+" : ""}
                    {r.changePct.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-200 dark:bg-[#222230] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            r.rsRating >= 70
                              ? "bg-emerald-500 dark:bg-emerald-400"
                              : r.rsRating >= 50
                              ? "bg-cyan-500 dark:bg-cyan-400"
                              : "bg-rose-500 dark:bg-rose-400"
                          }`}
                          style={{ width: `${r.rsRating}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">{r.rsRating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-700 dark:text-zinc-300">
                    {r.volumeSurge.toFixed(2)}x
                  </td>
                  <td className="py-3 px-3 text-center">{getSignalBadge(r.signal)}</td>
                  <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-zinc-300 font-sans leading-tight max-w-xs">
                    {r.reason}
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

"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Zap, Activity } from "lucide-react";

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  obi: number;
  signal: "BUY" | "SELL" | "NEUTRAL";
}

const INITIAL_TICKERS: TickerItem[] = [
  { symbol: "NIFTY 50", name: "NIFTY 50 Index", price: 24850.4, changePct: +0.68, obi: +0.42, signal: "BUY" },
  { symbol: "BANKNIFTY", name: "Bank Nifty Index", price: 53210.15, changePct: +0.85, obi: +0.55, signal: "BUY" },
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2940.5, changePct: -0.24, obi: -0.15, signal: "NEUTRAL" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 1685.2, changePct: +1.12, obi: +0.48, signal: "BUY" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", price: 978.6, changePct: +2.45, obi: +0.62, signal: "BUY" },
  { symbol: "INFY", name: "Infosys Ltd", price: 1892.4, changePct: -0.65, obi: -0.38, signal: "SELL" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 4230.1, changePct: +0.35, obi: +0.22, signal: "BUY" },
  { symbol: "BTC/USDT", name: "Bitcoin USDT", price: 68420.0, changePct: +3.18, obi: +0.71, signal: "BUY" },
];

export default function StockTickerTape() {
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);

  // Micro-tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((item) => {
          const deltaPct = (Math.random() - 0.49) * 0.08;
          const newPrice = parseFloat((item.price * (1 + deltaPct / 100)).toFixed(2));
          const newChange = parseFloat((item.changePct + deltaPct * 0.2).toFixed(2));
          const newObi = parseFloat((Math.max(-0.9, Math.min(0.9, item.obi + (Math.random() - 0.49) * 0.05))).toFixed(2));
          const newSignal = newObi > 0.3 ? "BUY" : newObi < -0.3 ? "SELL" : "NEUTRAL";
          return {
            ...item,
            price: newPrice,
            changePct: newChange,
            obi: newObi,
            signal: newSignal,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#08080c] dark:bg-[#07070b] border-b border-slate-200 dark:border-[#1a1a26] text-xs font-mono py-1.5 overflow-hidden select-none">
      <div className="flex items-center space-x-6 animate-marquee whitespace-nowrap overflow-x-auto no-scrollbar px-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#387ed1] shrink-0 border-r border-slate-300 dark:border-[#1a1a26] pr-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>L2 TICK STREAM</span>
        </div>

        {tickers.map((t) => {
          const isPos = t.changePct >= 0;
          return (
            <div key={t.symbol} className="inline-flex items-center space-x-2 shrink-0">
              <span className="font-bold text-slate-800 dark:text-zinc-200">{t.symbol}</span>
              <span className="text-slate-900 dark:text-white font-bold">₹{t.price.toLocaleString("en-IN")}</span>
              <span
                className={`inline-flex items-center gap-0.5 font-bold text-[11px] ${
                  isPos ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{isPos ? `+${t.changePct}%` : `${t.changePct}%`}</span>
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                  t.signal === "BUY"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                    : t.signal === "SELL"
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                    : "bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-300 dark:border-zinc-700"
                }`}
              >
                OBI {t.obi > 0 ? `+${t.obi}` : t.obi} ({t.signal})
              </span>
              <span className="text-slate-300 dark:text-zinc-800">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

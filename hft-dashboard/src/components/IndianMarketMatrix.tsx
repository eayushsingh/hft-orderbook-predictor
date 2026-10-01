"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ScanLine,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Building2,
  ShieldCheck,
  Layers,
  Zap,
} from "lucide-react";

export interface BrokerPlatformFlow {
  platform: string;
  brokerCode: string;
  logoColor: string;
  buyRatio: number;
  sellRatio: number;
  obi: number;
  liquidityDepth: string;
  latencyMs: number;
  status: "ACTIVE" | "HIGH DRIFT" | "EQUILIBRIUM";
}

export interface IndianStockData {
  ticker: string;
  companyName: string;
  exchange: "NSE" | "BSE";
  currentPrice: number;
  changePct: number;
  overallObi: number;
  overallBuyRatio: number;
  overallSellRatio: number;
  microPriceDrift: number;
  consensus: "STRONG BULLISH" | "BULLISH" | "NEUTRAL" | "BEARISH" | "STRONG BEARISH";
  platforms: BrokerPlatformFlow[];
}

const DEFAULT_INDIAN_STOCKS: Record<string, IndianStockData> = {
  RELIANCE: {
    ticker: "RELIANCE",
    companyName: "Reliance Industries Ltd.",
    exchange: "NSE",
    currentPrice: 2984.50,
    changePct: +1.84,
    overallObi: 0.42,
    overallBuyRatio: 71,
    overallSellRatio: 29,
    microPriceDrift: +3.20,
    consensus: "STRONG BULLISH",
    platforms: [
      { platform: "DhanHQ (Direct L2 Feed)", brokerCode: "DHAN", logoColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", buyRatio: 74, sellRatio: 26, obi: 0.48, liquidityDepth: "₹128.4 Cr", latencyMs: 0.8, status: "ACTIVE" },
      { platform: "Zerodha (Kite Connect)", brokerCode: "KITE", logoColor: "text-orange-400 border-orange-500/30 bg-orange-500/10", buyRatio: 69, sellRatio: 31, obi: 0.38, liquidityDepth: "₹245.1 Cr", latencyMs: 1.4, status: "ACTIVE" },
      { platform: "Groww (Order Engine)", brokerCode: "GROWW", logoColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", buyRatio: 72, sellRatio: 28, obi: 0.44, liquidityDepth: "₹182.9 Cr", latencyMs: 2.1, status: "ACTIVE" },
      { platform: "Angel One (SmartAPI)", brokerCode: "ANGEL", logoColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10", buyRatio: 65, sellRatio: 35, obi: 0.30, liquidityDepth: "₹94.2 Cr", latencyMs: 1.8, status: "ACTIVE" },
      { platform: "Upstox (Developer API)", brokerCode: "UPSTX", logoColor: "text-purple-400 border-purple-500/30 bg-purple-500/10", buyRatio: 70, sellRatio: 30, obi: 0.40, liquidityDepth: "₹81.6 Cr", latencyMs: 1.6, status: "ACTIVE" },
      { platform: "ICICI Direct", brokerCode: "ICICI", logoColor: "text-amber-400 border-amber-500/30 bg-amber-500/10", buyRatio: 68, sellRatio: 32, obi: 0.36, liquidityDepth: "₹67.3 Cr", latencyMs: 2.9, status: "EQUILIBRIUM" },
    ],
  },
  NIFTY50: {
    ticker: "NIFTY 50",
    companyName: "NSE Benchmark Index",
    exchange: "NSE",
    currentPrice: 24850.75,
    changePct: +0.62,
    overallObi: 0.28,
    overallBuyRatio: 64,
    overallSellRatio: 36,
    microPriceDrift: +14.50,
    consensus: "BULLISH",
    platforms: [
      { platform: "DhanHQ (Direct L2 Feed)", brokerCode: "DHAN", logoColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", buyRatio: 67, sellRatio: 33, obi: 0.34, liquidityDepth: "₹850.2 Cr", latencyMs: 0.7, status: "ACTIVE" },
      { platform: "Zerodha (Kite Connect)", brokerCode: "KITE", logoColor: "text-orange-400 border-orange-500/30 bg-orange-500/10", buyRatio: 63, sellRatio: 37, obi: 0.26, liquidityDepth: "₹1,420.5 Cr", latencyMs: 1.2, status: "ACTIVE" },
      { platform: "Groww (Order Engine)", brokerCode: "GROWW", logoColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", buyRatio: 65, sellRatio: 35, obi: 0.30, liquidityDepth: "₹960.0 Cr", latencyMs: 1.9, status: "ACTIVE" },
      { platform: "Angel One (SmartAPI)", brokerCode: "ANGEL", logoColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10", buyRatio: 61, sellRatio: 39, obi: 0.22, liquidityDepth: "₹620.4 Cr", latencyMs: 1.5, status: "ACTIVE" },
      { platform: "Upstox (Developer API)", brokerCode: "UPSTX", logoColor: "text-purple-400 border-purple-500/30 bg-purple-500/10", buyRatio: 64, sellRatio: 36, obi: 0.28, liquidityDepth: "₹480.1 Cr", latencyMs: 1.4, status: "ACTIVE" },
    ],
  },
  HDFCBANK: {
    ticker: "HDFCBANK",
    companyName: "HDFC Bank Ltd.",
    exchange: "NSE",
    currentPrice: 1642.30,
    changePct: -0.45,
    overallObi: -0.22,
    overallBuyRatio: 39,
    overallSellRatio: 61,
    microPriceDrift: -1.80,
    consensus: "BEARISH",
    platforms: [
      { platform: "DhanHQ (Direct L2 Feed)", brokerCode: "DHAN", logoColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", buyRatio: 37, sellRatio: 63, obi: -0.26, liquidityDepth: "₹98.5 Cr", latencyMs: 0.9, status: "HIGH DRIFT" },
      { platform: "Zerodha (Kite Connect)", brokerCode: "KITE", logoColor: "text-orange-400 border-orange-500/30 bg-orange-500/10", buyRatio: 41, sellRatio: 59, obi: -0.18, liquidityDepth: "₹190.2 Cr", latencyMs: 1.5, status: "ACTIVE" },
      { platform: "Groww (Order Engine)", brokerCode: "GROWW", logoColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", buyRatio: 38, sellRatio: 62, obi: -0.24, liquidityDepth: "₹140.7 Cr", latencyMs: 2.2, status: "ACTIVE" },
      { platform: "Angel One (SmartAPI)", brokerCode: "ANGEL", logoColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10", buyRatio: 40, sellRatio: 60, obi: -0.20, liquidityDepth: "₹75.3 Cr", latencyMs: 1.7, status: "ACTIVE" },
    ],
  },
  TATAMOTORS: {
    ticker: "TATAMOTORS",
    companyName: "Tata Motors Ltd.",
    exchange: "NSE",
    currentPrice: 985.10,
    changePct: +2.95,
    overallObi: 0.58,
    overallBuyRatio: 79,
    overallSellRatio: 21,
    microPriceDrift: +4.15,
    consensus: "STRONG BULLISH",
    platforms: [
      { platform: "DhanHQ (Direct L2 Feed)", brokerCode: "DHAN", logoColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", buyRatio: 82, sellRatio: 18, obi: 0.64, liquidityDepth: "₹112.0 Cr", latencyMs: 0.8, status: "ACTIVE" },
      { platform: "Zerodha (Kite Connect)", brokerCode: "KITE", logoColor: "text-orange-400 border-orange-500/30 bg-orange-500/10", buyRatio: 77, sellRatio: 23, obi: 0.54, liquidityDepth: "₹210.4 Cr", latencyMs: 1.3, status: "ACTIVE" },
      { platform: "Groww (Order Engine)", brokerCode: "GROWW", logoColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", buyRatio: 80, sellRatio: 20, obi: 0.60, liquidityDepth: "₹165.8 Cr", latencyMs: 2.0, status: "ACTIVE" },
      { platform: "Upstox (Developer API)", brokerCode: "UPSTX", logoColor: "text-purple-400 border-purple-500/30 bg-purple-500/10", buyRatio: 78, sellRatio: 22, obi: 0.56, liquidityDepth: "₹74.9 Cr", latencyMs: 1.5, status: "ACTIVE" },
    ],
  },
  INFY: {
    ticker: "INFY",
    companyName: "Infosys Ltd.",
    exchange: "NSE",
    currentPrice: 1890.60,
    changePct: +0.15,
    overallObi: 0.04,
    overallBuyRatio: 52,
    overallSellRatio: 48,
    microPriceDrift: +0.40,
    consensus: "NEUTRAL",
    platforms: [
      { platform: "DhanHQ (Direct L2 Feed)", brokerCode: "DHAN", logoColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", buyRatio: 53, sellRatio: 47, obi: 0.06, liquidityDepth: "₹76.2 Cr", latencyMs: 0.8, status: "EQUILIBRIUM" },
      { platform: "Zerodha (Kite Connect)", brokerCode: "KITE", logoColor: "text-orange-400 border-orange-500/30 bg-orange-500/10", buyRatio: 51, sellRatio: 49, obi: 0.02, liquidityDepth: "₹155.0 Cr", latencyMs: 1.4, status: "EQUILIBRIUM" },
      { platform: "Groww (Order Engine)", brokerCode: "GROWW", logoColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", buyRatio: 52, sellRatio: 48, obi: 0.04, liquidityDepth: "₹110.3 Cr", latencyMs: 2.1, status: "EQUILIBRIUM" },
    ],
  }
};

export default function IndianMarketMatrix() {
  const [selectedTicker, setSelectedTicker] = useState<string>("RELIANCE");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [stockData, setStockData] = useState<IndianStockData>(DEFAULT_INDIAN_STOCKS.RELIANCE);

  // Live order flow tick simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setStockData((prev) => {
        const jitter = (Math.random() - 0.5) * 0.4;
        const newPrice = Math.max(1, Math.round((prev.currentPrice + jitter) * 100) / 100);
        const buyDelta = Math.floor((Math.random() - 0.5) * 4);
        const newBuy = Math.min(95, Math.max(5, prev.overallBuyRatio + buyDelta));
        const newSell = 100 - newBuy;
        const newObi = Math.round(((newBuy - newSell) / 100) * 100) / 100;

        return {
          ...prev,
          currentPrice: newPrice,
          overallBuyRatio: newBuy,
          overallSellRatio: newSell,
          overallObi: newObi,
          platforms: prev.platforms.map((p) => {
            const pDelta = Math.floor((Math.random() - 0.5) * 6);
            const pBuy = Math.min(95, Math.max(5, p.buyRatio + pDelta));
            const pSell = 100 - pBuy;
            return {
              ...p,
              buyRatio: pBuy,
              sellRatio: pSell,
              obi: Math.round(((pBuy - pSell) / 100) * 100) / 100,
            };
          }),
        };
      });
    }, 400);

    return () => clearInterval(interval);
  }, [selectedTicker]);

  const handleSelectStock = (tickerKey: string) => {
    if (DEFAULT_INDIAN_STOCKS[tickerKey]) {
      setSelectedTicker(tickerKey);
      setStockData(DEFAULT_INDIAN_STOCKS[tickerKey]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const queryUpper = searchQuery.trim().toUpperCase();
    setIsScanning(true);

    setTimeout(() => {
      if (DEFAULT_INDIAN_STOCKS[queryUpper]) {
        setSelectedTicker(queryUpper);
        setStockData(DEFAULT_INDIAN_STOCKS[queryUpper]);
      } else {
        const customStock: IndianStockData = {
          ticker: queryUpper,
          companyName: `${queryUpper} Ltd. (NSE / BSE)`,
          exchange: "NSE",
          currentPrice: Math.round((Math.random() * 2000 + 150) * 100) / 100,
          changePct: Math.round((Math.random() * 6 - 3) * 100) / 100,
          overallObi: 0.35,
          overallBuyRatio: 68,
          overallSellRatio: 32,
          microPriceDrift: +2.40,
          consensus: "BULLISH",
          platforms: [
            { platform: "DhanHQ (Direct L2 Feed)", brokerCode: "DHAN", logoColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", buyRatio: 70, sellRatio: 30, obi: 0.40, liquidityDepth: "₹45.2 Cr", latencyMs: 0.8, status: "ACTIVE" },
            { platform: "Zerodha (Kite Connect)", brokerCode: "KITE", logoColor: "text-orange-400 border-orange-500/30 bg-orange-500/10", buyRatio: 66, sellRatio: 34, obi: 0.32, liquidityDepth: "₹110.5 Cr", latencyMs: 1.3, status: "ACTIVE" },
            { platform: "Groww (Order Engine)", brokerCode: "GROWW", logoColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", buyRatio: 69, sellRatio: 31, obi: 0.38, liquidityDepth: "₹88.1 Cr", latencyMs: 2.0, status: "ACTIVE" },
            { platform: "Angel One (SmartAPI)", brokerCode: "ANGEL", logoColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10", buyRatio: 65, sellRatio: 35, obi: 0.30, liquidityDepth: "₹52.4 Cr", latencyMs: 1.6, status: "ACTIVE" },
            { platform: "Upstox (Developer API)", brokerCode: "UPSTX", logoColor: "text-purple-400 border-purple-500/30 bg-purple-500/10", buyRatio: 67, sellRatio: 33, obi: 0.34, liquidityDepth: "₹41.9 Cr", latencyMs: 1.5, status: "ACTIVE" },
          ],
        };
        setSelectedTicker(queryUpper);
        setStockData(customStock);
      }
      setIsScanning(false);
    }, 700);
  };

  const getConsensusBadge = (consensus: IndianStockData["consensus"]) => {
    switch (consensus) {
      case "STRONG BULLISH":
      case "BULLISH":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]";
      case "STRONG BEARISH":
      case "BEARISH":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30 drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/[0.08] bg-[#0c0c10]/95 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-2xl transition-all">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-6 sm:h-7 w-6 sm:w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-orange-400 uppercase">
              NSE &amp; BSE Institutional Intelligence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2.5">
            Indian Market Multi-Broker Liquidity
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Order Flow
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Buying vs. selling volume ratio, order book imbalance (OBI), and micro-price drift aggregated across DhanHQ, Zerodha Kite, Groww, Angel One, and Upstox.
          </p>
        </div>

        {/* Scrollable Mobile Pill Chips */}
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 min-w-max">
            {Object.keys(DEFAULT_INDIAN_STOCKS).map((tkr) => (
              <motion.button
                key={tkr}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectStock(tkr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border whitespace-nowrap active:scale-95 ${
                  selectedTicker === tkr
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {tkr}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-center gap-2.5 mb-6">
        <div className="relative flex-1 group w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-orange-400 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NSE/BSE Symbol (e.g. TATAMOTORS, ZOMATO, SBIN)"
            className="w-full bg-[#060608] text-white pl-10 pr-3.5 py-3 rounded-xl border border-white/[0.08] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono uppercase text-xs sm:text-sm placeholder:normal-case placeholder:text-zinc-600"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={!searchQuery.trim() || isScanning}
          className="flex h-[44px] sm:h-[48px] w-full sm:w-auto items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-40 text-white px-6 rounded-xl font-medium text-xs sm:text-sm transition-all border border-orange-500/40 min-w-[120px]"
        >
          {isScanning ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <ScanLine className="h-4 w-4" />
            </motion.div>
          ) : (
            <>
              Scan Depth <ScanLine className="h-4 w-4 opacity-80" />
            </>
          )}
        </motion.button>
      </form>

      {/* ── ACTIVE STOCK INSIGHTS CARD ── */}
      <div className="bg-[#121218] border border-white/[0.08] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
          
          {/* Stock Info */}
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-white/[0.08] pb-4 md:pb-0 pr-0 md:pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                {stockData.exchange}
              </span>
              <span className="text-xs text-zinc-400 truncate">{stockData.companyName}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">{stockData.ticker}</h3>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                ₹{stockData.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`flex items-center text-xs font-mono font-bold ${
                  stockData.changePct >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {stockData.changePct >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                )}
                {stockData.changePct >= 0 ? `+${stockData.changePct}%` : `${stockData.changePct}%`}
              </span>
            </div>
          </div>

          {/* Aggregated Buy/Sell Ratio Gauge */}
          <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-white/[0.08] pb-4 md:pb-0 pr-0 md:pr-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                Aggregate Buy / Sell Ratio
              </span>
              <div className="flex items-center gap-2 font-mono text-xs font-bold">
                <span className="text-emerald-400">{stockData.overallBuyRatio}% Buy</span>
                <span className="text-zinc-600">|</span>
                <span className="text-rose-400">{stockData.overallSellRatio}% Sell</span>
              </div>
            </div>

            {/* Gauge Split Bar */}
            <div className="h-3.5 sm:h-4 w-full bg-rose-500/20 rounded-full overflow-hidden flex p-0.5 border border-white/[0.08]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stockData.overallBuyRatio}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>

            <div className="flex justify-between items-center mt-2.5 text-[10px] sm:text-[11px] text-zinc-400 font-mono">
              <span>OBI: <strong className={stockData.overallObi >= 0 ? "text-emerald-400" : "text-rose-400"}>
                {stockData.overallObi > 0 ? `+${stockData.overallObi}` : stockData.overallObi}
              </strong></span>
              <span>Micro-Price: <strong className={stockData.microPriceDrift >= 0 ? "text-emerald-400" : "text-rose-400"}>
                {stockData.microPriceDrift > 0 ? `+₹${stockData.microPriceDrift}` : `-₹${Math.abs(stockData.microPriceDrift)}`}
              </strong></span>
            </div>
          </div>

          {/* HFT Predictor Signal Badge */}
          <div className="md:col-span-1 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
              HFT Predictor Signal
            </span>
            <span className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border ${getConsensusBadge(stockData.consensus)}`}>
              {stockData.consensus}
            </span>
          </div>

        </div>
      </div>

      {/* ── PLATFORM BREAKDOWN CARDS GRID ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 mb-1">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Broker Platform Breakdown
          </h4>
          <span className="text-[10px] text-zinc-500 font-mono">
            {stockData.platforms.length} Feed Connections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stockData.platforms.map((platform, idx) => (
            <motion.div
              key={platform.platform}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-[#111116] border border-white/[0.06] hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] rounded-xl p-3.5 transition-all hover:bg-white/[0.02]"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${platform.logoColor}`}>
                    {platform.brokerCode}
                  </span>
                  <span className="text-xs font-bold text-zinc-200 truncate">{platform.platform}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 shrink-0">
                  <Zap className="h-3 w-3 text-amber-400" />
                  {platform.latencyMs}ms
                </div>
              </div>

              {/* Buying / Selling Split Bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono font-bold mb-1">
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" />
                    Buy {platform.buyRatio}%
                  </span>
                  <span className="text-rose-400 flex items-center gap-0.5">
                    Sell {platform.sellRatio}%
                    <ArrowDownRight className="h-3 w-3" />
                  </span>
                </div>

                <div className="h-2 w-full bg-rose-500/20 rounded-full overflow-hidden flex border border-white/[0.05]">
                  <motion.div
                    animate={{ width: `${platform.buyRatio}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-2.5 pt-2 border-t border-white/[0.04]">
                <span>OBI: <strong className={platform.obi >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {platform.obi > 0 ? `+${platform.obi}` : platform.obi}
                </strong></span>
                <span>Depth: <strong className="text-zinc-200">{platform.liquidityDepth}</strong></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}

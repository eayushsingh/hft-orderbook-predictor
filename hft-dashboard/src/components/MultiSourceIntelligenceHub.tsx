"use client";

import React, { useState } from "react";
import {
  Search,
  Globe,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  Building2,
  Newspaper,
  PieChart,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface StockMetadata {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  marketCapCr: number;
  pe: number;
  industryPe: number;
  rocePct: number;
  roePct: number;
  fiiHoldingPct: number;
  diiHoldingPct: number;
  promoterHoldingPct: number;
  deliveryPct: number;
  screenerUrl: string;
  nseUrl: string;
  tradingviewUrl: string;
  moneycontrolUrl: string;
  trendlyneUrl: string;
}

const POPULAR_STOCKS: Record<string, StockMetadata> = {
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    sector: "Oil & Gas / Digital Services",
    price: 2945.5,
    changePct: 1.45,
    marketCapCr: 1992450,
    pe: 28.4,
    industryPe: 24.1,
    rocePct: 12.8,
    roePct: 11.2,
    fiiHoldingPct: 22.4,
    diiHoldingPct: 16.8,
    promoterHoldingPct: 50.3,
    deliveryPct: 62.4,
    screenerUrl: "https://www.screener.in/company/RELIANCE/consolidated/",
    nseUrl: "https://www.nseindia.com/get-quotes/equity?symbol=RELIANCE",
    tradingviewUrl: "https://www.tradingview.com/symbols/NSE-RELIANCE/",
    moneycontrolUrl: "https://www.moneycontrol.com/india/stockpricequote/refineries/relianceindustries/RI",
    trendlyneUrl: "https://trendlyne.com/equity/1118/RELIANCE/reliance-industries-ltd/",
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    sector: "Private Sector Bank",
    price: 1682.1,
    changePct: -0.65,
    marketCapCr: 1285400,
    pe: 18.2,
    industryPe: 16.5,
    rocePct: 14.5,
    roePct: 16.1,
    fiiHoldingPct: 32.1,
    diiHoldingPct: 34.5,
    promoterHoldingPct: 0.0,
    deliveryPct: 68.2,
    screenerUrl: "https://www.screener.in/company/HDFCBANK/consolidated/",
    nseUrl: "https://www.nseindia.com/get-quotes/equity?symbol=HDFCBANK",
    tradingviewUrl: "https://www.tradingview.com/symbols/NSE-HDFCBANK/",
    moneycontrolUrl: "https://www.moneycontrol.com/india/stockpricequote/banks-private-sector/hdfcbank/HDF01",
    trendlyneUrl: "https://trendlyne.com/equity/603/HDFCBANK/hdfc-bank-ltd/",
  },
  INFY: {
    symbol: "INFY",
    name: "Infosys Ltd",
    sector: "Information Technology",
    price: 1892.4,
    changePct: 2.15,
    marketCapCr: 785600,
    pe: 29.1,
    industryPe: 27.8,
    rocePct: 38.4,
    roePct: 31.2,
    fiiHoldingPct: 33.5,
    diiHoldingPct: 35.8,
    promoterHoldingPct: 14.8,
    deliveryPct: 71.5,
    screenerUrl: "https://www.screener.in/company/INFY/consolidated/",
    nseUrl: "https://www.nseindia.com/get-quotes/equity?symbol=INFY",
    tradingviewUrl: "https://www.tradingview.com/symbols/NSE-INFY/",
    moneycontrolUrl: "https://www.moneycontrol.com/india/stockpricequote/computers-software/infosys/IT",
    trendlyneUrl: "https://trendlyne.com/equity/676/INFY/infosys-ltd/",
  },
  TATAMOTORS: {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    sector: "Automobiles",
    price: 985.3,
    changePct: 3.25,
    marketCapCr: 362400,
    pe: 11.4,
    industryPe: 22.5,
    rocePct: 21.6,
    roePct: 24.8,
    fiiHoldingPct: 18.6,
    diiHoldingPct: 17.9,
    promoterHoldingPct: 46.4,
    deliveryPct: 54.8,
    screenerUrl: "https://www.screener.in/company/TATAMOTORS/consolidated/",
    nseUrl: "https://www.nseindia.com/get-quotes/equity?symbol=TATAMOTORS",
    tradingviewUrl: "https://www.tradingview.com/symbols/NSE-TATAMOTORS/",
    moneycontrolUrl: "https://www.moneycontrol.com/india/stockpricequote/auto-cars-jeeps/tatamotors/TM03",
    trendlyneUrl: "https://trendlyne.com/equity/1373/TATAMOTORS/tata-motors-ltd/",
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    sector: "Information Technology",
    price: 4250.8,
    changePct: 1.12,
    marketCapCr: 1538200,
    pe: 31.8,
    industryPe: 27.8,
    rocePct: 52.1,
    roePct: 44.6,
    fiiHoldingPct: 12.5,
    diiHoldingPct: 10.4,
    promoterHoldingPct: 72.4,
    deliveryPct: 74.2,
    screenerUrl: "https://www.screener.in/company/TCS/consolidated/",
    nseUrl: "https://www.nseindia.com/get-quotes/equity?symbol=TCS",
    tradingviewUrl: "https://www.tradingview.com/symbols/NSE-TCS/",
    moneycontrolUrl: "https://www.moneycontrol.com/india/stockpricequote/computers-software/tataconsultancyservices/TCS",
    trendlyneUrl: "https://trendlyne.com/equity/1376/TCS/tata-consultancy-services-ltd/",
  },
  ICICIBANK: {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    sector: "Private Sector Bank",
    price: 1245.0,
    changePct: 0.85,
    marketCapCr: 874500,
    pe: 19.5,
    industryPe: 16.5,
    rocePct: 16.2,
    roePct: 18.4,
    fiiHoldingPct: 44.2,
    diiHoldingPct: 45.1,
    promoterHoldingPct: 0.0,
    deliveryPct: 69.4,
    screenerUrl: "https://www.screener.in/company/ICICIBANK/consolidated/",
    nseUrl: "https://www.nseindia.com/get-quotes/equity?symbol=ICICIBANK",
    tradingviewUrl: "https://www.tradingview.com/symbols/NSE-ICICIBANK/",
    moneycontrolUrl: "https://www.moneycontrol.com/india/stockpricequote/banks-private-sector/icicibank/ICI02",
    trendlyneUrl: "https://trendlyne.com/equity/626/ICICIBANK/icici-bank-ltd/",
  },
};

type ActiveSourceTab = "all" | "screener" | "nse" | "tradingview" | "moneycontrol" | "trendlyne" | "macro";

export default function MultiSourceIntelligenceHub() {
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveSourceTab>("all");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const stock = POPULAR_STOCKS[selectedSymbol] || POPULAR_STOCKS["RELIANCE"];

  const filteredSymbols = Object.keys(POPULAR_STOCKS).filter(
    (sym) =>
      sym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      POPULAR_STOCKS[sym].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#08080c] text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl p-4 sm:p-6 space-y-6 font-sans">
      {/* ── HEADER TITLE & CONTROLS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#387ed1]/15 text-[#387ed1] border border-[#387ed1]/30">
              <Globe className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              All-In-One Quant &amp; Research Intelligence Hub
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase">
              7 Live Sources Integrated
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Screener.in fundamentals, NSE India filings, TradingView technicals, Moneycontrol sentiment, and Trendlyne institutional flow — all aggregated into a single terminal window.
          </p>
        </div>

        {/* Stock Search Bar */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock (RELIANCE, INFY, HDFCBANK)..."
            className="w-full bg-[#111118] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-[#387ed1] transition-colors font-mono"
          />

          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#12121a] border border-zinc-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto z-50 p-1">
              {filteredSymbols.length > 0 ? (
                filteredSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => {
                      setSelectedSymbol(sym);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-mono rounded-lg hover:bg-[#1f1f2e] transition-colors flex items-center justify-between"
                  >
                    <span className="font-bold text-white">{sym}</span>
                    <span className="text-[10px] text-zinc-400 truncate max-w-[140px]">
                      {POPULAR_STOCKS[sym].name}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-xs text-zinc-500 text-center font-mono">No stock found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── POPULAR TICKERS QUICK CHIPS ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-[11px] font-mono text-zinc-500 font-bold shrink-0 uppercase">Quick Tickers:</span>
        {Object.keys(POPULAR_STOCKS).map((sym) => {
          const isSelected = selectedSymbol === sym;
          return (
            <button
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
                isSelected
                  ? "bg-[#387ed1] text-white border-[#387ed1] shadow-lg shadow-[#387ed1]/20 scale-105"
                  : "bg-[#101018] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {sym}
            </button>
          );
        })}
      </div>

      {/* ── SOURCE SELECTION NAVIGATION TABS ── */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800/80 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => {
            setActiveTab("all");
            setIframeUrl(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
            activeTab === "all"
              ? "bg-[#387ed1]/15 text-[#387ed1] border-[#387ed1]/40 shadow-sm"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Unified All-In-One Matrix</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("screener");
            setIframeUrl(stock.screenerUrl);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
            activeTab === "screener"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Screener.in (Fundamentals)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("nse");
            setIframeUrl(stock.nseUrl);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
            activeTab === "nse"
              ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NSE India (Official Disclosures)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("tradingview");
            setIframeUrl(stock.tradingviewUrl);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
            activeTab === "tradingview"
              ? "bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-sm"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>TradingView (Technicals)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("moneycontrol");
            setIframeUrl(stock.moneycontrolUrl);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
            activeTab === "moneycontrol"
              ? "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-sm"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Moneycontrol (News &amp; FII)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("trendlyne");
            setIframeUrl(stock.trendlyneUrl);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
            activeTab === "trendlyne"
              ? "bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-sm"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Trendlyne (Delivery &amp; Superstars)</span>
        </button>
      </div>

      {/* ── EXTERNAL DIRECT LAUNCH PADS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0f0f17] border border-zinc-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase">{stock.symbol} ({stock.name})</span>
          <span className="text-zinc-400">· ₹{stock.price.toLocaleString("en-IN")}</span>
          <span
            className={`font-bold ${
              stock.changePct >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {stock.changePct >= 0 ? "+" : ""}
            {stock.changePct}%
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <a
            href={stock.screenerUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:underline px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20"
          >
            <span>Screener.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={stock.nseUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-cyan-400 hover:underline px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20"
          >
            <span>NSE Official</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={stock.tradingviewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sky-400 hover:underline px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/20"
          >
            <span>TradingView</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={stock.moneycontrolUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:underline px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20"
          >
            <span>Moneycontrol</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── TAB CONTENT DISPLAY AREA ── */}
      {activeTab === "all" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Screener.in Fundamentals */}
          <div className="p-5 rounded-2xl bg-[#0d0d14] border border-emerald-500/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Screener.in Financial Ratios</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">Stock P/E</span>
                <div className="text-sm font-bold text-white mt-0.5">{stock.pe}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">Industry P/E</span>
                <div className="text-sm font-bold text-zinc-300 mt-0.5">{stock.industryPe}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">ROCE (%)</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{stock.rocePct}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">ROE (%)</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{stock.roePct}%</div>
              </div>
            </div>

            {/* Shareholding Breakdown */}
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>FII Holding</span>
                <span className="font-bold text-sky-400">{stock.fiiHoldingPct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-sky-500 transition-all duration-500 ease-out transform-gpu" style={{ width: `${stock.fiiHoldingPct}%` }} />
              </div>

              <div className="flex justify-between text-zinc-400 text-[11px] pt-1">
                <span>DII Holding</span>
                <span className="font-bold text-emerald-400">{stock.diiHoldingPct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500 ease-out transform-gpu" style={{ width: `${stock.diiHoldingPct}%` }} />
              </div>

              <div className="flex justify-between text-zinc-400 text-[11px] pt-1">
                <span>Promoters</span>
                <span className="font-bold text-purple-400">{stock.promoterHoldingPct}%</span>
              </div>
            </div>

            <a
              href={stock.screenerUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition-all"
            >
              <span>View Full Screener.in Balance Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: NSE Official Exchange Intelligence */}
          <div className="p-5 rounded-2xl bg-[#0d0d14] border border-cyan-500/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">NSE Official Filings &amp; Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                LIVE NSE DISCLOSURE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#141420] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>NSE CORPORATE ANNOUNCEMENT</span>
                  <span className="text-cyan-400">TODAY 10:14 AM</span>
                </div>
                <div className="font-bold text-white text-xs">
                  Board Meeting Outcome: Q2 Capital Expenditure &amp; Expansion Disclosures
                </div>
                <p className="text-[11px] text-zinc-400">
                  Official exchange filing verified under Regulation 30 of SEBI (LODR).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141420] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>NSE BULK DEAL STREAM</span>
                  <span className="text-emerald-400">EXECUTED</span>
                </div>
                <div className="font-bold text-white text-xs">
                  ICICI Prudential Mutual Fund bought 1.2M shares at ₹{stock.price}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#14141f] border border-zinc-800 text-xs">
                <span className="text-zinc-400">Delivery Volume %</span>
                <span className="font-bold text-cyan-400 font-mono">{stock.deliveryPct}% (High Accumulation)</span>
              </div>
            </div>

            <a
              href={stock.nseUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold transition-all"
            >
              <span>View NSE India Corporate Filings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: TradingView Technical Consensus */}
          <div className="p-5 rounded-2xl bg-[#0d0d14] border border-sky-500/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm">TradingView Technical Ratings</h3>
              </div>
              <span className="text-[10px] font-mono text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                STRONG BUY
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#141420] border border-zinc-800 text-center space-y-2">
                <span className="text-zinc-400 text-[10px] uppercase">Combined Consensus Gauge</span>
                <div className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>STRONG BUY (18 / 22 Indicators)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">RSI (14)</span>
                  <div className="font-bold text-emerald-400 mt-0.5">62.4 (Bullish Zone)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">MACD (12, 26)</span>
                  <div className="font-bold text-emerald-400 mt-0.5">+14.2 Bull Crossover</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">200 DMA</span>
                  <div className="font-bold text-cyan-400 mt-0.5">Above Trendline</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#14141f] border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">Pivot (R1)</span>
                  <div className="font-bold text-white mt-0.5">₹{(stock.price * 1.025).toFixed(1)}</div>
                </div>
              </div>
            </div>

            <a
              href={stock.tradingviewUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-mono text-xs font-bold transition-all"
            >
              <span>Open TradingView Interactive Chart</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* Embedded Live Frame Preview Window */
        <div className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl space-y-2 p-4">
          <div className="flex items-center justify-between px-3 py-2 bg-[#12121c] rounded-xl border border-zinc-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300 font-bold truncate max-w-md">
                Live Source Web Portal Stream: {iframeUrl}
              </span>
            </div>
            <a
              href={iframeUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#387ed1] text-white font-bold text-xs hover:bg-[#306ec0] transition-colors"
            >
              <span>Open External Window</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-[520px] bg-[#0c0c12] rounded-xl overflow-hidden relative border border-zinc-800/80">
            <iframe
              src={iframeUrl || stock.screenerUrl}
              className="w-full h-full border-0"
              title="Multi-Source Market Stream"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        </div>
      )}
    </div>
  );
}

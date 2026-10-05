"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Layers,
  ChevronRight,
  Pin,
  PinOff,
} from "lucide-react";

export interface WatchlistStock {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE" | "BINANCE";
  price: number;
  changePct: number;
  changeAbs: number;
  pinned?: boolean;
  depth?: {
    bids: { price: number; qty: number }[];
    asks: { price: number; qty: number }[];
  };
}

export const INITIAL_WATCHLIST: WatchlistStock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    exchange: "NSE",
    price: 2984.50,
    changePct: 1.84,
    changeAbs: 53.80,
    pinned: true,
    depth: {
      bids: [
        { price: 2984.50, qty: 1450 },
        { price: 2984.00, qty: 3200 },
        { price: 2983.50, qty: 890 },
      ],
      asks: [
        { price: 2985.00, qty: 1120 },
        { price: 2985.50, qty: 2400 },
        { price: 2986.00, qty: 1800 },
      ],
    },
  },
  {
    symbol: "NIFTY 50",
    name: "NSE Benchmark Index",
    exchange: "NSE",
    price: 24850.75,
    changePct: 0.62,
    changeAbs: 153.20,
    pinned: true,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    exchange: "NSE",
    price: 1642.30,
    changePct: -0.45,
    changeAbs: -7.40,
    pinned: true,
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd.",
    exchange: "NSE",
    price: 985.10,
    changePct: 2.95,
    changeAbs: 28.20,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    exchange: "NSE",
    price: 1890.60,
    changePct: 0.15,
    changeAbs: 2.80,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
    price: 4250.00,
    changePct: 1.10,
    changeAbs: 46.30,
  },
  {
    symbol: "BTC/USDT",
    name: "Bitcoin Live Disruptor Stream",
    exchange: "BINANCE",
    price: 64250.00,
    changePct: 2.10,
    changeAbs: 1320.00,
    pinned: true,
  },
];

interface LalanWatchlistProps {
  onSelectStock: (stock: WatchlistStock) => void;
  selectedSymbol?: string;
  onOpenBuyModal: (symbol: string, price: number) => void;
  onOpenSellModal: (symbol: string, price: number) => void;
  liveBtcPrice?: number;
}

export default function LalanWatchlist({
  onSelectStock,
  selectedSymbol = "RELIANCE",
  onOpenBuyModal,
  onOpenSellModal,
  liveBtcPrice,
}: LalanWatchlistProps) {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>(INITIAL_WATCHLIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<number>(1);
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  // Sync BTC price tick updates
  useEffect(() => {
    if (!liveBtcPrice) return;
    setWatchlist((prev) =>
      prev.map((item) =>
        item.symbol === "BTC/USDT"
          ? {
              ...item,
              price: liveBtcPrice,
              changeAbs: liveBtcPrice - 62930,
              changePct: ((liveBtcPrice - 62930) / 62930) * 100,
            }
          : item
      )
    );
  }, [liveBtcPrice]);

  // Market price tick calculation
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;
      setWatchlist((prev) =>
        prev.map((item, idx) => {
          if (item.symbol === "BTC/USDT" && liveBtcPrice) return item;
          const delta = Math.sin((tickCount + idx) * 0.4) * (item.price * 0.0008);
          const newPrice = Math.max(1, Math.round((item.price + delta) * 100) / 100);
          return {
            ...item,
            price: newPrice,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [liveBtcPrice]);

  // Zero-latency memoized filtered list
  const filteredWatchlist = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return watchlist;
    return watchlist.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(q) ||
        stock.name.toLowerCase().includes(q)
    );
  }, [watchlist, searchQuery]);

  const togglePin = useCallback((e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    setWatchlist((prev) =>
      prev.map((item) => (item.symbol === symbol ? { ...item, pinned: !item.pinned } : item))
    );
  }, []);

  const removeStock = useCallback((e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
  }, []);

  return (
    <div className="flex h-full flex-col border-r border-[#262630] bg-[#121216] text-[#e0e0e0] font-sans">
      {/* ── SEARCH & FILTER HEADER ── */}
      <div className="border-b border-[#1f1f26] p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#747888]" />
          <input
            type="text"
            placeholder="Search eg: RELIANCE, NIFTY, BTC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#262630] bg-[#0c0c0f] pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-[#747888] focus:border-[#387ed1] focus:outline-none focus:ring-1 focus:ring-[#387ed1]"
          />
        </div>

        {/* Watchlist Tabs (1 to 5) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#747888] px-1 pt-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">MarketWatch</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((tabNum) => (
              <button
                key={tabNum}
                onClick={() => setActiveTab(tabNum)}
                className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold transition-colors ${
                  activeTab === tabNum
                    ? "bg-[#387ed1] text-white"
                    : "hover:bg-[#1a1a20] text-[#747888]"
                }`}
              >
                {tabNum}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── WATCHLIST ITEM LIST ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#1a1a22]">
        {filteredWatchlist.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#747888] font-mono">
            No instruments found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredWatchlist.map((stock) => {
            const isSelected = stock.symbol === selectedSymbol;
            const isHovered = hoveredSymbol === stock.symbol;
            const isPositive = stock.changePct >= 0;

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                onMouseEnter={() => setHoveredSymbol(stock.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className={`relative flex items-center justify-between p-3 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-slate-100 dark:bg-[#1c1c26] border-l-2 border-[#387ed1]"
                    : "hover:bg-slate-100 dark:hover:bg-[#16161e]"
                }`}
              >
                {/* Symbol & Exchange Name */}
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`font-mono text-xs font-bold truncate ${
                        isSelected ? "text-[#387ed1] font-extrabold" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {stock.symbol}
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-1 rounded bg-slate-200 dark:bg-[#1c1c24] text-slate-700 dark:text-[#747888]">
                      {stock.exchange}
                    </span>
                    {stock.pinned && <Pin className="h-2.5 w-2.5 text-[#387ed1] fill-[#387ed1]" />}
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-[#747888] font-medium truncate max-w-[140px]">
                    {stock.name}
                  </span>
                </div>

                {/* ── HOVER ACTION BUTTONS ── */}
                {isHovered ? (
                  <motion.div
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-1 z-10 shrink-0"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBuyModal(stock.symbol, stock.price);
                      }}
                      className="bg-[#387ed1] hover:bg-[#306ec0] text-white font-mono text-[10px] font-bold px-2 py-1 rounded transition-all shadow"
                    >
                      B
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSellModal(stock.symbol, stock.price);
                      }}
                      className="bg-[#ff5722] hover:bg-[#e64a19] text-white font-mono text-[10px] font-bold px-2 py-1 rounded transition-all shadow"
                    >
                      S
                    </button>
                    <button
                      onClick={(e) => togglePin(e, stock.symbol)}
                      className="p-1 rounded hover:bg-[#242432] text-[#747888] hover:text-white"
                      title={stock.pinned ? "Unpin" : "Pin"}
                    >
                      {stock.pinned ? (
                        <PinOff className="h-3 w-3" />
                      ) : (
                        <Pin className="h-3 w-3" />
                      )}
                    </button>
                  </motion.div>
                ) : (
                  /* Standard Price & Percentage Display */
                  <div className="flex flex-col text-right leading-tight font-mono shrink-0">
                    <span
                      className={`text-xs font-bold ${
                        isPositive ? "text-[#10b981]" : "text-[#f43f5e]"
                      }`}
                    >
                      {stock.exchange === "BINANCE" ? "$" : "₹"}
                      {stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`flex items-center justify-end text-[10px] font-semibold ${
                        isPositive ? "text-[#10b981]" : "text-[#f43f5e]"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {isPositive ? `+${stock.changePct.toFixed(2)}%` : `${stock.changePct.toFixed(2)}%`}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── FOOTER STATS SUMMARY ── */}
      <div className="border-t border-[#1f1f26] bg-[#0c0c0f] p-2.5 text-[10px] font-mono text-[#747888] flex items-center justify-between">
        <span>{watchlist.length} / 50 ITEMS</span>
        <span className="text-[#387ed1]">LALAN DIRECT L2</span>
      </div>
    </div>
  );
}

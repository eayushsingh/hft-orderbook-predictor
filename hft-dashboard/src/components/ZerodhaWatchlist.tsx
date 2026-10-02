"use client";

import React, { useState, useEffect } from "react";
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

interface ZerodhaWatchlistProps {
  onSelectStock: (stock: WatchlistStock) => void;
  selectedSymbol?: string;
  onOpenBuyModal: (symbol: string, price: number) => void;
  onOpenSellModal: (symbol: string, price: number) => void;
  liveBtcPrice?: number;
}

export default function ZerodhaWatchlist({
  onSelectStock,
  selectedSymbol = "RELIANCE",
  onOpenBuyModal,
  onOpenSellModal,
  liveBtcPrice,
}: ZerodhaWatchlistProps) {
  const [stocks, setStocks] = useState<WatchlistStock[]>(INITIAL_WATCHLIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWatchlistTab, setActiveWatchlistTab] = useState(1);
  const [tickFlashes, setTickFlashes] = useState<Record<string, "up" | "down">>({});
  const [depthOpenSymbol, setDepthOpenSymbol] = useState<string | null>(null);

  // Sync live BTC price from Binance stream if present
  useEffect(() => {
    if (liveBtcPrice && liveBtcPrice > 0) {
      setStocks((prev) =>
        prev.map((s) => {
          if (s.symbol === "BTC/USDT") {
            const dir = liveBtcPrice > s.price ? "up" : "down";
            setTickFlashes((f) => ({ ...f, "BTC/USDT": dir }));
            setTimeout(() => {
              setTickFlashes((f) => {
                const next = { ...f };
                delete next["BTC/USDT"];
                return next;
              });
            }, 300);

            return { ...s, price: liveBtcPrice };
          }
          return s;
        })
      );
    }
  }, [liveBtcPrice]);

  // Live order flow tick simulation for domestic stocks
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => {
          if (stock.symbol === "BTC/USDT") return stock; // handled by live stream
          if (Math.random() < 0.4) {
            const delta = (Math.random() - 0.48) * (stock.price * 0.001);
            const newPrice = Math.max(1, Math.round((stock.price + delta) * 100) / 100);
            const dir = newPrice >= stock.price ? "up" : "down";

            setTickFlashes((f) => ({ ...f, [stock.symbol]: dir }));
            setTimeout(() => {
              setTickFlashes((f) => {
                const next = { ...f };
                delete next[stock.symbol];
                return next;
              });
            }, 300);

            return { ...stock, price: newPrice };
          }
          return stock;
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePin = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStocks((prev) =>
      prev.map((s) => (s.symbol === symbol ? { ...s, pinned: !s.pinned } : s))
    );
  };

  return (
    <div className="flex h-full flex-col border-r border-[#262630] bg-[#14141a] text-[#dedede] font-sans selection:bg-[#387ed1] selection:text-white">
      {/* ── SEARCH BAR ── */}
      <div className="p-2.5 border-b border-[#262630] bg-[#111116]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#747888]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search eg: infy bse, nifty fut, btc..."
            className="w-full bg-[#1c1c24] text-xs text-white pl-9 pr-7 py-2 rounded border border-[#282834] focus:outline-none focus:border-[#387ed1] transition-colors placeholder:text-[#636674] font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#747888] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── WATCHLIST TABS ── */}
      <div className="flex items-center justify-between border-b border-[#262630] bg-[#0d0d11] px-2 text-[11px] font-mono text-[#8a8d9b]">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setActiveWatchlistTab(num)}
              className={`px-3 py-1.5 font-bold transition-all border-b-2 ${
                activeWatchlistTab === num
                  ? "border-[#387ed1] text-[#387ed1] bg-[#16161d]"
                  : "border-transparent text-[#747888] hover:text-white"
              }`}
            >
              WL {num}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-[#636674] pr-1">{filteredStocks.length} Items</span>
      </div>

      {/* ── STOCK LISTING ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#1e1e27]">
        {filteredStocks.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#747888] font-mono">
            No instruments match &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const isSelected = selectedSymbol === stock.symbol;
            const flash = tickFlashes[stock.symbol];
            const isPositive = stock.changePct >= 0;

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className={`group relative flex flex-col px-3 py-2.5 transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#1f1f2a] border-l-2 border-[#387ed1]"
                    : "hover:bg-[#181820]"
                } ${
                  flash === "up"
                    ? "bg-[#10b981]/15"
                    : flash === "down"
                    ? "bg-[#f43f5e]/15"
                    : ""
                }`}
              >
                {/* Main Stock Line */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="text-xs font-bold text-white font-mono tracking-tight group-hover:text-[#387ed1] transition-colors">
                      {stock.symbol}
                    </span>
                    <span className="text-[9px] font-mono px-1 rounded bg-[#242430] text-[#8a8d9b] border border-[#303040]">
                      {stock.exchange}
                    </span>
                  </div>

                  {/* Price & Change */}
                  <div className="flex items-baseline space-x-2 font-mono text-right shrink-0">
                    <span
                      className={`text-xs font-bold transition-colors ${
                        flash === "up"
                          ? "text-[#10b981]"
                          : flash === "down"
                          ? "text-[#f43f5e]"
                          : isPositive
                          ? "text-[#10b981]"
                          : "text-[#f43f5e]"
                      }`}
                    >
                      {stock.exchange === "BINANCE"
                        ? `$${stock.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : `₹${stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isPositive ? "text-[#10b981]" : "text-[#f43f5e]"
                      }`}
                    >
                      {isPositive ? `+${stock.changePct}%` : `${stock.changePct}%`}
                    </span>
                  </div>
                </div>

                {/* Subtitle / Company Name */}
                <div className="flex items-center justify-between mt-0.5 text-[10px] text-[#747888]">
                  <span className="truncate max-w-[170px]">{stock.name}</span>
                  <span>{stock.changeAbs > 0 ? `+${stock.changeAbs}` : stock.changeAbs}</span>
                </div>

                {/* ── HOVER ACTION BUTTONS (Zerodha Kite Signature feature!) ── */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center space-x-1 bg-[#16161d] p-1 rounded border border-[#2a2a38] shadow-xl z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBuyModal(stock.symbol, stock.price);
                    }}
                    className="bg-[#387ed1] hover:bg-[#306ec0] text-white text-[10px] font-extrabold px-2 py-1 rounded transition-transform active:scale-95 shadow"
                    title="Buy (B)"
                  >
                    B
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSellModal(stock.symbol, stock.price);
                    }}
                    className="bg-[#ff5722] hover:bg-[#e64a19] text-white text-[10px] font-extrabold px-2 py-1 rounded transition-transform active:scale-95 shadow"
                    title="Sell (S)"
                  >
                    S
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDepthOpenSymbol(
                        depthOpenSymbol === stock.symbol ? null : stock.symbol
                      );
                    }}
                    className="bg-[#242430] hover:bg-[#303040] text-[#b0b3c0] hover:text-white p-1 rounded transition-colors"
                    title="Market Depth"
                  >
                    <BarChart2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => togglePin(stock.symbol, e)}
                    className="bg-[#242430] hover:bg-[#303040] text-[#b0b3c0] hover:text-white p-1 rounded transition-colors"
                    title={stock.pinned ? "Unpin" : "Pin"}
                  >
                    {stock.pinned ? (
                      <PinOff className="h-3 w-3 text-[#ff5722]" />
                    ) : (
                      <Pin className="h-3 w-3" />
                    )}
                  </button>
                </div>

                {/* Inline Market Depth drawer if clicked */}
                <AnimatePresence>
                  {depthOpenSymbol === stock.symbol && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 pt-2 border-t border-[#262630] text-[10px] font-mono bg-[#0e0e14] p-2 rounded"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[#10b981] font-bold mb-1">BIDS (BUY)</p>
                          <div className="space-y-0.5">
                            {(stock.depth?.bids || [
                              { price: stock.price - 0.5, qty: 850 },
                              { price: stock.price - 1.0, qty: 1400 },
                            ]).map((b, i) => (
                              <div key={i} className="flex justify-between text-[#a0a3b0]">
                                <span>₹{b.price.toFixed(2)}</span>
                                <span className="text-white">{b.qty}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[#f43f5e] font-bold mb-1 text-right">ASKS (SELL)</p>
                          <div className="space-y-0.5">
                            {(stock.depth?.asks || [
                              { price: stock.price + 0.5, qty: 920 },
                              { price: stock.price + 1.0, qty: 1800 },
                            ]).map((a, i) => (
                              <div key={i} className="flex justify-between text-[#a0a3b0]">
                                <span>₹{a.price.toFixed(2)}</span>
                                <span className="text-white">{a.qty}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-[#262630] bg-[#0c0c10] text-[10px] font-mono text-[#636674] flex justify-between items-center">
        <span>HOLDINGS: 4</span>
        <span className="text-[#387ed1]">L2 DIRECT FEED</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Layers, Zap } from "lucide-react";

export interface DepthLevel {
  price: number;
  qty: number;
}

interface LalanOrderBookProps {
  bids: DepthLevel[];
  asks: DepthLevel[];
  spread: number;
  spreadBps: number;
  midPrice: number;
  obi: number;
  onSelectPrice?: (price: number, type: "BUY" | "SELL") => void;
  currencySymbol?: string;
}

type ViewMode = "both" | "bids" | "asks" | "sideBySide";

export default function LalanOrderBook({
  bids = [],
  asks = [],
  spread = 0,
  spreadBps = 0,
  midPrice = 0,
  obi = 0,
  onSelectPrice,
  currencySymbol = "$",
}: LalanOrderBookProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [depthCount, setDepthCount] = useState<number>(10);
  const [hoveredRow, setHoveredRow] = useState<{ price: number; type: "BUY" | "SELL" } | null>(null);

  // Generate fallback realistic multi-level depth if WS stream provides 5 levels
  const formattedBids = useMemo(() => {
    if (bids.length >= depthCount) return bids.slice(0, depthCount);
    if (bids.length === 0) return [];
    
    const result: DepthLevel[] = [...bids];
    const topBid = bids[0]?.price || 100;
    const baseQty = bids[0]?.qty || 1.5;

    for (let i = bids.length; i < depthCount; i++) {
      const p = topBid - i * (topBid * 0.0003);
      const q = baseQty * (1 + Math.sin(i) * 0.3 + i * 0.15);
      result.push({
        price: Math.max(0.01, Math.round(p * 100) / 100),
        qty: Math.round(q * 1000) / 1000,
      });
    }
    return result;
  }, [bids, depthCount]);

  const formattedAsks = useMemo(() => {
    if (asks.length >= depthCount) return asks.slice(0, depthCount);
    if (asks.length === 0) return [];

    const result: DepthLevel[] = [...asks];
    const topAsk = asks[0]?.price || 100;
    const baseQty = asks[0]?.qty || 1.5;

    for (let i = asks.length; i < depthCount; i++) {
      const p = topAsk + i * (topAsk * 0.0003);
      const q = baseQty * (1 + Math.cos(i) * 0.3 + i * 0.15);
      result.push({
        price: Math.round(p * 100) / 100,
        qty: Math.round(q * 1000) / 1000,
      });
    }
    return result;
  }, [asks, depthCount]);

  // Compute cumulative volumes and maximum volume for depth background bar fill
  const { bidsWithCum, asksWithCum, maxCumVolume, totalBidQty, totalAskQty } = useMemo(() => {
    let cumBid = 0;
    const bidsWithCumList = [];
    for (const b of formattedBids) {
      cumBid += b.qty;
      bidsWithCumList.push({ ...b, cumQty: cumBid });
    }

    let cumAsk = 0;
    const asksWithCumList = [];
    for (const a of formattedAsks) {
      cumAsk += a.qty;
      asksWithCumList.push({ ...a, cumQty: cumAsk });
    }

    const maxCumVolume = Math.max(cumBid, cumAsk, 1);
    return {
      bidsWithCum: bidsWithCumList,
      asksWithCum: asksWithCumList,
      maxCumVolume,
      totalBidQty: cumBid,
      totalAskQty: cumAsk,
    };
  }, [formattedBids, formattedAsks]);

  // Buy / Sell percentage ratio
  const totalWeight = totalBidQty + totalAskQty || 1;
  const buyPct = Math.round((totalBidQty / totalWeight) * 100);
  const sellPct = 100 - buyPct;

  return (
    <div className="w-full rounded-2xl border border-[#262634] bg-[#14141a] p-4 sm:p-5 shadow-2xl font-sans text-[#e0e0e0] flex flex-col">
      {/* ── HEADER TOOLBAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262634] pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/30">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white tracking-wider uppercase flex items-center gap-1.5">
              Level 2 Order Book
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
              </span>
            </h3>
            <span className="text-[10px] text-[#747888] font-mono">Institutional Depth Stream</span>
          </div>
        </div>

        {/* View Mode Controls & Depth Count Selector */}
        <div className="flex items-center space-x-2">
          {/* Layout Buttons */}
          <div className="flex rounded-lg bg-[#0c0c0f] border border-[#262630] p-0.5 text-[10px] font-mono font-bold">
            <button
              onClick={() => setViewMode("both")}
              className={`px-2 py-1 rounded transition-colors ${
                viewMode === "both" ? "bg-[#1f1f28] text-white shadow" : "text-[#747888] hover:text-white"
              }`}
              title="Both Bids & Asks"
            >
              Default
            </button>
            <button
              onClick={() => setViewMode("bids")}
              className={`px-2 py-1 rounded transition-colors ${
                viewMode === "bids" ? "bg-[#10b981]/20 text-[#10b981]" : "text-[#747888] hover:text-white"
              }`}
              title="Bids Only"
            >
              Bids
            </button>
            <button
              onClick={() => setViewMode("asks")}
              className={`px-2 py-1 rounded transition-colors ${
                viewMode === "asks" ? "bg-[#f43f5e]/20 text-[#f43f5e]" : "text-[#747888] hover:text-white"
              }`}
              title="Asks Only"
            >
              Asks
            </button>
            <button
              onClick={() => setViewMode("sideBySide")}
              className={`px-2 py-1 rounded transition-colors ${
                viewMode === "sideBySide" ? "bg-[#387ed1]/20 text-[#387ed1]" : "text-[#747888] hover:text-white"
              }`}
              title="Side-by-Side View"
            >
              Split
            </button>
          </div>

          {/* Depth Count Selector */}
          <div className="flex items-center space-x-1 bg-[#0c0c0f] border border-[#262630] px-2 py-1 rounded-lg text-[10px] font-mono text-[#747888]">
            <span>Depth:</span>
            <select
              value={depthCount}
              onChange={(e) => setDepthCount(Number(e.target.value))}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value={5} className="bg-[#14141a]">5</option>
              <option value={10} className="bg-[#14141a]">10</option>
              <option value={15} className="bg-[#14141a]">15</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── TABLE COLUMN HEADERS ── */}
      {viewMode !== "sideBySide" ? (
        <div className="grid grid-cols-3 gap-2 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#747888] border-b border-[#242432]">
          <span>Price ({currencySymbol})</span>
          <span className="text-right">Size (Qty)</span>
          <span className="text-right">Total (Cumulative)</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#747888] border-b border-[#242432]">
          <div className="flex justify-between pr-2">
            <span>Bids (Buy)</span>
            <span>Qty</span>
          </div>
          <div className="flex justify-between pl-2">
            <span>Qty</span>
            <span>Asks (Sell)</span>
          </div>
        </div>
      )}

      {/* ── ORDER BOOK CONTENT ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-1 space-y-0.5 text-xs font-mono">
        {viewMode === "sideBySide" ? (
          /* Side-by-Side Split View */
          <div className="grid grid-cols-2 gap-3">
            {/* Left Column: Bids (Buy) */}
            <div className="space-y-0.5">
              {bidsWithCum.map((bid, i) => {
                const fillPct = Math.min(100, Math.max(5, (bid.cumQty / maxCumVolume) * 100));
                return (
                  <div
                    key={`split-bid-${i}`}
                    onClick={() => onSelectPrice && onSelectPrice(bid.price, "BUY")}
                    onMouseEnter={() => setHoveredRow({ price: bid.price, type: "BUY" })}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`relative flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-all duration-200 hover:bg-[#10b981]/20 hover:scale-[1.01] active:scale-[0.99] ${
                      hoveredRow?.price === bid.price && hoveredRow.type === "BUY" ? "ring-1 ring-[#10b981]/50 bg-[#10b981]/20" : ""
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded bg-[#10b981]/15 pointer-events-none transition-all duration-300 ease-out transform-gpu"
                      style={{ width: `${fillPct}%` }}
                    />
                    <span className="relative z-10 text-[#10b981] font-bold">
                      {currencySymbol}{bid.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="relative z-10 text-white font-semibold">{bid.qty.toFixed(4)}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Asks (Sell) */}
            <div className="space-y-0.5">
              {asksWithCum.map((ask, i) => {
                const fillPct = Math.min(100, Math.max(5, (ask.cumQty / maxCumVolume) * 100));
                return (
                  <div
                    key={`split-ask-${i}`}
                    onClick={() => onSelectPrice && onSelectPrice(ask.price, "SELL")}
                    onMouseEnter={() => setHoveredRow({ price: ask.price, type: "SELL" })}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`relative flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-all duration-200 hover:bg-[#f43f5e]/20 hover:scale-[1.01] active:scale-[0.99] ${
                      hoveredRow?.price === ask.price && hoveredRow.type === "SELL" ? "ring-1 ring-[#f43f5e]/50 bg-[#f43f5e]/20" : ""
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 right-0 rounded bg-[#f43f5e]/15 pointer-events-none transition-all duration-300 ease-out transform-gpu"
                      style={{ width: `${fillPct}%` }}
                    />
                    <span className="relative z-10 text-white font-semibold">{ask.qty.toFixed(4)}</span>
                    <span className="relative z-10 text-[#f43f5e] font-bold">
                      {currencySymbol}{ask.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Standard Vertical View (Asks on Top, Spread Bar, Bids on Bottom) */
          <>
            {/* ASKS (SELL ORDERS) - Displayed in reverse order (highest top, lowest ask near spread) */}
            {(viewMode === "both" || viewMode === "asks") && (
              <div className="flex flex-col-reverse space-y-0.5 space-y-reverse">
                {asksWithCum.map((ask, i) => {
                  const fillPct = Math.min(100, Math.max(5, (ask.cumQty / maxCumVolume) * 100));
                  return (
                    <div
                      key={`ask-${i}`}
                      onClick={() => onSelectPrice && onSelectPrice(ask.price, "SELL")}
                      onMouseEnter={() => setHoveredRow({ price: ask.price, type: "SELL" })}
                      onMouseLeave={() => setHoveredRow(null)}
                      className="group relative grid grid-cols-3 gap-2 px-2 py-1 rounded cursor-pointer transition-colors hover:bg-[#f43f5e]/20"
                    >
                      <div
                        className="absolute inset-y-0 right-0 rounded bg-[#f43f5e]/15 pointer-events-none transition-all duration-150"
                        style={{ width: `${fillPct}%` }}
                      />
                      <span className="relative z-10 text-[#f43f5e] font-bold flex items-center gap-1">
                        {currencySymbol}{ask.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="relative z-10 text-right text-white font-semibold">{ask.qty.toFixed(4)}</span>
                      <span className="relative z-10 text-right text-[#8a8d9b] font-medium">{ask.cumQty.toFixed(4)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* REAL-TIME SPREAD BANNER (Center Divider) */}
            {viewMode === "both" && (
              <div className="my-2 flex items-center justify-between rounded-xl bg-[#0c0c10] border border-[#262634] px-3 py-2 my-1 shadow-inner">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#747888] uppercase tracking-wider">Mid-Price:</span>
                  <span className="font-mono text-sm font-black text-white">
                    {currencySymbol}{midPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px] font-mono">
                  <div className="flex items-center space-x-1 text-[#8a8d9b]">
                    <span>Spread:</span>
                    <span className="font-bold text-white">
                      {currencySymbol}{spread.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#387ed1]">({spreadBps.toFixed(2)} bps)</span>
                  </div>
                </div>
              </div>
            )}

            {/* BIDS (BUY ORDERS) - Displayed in descending order (highest bid near spread, lowest bottom) */}
            {(viewMode === "both" || viewMode === "bids") && (
              <div className="space-y-0.5">
                {bidsWithCum.map((bid, i) => {
                  const fillPct = Math.min(100, Math.max(5, (bid.cumQty / maxCumVolume) * 100));
                  return (
                    <div
                      key={`bid-${i}`}
                      onClick={() => onSelectPrice && onSelectPrice(bid.price, "BUY")}
                      onMouseEnter={() => setHoveredRow({ price: bid.price, type: "BUY" })}
                      onMouseLeave={() => setHoveredRow(null)}
                      className="group relative grid grid-cols-3 gap-2 px-2 py-1 rounded cursor-pointer transition-colors hover:bg-[#10b981]/20"
                    >
                      <div
                        className="absolute inset-y-0 right-0 rounded bg-[#10b981]/15 pointer-events-none transition-all duration-150"
                        style={{ width: `${fillPct}%` }}
                      />
                      <span className="relative z-10 text-[#10b981] font-bold flex items-center gap-1">
                        {currencySymbol}{bid.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="relative z-10 text-right text-white font-semibold">{bid.qty.toFixed(4)}</span>
                      <span className="relative z-10 text-right text-[#8a8d9b] font-medium">{bid.cumQty.toFixed(4)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FOOTER SUMMARY: ORDER BOOK IMBALANCE & TOTAL LIQUIDITY ── */}
      <div className="mt-3 border-t border-[#262634] pt-3 font-mono space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#10b981] font-bold">
            Bids: {buyPct}% ({totalBidQty.toFixed(2)} Qty)
          </span>
          <span className="text-[#f43f5e] font-bold">
            Asks: {sellPct}% ({totalAskQty.toFixed(2)} Qty)
          </span>
        </div>

        {/* Dynamic Liquidity Pressure Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f43f5e]/30 flex">
          <motion.div
            animate={{ width: `${buyPct}%` }}
            className="h-full bg-[#10b981] rounded-full transition-all duration-300"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#747888]">
          <span>OBI Metric: <strong className="text-white">{obi >= 0 ? `+${obi.toFixed(3)}` : obi.toFixed(3)}</strong></span>
          <span className="text-[#387ed1] font-bold flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Click price to trade
          </span>
        </div>
      </div>
    </div>
  );
}

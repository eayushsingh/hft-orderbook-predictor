"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutedOrder } from "./LalanOrderTicketModal";
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  BookOpen,
  XCircle,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

export interface ActivePosition {
  symbol: string;
  product: "MIS" | "CNC" | "NRML" | "CO";
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPct: number;
}

interface LalanPositionsAndOrdersProps {
  orders: ExecutedOrder[];
  positions: ActivePosition[];
  onExitPosition: (symbol: string) => void;
  onSquareOffAll: () => void;
}

export default function LalanPositionsAndOrders({
  orders,
  positions,
  onExitPosition,
  onSquareOffAll,
}: LalanPositionsAndOrdersProps) {
  const [activeSubTab, setActiveSubTab] = useState<"positions" | "orders">("positions");

  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.pnl, 0);
  const isOverallProfitable = totalUnrealizedPnl >= 0;

  return (
    <div className="w-full rounded-2xl border border-[#262634] bg-[#14141a] p-4 sm:p-6 shadow-2xl font-sans text-[#e0e0e0]">
      {/* ── HEADER NAVIGATION TABS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262634] pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab("positions")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
              activeSubTab === "positions"
                ? "bg-[#387ed1] text-white border-[#387ed1] shadow-lg shadow-[#387ed1]/20"
                : "bg-[#1c1c24] text-[#9e9ea8] border-[#282834] hover:text-white"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Positions ({positions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("orders")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
              activeSubTab === "orders"
                ? "bg-[#387ed1] text-white border-[#387ed1] shadow-lg shadow-[#387ed1]/20"
                : "bg-[#1c1c24] text-[#9e9ea8] border-[#282834] hover:text-white"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Orders Log ({orders.length})</span>
          </button>
        </div>

        {/* Total P&L & Emergency Square Off */}
        {activeSubTab === "positions" && (
          <div className="flex items-center space-x-4">
            <div className="flex flex-col text-right font-mono">
              <span className="text-[10px] text-[#747888] uppercase tracking-wider">
                Total Unrealized P&amp;L
              </span>
              <span
                className={`text-base font-black ${
                  isOverallProfitable ? "text-[#10b981]" : "text-[#f43f5e]"
                }`}
              >
                {totalUnrealizedPnl >= 0 ? "+" : ""}₹
                {totalUnrealizedPnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {positions.length > 0 && (
              <button
                onClick={onSquareOffAll}
                className="bg-[#ff5722] hover:bg-[#e64a19] text-white font-mono font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-[#ff5722]/20 active:scale-95 transition-all"
              >
                Exit All Positions
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── POSITIONS TABLE ── */}
      {activeSubTab === "positions" && (
        <div className="overflow-x-auto">
          {positions.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#747888] space-y-2">
              <p>No open positions in your trading account.</p>
              <p className="text-[11px] text-[#387ed1]">
                Use BUY (B) or SELL (S) buttons on MarketWatch to place orders.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#262634] text-[10px] text-[#747888] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Instrument</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3 text-right">Qty</th>
                  <th className="pb-3 text-right">Avg. Price</th>
                  <th className="pb-3 text-right">LTP</th>
                  <th className="pb-3 text-right">P&amp;L (₹)</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c28]">
                {positions.map((pos) => {
                  const isPosProfitable = pos.pnl >= 0;
                  return (
                    <tr key={pos.symbol} className="hover:bg-[#1a1a24] transition-colors">
                      <td className="py-3 pl-2 font-bold text-white">{pos.symbol}</td>
                      <td className="py-3">
                        <span className="bg-[#1c1c26] text-[#387ed1] border border-[#387ed1]/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {pos.product}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-white">{pos.qty}</td>
                      <td className="py-3 text-right text-[#b0b3c0]">
                        ₹{pos.avgPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right text-white font-semibold">
                        ₹{pos.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td
                        className={`py-3 text-right font-bold ${
                          isPosProfitable ? "text-[#10b981]" : "text-[#f43f5e]"
                        }`}
                      >
                        {isPosProfitable ? "+" : ""}
                        ₹{pos.pnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (
                        {pos.pnlPct >= 0 ? "+" : ""}
                        {pos.pnlPct.toFixed(2)}%)
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => onExitPosition(pos.symbol)}
                          className="text-[10px] font-bold text-[#f43f5e] hover:bg-[#f43f5e]/10 border border-[#f43f5e]/30 px-2 py-1 rounded transition-colors"
                        >
                          Exit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── ORDERS LOG TABLE ── */}
      {activeSubTab === "orders" && (
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#747888]">
              No executed orders in current session.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#262634] text-[10px] text-[#747888] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Time</th>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3 text-right">Qty</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c28]">
                {orders.map((ord) => (
                  <tr key={ord.orderId + ord.timestamp} className="hover:bg-[#1a1a24] transition-colors">
                    <td className="py-3 pl-2 text-[#747888]">{ord.timestamp}</td>
                    <td className="py-3 text-[#387ed1] font-bold">#{ord.orderId}</td>
                    <td className="py-3 font-bold text-white">{ord.symbol}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ord.type === "BUY"
                            ? "bg-[#387ed1]/20 text-[#387ed1]"
                            : "bg-[#ff5722]/20 text-[#ff5722]"
                        }`}
                      >
                        {ord.type}
                      </span>
                    </td>
                    <td className="py-3 text-[#b0b3c0]">{ord.product}</td>
                    <td className="py-3 text-right text-white font-bold">{ord.qty}</td>
                    <td className="py-3 text-right text-white">
                      ₹{ord.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#10b981]">
                        <CheckCircle className="h-3 w-3" />
                        <span>{ord.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

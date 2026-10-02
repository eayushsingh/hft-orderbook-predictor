"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutedOrder } from "./ZerodhaOrderTicketModal";
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
  product: "MIS" | "CNC" | "CO";
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPct: number;
}

interface ZerodhaPositionsAndOrdersProps {
  orders: ExecutedOrder[];
  positions: ActivePosition[];
  onExitPosition: (symbol: string) => void;
  onSquareOffAll: () => void;
}

export default function ZerodhaPositionsAndOrders({
  orders,
  positions,
  onExitPosition,
  onSquareOffAll,
}: ZerodhaPositionsAndOrdersProps) {
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
            <span>Order History ({orders.length})</span>
          </button>
        </div>

        {/* MTM Banner for Positions */}
        {activeSubTab === "positions" && (
          <div className="flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-mono text-[#747888] tracking-wider">
                Total Unrealized P&amp;L (MTM)
              </span>
              <span
                className={`text-base sm:text-lg font-black font-mono ${
                  isOverallProfitable ? "text-[#10b981]" : "text-[#f43f5e]"
                }`}
              >
                {isOverallProfitable ? `+₹${totalUnrealizedPnl.toFixed(2)}` : `-₹${Math.abs(totalUnrealizedPnl).toFixed(2)}`}
              </span>
            </div>

            {positions.length > 0 && (
              <button
                onClick={onSquareOffAll}
                className="bg-[#ff5722]/20 hover:bg-[#ff5722] text-[#ff5722] hover:text-white border border-[#ff5722]/40 text-xs font-bold font-mono px-3 py-1.5 rounded-xl transition-all"
              >
                Exit All
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── POSITIONS TAB ── */}
      {activeSubTab === "positions" && (
        <div className="space-y-4">
          {positions.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#282836] rounded-xl bg-[#0f0f14]">
              <Briefcase className="h-8 w-8 text-[#545766] mx-auto mb-2" />
              <p className="text-xs text-[#9e9ea8] font-mono">No active open positions</p>
              <p className="text-[11px] text-[#636674] mt-1">
                Place an order via Marketwatch or Quick Order ticket to stream live P&amp;L.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#262634] text-[#747888] text-[10px] uppercase tracking-wider bg-[#101015]">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Instrument</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Avg Price</th>
                    <th className="py-2.5 px-3 text-right">LTP</th>
                    <th className="py-2.5 px-3 text-right">P&amp;L</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e28]">
                  {positions.map((pos) => {
                    const isProfit = pos.pnl >= 0;
                    return (
                      <tr key={pos.symbol} className="hover:bg-[#181820] transition-colors">
                        <td className="py-3 px-3">
                          <span className="bg-[#242432] text-[#387ed1] border border-[#387ed1]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            {pos.product}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-white">{pos.symbol}</td>
                        <td className="py-3 px-3 text-right font-bold text-white">{pos.qty}</td>
                        <td className="py-3 px-3 text-right text-[#b0b3c0]">
                          ₹{pos.avgPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right text-white font-bold">
                          ₹{pos.ltp.toFixed(2)}
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-bold ${
                            isProfit ? "text-[#10b981]" : "text-[#f43f5e]"
                          }`}
                        >
                          {isProfit ? `+₹${pos.pnl.toFixed(2)}` : `-₹${Math.abs(pos.pnl).toFixed(2)}`}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => onExitPosition(pos.symbol)}
                            className="bg-[#ff5722]/10 hover:bg-[#ff5722] text-[#ff5722] hover:text-white border border-[#ff5722]/30 px-2.5 py-1 rounded text-[11px] font-bold transition-all"
                          >
                            Exit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeSubTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#282836] rounded-xl bg-[#0f0f14]">
              <BookOpen className="h-8 w-8 text-[#545766] mx-auto mb-2" />
              <p className="text-xs text-[#9e9ea8] font-mono">No order history available</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#262634] text-[#747888] text-[10px] uppercase tracking-wider bg-[#101015]">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Instrument</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e28]">
                  {orders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-[#181820] transition-colors">
                      <td className="py-3 px-3 text-[#747888]">{ord.timestamp}</td>
                      <td className="py-3 px-3 text-[#b0b3c0]">#{ord.orderId}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.type === "BUY"
                              ? "bg-[#387ed1]/20 text-[#387ed1]"
                              : "bg-[#ff5722]/20 text-[#ff5722]"
                          }`}
                        >
                          {ord.type} ({ord.product})
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">{ord.symbol}</td>
                      <td className="py-3 px-3 text-right text-white font-bold">{ord.qty}</td>
                      <td className="py-3 px-3 text-right text-white font-bold">
                        ₹{ord.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center space-x-1 bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          <CheckCircle className="h-3 w-3" />
                          <span>{ord.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

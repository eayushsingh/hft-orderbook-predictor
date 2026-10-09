"use client";

import React from "react";
import { BookOpen, CheckCircle, XCircle, Clock, Check, X } from "lucide-react";
import { AutopilotOrder, OrderStatus } from "@/lib/autopilot/types";

interface AutopilotOrdersTableProps {
  orders: AutopilotOrder[];
  onApproveOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export default function AutopilotOrdersTable({
  orders,
  onApproveOrder,
  onCancelOrder,
}: AutopilotOrdersTableProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "FILLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
            <CheckCircle className="w-3 h-3" />
            FILLED
          </span>
        );
      case "PENDING_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold animate-pulse">
            <Clock className="w-3 h-3" />
            APPROVAL REQUIRED
          </span>
        );
      case "PENDING_SUBMISSION":
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono font-bold">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case "REJECTED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold">
            <XCircle className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-mono font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#121218] border border-[#222230] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black font-mono text-white flex items-center gap-2">
            PERSISTENT ORDER BOOK & LIFECYCLE
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#181824] text-zinc-300 border border-[#262638]">
              {orders.length} Logged
            </span>
          </h2>
          <p className="text-xs text-zinc-400">
            Audit-tracked state transitions: Pending Approval → Submission → Broker OMS → Fill.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar rounded-xl border border-[#20202e]">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#0e0e14] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-[#20202e]">
            <tr>
              <th className="py-3 px-3">Time & Ref</th>
              <th className="py-3 px-3">Symbol</th>
              <th className="py-3 px-3 text-center">Side</th>
              <th className="py-3 px-3 text-right">Qty</th>
              <th className="py-3 px-3 text-right">Fill / Limit (₹)</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Broker & Idempotency Key</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c28] bg-[#121218]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500 font-mono">
                  No orders recorded in the current session.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#161622] transition-colors">
                  <td className="py-3 px-3">
                    <div className="text-zinc-300 font-bold">
                      {new Date(o.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-[10px] text-zinc-500">{o.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-black text-white">{o.symbol}</div>
                    <div className="text-[10px] text-zinc-400">{o.strategy}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.side === "BUY"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {o.side}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    {o.filledQuantity > 0 ? `${o.filledQuantity}/${o.quantity}` : o.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    ₹
                    {(o.averageFillPrice || o.limitPrice || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(o.status)}
                    {o.rejectReason && (
                      <div className="text-[9px] text-rose-400 font-sans truncate max-w-xs mt-0.5">
                        {o.rejectReason}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-zinc-300 text-[11px]">{o.brokerName}</div>
                    <div className="text-[9px] text-zinc-500 truncate max-w-[160px]">
                      {o.idempotencyKey}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {o.status === "PENDING_APPROVAL" ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onApproveOrder(o.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-all active:scale-95 cursor-pointer"
                          title="Approve and execute order"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onCancelOrder(o.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 transition-all active:scale-95 cursor-pointer"
                          title="Reject / cancel order"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-500">—</span>
                    )}
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

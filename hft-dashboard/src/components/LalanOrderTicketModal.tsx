"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, ArrowDownRight, ShieldCheck, Zap, Info } from "lucide-react";

export interface ExecutedOrder {
  orderId: string;
  timestamp: string;
  symbol: string;
  type: "BUY" | "SELL";
  product: "MIS" | "CNC" | "NRML" | "CO";
  orderType: "MARKET" | "LIMIT" | "SL" | "SL-M";
  qty: number;
  price: number;
  status: "COMPLETE" | "REJECTED" | "OPEN";
}

interface LalanOrderTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  initialPrice: number;
  initialType?: "BUY" | "SELL";
  availableFunds: number;
  onExecuteOrder: (order: ExecutedOrder) => void;
}

export default function LalanOrderTicketModal({
  isOpen,
  onClose,
  symbol,
  initialPrice,
  initialType = "BUY",
  availableFunds,
  onExecuteOrder,
}: LalanOrderTicketModalProps) {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">(initialType);
  const [product, setProduct] = useState<"MIS" | "CNC" | "NRML">("MIS");
  const [validity, setValidity] = useState<"MARKET" | "LIMIT" | "SL">("MARKET");
  const [qty, setQty] = useState<number>(25);
  const [limitPrice, setLimitPrice] = useState<number>(initialPrice);
  const [triggerPrice, setTriggerPrice] = useState<number>(initialPrice * 0.98);

  const isBuy = orderType === "BUY";
  const effectivePrice = validity === "MARKET" ? initialPrice : limitPrice;
  const totalValue = qty * effectivePrice;
  const marginRequired = product === "MIS" ? totalValue * 0.2 : totalValue; // 5x leverage on Intraday MIS

  const handleExecute = () => {
    const newOrder: ExecutedOrder = {
      orderId: Math.floor(10000000 + Math.random() * 90000000).toString(),
      timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
      symbol,
      type: orderType,
      product,
      orderType: validity,
      qty,
      price: effectivePrice,
      status: "COMPLETE",
    };

    onExecuteOrder(newOrder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl font-sans ${
            isBuy
              ? "border-[#387ed1]/40 bg-[#0f141d]"
              : "border-[#ff5722]/40 bg-[#1a1111]"
          }`}
        >
          {/* ── MODAL HEADER ── */}
          <div
            className={`flex items-center justify-between px-5 py-3.5 border-b text-white ${
              isBuy ? "bg-[#387ed1] border-[#306ec0]" : "bg-[#ff5722] border-[#e64a19]"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-black uppercase tracking-wider">
                {orderType} {symbol}
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded uppercase">
                NSE x1
              </span>
            </div>

            {/* Toggle Buy / Sell switch */}
            <div className="flex items-center space-x-2">
              <div className="flex rounded bg-black/20 p-0.5 text-[10px] font-mono font-bold">
                <button
                  onClick={() => setOrderType("BUY")}
                  className={`px-2 py-0.5 rounded ${isBuy ? "bg-white text-[#387ed1]" : "text-white"}`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setOrderType("SELL")}
                  className={`px-2 py-0.5 rounded ${!isBuy ? "bg-white text-[#ff5722]" : "text-white"}`}
                >
                  SELL
                </button>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-black/20 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── BODY FORM ── */}
          <div className="p-5 space-y-4 text-xs font-mono text-[#e0e0e0]">
            {/* Product Type (Intraday MIS vs Delivery CNC) */}
            <div>
              <label className="text-[10px] text-[#747888] uppercase tracking-wider block mb-1.5">
                Product Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "MIS", label: "Intraday MIS (5x)" },
                  { id: "CNC", label: "Longterm CNC" },
                  { id: "NRML", label: "Overnight F&O" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProduct(item.id as "MIS" | "CNC" | "NRML")}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      product === item.id
                        ? isBuy
                          ? "border-[#387ed1] bg-[#387ed1]/20 text-white font-bold"
                          : "border-[#ff5722] bg-[#ff5722]/20 text-white font-bold"
                        : "border-[#262634] bg-[#14141a] text-[#747888] hover:text-white"
                    }`}
                  >
                    <span className="block font-bold">{item.id}</span>
                    <span className="text-[9px] text-[#747888]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Variety (Market vs Limit) */}
            <div>
              <label className="text-[10px] text-[#747888] uppercase tracking-wider block mb-1.5">
                Order Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["MARKET", "LIMIT", "SL"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setValidity(v as "MARKET" | "LIMIT" | "SL")}
                    className={`py-1.5 rounded-lg border text-center font-bold transition-all ${
                      validity === v
                        ? "border-white bg-white/10 text-white"
                        : "border-[#262634] bg-[#14141a] text-[#747888] hover:text-white"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Quantity & Limit Price */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] text-[#747888] uppercase tracking-wider block mb-1">
                  Quantity (Lots/Qty)
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-lg border border-[#262634] bg-[#14141a] px-3 py-2 text-sm font-bold text-white focus:border-[#387ed1] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#747888] uppercase tracking-wider block mb-1">
                  Price {validity === "MARKET" && "(At Market)"}
                </label>
                <input
                  type="number"
                  disabled={validity === "MARKET"}
                  value={validity === "MARKET" ? initialPrice : limitPrice}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-[#262634] bg-[#14141a] px-3 py-2 text-sm font-bold text-white disabled:opacity-50 focus:border-[#387ed1] focus:outline-none"
                />
              </div>
            </div>

            {/* Margin Calculation Summary */}
            <div className="rounded-xl bg-[#14141a] border border-[#262634] p-3 space-y-1.5">
              <div className="flex justify-between text-[#747888]">
                <span>Margin Required:</span>
                <span className="font-bold text-white">
                  ₹{marginRequired.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-[#747888]">
                <span>Available Margin:</span>
                <span className="font-bold text-[#10b981]">
                  ₹{availableFunds.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="flex items-center justify-between p-4 bg-[#0a0a0f] border-t border-[#1f1f26]">
            <div className="flex items-center space-x-1 text-[10px] text-[#747888] font-mono">
              <Zap className="h-3 w-3 text-[#10b981]" />
              <span>O(1) Direct LALAN Gateway</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#747888] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecute}
                className={`px-6 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${
                  isBuy
                    ? "bg-[#387ed1] hover:bg-[#306ec0] shadow-[#387ed1]/30"
                    : "bg-[#ff5722] hover:bg-[#e64a19] shadow-[#ff5722]/30"
                }`}
              >
                EXECUTE {orderType}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

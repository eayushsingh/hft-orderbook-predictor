"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRightLeft, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export interface ExecutedOrder {
  orderId: string;
  timestamp: string;
  symbol: string;
  type: "BUY" | "SELL";
  product: "MIS" | "CNC" | "CO";
  orderType: "MARKET" | "LIMIT" | "SL" | "SL-M";
  qty: number;
  price: number;
  status: "COMPLETE" | "REJECTED" | "OPEN";
}

interface ZerodhaOrderTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymbol?: string;
  initialPrice?: number;
  initialType?: "BUY" | "SELL";
  availableFunds: number;
  onExecuteOrder: (order: ExecutedOrder) => void;
}

export default function ZerodhaOrderTicketModal({
  isOpen,
  onClose,
  initialSymbol = "RELIANCE",
  initialPrice = 2984.50,
  initialType = "BUY",
  availableFunds,
  onExecuteOrder,
}: ZerodhaOrderTicketModalProps) {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">(initialType);
  const [exchange, setExchange] = useState<"NSE" | "BSE">("NSE");
  const [product, setProduct] = useState<"MIS" | "CNC" | "CO">("MIS");
  const [executionType, setExecutionType] = useState<"MARKET" | "LIMIT" | "SL" | "SL-M">("MARKET");
  
  const [qty, setQty] = useState<number>(10);
  const [price, setPrice] = useState<number>(initialPrice);
  const [triggerPrice, setTriggerPrice] = useState<number>(Math.round(initialPrice * 0.98 * 100) / 100);
  const [stopLoss, setStopLoss] = useState<number>(Math.round(initialPrice * 0.99 * 100) / 100);
  const [target, setTarget] = useState<number>(Math.round(initialPrice * 1.02 * 100) / 100);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    setOrderType(initialType);
    setPrice(initialPrice);
    setTriggerPrice(Math.round(initialPrice * 0.98 * 100) / 100);
    setStopLoss(Math.round(initialPrice * 0.99 * 100) / 100);
    setTarget(Math.round(initialPrice * 1.02 * 100) / 100);
  }, [initialSymbol, initialPrice, initialType, isOpen]);

  if (!isOpen) return null;

  // Margin calculation formula (MIS gives 5x leverage)
  const leverageMultiplier = product === "MIS" ? 0.2 : 1.0;
  const effectivePrice = executionType === "MARKET" ? initialPrice : price;
  const requiredMargin = Math.round(qty * effectivePrice * leverageMultiplier * 100) / 100;
  const isSufficientFunds = availableFunds >= requiredMargin;

  const handlePlaceOrder = () => {
    if (!isSufficientFunds) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: ExecutedOrder = {
        orderId: Math.floor(10000000 + Math.random() * 90000000).toString(),
        timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
        symbol: initialSymbol,
        type: orderType,
        product,
        orderType: executionType,
        qty,
        price: effectivePrice,
        status: "COMPLETE",
      };

      onExecuteOrder(newOrder);
      setIsSubmitting(false);
      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 700);
    }, 350);
  };

  const isBuy = orderType === "BUY";
  const themeColor = isBuy ? "bg-[#387ed1]" : "bg-[#ff5722]";
  const themeTextColor = isBuy ? "text-[#387ed1]" : "text-[#ff5722]";
  const themeBorderColor = isBuy ? "border-[#387ed1]" : "border-[#ff5722]";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg rounded-xl bg-[#16161c] border border-[#282836] shadow-2xl overflow-hidden"
        >
          {/* ── HEADER TICKET ── */}
          <div className={`${themeColor} p-4 text-white flex items-center justify-between transition-colors`}>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold uppercase tracking-wider font-mono">
                  {orderType} {initialSymbol}
                </span>
                <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-mono">
                  x {qty} Qty
                </span>
              </div>
              <p className="text-xs text-white/80 font-mono mt-0.5">
                LTP: ₹{initialPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Buy / Sell Toggle inside modal */}
              <button
                onClick={() => setOrderType(isBuy ? "SELL" : "BUY")}
                className="flex items-center space-x-1 bg-black/20 hover:bg-black/30 text-white text-[11px] px-2.5 py-1 rounded font-mono transition-all border border-white/20"
              >
                <ArrowRightLeft className="h-3 w-3" />
                <span>Switch to {isBuy ? "SELL" : "BUY"}</span>
              </button>

              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-black/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── BODY FORM ── */}
          <div className="p-5 space-y-4 text-xs text-[#e0e0e0]">
            
            {/* Exchange & Product Selector */}
            <div className="flex justify-between items-center pb-3 border-b border-[#262630]">
              {/* Exchange Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-[#747888] font-mono">Exchange:</span>
                {(["NSE", "BSE"] as const).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setExchange(ex)}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold border ${
                      exchange === ex
                        ? "bg-[#242432] text-white border-[#387ed1]"
                        : "bg-[#101014] text-[#747888] border-[#22222c]"
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Product Tabs (MIS / CNC / CO) */}
              <div className="flex items-center space-x-1 bg-[#101014] p-1 rounded border border-[#22222c]">
                {[
                  { id: "MIS", label: "Intraday (MIS)" },
                  { id: "CNC", label: "Longterm (CNC)" },
                  { id: "CO", label: "Cover Order" },
                ].map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => setProduct(prod.id as "MIS" | "CNC" | "CO")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all ${
                      product === prod.id
                        ? `${themeColor} text-white`
                        : "text-[#747888] hover:text-white"
                    }`}
                  >
                    {prod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Type Tabs (Market / Limit / SL / SL-M) */}
            <div>
              <span className="text-[10px] text-[#747888] uppercase tracking-wider font-mono block mb-1.5">
                Order Type
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(["MARKET", "LIMIT", "SL", "SL-M"] as const).map((ot) => (
                  <button
                    key={ot}
                    onClick={() => setExecutionType(ot)}
                    className={`py-1.5 rounded font-mono text-center font-bold text-xs border transition-all ${
                      executionType === ot
                        ? `bg-[#22222e] text-white ${themeBorderColor}`
                        : "bg-[#111116] text-[#747888] border-[#22222c] hover:bg-[#1a1a22]"
                    }`}
                  >
                    {ot}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid: Qty, Price, Trigger Price */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Quantity */}
              <div>
                <label className="text-[10px] text-[#747888] font-mono block mb-1">Quantity</label>
                <div className="flex items-center bg-[#101015] border border-[#262634] rounded overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-2 text-[#747888] hover:text-white bg-[#1a1a22] font-mono text-xs font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-transparent text-center text-xs font-mono font-bold text-white focus:outline-none"
                  />
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-2.5 py-2 text-[#747888] hover:text-white bg-[#1a1a22] font-mono text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-[10px] text-[#747888] font-mono block mb-1">
                  Price {executionType === "MARKET" ? "(Market)" : "₹"}
                </label>
                <input
                  type="number"
                  disabled={executionType === "MARKET" || executionType === "SL-M"}
                  value={executionType === "MARKET" ? initialPrice : price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#101015] border border-[#262634] disabled:opacity-40 text-xs font-mono font-bold text-white px-3 py-2 rounded focus:outline-none focus:border-[#387ed1]"
                />
              </div>

              {/* Trigger Price */}
              <div>
                <label className="text-[10px] text-[#747888] font-mono block mb-1">
                  Trigger Price ₹
                </label>
                <input
                  type="number"
                  disabled={executionType !== "SL" && executionType !== "SL-M"}
                  value={triggerPrice}
                  onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#101015] border border-[#262634] disabled:opacity-30 text-xs font-mono font-bold text-white px-3 py-2 rounded focus:outline-none focus:border-[#387ed1]"
                />
              </div>
            </div>

            {/* Target & Stop Loss Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] text-[#10b981] font-mono block mb-1">
                  Target Price (Optional)
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#101015] border border-[#10b981]/30 text-xs font-mono text-white px-3 py-1.5 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#f43f5e] font-mono block mb-1">
                  Stop-Loss Price (Optional)
                </label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#101015] border border-[#f43f5e]/30 text-xs font-mono text-white px-3 py-1.5 rounded focus:outline-none"
                />
              </div>
            </div>

            {/* ── MARGIN COMPUTATION SUMMARY ── */}
            <div className="p-3 rounded-lg bg-[#0e0e14] border border-[#242432] space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#747888]">Margin Required:</span>
                <span className={`font-bold ${isSufficientFunds ? "text-white" : "text-[#f43f5e]"}`}>
                  ₹{requiredMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  {product === "MIS" && <span className="text-[10px] text-[#10b981] ml-1">(5x MIS)</span>}
                </span>
              </div>

              <div className="flex justify-between items-center font-mono text-xs border-t border-[#1f1f2a] pt-1.5">
                <span className="text-[#747888]">Available Cash:</span>
                <span className="font-bold text-[#10b981]">
                  ₹{availableFunds.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {!isSufficientFunds && (
                <div className="flex items-center space-x-1.5 text-[11px] text-[#f43f5e] pt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Insufficient funds available for this order.</span>
                </div>
              )}
            </div>

          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="p-4 bg-[#111117] border-t border-[#262630] flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[11px] text-[#747888] font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
              <span>O(1) Direct Kite Gateway</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-[#1c1c24] hover:bg-[#282834] text-xs font-bold text-[#9e9ea8] transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={!isSufficientFunds || isSubmitting}
                onClick={handlePlaceOrder}
                className={`${themeColor} hover:opacity-90 disabled:opacity-40 text-white px-6 py-2 rounded text-xs font-extrabold uppercase font-mono tracking-wider transition-all shadow-lg active:scale-95 flex items-center space-x-1.5`}
              >
                {isSubmitting ? (
                  <span>Executing...</span>
                ) : showSuccessToast ? (
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Placed!</span>
                  </span>
                ) : (
                  <span>{orderType}</span>
                )}
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

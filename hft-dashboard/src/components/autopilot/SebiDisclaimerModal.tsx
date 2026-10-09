"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { SEBI_ALGO_DISCLOSURES } from "@/lib/autopilot/compliance/sebiCompliance";

interface SebiDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SebiDisclaimerModal({ isOpen, onClose }: SebiDisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#111116] border border-[#242434] rounded-2xl shadow-2xl overflow-hidden text-zinc-200 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#20202e] bg-[#0c0c10]">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black font-mono text-white">
                  SEBI ALGORITHMIC TRADING NOTICE
                </h2>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Regulatory disclosures & statutory safeguards
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#181822] text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar text-xs leading-relaxed font-sans">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Non-Registered System Notice:</strong> Nifty 50 Autopilot is self-directed quantitative tooling. It is NOT SEBI-approved or registered as a PMS, RIA, or RA.
              </div>
            </div>

            <div className="space-y-2 text-zinc-300">
              <h3 className="font-bold text-white font-mono text-xs uppercase tracking-wider">
                1. Cash Equities Scope & Prohibition of Derivatives
              </h3>
              <p>
                The system operates exclusively on verified National Stock Exchange (NSE) Nifty 50 constituent cash equities. Bank Nifty, index options, stock futures, penny stocks, and cryptocurrency are strictly disallowed.
              </p>
            </div>

            <div className="space-y-2 text-zinc-300">
              <h3 className="font-bold text-white font-mono text-xs uppercase tracking-wider">
                2. No Return Guarantees or Predictions
              </h3>
              <p>
                Trading in cash equities involves significant risk of capital loss. Historical backtest returns and quantitative factor scores do not guarantee future profitability.
              </p>
            </div>

            <div className="space-y-2 text-zinc-300">
              <h3 className="font-bold text-white font-mono text-xs uppercase tracking-wider">
                3. Stop-Loss Fill Reality & Circuit Halts
              </h3>
              <p>
                Automated stop loss orders are executed on the exchange as market/limit triggers. During market gaps or upper/lower circuit freezes, fills may experience slippage.
              </p>
            </div>

            <div className="space-y-2 text-zinc-300">
              <h3 className="font-bold text-white font-mono text-xs uppercase tracking-wider">
                4. Broker API Whitelisting & Static IP Compliance
              </h3>
              <p>
                Users connecting Angel One SmartAPI or Zerodha Kite Connect must adhere to SEBI algo circulars and ensure static IP whitelisting as mandated by their respective brokers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161622] border border-[#222234] space-y-2">
              <div className="font-mono text-[11px] font-bold text-cyan-300 uppercase">
                Mandatory Operator Checklist
              </div>
              <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                {SEBI_ALGO_DISCLOSURES.mandatoryChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-5 py-3.5 border-t border-[#20202e] bg-[#0c0c10]">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#387ed1] hover:bg-[#2f6cb5] text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              I Acknowledge & Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

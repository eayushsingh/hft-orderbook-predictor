"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Shield, AlertTriangle, Save } from "lucide-react";
import { AutopilotConfig, StrategyType, TradingMode } from "@/lib/autopilot/types";

interface AutopilotConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: AutopilotConfig | null;
  onSaveConfig: (updated: Partial<AutopilotConfig>) => Promise<boolean>;
}

export default function AutopilotConfigModal({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
}: AutopilotConfigModalProps) {
  const [strategy, setStrategy] = useState<StrategyType>(currentConfig?.strategy || "SWING");
  const [mode, setMode] = useState<TradingMode>(currentConfig?.mode || "PAPER");
  const [broker, setBroker] = useState<"ANGEL_ONE" | "ZERODHA" | "PAPER" | "DEMO">(
    currentConfig?.broker || "PAPER"
  );
  const [capital, setCapital] = useState<number>(currentConfig?.capital || 500000);
  const [riskPerTradePct, setRiskPerTradePct] = useState<number>(currentConfig?.riskPerTradePct || 1.0);
  const [maxDailyLossPct, setMaxDailyLossPct] = useState<number>(currentConfig?.maxDailyLossPct || 3.0);
  const [maxDrawdownPct, setMaxDrawdownPct] = useState<number>(currentConfig?.maxDrawdownPct || 10.0);
  const [maxPositions, setMaxPositions] = useState<number>(currentConfig?.maxPositions || 5);
  const [maxPositionCapPct, setMaxPositionCapPct] = useState<number>(currentConfig?.maxPositionCapPct || 20.0);
  const [maxSectorCapPct, setMaxSectorCapPct] = useState<number>(currentConfig?.maxSectorCapPct || 35.0);
  const [maxSlippageBps, setMaxSlippageBps] = useState<number>(currentConfig?.maxSlippageBps || 15);
  const [maxOrderValue, setMaxOrderValue] = useState<number>(currentConfig?.maxOrderValue || 100000);
  const [requireApproval, setRequireApproval] = useState<boolean>(currentConfig?.requireApproval ?? true);
  const [trailingStopEnabled, setTrailingStopEnabled] = useState<boolean>(currentConfig?.trailingStopEnabled ?? true);
  const [trailingAtrMultiplier, setTrailingAtrMultiplier] = useState<number>(currentConfig?.trailingAtrMultiplier || 2.0);
  const [rebalanceBandPct, setRebalanceBandPct] = useState<number>(currentConfig?.rebalanceBandPct || 3.0);
  const [sebiDisclaimerAccepted, setSebiDisclaimerAccepted] = useState<boolean>(
    currentConfig?.sebiDisclaimerAccepted ?? false
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setError(null);
    if (mode === "LIVE" && !sebiDisclaimerAccepted) {
      setError("You must acknowledge the SEBI Algo Trading Risk Disclosure to enable Live trading.");
      return;
    }

    setSaving(true);
    const success = await onSaveConfig({
      strategy,
      mode,
      broker,
      capital,
      riskPerTradePct,
      maxDailyLossPct,
      maxDrawdownPct,
      maxPositions,
      maxPositionCapPct,
      maxSectorCapPct,
      maxSlippageBps,
      maxOrderValue,
      requireApproval,
      trailingStopEnabled,
      trailingAtrMultiplier,
      rebalanceBandPct,
      sebiDisclaimerAccepted,
    });
    setSaving(false);

    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-[#242434] rounded-2xl shadow-2xl overflow-hidden my-6 text-slate-800 dark:text-zinc-200 font-sans transition-colors"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#20202e] bg-slate-50 dark:bg-[#0c0c10]">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-[#387ed1]/15 text-[#387ed1]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                  AUTOPILOT CONFIGURATION
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  Config Version {currentConfig?.version || 1} • Last Updated:{" "}
                  {currentConfig?.updatedAt ? new Date(currentConfig.updatedAt).toLocaleTimeString() : "N/A"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#181822] dark:hover:bg-[#20202e] text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar font-mono text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-700 dark:text-red-400 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-xs">{error}</span>
              </div>
            )}

            {/* Strategy & Mode Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  STRATEGY ENGINE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStrategy("SWING")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      strategy === "SWING"
                        ? "bg-[#387ed1]/15 border-[#387ed1] text-[#1d4ed8] dark:text-cyan-300 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161620] border-slate-200 dark:border-[#222230] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1c1c28]"
                    }`}
                  >
                    SWING (ATR Momentum)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrategy("LONG_TERM")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      strategy === "LONG_TERM"
                        ? "bg-[#387ed1]/15 border-[#387ed1] text-[#1d4ed8] dark:text-cyan-300 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161620] border-slate-200 dark:border-[#222230] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1c1c28]"
                    }`}
                  >
                    LONG-TERM (Factor Rebalance)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  EXECUTION MODE
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMode("DEMO")}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      mode === "DEMO"
                        ? "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161620] border-slate-200 dark:border-[#222230] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1c1c28]"
                    }`}
                  >
                    DEMO
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("PAPER")}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      mode === "PAPER"
                        ? "bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161620] border-slate-200 dark:border-[#222230] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1c1c28]"
                    }`}
                  >
                    PAPER
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("LIVE")}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      mode === "LIVE"
                        ? "bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161620] border-slate-200 dark:border-[#222230] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1c1c28]"
                    }`}
                  >
                    LIVE
                  </button>
                </div>
              </div>
            </div>

            {/* Broker Adapter */}
            <div className="space-y-1.5">
              <label className="text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                BROKER GATEWAY
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "PAPER" as const, label: "Paper Simulator" },
                  { id: "DEMO" as const, label: "Demo Sandbox" },
                  { id: "ANGEL_ONE" as const, label: "Angel One SmartAPI" },
                  { id: "ZERODHA" as const, label: "Zerodha Kite" },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBroker(b.id)}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      broker === b.id
                        ? "bg-[#387ed1]/15 border-[#387ed1] text-[#1d4ed8] dark:text-cyan-300 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161620] border-slate-200 dark:border-[#222230] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#1c1c28]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Capital & Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">ALLOCATED CAPITAL (₹)</label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">RISK PER TRADE (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPerTradePct}
                  onChange={(e) => setRiskPerTradePct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">MAX DAILY LOSS (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={maxDailyLossPct}
                  onChange={(e) => setMaxDailyLossPct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Drawdown & Position Constraints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">MAX PORTFOLIO DRAWDOWN (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={maxDrawdownPct}
                  onChange={(e) => setMaxDrawdownPct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">MAX CONCURRENT POSITIONS</label>
                <input
                  type="number"
                  value={maxPositions}
                  onChange={(e) => setMaxPositions(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">MAX SINGLE ORDER VALUE (₹)</label>
                <input
                  type="number"
                  value={maxOrderValue}
                  onChange={(e) => setMaxOrderValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Position Cap, Sector Cap & Slippage */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">POSITION CAP (%)</label>
                <input
                  type="number"
                  value={maxPositionCapPct}
                  onChange={(e) => setMaxPositionCapPct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">SECTOR CAP (%)</label>
                <input
                  type="number"
                  value={maxSectorCapPct}
                  onChange={(e) => setMaxSectorCapPct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">SLIPPAGE (BPS)</label>
                <input
                  type="number"
                  value={maxSlippageBps}
                  onChange={(e) => setMaxSlippageBps(parseInt(e.target.value, 10) || 10)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-zinc-400 text-[11px]">DRIFT BAND (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={rebalanceBandPct}
                  onChange={(e) => setRebalanceBandPct(parseFloat(e.target.value) || 3.0)}
                  className="w-full bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-[#387ed1] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#1e1e2c]">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#387ed1] focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-700 dark:text-zinc-300 font-medium">
                  Require Operator Approval Before Placing Orders (Semi-Automated Mode)
                </span>
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trailingStopEnabled}
                    onChange={(e) => setTrailingStopEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#387ed1] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-zinc-300 font-medium">
                    Enable ATR Trailing Stops for Swing Positions
                  </span>
                </label>

                {trailingStopEnabled && (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 dark:text-zinc-400 text-[11px]">Multiplier:</span>
                    <input
                      type="number"
                      step="0.5"
                      min="1.0"
                      max="5.0"
                      value={trailingAtrMultiplier}
                      onChange={(e) => setTrailingAtrMultiplier(parseFloat(e.target.value) || 2.0)}
                      className="w-16 bg-slate-50 dark:bg-[#161620] border border-slate-300 dark:border-[#2a2a3c] rounded-lg px-2 py-1 text-slate-900 dark:text-white font-mono text-center outline-none focus:border-[#387ed1] transition-colors"
                    />
                    <span className="text-slate-400 dark:text-zinc-500 text-[11px]">x ATR</span>
                  </div>
                )}
              </div>
            </div>

            {/* SEBI Compliance Checkbox */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#14141e] border border-slate-200 dark:border-[#262638] space-y-2">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold">
                <Shield className="w-4 h-4" />
                <span>SEBI Algorithmic Trading Regulatory Acknowledgment</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                Nifty 50 Autopilot is a self-directed algorithmic execution system. Cash equities only. No profit guarantees. Stop loss fills are subject to exchange liquidity and circuit limits.
              </p>
              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={sebiDisclaimerAccepted}
                  onChange={(e) => setSebiDisclaimerAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] text-slate-800 dark:text-zinc-300 font-bold">
                  I understand and accept the SEBI Algorithmic Risk Disclosure.
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-[#20202e] bg-slate-50 dark:bg-[#0c0c10]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#181822] dark:hover:bg-[#20202e] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-mono text-xs font-bold transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[#387ed1] hover:bg-[#2f6cb5] text-white font-mono text-xs font-black transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Config..." : "Save Configuration"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

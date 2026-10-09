"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, Power } from "lucide-react";
import { EngineState } from "@/lib/autopilot/types";

interface AutopilotKillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: EngineState;
  onTriggerKillSwitch: (action: "ENGAGE" | "RESET", reason: string) => Promise<boolean>;
}

export default function AutopilotKillSwitchModal({
  isOpen,
  onClose,
  currentState,
  onTriggerKillSwitch,
}: AutopilotKillSwitchModalProps) {
  const [reason, setReason] = useState<string>("Manual operator emergency risk action");
  const [confirmText, setConfirmText] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const isEngaged = currentState === "KILL_SWITCH_ENGAGED";
  const isEngageAction = !isEngaged;

  const handleAction = async () => {
    if (isEngageAction && confirmText.trim().toUpperCase() !== "STOP") {
      return;
    }

    setProcessing(true);
    const action = isEngageAction ? "ENGAGE" : "RESET";
    const success = await onTriggerKillSwitch(action, reason);
    setProcessing(false);

    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#121218] border border-red-500/50 rounded-2xl shadow-2xl overflow-hidden text-zinc-200 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-red-500/30 bg-red-950/40">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black font-mono text-white">
                  {isEngageAction ? "EMERGENCY KILL SWITCH" : "RESET KILL SWITCH"}
                </h2>
                <p className="text-[11px] text-red-300 font-mono">
                  {isEngageAction ? "Immediate trade halting protocol" : "Safety recovery procedure"}
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

          {/* Content */}
          <div className="p-5 space-y-4 font-mono text-xs">
            {isEngageAction ? (
              <>
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 leading-relaxed font-sans">
                  <strong>WARNING:</strong> Engaging the kill switch will immediately block all new entry orders across Nifty 50 cash equities. Active positions will NOT be automatically squared off unless explicitly requested.
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">TRIGGER REASON / NOTE</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-[#161622] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">
                    TYPE <span className="text-red-400 font-black">&quot;STOP&quot;</span> TO CONFIRM
                  </label>
                  <input
                    type="text"
                    placeholder="STOP"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full bg-[#161622] border border-[#2a2a3c] rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-red-500 text-center font-black tracking-widest uppercase"
                  />
                </div>
              </>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 leading-relaxed font-sans">
                <strong>SAFETY PROTOCOL:</strong> Resetting the kill switch will move the engine to <strong>PAUSED</strong> state. It will NOT automatically resume live trading. You must review risk limits and manually resume when ready.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#20202e] bg-[#0c0c10]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#181822] text-zinc-400 hover:text-white font-mono text-xs font-bold"
            >
              Cancel
            </button>

            <button
              onClick={handleAction}
              disabled={
                processing ||
                (isEngageAction && confirmText.trim().toUpperCase() !== "STOP")
              }
              className={`flex items-center space-x-1.5 px-5 py-2 rounded-xl font-mono text-xs font-black transition-all shadow-lg active:scale-95 disabled:opacity-40 cursor-pointer ${
                isEngageAction
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-black"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {processing
                  ? "Processing..."
                  : isEngageAction
                  ? "ENGAGE KILL SWITCH"
                  : "RESET TO PAUSED"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

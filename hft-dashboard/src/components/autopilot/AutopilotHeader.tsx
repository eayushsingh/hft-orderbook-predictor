"use client";

import React from "react";
import {
  ShieldAlert,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react";
import { AutopilotConfig, EngineState, TradingMode } from "@/lib/autopilot/types";

interface AutopilotHeaderProps {
  config: AutopilotConfig | null;
  isRunningCycle: boolean;
  marketOpen: boolean;
  marketIstTime: string;
  onRunCycle: () => void;
  onOpenConfig: () => void;
  onTogglePause: () => void;
  onOpenKillSwitchModal: () => void;
  onOpenDisclaimerModal: () => void;
}

export default function AutopilotHeader({
  config,
  isRunningCycle,
  marketOpen,
  marketIstTime,
  onRunCycle,
  onOpenConfig,
  onTogglePause,
  onOpenKillSwitchModal,
  onOpenDisclaimerModal,
}: AutopilotHeaderProps) {
  if (!config) return null;

  const getModeBadge = (mode: TradingMode) => {
    switch (mode) {
      case "LIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-mono font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            LIVE (LOCKED)
          </span>
        );
      case "PAPER":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[11px] font-mono font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            PAPER TRADING (SIMULATED)
          </span>
        );
      case "DEMO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-mono font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            DEMO MODE (MOCK)
          </span>
        );
    }
  };

  const getStateBadge = (state: EngineState) => {
    switch (state) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            ENGINE ACTIVE
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold">
            <Pause className="w-3 h-3 text-amber-400" />
            ENGINE PAUSED
          </span>
        );
      case "KILL_SWITCH_ENGAGED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/25 text-red-400 border border-red-500 text-[11px] font-mono font-extrabold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            KILL SWITCH ENGAGED
          </span>
        );
    }
  };

  return (
    <div className="bg-[#121218] border border-[#222230] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Top row: Title + Status + Disclosures */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#387ed1]/20 border border-[#387ed1]/40 text-[#387ed1]">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight flex items-center gap-2">
              NIFTY 50 AUTOPILOT
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              v{config.version} • {config.strategy}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans">
            Autonomous quantitative execution strictly on verified NSE Nifty 50 constituent cash equities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {getModeBadge(config.mode)}
          {getStateBadge(config.state)}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181824] border border-[#262638] text-[11px] font-mono text-zinc-300">
            <span className={`w-2 h-2 rounded-full ${marketOpen ? "bg-emerald-500" : "bg-zinc-500"}`} />
            NSE {marketOpen ? "OPEN" : "CLOSED"} ({marketIstTime})
          </span>
        </div>
      </div>

      {/* Control Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1e1e2c]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRunCycle}
            disabled={isRunningCycle || config.state === "KILL_SWITCH_ENGAGED"}
            className="flex items-center space-x-1.5 bg-[#387ed1] hover:bg-[#2f6cb5] disabled:opacity-50 text-white font-mono text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningCycle ? "animate-spin" : ""}`} />
            <span>{isRunningCycle ? "Analyzing Universe..." : "Run Analysis Cycle"}</span>
          </button>

          <button
            onClick={onTogglePause}
            disabled={config.state === "KILL_SWITCH_ENGAGED"}
            className={`flex items-center space-x-1.5 font-mono text-xs font-bold px-3.5 py-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              config.state === "ACTIVE"
                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {config.state === "ACTIVE" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{config.state === "ACTIVE" ? "Pause Engine" : "Resume Engine"}</span>
          </button>

          <button
            onClick={onOpenConfig}
            className="flex items-center space-x-1.5 bg-[#181824] hover:bg-[#202030] text-zinc-200 border border-[#2a2a3c] font-mono text-xs font-bold px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#387ed1]" />
            <span>Strategy & Risk Limits</span>
          </button>

          <button
            onClick={onOpenDisclaimerModal}
            className="flex items-center space-x-1.5 bg-[#181824] hover:bg-[#202030] text-zinc-300 border border-[#2a2a3c] font-mono text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>SEBI Notice</span>
          </button>
        </div>

        {/* Emergency Kill Switch Button */}
        <div>
          <button
            onClick={onOpenKillSwitchModal}
            className="flex items-center space-x-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 font-mono text-xs font-black px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-950/40 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>EMERGENCY KILL SWITCH</span>
          </button>
        </div>
      </div>
    </div>
  );
}

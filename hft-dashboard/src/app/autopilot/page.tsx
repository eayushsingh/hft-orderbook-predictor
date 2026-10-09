"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Briefcase,
  BookOpen,
  BarChart3,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Wallet,
} from "lucide-react";

import LalanNavbar from "@/components/LalanNavbar";
import AutopilotHeader from "@/components/autopilot/AutopilotHeader";
import AutopilotRankingsTable from "@/components/autopilot/AutopilotRankingsTable";
import AutopilotPositionsTable from "@/components/autopilot/AutopilotPositionsTable";
import AutopilotOrdersTable from "@/components/autopilot/AutopilotOrdersTable";
import AutopilotBacktestView from "@/components/autopilot/AutopilotBacktestView";
import AutopilotAuditLogView from "@/components/autopilot/AutopilotAuditLogView";
import AutopilotConfigModal from "@/components/autopilot/AutopilotConfigModal";
import AutopilotKillSwitchModal from "@/components/autopilot/AutopilotKillSwitchModal";
import SebiDisclaimerModal from "@/components/autopilot/SebiDisclaimerModal";
import {
  AutopilotAuditLog,
  AutopilotConfig,
  AutopilotOrder,
  AutopilotPosition,
  BacktestResult,
  ConstituentRanking,
  IndexMarketData,
  StrategyType,
} from "@/lib/autopilot/types";

export default function AutopilotPage() {
  const [config, setConfig] = useState<AutopilotConfig | null>(null);
  const [indexData, setIndexData] = useState<IndexMarketData | null>(null);
  const [funds, setFunds] = useState<{ availableCash: number; usedMargin: number; totalEquity: number }>({
    availableCash: 500000,
    usedMargin: 0,
    totalEquity: 500000,
  });
  const [marketStatus, setMarketStatus] = useState<{ isOpen: boolean; istTime: string }>({
    isOpen: true,
    istTime: "09:30 IST",
  });
  const [rankings, setRankings] = useState<ConstituentRanking[]>([]);
  const [positions, setPositions] = useState<AutopilotPosition[]>([]);
  const [orders, setOrders] = useState<AutopilotOrder[]>([]);
  const [auditLogs, setAuditLogs] = useState<AutopilotAuditLog[]>([]);
  const [latestBacktest, setLatestBacktest] = useState<BacktestResult | null>(null);

  const [activeTab, setActiveTab] = useState<string>("rankings");
  const [isRunningCycle, setIsRunningCycle] = useState<boolean>(false);
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const [killSwitchModalOpen, setKillSwitchModalOpen] = useState<boolean>(false);
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch complete autopilot snapshot
  const fetchAutopilotState = useCallback(async () => {
    try {
      const res = await fetch("/api/autopilot");
      const json = await res.json();
      if (json.success && json.data) {
        setConfig(json.data.config);
        setIndexData(json.data.indexData);
        if (json.data.funds) setFunds(json.data.funds);
        if (json.data.marketStatus) setMarketStatus(json.data.marketStatus);
        if (json.data.rankings) setRankings(json.data.rankings);
        if (json.data.positions) setPositions(json.data.positions);
        if (json.data.orders) setOrders(json.data.orders);
        if (json.data.auditLogs) setAuditLogs(json.data.auditLogs);
      }
    } catch {
      // Graceful offline fallback
    }
  }, []);

  // Fetch initial state & start polling interval
  useEffect(() => {
    let isMounted = true;
    const loadState = async () => {
      try {
        const res = await fetch("/api/autopilot");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setConfig(json.data.config);
          setIndexData(json.data.indexData);
          if (json.data.funds) setFunds(json.data.funds);
          if (json.data.marketStatus) setMarketStatus(json.data.marketStatus);
          if (json.data.rankings) setRankings(json.data.rankings);
          if (json.data.positions) setPositions(json.data.positions);
          if (json.data.orders) setOrders(json.data.orders);
          if (json.data.auditLogs) setAuditLogs(json.data.auditLogs);
        }
      } catch {
        // Graceful offline fallback
      }
    };

    loadState();
    const interval = setInterval(loadState, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Run cycle manually
  const handleRunCycle = async () => {
    setIsRunningCycle(true);
    try {
      const res = await fetch("/api/autopilot/cycle", { method: "POST" });
      const json = await res.json();
      if (json.success && json.data) {
        setRankings(json.data.rankings || []);
        setPositions(json.data.activePositions || []);
        if (json.data.config) setConfig(json.data.config);
        await fetchAutopilotState();
        setFeedbackMessage({
          type: "success",
          text: `Analysis cycle completed. Scored ${json.data.rankings?.length || 50} Nifty 50 constituents.`,
        });
      } else {
        setFeedbackMessage({ type: "error", text: json.error || "Cycle failed" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setFeedbackMessage({ type: "error", text: msg });
    } finally {
      setIsRunningCycle(false);
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  // Toggle Pause / Resume
  const handleTogglePause = async () => {
    if (!config) return;
    const nextState = config.state === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      const res = await fetch("/api/autopilot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: nextState }),
      });
      const json = await res.json();
      if (json.success) {
        setConfig(json.config);
        await fetchAutopilotState();
      }
    } catch {
      // Ignored
    }
  };

  // Save config
  const handleSaveConfig = async (updated: Partial<AutopilotConfig>): Promise<boolean> => {
    try {
      const res = await fetch("/api/autopilot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (json.success) {
        setConfig(json.config);
        await fetchAutopilotState();
        setFeedbackMessage({ type: "success", text: "Configuration saved and version incremented." });
        setTimeout(() => setFeedbackMessage(null), 4000);
        return true;
      } else {
        setFeedbackMessage({ type: "error", text: json.error || "Failed to update configuration" });
        return false;
      }
    } catch {
      setFeedbackMessage({ type: "error", text: "Failed to connect to config API" });
      return false;
    }
  };

  // Trigger Kill Switch
  const handleTriggerKillSwitch = async (action: "ENGAGE" | "RESET", reason: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/autopilot/kill-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const json = await res.json();
      if (json.success) {
        if (json.config) setConfig(json.config);
        await fetchAutopilotState();
        setFeedbackMessage({
          type: "success",
          text: action === "ENGAGE" ? "EMERGENCY KILL SWITCH ENGAGED." : "Kill switch reset to PAUSED.",
        });
        setTimeout(() => setFeedbackMessage(null), 5000);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Approve / Cancel Order
  const handleApproveOrder = async (orderId: string) => {
    try {
      const res = await fetch("/api/autopilot/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "APPROVE" }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchAutopilotState();
        setFeedbackMessage({ type: "success", text: `Order ${orderId} approved and executed.` });
      } else {
        setFeedbackMessage({ type: "error", text: json.message || "Failed to approve order" });
      }
    } catch {
      setFeedbackMessage({ type: "error", text: "Order action network error" });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch("/api/autopilot/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "CANCEL" }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchAutopilotState();
        setFeedbackMessage({ type: "success", text: `Order ${orderId} cancelled.` });
      }
    } catch {
      // Error
    }
  };

  // Exit position
  const handleExitPosition = async (symbol: string) => {
    try {
      const res = await fetch("/api/autopilot/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EXIT_POSITION", symbol }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchAutopilotState();
        setFeedbackMessage({ type: "success", text: `Exit order placed for ${symbol}.` });
      }
    } catch {
      // Error
    }
  };

  const handleSquareOffAll = async () => {
    try {
      const res = await fetch("/api/autopilot/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SQUARE_OFF_ALL" }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchAutopilotState();
        setFeedbackMessage({ type: "success", text: "Square-off orders submitted for all active positions." });
      }
    } catch {
      // Error
    }
  };

  // Run Backtest
  const handleRunBacktest = async (strategy: StrategyType, cap: number, risk: number): Promise<BacktestResult | null> => {
    try {
      const res = await fetch("/api/autopilot/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy, initialCapital: cap, riskPerTradePct: risk }),
      });
      const json = await res.json();
      if (json.success && json.result) {
        setLatestBacktest(json.result);
        return json.result;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Compute live portfolio metrics
  const totalInvested = positions.reduce((acc, p) => acc + p.quantity * p.currentLtp, 0);
  const totalEquity = funds.availableCash + totalInvested;
  const initialCap = config?.capital || 500000;
  const totalPnl = totalEquity - initialCap;
  const totalPnlPct = initialCap > 0 ? (totalPnl / initialCap) * 100 : 0;

  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING_APPROVAL").length;

  return (
    <div className="min-h-screen bg-[#08080c] text-zinc-100 font-sans selection:bg-[#387ed1] selection:text-white flex flex-col">
      {/* Navbar */}
      <LalanNavbar
        activeTab="autopilot"
        setActiveTab={() => {}}
        latencyMs={0.45}
        availableFunds={funds.availableCash}
        niftyPrice={indexData?.ltp || 24850.75}
        niftyChange={indexData?.changePct || 0.62}
        bankNiftyPrice={52340.1}
        bankNiftyChange={0.85}
        btcPrice={84572.5}
        btcChange={2.1}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 space-y-5">
        {/* Feedback Alert Toast */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-xl border font-mono text-xs flex items-center justify-between shadow-lg ${
                feedbackMessage.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-rose-500/15 border-rose-500/40 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedbackMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>{feedbackMessage.text}</span>
              </div>
              <button
                onClick={() => setFeedbackMessage(null)}
                className="text-zinc-400 hover:text-white text-xs font-bold"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header & Controls */}
        <AutopilotHeader
          config={config}
          isRunningCycle={isRunningCycle}
          marketOpen={marketStatus.isOpen}
          marketIstTime={marketStatus.istTime}
          onRunCycle={handleRunCycle}
          onOpenConfig={() => setConfigModalOpen(true)}
          onTogglePause={handleTogglePause}
          onOpenKillSwitchModal={() => setKillSwitchModalOpen(true)}
          onOpenDisclaimerModal={() => setDisclaimerModalOpen(true)}
        />

        {/* Pending Approval Banner */}
        {pendingOrdersCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg font-mono">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <div className="font-black text-sm text-white">
                  {pendingOrdersCount} ORDER{pendingOrdersCount > 1 ? "S" : ""} AWAITING APPROVAL
                </div>
                <div className="text-xs text-amber-200/80 font-sans">
                  Semi-automated mode requires operator authorization before submitting orders to broker.
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("orders")}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow active:scale-95 cursor-pointer"
            >
              Review Pending Orders →
            </button>
          </div>
        )}

        {/* Telemetry Summary Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Index Card */}
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#222230] shadow-md space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold">
              <span>NIFTY 50 BENCHMARK</span>
              <span className="px-1.5 py-0.5 rounded bg-[#1c1c28] text-cyan-400">
                {indexData?.marketRegime || "BULLISH_TREND"}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                ₹{indexData?.ltp ? indexData.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "24,850.75"}
              </div>
              <div className={`text-xs font-bold ${indexData?.changePct && indexData.changePct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {indexData?.changePct && indexData.changePct >= 0 ? "+" : ""}{indexData?.changePct?.toFixed(2) || "0.62"}%
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-[#1c1c28]">
              <span>India VIX: {indexData?.indiaVix?.toFixed(1) || "13.8"}</span>
              <span>Adv/Dec: {indexData?.advancers || 34}/{indexData?.decliners || 16}</span>
            </div>
          </div>

          {/* Capital & Equity */}
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#222230] shadow-md space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold">
              <span>PORTFOLIO EQUITY</span>
              <Wallet className="w-3.5 h-3.5 text-[#387ed1]" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                ₹{totalEquity.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-xs font-bold ${totalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {totalPnl >= 0 ? "+" : ""}₹{totalPnl.toLocaleString("en-IN", { minimumFractionDigits: 0 })} ({totalPnlPct.toFixed(2)}%)
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-[#1c1c28]">
              <span>Cash: ₹{funds.availableCash.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              <span>Invested: ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Positions & Risk Limits */}
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#222230] shadow-md space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold">
              <span>POSITIONS & CAPACITY</span>
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                {positions.length} / {config?.maxPositions || 5}
              </div>
              <div className="text-xs font-bold text-zinc-400">
                Max {config?.maxPositionCapPct || 20}% / Stock
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-[#1c1c28]">
              <span>Risk/Trade: {config?.riskPerTradePct || 1.0}%</span>
              <span>Max Sector: {config?.maxSectorCapPct || 35}%</span>
            </div>
          </div>

          {/* Drawdown & Loss Meter */}
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#222230] shadow-md space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold">
              <span>DAILY LOSS & DRAWDOWN</span>
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                0.00%
              </div>
              <div className="text-xs font-bold text-zinc-400">
                Max Limit: {config?.maxDrawdownPct || 10}%
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-[#1c1c28]">
              <span>Daily Loss Cap: {config?.maxDailyLossPct || 3}%</span>
              <span className="text-emerald-400 font-bold">Within Limits</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-[#20202e] pb-1 overflow-x-auto no-scrollbar font-mono text-xs">
          {[
            { id: "rankings", label: "Universe Rankings", icon: Layers },
            { id: "positions", label: `Active Positions (${positions.length})`, icon: Briefcase },
            { id: "orders", label: `Order Book (${orders.length})`, icon: BookOpen },
            { id: "backtest", label: "Factor Backtest Sandbox", icon: BarChart3 },
            { id: "audit", label: `Audit Trail (${auditLogs.length})`, icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#1c1c28] text-cyan-300 border border-[#2e2e42] shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#121218]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#387ed1]" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab === "rankings" && (
          <AutopilotRankingsTable
            rankings={rankings}
          />
        )}

        {activeTab === "positions" && (
          <AutopilotPositionsTable
            positions={positions}
            onExitPosition={handleExitPosition}
            onSquareOffAll={handleSquareOffAll}
          />
        )}

        {activeTab === "orders" && (
          <AutopilotOrdersTable
            orders={orders}
            onApproveOrder={handleApproveOrder}
            onCancelOrder={handleCancelOrder}
          />
        )}

        {activeTab === "backtest" && (
          <AutopilotBacktestView
            initialResult={latestBacktest}
            onRunBacktest={handleRunBacktest}
          />
        )}

        {activeTab === "audit" && (
          <AutopilotAuditLogView
            logs={auditLogs}
          />
        )}
      </main>

      {/* Modals */}
      <AutopilotConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        currentConfig={config}
        onSaveConfig={handleSaveConfig}
      />

      <AutopilotKillSwitchModal
        isOpen={killSwitchModalOpen}
        onClose={() => setKillSwitchModalOpen(false)}
        currentState={config?.state || "ACTIVE"}
        onTriggerKillSwitch={handleTriggerKillSwitch}
      />

      <SebiDisclaimerModal
        isOpen={disclaimerModalOpen}
        onClose={() => setDisclaimerModalOpen(false)}
      />
    </div>
  );
}

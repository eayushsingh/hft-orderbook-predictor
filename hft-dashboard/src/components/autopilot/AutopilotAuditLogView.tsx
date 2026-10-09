"use client";

import React from "react";
import { AlertCircle, Info, AlertTriangle, Terminal } from "lucide-react";
import { AutopilotAuditLog } from "@/lib/autopilot/types";

interface AutopilotAuditLogViewProps {
  logs: AutopilotAuditLog[];
}

export default function AutopilotAuditLogView({ logs }: AutopilotAuditLogViewProps) {
  const getSeverityBadge = (severity: "INFO" | "WARNING" | "CRITICAL") => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 text-[9px] font-mono font-bold animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40 text-[9px] font-mono font-bold">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            WARNING
          </span>
        );
      case "INFO":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold">
            <Info className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#222230] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm dark:shadow-xl font-mono text-xs transition-colors">
      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            AUDIT TELEMETRY & EVENT TRAIL
            <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-slate-100 dark:bg-[#181824] text-slate-700 dark:text-zinc-400 border border-slate-200 dark:border-[#262638]">
              {logs.length} Events Logged
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans">
            Tamper-evident logs of signals, risk barriers, orders, fills, and operator interventions.
          </p>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar pr-1">
        {logs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-zinc-500">
            No audit records generated yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#222234] flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#387ed1]/40 transition-colors shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 dark:text-zinc-500 text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {getSeverityBadge(log.severity)}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1c1c28] text-slate-800 dark:text-zinc-300 font-bold">
                    {log.eventType}
                  </span>
                  {log.symbol && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#387ed1]/15 text-[#1d4ed8] dark:text-[#387ed1] font-bold">
                      {log.symbol}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans">by {log.actor}</span>
                </div>
                <div className="text-slate-800 dark:text-zinc-200 text-xs font-sans font-normal">{log.details}</div>
              </div>
              <div className="text-[9px] text-slate-400 dark:text-zinc-600 shrink-0">{log.id}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

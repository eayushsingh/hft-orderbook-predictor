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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/25 text-rose-400 border border-rose-500/50 text-[9px] font-mono font-bold animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-mono font-bold">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            WARNING
          </span>
        );
      case "INFO":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold">
            <Info className="w-3 h-3 text-cyan-400" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="bg-[#121218] border border-[#222230] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl font-mono text-xs">
      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            AUDIT TELEMETRY & EVENT TRAIL
            <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-[#181824] text-zinc-400 border border-[#262638]">
              {logs.length} Events Logged
            </span>
          </h2>
          <p className="text-xs text-zinc-400 font-sans">
            Tamper-evident logs of signals, risk barriers, orders, fills, and operator interventions.
          </p>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar pr-1">
        {logs.length === 0 ? (
          <div className="py-8 text-center text-zinc-500">
            No audit records generated yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#161622] border border-[#222234] flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#387ed1]/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-zinc-500 text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {getSeverityBadge(log.severity)}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1c1c28] text-zinc-300 font-bold">
                    {log.eventType}
                  </span>
                  {log.symbol && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#387ed1]/15 text-[#387ed1] font-bold">
                      {log.symbol}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-500 font-sans">by {log.actor}</span>
                </div>
                <div className="text-zinc-200 text-xs font-sans">{log.details}</div>
              </div>
              <div className="text-[9px] text-zinc-600 shrink-0">{log.id}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, FileText, Cpu, Activity, ShieldAlert } from 'lucide-react';

export const SlideCompliancePPT: React.FC = () => {
  const [killSwitchState, setKillSwitchState] = useState<'ARMED' | 'DISARMED'>('ARMED');
  const [activeCheck, setActiveCheck] = useState<'PRE_TRADE' | 'POST_TRADE' | 'AUDIT'>('PRE_TRADE');

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Slide Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Slide 10 &bull; Risk &amp; Compliance Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Risk Controls &amp; SEBI/SEC Audit Framework
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Emergency Circuit Breaker:</span>
          <button
            type="button"
            onClick={() => setKillSwitchState((s) => (s === 'ARMED' ? 'DISARMED' : 'ARMED'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              killSwitchState === 'ARMED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/10'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {killSwitchState === 'ARMED' ? 'SYSTEM ARMED & SECURE' : 'KILL SWITCH TEST ACTIVE'}
          </button>
        </div>
      </div>

      {/* Main Grid Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-4">
        {/* Left Column: Risk Check Filters */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
            {(['PRE_TRADE', 'POST_TRADE', 'AUDIT'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCheck(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCheck === tab
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'PRE_TRADE' ? 'Pre-Trade Gateway Checks' : tab === 'POST_TRADE' ? 'Post-Trade Monitoring' : 'Immutable Audit Log'}
              </button>
            ))}
          </div>

          {/* Interactive Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            {activeCheck === 'PRE_TRADE' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Sub-Microsecond Hard Limits (FPGA Engine)
                  </span>
                  <span className="text-emerald-400">0.12 μs Validation Time</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-white">Max Notional Order Value</span>
                    <p className="text-slate-400 text-[11px]">Hard capped at ₹50,00,000 per order packet.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-white">Fat-Finger Price Collar</span>
                    <p className="text-slate-400 text-[11px]">Rejects limit prices outside ±0.8% of Best Bid/Offer.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-white">Order Rate Throttling</span>
                    <p className="text-slate-400 text-[11px]">Enforces SEBI max 500 order modifications/sec limit.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-white">Self-Trade Prevention</span>
                    <p className="text-slate-400 text-[11px]">Automated match cancellation across internal desk IDs.</p>
                  </div>
                </div>
              </div>
            )}

            {activeCheck === 'POST_TRADE' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    Real-Time Position &amp; Exposure Tracking
                  </span>
                  <span className="text-teal-400">100% Real-Time Delta/Gamma</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Max Portfolio VaR (99.9% 1-day):</span>
                    <span className="text-emerald-400 font-bold">₹12,40,000 (0.42%)</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Intraday Drawdown Stop:</span>
                    <span className="text-slate-200 font-bold">2.0% Soft / 3.5% Hard Stop</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Leverage Utilization:</span>
                    <span className="text-emerald-400 font-bold">1.8x / 4.0x Allowed</span>
                  </div>
                </div>
              </div>
            )}

            {activeCheck === 'AUDIT' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Cryptographic Audit Ledger &amp; Timestamping
                  </span>
                  <span className="text-emerald-400">PTP Nanosecond Sync</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1.5 text-slate-300">
                  <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1">
                    <span>TIME (PTP UTC)</span>
                    <span>EVENT TYPE</span>
                    <span>CHECKSUM HASH</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>14:32:01.409128301</span>
                    <span>PRE_TRADE_PASS</span>
                    <span>0x8f4a...e12b</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>14:32:01.409128450</span>
                    <span>ORDER_ACK_NSE</span>
                    <span>0x9c3b...d48a</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>14:32:01.409129100</span>
                    <span>EXECUTION_FILL</span>
                    <span>0x1d7e...f902</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Regulatory Accreditations */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Compliance Standards &amp; Certifications
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">SEBI Algorithmic Guidelines</div>
                  <div className="text-[11px] text-slate-400">Circular SEBI/HO/MRD/DP/CIR/P/2018/62</div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">VERIFIED</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">SOC 2 Type II Certified</div>
                  <div className="text-[11px] text-slate-400">Annual Independent Security Audit</div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">COMPLIANT</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">ISO 27001 Information Security</div>
                  <div className="text-[11px] text-slate-400">End-to-End Encryption &amp; Vault Key Management</div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">CERTIFIED</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-mono">Zero Algorithmic Violations</span>
              <p className="text-xs text-white font-semibold">100% Audit Readiness Across All Trading Desks</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 ml-3" />
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Risk Latency</span>
          <div className="text-sm font-extrabold text-emerald-400 font-mono">120 Nanoseconds</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Daily Audit Logs</span>
          <div className="text-sm font-extrabold text-white font-mono">25,00,000 Entries</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Clock Sync Precision</span>
          <div className="text-sm font-extrabold text-teal-400 font-mono">&lt; 100 ns PTP</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Security Uptime</span>
          <div className="text-sm font-extrabold text-emerald-400 font-mono">99.999%</div>
        </div>
      </div>
    </div>
  );
};

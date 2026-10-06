"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, Activity, Gauge, Eye } from "lucide-react";

export default function VPINSpoofingRadar() {
  const [vpinScore, setVpinScore] = useState(0.34); // VPIN value 0.0 to 1.0
  const [cancelToFillRatio, setCancelToFillRatio] = useState(14.2); // CFR ratio
  const [toxicFlowAlert, setToxicFlowAlert] = useState<"LOW" | "MODERATE" | "HIGH">("LOW");
  const [detectedIcebergs, setDetectedIcebergs] = useState<number>(3);
  const [phantomOrders, setPhantomOrders] = useState<number>(18);

  useEffect(() => {
    const interval = setInterval(() => {
      const newVpin = parseFloat((0.25 + Math.random() * 0.45).toFixed(2));
      setVpinScore(newVpin);
      setToxicFlowAlert(newVpin > 0.55 ? "HIGH" : newVpin > 0.4 ? "MODERATE" : "LOW");
      setCancelToFillRatio(parseFloat((10 + Math.random() * 12).toFixed(1)));
      if (Math.random() > 0.7) {
        setDetectedIcebergs((prev) => Math.min(12, Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-[#262634] bg-[#101016] p-5 sm:p-6 shadow-2xl font-sans text-zinc-100 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222232] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-mono text-white">
                VPIN &amp; Spoofing Detection Radar (MMIP)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold uppercase border border-rose-500/30">
                Institutional Spec
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Volume-Synchronized Probability of Toxicity &amp; Phantom Order Detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-500">Flow Status:</span>
          <span
            className={`px-2.5 py-1 rounded-full font-bold uppercase text-[11px] ${
              toxicFlowAlert === "HIGH"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                : toxicFlowAlert === "MODERATE"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            }`}
          >
            {toxicFlowAlert} TOXIC FLOW
          </span>
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* VPIN Metric Card */}
        <div className="p-4 rounded-xl bg-[#161622] border border-[#262638] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold">VPIN Toxicity Index</span>
            <Gauge className="w-4 h-4 text-[#387ed1]" />
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-2">
            <span>{(vpinScore * 100).toFixed(1)}%</span>
            <span className="text-xs font-normal text-zinc-400">
              {vpinScore < 0.4 ? "(Safe Retail Flow)" : "(Informed Institutional Accumulation)"}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className={`h-full transition-all duration-500 ${
                vpinScore > 0.55 ? "bg-rose-500" : vpinScore > 0.4 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${vpinScore * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            High VPIN indicates aggressive market orders by institutional algos anticipating directional sweeps.
          </p>
        </div>

        {/* Cancel-to-Fill Ratio */}
        <div className="p-4 rounded-xl bg-[#161622] border border-[#262638] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold">Cancel-to-Fill Ratio (CFR)</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{cancelToFillRatio}:1</div>
          <div className="text-xs text-zinc-400">
            Phantom Order Rate: <span className="text-white font-bold">{phantomOrders} cancels/sec</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Measures order book spoofing where high frequency algos place &amp; cancel quotes without execution intent.
          </p>
        </div>

        {/* Iceberg Detector */}
        <div className="p-4 rounded-xl bg-[#161622] border border-[#262638] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold">Hidden Iceberg Detection</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{detectedIcebergs} Orders Active</div>
          <div className="text-xs text-zinc-400">
            Est. Hidden Liquidity: <span className="text-white font-bold">₹42.8 Cr</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Detects stealth institutional orders hiding actual volume behind small L2 display sizes.
          </p>
        </div>
      </div>

      {/* Real-time Order Book Toxicity Telemetry Stream */}
      <div className="p-4 rounded-xl bg-[#09090f] border border-[#1e1e2c] space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-bold border-b border-zinc-800 pb-2">
          <span className="flex items-center gap-1.5 text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>LIVE MICROSTRUCTURE ANOMALY AUDIT LOG</span>
          </span>
          <span className="text-[10px] text-zinc-500">Sub-ms Tick Telemetry</span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="text-emerald-400 font-bold">[ICEBERG DETECTED]</span>
            <span>RELIANCE L2 Bid @ ₹2,940.00 — Displayed: 500 qty | Estimated Total: 25,000 qty</span>
            <span className="text-zinc-500">16:47:01.042</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span className="text-amber-400 font-bold">[SPOOFING PATTERN]</span>
            <span>HDFCBANK Ask Wall @ ₹1,688.00 — 50,000 qty canceled within 4.2ms</span>
            <span className="text-zinc-500">16:47:00.890</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span className="text-sky-400 font-bold">[VPIN SURGE]</span>
            <span>NIFTY 24850 CE Volume Synchronized Toxicity escalated from 0.28 to 0.58</span>
            <span className="text-zinc-500">16:46:59.215</span>
          </div>
        </div>
      </div>
    </div>
  );
}

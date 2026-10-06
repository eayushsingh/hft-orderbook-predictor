'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap, Sparkles, CheckCircle2, Server, ArrowRight, ShieldCheck } from 'lucide-react';

interface SimulationPacket {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  qty: number;
  price: string;
  latencyNs: number;
  status: 'PENDING' | 'ROUTED' | 'EXECUTED';
}

export const SlideLiveSandboxPPT: React.FC = () => {
  const [packets, setPackets] = useState<SimulationPacket[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalExecuted, setTotalExecuted] = useState(142050);
  const [avgLatency, setAvgLatency] = useState(420);

  const runSimulation = () => {
    setIsSimulating(true);
    setPackets([]);

    const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
    const newPackets: SimulationPacket[] = Array.from({ length: 6 }).map((_, i) => {
      const sym = symbols[i % symbols.length];
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const price = (2000 + Math.random() * 500).toFixed(2);
      const latencyNs = Math.floor(350 + Math.random() * 120);
      return {
        id: `pkt-${Date.now()}-${i}`,
        symbol: sym,
        side,
        qty: (i + 1) * 50,
        price,
        latencyNs,
        status: 'PENDING',
      };
    });

    setPackets(newPackets);

    // Transition packets sequentially
    newPackets.forEach((pkt, idx) => {
      setTimeout(() => {
        setPackets((prev) =>
          prev.map((p) => (p.id === pkt.id ? { ...p, status: 'ROUTED' } : p))
        );
      }, (idx + 1) * 200);

      setTimeout(() => {
        setPackets((prev) =>
          prev.map((p) => (p.id === pkt.id ? { ...p, status: 'EXECUTED' } : p))
        );
        setTotalExecuted((prev) => prev + pkt.qty);
      }, (idx + 1) * 200 + 150);
    });

    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-y-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Slide 11 &bull; Interactive Execution Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Order Simulation &amp; FPGA Gateway Benchmarking
          </h2>
        </div>

        <button
          type="button"
          onClick={runSimulation}
          disabled={isSimulating}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
            isSimulating
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 font-extrabold shadow-lg shadow-emerald-500/20 active:scale-95'
          }`}
        >
          {isSimulating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" /> Simulating Order Burst...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Fire HFT Test Burst
            </>
          )}
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-4">
        {/* Left Column: Live Packet Simulator Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Live Order Gateway Packet Pipeline
              </span>
              <span className="text-[11px] font-mono text-emerald-400">PTP Clock Synced</span>
            </div>

            {/* Packets Stream */}
            <div className="space-y-2 min-h-[200px]">
              {packets.length === 0 ? (
                <div className="h-48 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Sparkles className="w-8 h-8 text-emerald-500/40" />
                  <p className="text-xs">Click <strong className="text-slate-300">&quot;Fire HFT Test Burst&quot;</strong> above to simulate sub-microsecond order packet routing across NSE direct DMA gateway.</p>
                </div>
              ) : (
                packets.map((pkt) => (
                  <motion.div
                    key={pkt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pkt.side === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {pkt.side}
                      </span>
                      <span className="font-bold text-white">{pkt.symbol}</span>
                      <span className="text-slate-400">{pkt.qty} @ ₹{pkt.price}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">{pkt.latencyNs} ns</span>
                      {pkt.status === 'PENDING' && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">INGESTING</span>
                      )}
                      {pkt.status === 'ROUTED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-400">ROUTING</span>
                      )}
                      {pkt.status === 'EXECUTED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> FILLED
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Metrics */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Real-Time Gateway Telemetry
            </h4>

            <div className="space-y-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Cumulative Shares Traded</span>
                <span className="text-sm font-bold text-emerald-400">{totalExecuted.toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Tick-to-Trade Latency</span>
                <span className="text-sm font-bold text-teal-400">{avgLatency} ns</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">FPGA Queue Drop Rate</span>
                <span className="text-sm font-bold text-emerald-400">0.0000%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-emerald-400 font-mono font-bold uppercase">Sub-Microsecond Performance</span>
              <p className="text-xs text-slate-300">Direct exchange DMA colocation with zero operating system kernel bypass jitter</p>
            </div>
            <ArrowRight className="w-6 h-6 text-emerald-400 shrink-0 ml-3" />
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Colocation Facility</span>
          <div className="text-sm font-extrabold text-white font-mono">NSE BKC / BSE Fort</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Kernel Bypass</span>
          <div className="text-sm font-extrabold text-emerald-400 font-mono">Solarflare EF_VI</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Network Interface</span>
          <div className="text-sm font-extrabold text-teal-400 font-mono">10GbE Fiber SFP+</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Memory Allocation</span>
          <div className="text-sm font-extrabold text-white font-mono">Zero-GC Off-Heap</div>
        </div>
      </div>
    </div>
  );
};

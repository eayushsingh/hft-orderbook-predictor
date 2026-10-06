'use client';

import React from 'react';
import { Globe } from 'lucide-react';

export const SlideMultiBrokerPPT: React.FC = () => {
  return (
    <div className="space-y-8 p-2">
      {/* Slide Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
          <Globe className="w-3.5 h-3.5" /> Slide 05 • Multi-Broker Integration Bridge
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Unified API Gateway Across Top Indian Brokerages
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Seamless multi-account routing, hot-failover order placement, and aggregated multi-broker portfolio position sync.
        </p>
      </div>

      {/* Broker Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {[
          { name: 'Zerodha Kite', tech: 'KiteConnect WebSocket', status: 'LIVE • 0.42ms', desc: 'Binary ticker & GTT order placement' },
          { name: 'DhanHQ', tech: 'Dhan Ultra API', status: 'LIVE • 0.38ms', desc: 'Zero-cost API co-located gateway' },
          { name: 'Upstox', tech: 'Upstox Pro v3', status: 'LIVE • 0.51ms', desc: 'Multi-account auth & WebSocket stream' },
          { name: 'AngelOne', tech: 'SmartAPI', status: 'LIVE • 0.45ms', desc: 'TOTP automated session manager' },
          { name: 'Groww', tech: 'Groww Trade API', status: 'LIVE • 0.58ms', desc: 'Direct order ticket bridge' },
        ].map((broker, i) => (
          <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-center">
            <span className="text-xs font-bold text-white block">{broker.name}</span>
            <span className="text-[10px] text-slate-400 font-mono block">{broker.tech}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
              {broker.status}
            </span>
            <p className="text-[11px] text-slate-500 leading-tight">{broker.desc}</p>
          </div>
        ))}
      </div>

      {/* Enterprise Gateway Specs */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Automatic Hot-Failover</span>
          <p className="text-slate-300 mt-1">Routes order slices instantly to backup broker if primary gateway latency spikes above 50ms.</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Unified Margin Pool</span>
          <p className="text-slate-300 mt-1">Aggregates available collateral across all linked broker accounts into a single purchasing pool.</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Encrypted OAuth Vault</span>
          <p className="text-slate-300 mt-1">AES-256 GCM encrypted token storage with automatic daily TOTP login renewal.</p>
        </div>
      </div>
    </div>
  );
};

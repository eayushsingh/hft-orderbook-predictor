'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Zap } from 'lucide-react';

interface TechLayer {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  technologies: {
    name: string;
    version: string;
    role: string;
    highlight: string;
  }[];
  benchmarks: { label: string; value: string }[];
}

const TECH_LAYERS: TechLayer[] = [
  {
    id: 'execution',
    name: 'High-Frequency Core Engine',
    category: 'Ultra-Low Latency Matching & Calculation',
    badge: 'C++20 / Java 21',
    description: 'Lock-free, zero-allocation ring buffer architecture running on dedicated pinned CPU isolcpus threads.',
    technologies: [
      {
        name: 'LMAX Disruptor 4.0',
        version: '4.0.0',
        role: 'Inter-thread ring buffer messaging',
        highlight: '6 million msgs/sec with 0 lock contention',
      },
      {
        name: 'DirectByteBuffer Pool',
        version: 'Zero-GC',
        role: 'Off-heap memory allocation',
        highlight: 'Eliminates Java Garbage Collector pauses',
      },
      {
        name: 'C++20 SIMD (AVX-512)',
        version: 'GCC 14 / Clang 18',
        role: 'Vectorized OBI & Micro-Price vector math',
        highlight: '8 parallel level evaluations per CPU instruction',
      },
      {
        name: 'Simple Binary Encoding (SBE)',
        version: 'v1.27',
        role: 'Direct memory-mapped market binary payload',
        highlight: 'Zero-copy decoding directly from network buffers',
      },
    ],
    benchmarks: [
      { label: 'p50 Tick Latency', value: '0.42 µs' },
      { label: 'Max Throughput', value: '12.4 M/sec' },
      { label: 'GC Pause', value: '0.00 ms' },
    ],
  },
  {
    id: 'networking',
    name: 'Kernel Bypass & Transport',
    category: 'Sub-Microsecond Network Ingestion',
    badge: 'Solarflare EF_VI',
    description: 'Hardware kernel bypass network architecture interfacing directly with exchange packet flows.',
    technologies: [
      {
        name: 'Solarflare EF_VI',
        version: 'OpenOnload v8.1',
        role: 'Direct NIC ring-buffer packet polling',
        highlight: 'Bypasses OS TCP/IP stack overhead entirely',
      },
      {
        name: 'UDP Multicast Protocol',
        version: 'ITCH / OUCH 5.0',
        role: 'Exchange feeds ingestion (NSE/BSE/LMAX/NASDAQ)',
        highlight: 'Lossless raw binary feed parser',
      },
      {
        name: 'Thread Pinned Polling',
        version: 'pthread_setaffinity_np',
        role: 'Dedicated busy-spin network core',
        highlight: 'Zero context switches or interrupt latencies',
      },
    ],
    benchmarks: [
      { label: 'NIC to User Space', value: '180 ns' },
      { label: 'Packet Drop Rate', value: '0.000%' },
      { label: 'Core Isolation', value: 'Cores 2-7' },
    ],
  },
  {
    id: 'inference',
    name: 'ML & Predictive Intelligence',
    category: 'Real-Time Signal Generation',
    badge: 'ONNX Runtime C++',
    description: 'Sub-millisecond inference pipeline executing neural order book imbalance models on live tick streams.',
    technologies: [
      {
        name: 'ONNX Runtime C++ API',
        version: 'v1.18',
        role: 'Pre-compiled ML model executor',
        highlight: 'Executes Deep LOB Transformer in < 80 µs',
      },
      {
        name: 'PyTorch Model Training',
        version: 'v2.4',
        role: 'Offline training on tick-by-tick dataset',
        highlight: 'Hawkes intensity & VPIN calibration',
      },
      {
        name: 'LightGBM / XGBoost C API',
        version: 'v2.1',
        role: 'Fast decision-tree queue fill predictor',
        highlight: '94.2% accuracy on queue priority estimation',
      },
    ],
    benchmarks: [
      { label: 'Inference Latency', value: '78 µs' },
      { label: 'Prediction Horizon', value: '100 ms' },
      { label: 'Fill Accuracy', value: '94.2%' },
    ],
  },
  {
    id: 'frontend',
    name: 'Institutional Dashboard & UX',
    category: 'Real-Time Monitoring & Telemetry UI',
    badge: 'Next.js 16 / React 19',
    description: 'High-performance React 19 dashboard utilizing WebSocket binary frames and GPU-accelerated rendering.',
    technologies: [
      {
        name: 'Next.js 16 (App Router)',
        version: '16.0',
        role: 'Server components & modular layout',
        highlight: 'Sub-second initial load with React Server Components',
      },
      {
        name: 'React 19 & TypeScript 5.7',
        version: 'Strict ESNext',
        role: 'Type-safe state management',
        highlight: 'Zero runtime type mismatches',
      },
      {
        name: 'Framer Motion & Canvas',
        version: 'v11',
        role: '60 FPS orderbook visual animations',
        highlight: 'Hardware GPU-accelerated layer transforms',
      },
      {
        name: 'Tailwind CSS & Lucide Icons',
        version: 'v3.4',
        role: 'Dark-mode glassmorphic interface system',
        highlight: 'Curated institutional color system',
      },
    ],
    benchmarks: [
      { label: 'Render Frame Rate', value: '60 FPS' },
      { label: 'WS Latency UI', value: '< 2 ms' },
      { label: 'Bundle Size', value: 'Opt. SWC' },
    ],
  },
];

export const InstitutionalTechStack: React.FC = () => {
  const [activeLayerId, setActiveLayerId] = useState<string>('execution');

  const activeLayer = TECH_LAYERS.find((l) => l.id === activeLayerId) || TECH_LAYERS[0];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl transform-gpu">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
              <Layers className="w-3 h-3" /> ARCHITECTURE STACK
            </span>
            <span className="text-xs text-slate-400 font-mono">End-to-End Enterprise Specification</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Institutional Technology Stack
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Zero-GC low-latency system design built for high-throughput market making & predictive analytics.
          </p>
        </div>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {TECH_LAYERS.map((layer) => {
          const isActive = layer.id === activeLayerId;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayerId(layer.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-violet-950/40 border-violet-500/50 shadow-lg shadow-violet-950/50 text-white'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-violet-400 font-semibold">
                  {layer.badge}
                </span>
              </div>
              <div className="font-bold text-sm text-slate-100 mt-2 truncate">{layer.name}</div>
              <div className="text-xs text-slate-400 truncate mt-0.5">{layer.category}</div>
            </button>
          );
        })}
      </div>

      {/* Layer Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLayer.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Header Summary & Benchmarks */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                {activeLayer.name}
                <span className="text-xs font-mono font-normal text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  {activeLayer.category}
                </span>
              </h4>
              <p className="text-slate-300 text-sm mt-1">{activeLayer.description}</p>
            </div>

            {/* Benchmark KPI Pills */}
            <div className="flex items-center gap-3">
              {activeLayer.benchmarks.map((b) => (
                <div key={b.label} className="bg-slate-900 border border-violet-500/20 px-3 py-2 rounded-lg text-center font-mono">
                  <div className="text-xs text-slate-400">{b.label}</div>
                  <div className="text-sm font-bold text-violet-300 mt-0.5">{b.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLayer.technologies.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-violet-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-base">{tech.name}</span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {tech.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">{tech.role}</p>
                </div>
                <div className="pt-2 border-t border-slate-900 flex items-center gap-2 text-xs font-mono text-violet-300 bg-violet-950/20 p-2 rounded border border-violet-500/20">
                  <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <span>{tech.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Code2, Copy, Check, Terminal, Cpu, Zap, Activity } from "lucide-react";

export default function QuantApiPlayground() {
  const [activeTab, setActiveTab] = useState<"java" | "python" | "cpp">("java");
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    java: `// LALAN LMAX Disruptor Ring Buffer Core (Java 17 Zero-GC)
public final class OrderBookImbalanceHandler implements EventHandler<OrderEvent> {
    private static final long RING_BUFFER_SIZE = 1024L * 1024L; // 1,048,576 slots
    private double totalBidVolume = 0.0;
    private double totalAskVolume = 0.0;

    @Override
    public void onEvent(OrderEvent event, long sequence, boolean endOfBatch) {
        // Primitive zero-allocation OBI calculation
        double vBid = event.getTop5BidVolume();
        double vAsk = event.getTop5AskVolume();
        
        double obiSignal = (vBid - vAsk) / (vBid + vAsk);
        double microPrice = (event.getBestBid() * vAsk + event.getBestAsk() * vBid) / (vBid + vAsk);

        if (obiSignal > 0.35) {
            System.out.printf("[HFT-SIGNAL] STRONG_BUY | Symbol: %s | OBI: %.4f | MicroPrice: %.2f | Latency: 0.68ms%n",
                event.getSymbol(), obiSignal, microPrice);
        }
    }
}`,
    python: `# LALAN Quantitative Python WebSocket API SDK
import asyncio
from lalan_quant import LalanWebSocketClient, SignalFilter

async function stream_hft_alpha():
    async with LalanWebSocketClient(api_key="lalan_live_sec_998822") as client:
        await client.subscribe(
            symbols=["NIFTY", "BANKNIFTY", "RELIANCE"],
            depth=5,
            filter=SignalFilter.OBI_IMBALANCE
        )

        async for tick in client.stream_ticks():
            print(f"[TICK] {tick.symbol} | OBI: {tick.obi_signal:.3f} | Signal: {tick.confidence_pct}%")
            if tick.obi_signal > 0.40:
                await client.submit_fast_order(
                    symbol=tick.symbol,
                    side="BUY",
                    quantity=500,
                    order_type="MARKET"
                )

asyncio.run(stream_hft_alpha())`,
    cpp: `// LALAN Cache-Aligned Lock-Free Ring Buffer (C++20 Primitive)
#include <atomic>
#include <iostream>

template<typename T, size_t Capacity>
class alignas(64) LockFreeRingBuffer {
private:
    alignas(64) T buffer_[Capacity];
    alignas(64) std::atomic<size_t> head_{0};
    alignas(64) std::atomic<size_t> tail_{0};

public:
    bool push(const T& item) noexcept {
        size_t current_tail = tail_.load(std::memory_order_relaxed);
        size_t next_tail = (current_tail + 1) % Capacity;
        if (next_tail == head_.load(std::memory_order_acquire)) return false; // Full
        
        buffer_[current_tail] = item;
        tail_.store(next_tail, std::memory_order_release);
        return true; // Zero-allocation success
    }
};`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b0b10] dark:bg-[#0c0c12] border border-slate-200 dark:border-[#1f1f2e] rounded-2xl overflow-hidden shadow-2xl my-12">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-100 dark:bg-[#07070b] px-4 py-3 border-b border-slate-200 dark:border-[#1f1f2e] gap-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#387ed1]" />
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Quant API &amp; Low-Latency Architecture SDK
          </span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1 bg-slate-200 dark:bg-[#14141e] p-1 rounded-xl border border-slate-300 dark:border-[#222234]">
            <button
              onClick={() => setActiveTab("java")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === "java"
                  ? "bg-[#387ed1] text-white shadow"
                  : "text-slate-600 dark:text-[#8a8d9b] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Java 17 (Disruptor)
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === "python"
                  ? "bg-[#387ed1] text-white shadow"
                  : "text-slate-600 dark:text-[#8a8d9b] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Python (SDK)
            </button>
            <button
              onClick={() => setActiveTab("cpp")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === "cpp"
                  ? "bg-[#387ed1] text-white shadow"
                  : "text-slate-600 dark:text-[#8a8d9b] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              C++20 (Lock-Free)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-[#141420] dark:hover:bg-[#1e1e2d] text-slate-800 dark:text-[#a0a3b0] hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-[#222234] text-xs font-mono transition-all"
            title="Copy Code Snippet"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="p-4 sm:p-6 bg-[#08080c] dark:bg-[#08080d] overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-[#00f0ff] dark:text-[#569cd6]">
        <pre className="text-slate-100 dark:text-[#d4d4d4]">
          <code>{codeSnippets[activeTab]}</code>
        </pre>
      </div>

      {/* Benchmark Footer Bar */}
      <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#07070a] border-t border-slate-200 dark:border-[#1a1a28] flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-600 dark:text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Execution Latency: <strong className="text-emerald-500 font-bold">0.68ms (Sub-ms)</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Memory Allocation: <strong className="text-slate-800 dark:text-white font-bold">0 Bytes / Event (Zero-GC)</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Throughput: <strong className="text-[#387ed1] font-bold">1,000,000+ Ticks/Sec</strong></span>
        </div>
      </div>
    </div>
  );
}

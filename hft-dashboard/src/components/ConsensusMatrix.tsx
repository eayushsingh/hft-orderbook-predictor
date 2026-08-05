"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, ScanLine, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface Source {
  platform: string;
  signal: string;
  color: string;
}

interface ConsensusData {
  ticker: string;
  consensus: string;
  sources: Source[];
}

export default function ConsensusMatrix() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState<ConsensusData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Simulated API call - later this will fetch from your Java backend
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    
    setIsScanning(true);
    
    // Simulate network delay for the scanning effect
    setTimeout(() => {
      // Mocking the response for Indian stocks
      setData({
        ticker: ticker.toUpperCase(),
        consensus: "STRONG BUY",
        sources: [
          { platform: "TradingView", signal: "BUY", color: "text-[#39FF14]" },
          { platform: "Screener.in", signal: "HOLD", color: "text-amber-400" },
          { platform: "Moneycontrol", signal: "BUY", color: "text-[#39FF14]" },
          { platform: "Trendlyne", signal: "SELL", color: "text-[#FF073A]" }
        ]
      });
      setIsScanning(false);
    }, 800);
  };

  const getSignalIcon = (signal: string) => {
    if (signal.includes("BUY")) return <ArrowUpRight className="h-4 w-4" />;
    if (signal.includes("SELL")) return <ArrowDownRight className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <div className="w-full rounded-2xl border border-white/[0.08] bg-[#0f0f13]/80 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Activity className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-medium text-zinc-100">Market Consensus Matrix</h2>
        </div>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="relative flex-1 group w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input 
            type="text" 
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter NSE/BSE Ticker (e.g., RELIANCE)" 
            className="w-full bg-[#08080a] text-zinc-100 pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all uppercase placeholder:normal-case placeholder:text-zinc-600 font-mono"
          />
        </div>
        <button 
          type="submit" 
          disabled={!ticker || isScanning}
          className="flex h-[46px] w-full sm:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.04] disabled:text-zinc-500 disabled:border-white/[0.04] text-white px-6 rounded-xl font-medium transition-all border border-indigo-500 min-w-[120px]"
        >
          {isScanning ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <ScanLine className="h-4 w-4" />
            </motion.div>
          ) : (
            <>
              Scan <ScanLine className="h-4 w-4 opacity-70" />
            </>
          )}
        </button>
      </form>

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {data && !isScanning && (
          <motion.div 
            key={data.ticker}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6 border-b border-white/[0.08] pb-5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-1">Target Asset</span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">{data.ticker}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-1">Aggregated Signal</span>
                <span className="px-3 py-1 rounded-lg bg-[#39FF14]/10 text-[#39FF14] font-mono text-sm border border-[#39FF14]/20 font-bold drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                  {data.consensus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.sources.map((source, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={index} 
                  className="bg-white/[0.02] p-4 rounded-xl flex justify-between items-center border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-zinc-400 font-medium text-sm">{source.platform}</span>
                  <div className={`flex items-center gap-1.5 font-mono font-bold ${source.color}`}>
                    {source.signal}
                    {getSignalIcon(source.signal)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

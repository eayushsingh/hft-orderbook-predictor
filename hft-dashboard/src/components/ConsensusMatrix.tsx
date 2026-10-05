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
  consensusColor: string;
  sources: Source[];
}

const KNOWN_CONSENSUS: Record<string, ConsensusData> = {
  RELIANCE: {
    ticker: "RELIANCE",
    consensus: "STRONG BUY",
    consensusColor: "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]",
    sources: [
      { platform: "TradingView (Techs)", signal: "STRONG BUY", color: "text-[#39FF14]" },
      { platform: "Screener.in (Value)", signal: "BUY", color: "text-[#39FF14]" },
      { platform: "Moneycontrol (FII)", signal: "BUY", color: "text-[#39FF14]" },
      { platform: "Trendlyne (DII)", signal: "HOLD", color: "text-amber-400" }
    ]
  },
  HDFCBANK: {
    ticker: "HDFCBANK",
    consensus: "BEARISH",
    consensusColor: "bg-[#FF073A]/10 text-[#FF073A] border-[#FF073A]/20 drop-shadow-[0_0_15px_rgba(255,7,58,0.3)]",
    sources: [
      { platform: "TradingView (Techs)", signal: "SELL", color: "text-[#FF073A]" },
      { platform: "Screener.in (Value)", signal: "HOLD", color: "text-amber-400" },
      { platform: "Moneycontrol (FII)", signal: "SELL", color: "text-[#FF073A]" },
      { platform: "Trendlyne (DII)", signal: "SELL", color: "text-[#FF073A]" }
    ]
  },
  INFY: {
    ticker: "INFY",
    consensus: "NEUTRAL",
    consensusColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    sources: [
      { platform: "TradingView (Techs)", signal: "HOLD", color: "text-amber-400" },
      { platform: "Screener.in (Value)", signal: "BUY", color: "text-[#39FF14]" },
      { platform: "Moneycontrol (FII)", signal: "HOLD", color: "text-amber-400" },
      { platform: "Trendlyne (DII)", signal: "SELL", color: "text-[#FF073A]" }
    ]
  },
  TATAMOTORS: {
    ticker: "TATAMOTORS",
    consensus: "STRONG BUY",
    consensusColor: "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]",
    sources: [
      { platform: "TradingView (Techs)", signal: "STRONG BUY", color: "text-[#39FF14]" },
      { platform: "Screener.in (Value)", signal: "BUY", color: "text-[#39FF14]" },
      { platform: "Moneycontrol (FII)", signal: "STRONG BUY", color: "text-[#39FF14]" },
      { platform: "Trendlyne (DII)", signal: "BUY", color: "text-[#39FF14]" }
    ]
  }
};

export default function ConsensusMatrix() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState<ConsensusData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;
    
    const uppercaseTicker = ticker.trim().toUpperCase();
    setIsScanning(true);
    
    setTimeout(() => {
      if (KNOWN_CONSENSUS[uppercaseTicker]) {
        setData(KNOWN_CONSENSUS[uppercaseTicker]);
      } else {
        // Dynamic deterministic calculation for any other scanned stock
        const hash = uppercaseTicker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const isBullish = hash % 2 === 0;
        
        setData({
          ticker: uppercaseTicker,
          consensus: isBullish ? "BULLISH" : "NEUTRAL",
          consensusColor: isBullish
            ? "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            : "bg-amber-500/10 text-amber-400 border-amber-500/20",
          sources: [
            { platform: "TradingView (Techs)", signal: isBullish ? "BUY" : "HOLD", color: isBullish ? "text-[#39FF14]" : "text-amber-400" },
            { platform: "Screener.in (Value)", signal: "BUY", color: "text-[#39FF14]" },
            { platform: "Moneycontrol (FII)", signal: isBullish ? "BUY" : "HOLD", color: isBullish ? "text-[#39FF14]" : "text-amber-400" },
            { platform: "Trendlyne (DII)", signal: isBullish ? "HOLD" : "SELL", color: isBullish ? "text-amber-400" : "text-[#FF073A]" }
          ]
        });
      }
      setIsScanning(false);
    }, 100);
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
            placeholder="Enter NSE/BSE Ticker (e.g., RELIANCE, INFY)" 
            className="w-full bg-[#08080a] text-zinc-100 pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all uppercase placeholder:normal-case placeholder:text-zinc-600 font-mono text-xs sm:text-sm"
          />
        </div>
        <button 
          type="submit" 
          disabled={!ticker.trim() || isScanning}
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
                <span className={`px-3 py-1 rounded-lg font-mono text-xs sm:text-sm border font-bold ${data.consensusColor}`}>
                  {data.consensus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.sources.map((source, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  key={index} 
                  className="bg-white/[0.02] p-3.5 rounded-xl flex justify-between items-center border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-zinc-400 font-medium text-xs sm:text-sm">{source.platform}</span>
                  <div className={`flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold ${source.color}`}>
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

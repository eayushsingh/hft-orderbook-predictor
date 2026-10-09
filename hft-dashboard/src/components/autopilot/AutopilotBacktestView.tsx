"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { BacktestResult, StrategyType } from "@/lib/autopilot/types";

interface AutopilotBacktestViewProps {
  initialResult: BacktestResult | null;
  onRunBacktest: (strategy: StrategyType, capital: number, riskPct: number) => Promise<BacktestResult | null>;
}

export default function AutopilotBacktestView({
  initialResult,
  onRunBacktest,
}: AutopilotBacktestViewProps) {
  const [strategy, setStrategy] = useState<StrategyType>("SWING");
  const [capital, setCapital] = useState<number>(500000);
  const [riskPct, setRiskPct] = useState<number>(1.0);
  const [running, setRunning] = useState<boolean>(false);
  const [result, setResult] = useState<BacktestResult | null>(initialResult);

  const handleRun = async () => {
    setRunning(true);
    const res = await onRunBacktest(strategy, capital, riskPct);
    if (res) setResult(res);
    setRunning(false);
  };

  // Render SVG Equity Curve
  const renderEquityCurve = (curve: { date: string; equity: number; benchmarkEquity: number }[]) => {
    if (!curve || curve.length < 2) return null;

    const width = 800;
    const height = 240;
    const padding = 20;

    const equities = curve.map((c) => c.equity);
    const benchmarkEquities = curve.map((c) => c.benchmarkEquity);
    const allValues = [...equities, ...benchmarkEquities];

    const minVal = Math.min(...allValues) * 0.98;
    const maxVal = Math.max(...allValues) * 1.02;
    const range = maxVal - minVal || 1;

    const getX = (idx: number) => padding + (idx / (curve.length - 1)) * (width - padding * 2);
    const getY = (val: number) => height - padding - ((val - minVal) / range) * (height - padding * 2);

    const stratPath = curve.map((c, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(c.equity)}`).join(" ");
    const benchPath = curve.map((c, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(c.benchmarkEquity)}`).join(" ");

    return (
      <div className="w-full bg-slate-50 dark:bg-[#0c0c10] border border-slate-200 dark:border-[#1e1e2c] rounded-xl p-4 overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
              <span className="w-3 h-0.5 bg-cyan-500 dark:bg-cyan-400" />
              Strategy Equity (Net of Costs & Slippage)
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-500 font-bold">
              <span className="w-3 h-0.5 bg-slate-400 dark:bg-zinc-500 border-dashed" />
              Nifty 50 Buy & Hold Benchmark
            </span>
          </div>
          <span className="text-slate-400 dark:text-zinc-500 text-[10px]">250 Trading Days</span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56">
          {/* Horizontal grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-200 dark:text-[#1a1a26]" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-slate-200 dark:text-[#1a1a26]" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-[#1a1a26]" strokeDasharray="3 3" />

          {/* Benchmark line */}
          <path d={benchPath} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Strategy line */}
          <path d={stratPath} fill="none" stroke="#387ed1" strokeWidth="2.5" />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#222230] rounded-2xl p-4 sm:p-5 space-y-5 shadow-sm dark:shadow-xl font-sans transition-colors">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white flex items-center gap-2">
            HISTORICAL FACTOR BACKTEST SANDBOX
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              SIMULATED • NO LOOK-AHEAD BIAS
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans">
            Validated against historical Nifty 50 cash equities with full statutory charges and slippage included.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as StrategyType)}
            className="bg-slate-50 dark:bg-[#181824] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-[#387ed1] transition-colors"
          >
            <option value="SWING" className="bg-white dark:bg-[#181824] text-slate-900 dark:text-white">SWING (ATR Momentum)</option>
            <option value="LONG_TERM" className="bg-white dark:bg-[#181824] text-slate-900 dark:text-white">LONG_TERM (Factor Rebalance)</option>
          </select>

          <div className="flex items-center space-x-1 bg-slate-50 dark:bg-[#181824] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-zinc-300 transition-colors">
            <span className="text-slate-400 dark:text-zinc-500 text-[10px]">Cap: ₹</span>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
              className="w-20 bg-transparent text-slate-900 dark:text-white font-mono text-xs outline-none"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-50 dark:bg-[#181824] border border-slate-300 dark:border-[#2a2a3c] rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-zinc-300 transition-colors">
            <span className="text-slate-400 dark:text-zinc-500 text-[10px]">Risk:</span>
            <input
              type="number"
              step="0.5"
              value={riskPct}
              onChange={(e) => setRiskPct(parseFloat(e.target.value) || 0)}
              className="w-12 bg-transparent text-slate-900 dark:text-white font-mono text-xs outline-none"
            />
            <span className="text-slate-400 dark:text-zinc-500 text-[10px]">%</span>
          </div>

          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#387ed1] hover:bg-[#2f6cb5] text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${running ? "animate-spin" : ""}`} />
            <span>{running ? "Simulating..." : "Run Backtest"}</span>
          </button>
        </div>
      </div>

      {result ? (
        <div className="space-y-5">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#242436] shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">TOTAL RETURN</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{result.totalReturnPct}%
              </div>
              <div className="text-[9px] text-slate-400 dark:text-zinc-500">CAGR: +{result.cagrPct}%</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#242436] shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">BENCHMARK RETURN</div>
              <div className="text-lg font-black text-slate-800 dark:text-zinc-300 mt-0.5">
                +{result.benchmarkReturnPct}%
              </div>
              <div className="text-[9px] text-slate-400 dark:text-zinc-500">Nifty 50 Buy & Hold</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#242436] shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">ALPHA VS INDEX</div>
              <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
                {result.alphaPct >= 0 ? "+" : ""}{result.alphaPct}%
              </div>
              <div className="text-[9px] text-slate-400 dark:text-zinc-500">Excess Return</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#242436] shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">MAX DRAWDOWN</div>
              <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">
                -{result.maxDrawdownPct}%
              </div>
              <div className="text-[9px] text-slate-400 dark:text-zinc-500">Peak-to-Trough</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#242436] shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">WIN RATE</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {result.winRatePct}%
              </div>
              <div className="text-[9px] text-slate-400 dark:text-zinc-500">
                {result.winningTrades}W / {result.losingTrades}L
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#242436] shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">SHARPE RATIO</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
                {result.sharpeRatio}
              </div>
              <div className="text-[9px] text-slate-400 dark:text-zinc-500">Profit Factor: {result.profitFactor}</div>
            </div>
          </div>

          {/* Equity Curve */}
          {renderEquityCurve(result.equityCurve)}

          {/* Assumptions & Costs Paid */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0c10] border border-slate-200 dark:border-[#1e1e2c] space-y-2 text-xs font-mono shadow-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-[#1c1c28] pb-1.5">
              <span>SIMULATION PARAMETERS & REGULATORY DEDUCTIONS</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-black">
                Total Statutory Costs & Slippage Paid: ₹{result.totalCostsPaid.toLocaleString("en-IN")}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-zinc-400 text-[11px] font-sans">
              {result.assumptions.map((asm, i) => (
                <li key={i}>{asm}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 dark:text-zinc-500 font-mono text-xs">
          Click &quot;Run Backtest&quot; to compute historical performance simulation on Nifty 50 constituents.
        </div>
      )}
    </div>
  );
}

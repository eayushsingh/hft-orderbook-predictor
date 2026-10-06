'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Shield, DollarSign, Award } from 'lucide-react';
import { ASSET_UNIVERSE, calculateExpectedMetrics } from '@/lib/robo-advisor/assetUniverse';
import { TargetAllocation } from '@/lib/robo-advisor/types';

interface PortfolioAllocationViewProps {
  allocations: TargetAllocation[];
  riskScore: number;
}

export const PortfolioAllocationView: React.FC<PortfolioAllocationViewProps> = ({
  allocations,
  riskScore,
}) => {
  const metrics = calculateExpectedMetrics(allocations);

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Expected Return</div>
            <div className="text-xl font-bold text-emerald-400">{metrics.expectedReturnPct}% / yr</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Expected Volatility</div>
            <div className="text-xl font-bold text-cyan-400">{metrics.expectedVolatilityPct}%</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Sharpe Ratio</div>
            <div className="text-xl font-bold text-amber-400">{metrics.sharpeRatio}</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Blended Fee (ER)</div>
            <div className="text-xl font-bold text-purple-400">{metrics.blendedExpenseRatioPct}%</div>
          </div>
        </div>
      </div>

      {/* Asset Allocation Breakdown List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Target Asset Class Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Risk Score: <strong className="text-emerald-400">{riskScore}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allocations.map((alloc) => {
            const assetInfo = ASSET_UNIVERSE[alloc.assetClass];
            if (!assetInfo || alloc.targetWeightPct <= 0) return null;

            return (
              <motion.div
                key={alloc.assetClass}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {alloc.etfSymbol}
                      </span>
                      <span className="text-xs font-semibold text-white">{assetInfo.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {assetInfo.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-400">
                      {alloc.targetWeightPct}%
                    </span>
                    <div className="text-[10px] text-slate-500">
                      [{alloc.minWeightPct}% - {alloc.maxWeightPct}%]
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${alloc.targetWeightPct}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
                  <span>Hist. Return: <strong className="text-slate-200">{assetInfo.historicalReturnRate}%</strong></span>
                  <span>Expense Ratio: <strong className="text-slate-200">{assetInfo.expenseRatioPct}%</strong></span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

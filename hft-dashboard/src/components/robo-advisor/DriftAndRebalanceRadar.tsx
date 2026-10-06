'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight, Zap, Play } from 'lucide-react';
import { PortfolioSummary, RebalanceExecutionPlan } from '@/lib/robo-advisor/types';
import { calculatePortfolioDrift } from '@/lib/robo-advisor/driftEngine';
import { generateRebalancePlan } from '@/lib/robo-advisor/rebalanceEngine';

interface DriftAndRebalanceRadarProps {
  portfolio: PortfolioSummary;
  onExecuteRebalance?: (plan: RebalanceExecutionPlan) => void;
}

export const DriftAndRebalanceRadar: React.FC<DriftAndRebalanceRadarProps> = ({
  portfolio,
  onExecuteRebalance,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const driftAnalysis = calculatePortfolioDrift(
    portfolio.holdings,
    portfolio.targetAllocations,
    portfolio.cashBalance
  );

  const rebalancePlan = generateRebalancePlan(
    portfolio.id,
    portfolio.holdings,
    portfolio.targetAllocations,
    portfolio.cashBalance
  );

  const handleConfirmRebalance = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setShowPlanModal(false);
      if (onExecuteRebalance) {
        onExecuteRebalance(rebalancePlan);
      }
    }, 1200);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-teal-400 animate-spin-slow" />
            <h3 className="text-lg font-bold text-white">Automated Portfolio Drift & Rebalance Radar</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous algorithmic monitoring of asset allocation drift and execution triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Drift Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
              driftAnalysis.driftSeverity === 'BALANCED'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : driftAnalysis.driftSeverity === 'MODERATE_DRIFT'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
            }`}
          >
            {driftAnalysis.driftSeverity === 'BALANCED' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>Drift Score: {driftAnalysis.totalDriftScore}% ({driftAnalysis.driftSeverity.replace('_', ' ')})</span>
          </div>

          <button
            type="button"
            onClick={() => setShowPlanModal(true)}
            disabled={rebalancePlan.orders.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              rebalancePlan.orders.length > 0
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4" /> Rebalance Now ({rebalancePlan.orders.length} Trades)
          </button>
        </div>
      </div>

      {/* Asset Class Drift Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="pb-3 font-semibold">Asset Class / Ticker</th>
              <th className="pb-3 font-semibold">Current Weight</th>
              <th className="pb-3 font-semibold">Target Weight</th>
              <th className="pb-3 font-semibold">Drift Delta</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {driftAnalysis.assetDrifts.map((drift) => (
              <tr key={drift.assetClass} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px] font-mono">
                      {drift.symbol}
                    </span>
                    <span>{drift.assetClass.replace(/_/g, ' ')}</span>
                  </div>
                </td>
                <td className="py-3 font-mono font-semibold text-slate-200">
                  {drift.currentWeightPct}%
                </td>
                <td className="py-3 font-mono font-semibold text-emerald-400">
                  {drift.targetWeightPct}%
                </td>
                <td className="py-3 font-mono">
                  {drift.currentWeightPct > drift.targetWeightPct ? (
                    <span className="text-rose-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +{drift.absoluteDriftPct}%
                    </span>
                  ) : drift.currentWeightPct < drift.targetWeightPct ? (
                    <span className="text-teal-400 flex items-center gap-0.5">
                      <ArrowDownRight className="w-3.5 h-3.5" /> -{drift.absoluteDriftPct}%
                    </span>
                  ) : (
                    <span className="text-slate-500">0.0%</span>
                  )}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      drift.status === 'OPTIMAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : drift.status === 'DRIFTED_HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {drift.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trade Execution Modal Preview */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-xl w-full space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Confirm Algorithmic Rebalance Execution</h3>
                </div>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400">Total Trade Volume:</span>
                    <div className="text-sm font-bold text-emerald-400">${rebalancePlan.totalTradeVolume}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected Post-Drift:</span>
                    <div className="text-sm font-bold text-cyan-400">{rebalancePlan.driftAfterRebalance}%</div>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rebalancePlan.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            order.action === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {order.action}
                        </span>
                        <span className="font-bold text-white">{order.symbol}</span>
                        <span className="text-slate-400">({order.shares} shares @ ${order.estimatedPrice})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-200">
                        ${order.estimatedTotalValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRebalance}
                  disabled={isExecuting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 text-xs font-bold hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Routing Orders...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Confirm & Execute Trades
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

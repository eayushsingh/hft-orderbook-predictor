'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { runMonteCarloSimulation } from '@/lib/robo-advisor/simulationEngine';
import { InvestorGoal, TargetAllocation } from '@/lib/robo-advisor/types';

interface GoalSimulationChartProps {
  goal: InvestorGoal;
  targetAllocations: TargetAllocation[];
}

export const GoalSimulationChart: React.FC<GoalSimulationChartProps> = ({
  goal: initialGoal,
  targetAllocations,
}) => {
  const [monthlyContrib, setMonthlyContrib] = useState(initialGoal.monthlyContribution);
  const [horizonYears, setHorizonYears] = useState(initialGoal.timeHorizonYears);

  const updatedGoal: InvestorGoal = {
    ...initialGoal,
    monthlyContribution: monthlyContrib,
    timeHorizonYears: horizonYears,
  };

  const simResult = runMonteCarloSimulation(updatedGoal, targetAllocations);

  const maxVal = Math.max(
    ...simResult.trajectories.map((t) => t.p90),
    simResult.goalTargetAmount
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Stochastic Monte Carlo Goal Simulation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            1,000 algorithmic market path iterations with geometric Brownian motion & real inflation adjustment.
          </p>
        </div>

        {/* Probability Gauge */}
        <div className="bg-slate-950 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Goal Success Rate</div>
            <div className="text-xl font-extrabold text-emerald-400">
              {simResult.probabilityOfSuccessPct}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xs bg-emerald-500/10">
            {simResult.probabilityOfSuccessPct >= 80 ? 'HIGH' : 'MED'}
          </div>
        </div>
      </div>

      {/* Trajectory Visual Chart */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
          <span>Initial ($100,000)</span>
          <span>Target: <strong className="text-emerald-400">${simResult.goalTargetAmount.toLocaleString()}</strong></span>
          <span>Year {horizonYears} Median: <strong className="text-teal-300">${simResult.projectedEndingMedianValue.toLocaleString()}</strong></span>
        </div>

        <div className="h-48 bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-end justify-between gap-1 relative overflow-hidden">
          {/* Target Goal Line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500/50 text-[10px] text-emerald-400 pl-2 font-bold"
            style={{
              bottom: `${Math.min(95, (simResult.goalTargetAmount / maxVal) * 100)}%`,
            }}
          >
            Target Goal (${(simResult.goalTargetAmount / 1000).toFixed(0)}k)
          </div>

          {simResult.trajectories.map((traj) => {
            const heightP90 = Math.max(5, (traj.p90 / maxVal) * 100);
            const heightP50 = Math.max(5, (traj.p50 / maxVal) * 100);
            const heightP10 = Math.max(5, (traj.p10 / maxVal) * 100);

            return (
              <div
                key={traj.year}
                className="flex-1 flex flex-col justify-end items-center h-full group relative"
              >
                {/* 90th percentile bar */}
                <div
                  style={{ height: `${heightP90}%` }}
                  className="w-full bg-emerald-500/20 rounded-t transition-all group-hover:bg-emerald-500/40"
                />
                {/* 50th percentile bar */}
                <div
                  style={{ height: `${heightP50}%` }}
                  className="w-full bg-teal-400/50 rounded-t absolute bottom-0 transition-all group-hover:bg-teal-400/80"
                />
                {/* 10th percentile bar */}
                <div
                  style={{ height: `${heightP10}%` }}
                  className="w-full bg-cyan-600/70 rounded-t absolute bottom-0 transition-all"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-1">
          <span>Year 0</span>
          <span>Year {Math.round(horizonYears / 2)}</span>
          <span>Year {horizonYears}</span>
        </div>
      </div>

      {/* Interactive Simulation Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Simulate Monthly Savings: <span className="text-emerald-400 font-bold">${monthlyContrib} / mo</span>
          </label>
          <input
            type="range"
            min={500}
            max={10000}
            step={250}
            value={monthlyContrib}
            onChange={(e) => setMonthlyContrib(parseInt(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Investment Horizon: <span className="text-emerald-400 font-bold">{horizonYears} Years</span>
          </label>
          <input
            type="range"
            min={5}
            max={35}
            value={horizonYears}
            onChange={(e) => setHorizonYears(parseInt(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

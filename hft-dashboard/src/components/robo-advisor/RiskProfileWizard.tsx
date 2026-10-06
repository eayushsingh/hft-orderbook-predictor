'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  TrendingUp,
  Target,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
} from 'lucide-react';
import { GoalType, RiskProfile, RiskQuestionnaire } from '@/lib/robo-advisor/types';
import { calculateRiskProfile } from '@/lib/robo-advisor/riskEngine';

interface RiskProfileWizardProps {
  onComplete: (profile: RiskProfile, goalType: GoalType) => void;
}

export const RiskProfileWizard: React.FC<RiskProfileWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState<GoalType>('RETIREMENT');
  const [questionnaire, setQuestionnaire] = useState<RiskQuestionnaire>({
    age: 30,
    investmentHorizonYears: 15,
    liquidNetWorth: 100000,
    monthlySavings: 2000,
    riskToleranceLevel: 4,
    marketDropReaction: 'BUY_MORE',
    primaryObjective: 'MAXIMIZE_RETURNS',
    priorLossExperience: true,
  });

  const [calculatedProfile, setCalculatedProfile] = useState<RiskProfile | null>(null);

  const handleNext = () => {
    if (step === 3) {
      const profile = calculateRiskProfile(questionnaire);
      setCalculatedProfile(profile);
      setStep(4);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleConfirm = () => {
    if (calculatedProfile) {
      onComplete(calculatedProfile, goalType);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Wizard Header & Stepper */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              AI Algorithmic Advisor
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Robo-Risk & Goal Profiler</h2>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step === i
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30'
                  : step > i
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Goals & Horizon */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              1. What is your primary investment goal?
            </h3>
            <p className="text-xs text-slate-400">
              Algorithms adjust asset weight sensitivity based on target objective liquidity and time horizon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { type: 'RETIREMENT', title: 'Early Retirement Fund', desc: 'Long-term equity compounding & inflation protection' },
              { type: 'WEALTH_ACCUMULATION', title: 'Wealth Accumulation', desc: 'Aggressive alpha seeking with global exposure' },
              { type: 'MAJOR_PURCHASE', title: 'Major Purchase / Home', desc: 'Moderate risk profile with drawdown mitigation' },
              { type: 'EMERGENCY_FUND', title: 'Capital Preservation / Emergency', desc: 'High liquidity in Treasury Bills & Core Bonds' },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setGoalType(item.type as GoalType)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                  goalType === item.type
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Your Age: <span className="text-emerald-400 font-bold">{questionnaire.age} years</span>
              </label>
              <input
                type="range"
                min={18}
                max={80}
                value={questionnaire.age}
                onChange={(e) =>
                  setQuestionnaire({ ...questionnaire, age: parseInt(e.target.value) })
                }
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Investment Horizon:{' '}
                <span className="text-emerald-400 font-bold">
                  {questionnaire.investmentHorizonYears} years
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={40}
                value={questionnaire.investmentHorizonYears}
                onChange={(e) =>
                  setQuestionnaire({
                    ...questionnaire,
                    investmentHorizonYears: parseInt(e.target.value),
                  })
                }
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Financial Capacity */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              2. Financial Capacity & Monthly Cash Flow
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates capacity to absorb market drawdowns without forced liquidations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Liquid Net Worth ($):
              </label>
              <input
                type="number"
                value={questionnaire.liquidNetWorth}
                onChange={(e) =>
                  setQuestionnaire({
                    ...questionnaire,
                    liquidNetWorth: Math.max(1000, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Monthly Savings Contribution ($):
              </label>
              <input
                type="number"
                value={questionnaire.monthlySavings}
                onChange={(e) =>
                  setQuestionnaire({
                    ...questionnaire,
                    monthlySavings: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-300">
              Primary Objective:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'CAPITAL_PRESERVATION', label: 'Preserve Capital' },
                { val: 'BALANCED_GROWTH', label: 'Balanced Growth' },
                { val: 'MAXIMIZE_RETURNS', label: 'Maximize Growth' },
              ].map((obj) => (
                <button
                  key={obj.val}
                  type="button"
                  onClick={() =>
                    setQuestionnaire({
                      ...questionnaire,
                      primaryObjective: obj.val as RiskQuestionnaire['primaryObjective'],
                    })
                  }
                  className={`py-3 px-2 rounded-xl text-xs font-medium border transition-all ${
                    questionnaire.primaryObjective === obj.val
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {obj.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Risk Tolerance & Market Drop Reaction */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              3. Risk Tolerance & Market Drop Scenario
            </h3>
            <p className="text-xs text-slate-400">
              How would you react if stock markets experience a sudden 20% drawdown?
            </p>
          </div>

          <div className="space-y-3">
            {[
              { val: 'SELL_ALL', label: 'Sell all holdings to prevent further losses', scoreDesc: 'Extreme Risk Aversion' },
              { val: 'SELL_SOME', label: 'Sell a portion to lock in cash buffer', scoreDesc: 'Moderate Caution' },
              { val: 'DO_NOTHING', label: 'Stay invested and hold for recovery', scoreDesc: 'Disciplined Patience' },
              { val: 'BUY_MORE', label: 'Opportunistically buy more at discounted valuations', scoreDesc: 'High Conviction Aggressive' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() =>
                  setQuestionnaire({
                    ...questionnaire,
                    marketDropReaction: opt.val as RiskQuestionnaire['marketDropReaction'],
                  })
                }
                className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                  questionnaire.marketDropReaction === opt.val
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{opt.scoreDesc}</div>
                </div>
                {questionnaire.marketDropReaction === opt.val && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 4: Profile Output Summary */}
      {step === 4 && calculatedProfile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" /> Calculated Algorithm Score
            </div>

            <div className="flex justify-center items-baseline space-x-2">
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {calculatedProfile.score}
              </span>
              <span className="text-slate-500 font-medium text-lg">/ 100</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-wider">
              {calculatedProfile.category.replace('_', ' ')}
            </h3>

            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Recommended Investment Horizon: <strong className="text-slate-200">{calculatedProfile.recommendedDuration}</strong>
            </p>

            {/* Target Asset Allocation Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Equity ({calculatedProfile.equityTargetPct}%)</span>
                <span>Fixed Income ({calculatedProfile.fixedIncomeTargetPct}%)</span>
                <span>Alternatives ({calculatedProfile.alternativesTargetPct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${calculatedProfile.equityTargetPct}%` }}
                  className="bg-emerald-500 h-full"
                />
                <div
                  style={{ width: `${calculatedProfile.fixedIncomeTargetPct}%` }}
                  className="bg-cyan-500 h-full"
                />
                <div
                  style={{ width: `${calculatedProfile.alternativesTargetPct}%` }}
                  className="bg-amber-500 h-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
        {step > 1 && step < 4 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all"
          >
            {step === 3 ? 'Generate Risk Model' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-xl shadow-emerald-500/30 transition-all"
          >
            <TrendingUp className="w-4 h-4" /> Build & Activate Portfolio
          </button>
        )}
      </div>
    </div>
  );
};

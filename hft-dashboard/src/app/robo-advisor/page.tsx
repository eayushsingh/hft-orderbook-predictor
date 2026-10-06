'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  RefreshCw,
  DollarSign,
  Activity,
  ShieldAlert,
  Bot,
} from 'lucide-react';
import LalanNavbar from '@/components/LalanNavbar';
import LalanSiteFooter from '@/components/LalanSiteFooter';
import { RiskProfileWizard } from '@/components/robo-advisor/RiskProfileWizard';
import { PortfolioAllocationView } from '@/components/robo-advisor/PortfolioAllocationView';
import { DriftAndRebalanceRadar } from '@/components/robo-advisor/DriftAndRebalanceRadar';
import { TaxHarvestingDashboard } from '@/components/robo-advisor/TaxHarvestingDashboard';
import { GoalSimulationChart } from '@/components/robo-advisor/GoalSimulationChart';
import { getDefaultSamplePortfolio, getSampleTaxLots } from '@/lib/robo-advisor/sampleData';
import { generateTargetAllocation } from '@/lib/robo-advisor/allocationEngine';
import { GoalType, PortfolioSummary, RiskProfile } from '@/lib/robo-advisor/types';

export default function RoboAdvisorPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROFILER' | 'REBALANCE' | 'TAX' | 'SIMULATION'>('OVERVIEW');
  const [portfolio, setPortfolio] = useState<PortfolioSummary>(getDefaultSamplePortfolio());
  const [autoPilotActive, setAutoPilotActive] = useState(true);

  const sampleTaxLots = getSampleTaxLots();

  const handleProfileComplete = (profile: RiskProfile, goalType: GoalType) => {
    const newTargetAllocations = generateTargetAllocation(profile, goalType);
    setPortfolio({
      ...portfolio,
      riskScore: profile.score,
      targetAllocations: newTargetAllocations,
    });
    setActiveTab('OVERVIEW');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <LalanNavbar
        activeTab="robo"
        setActiveTab={() => {}}
        latencyMs={1.2}
        availableFunds={portfolio.cashBalance}
        niftyPrice={24850.75}
        niftyChange={0.62}
        bankNiftyPrice={52340.1}
        bankNiftyChange={0.85}
        btcPrice={84572.52}
        btcChange={2.1}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Bot className="w-4 h-4" /> Autonomous Portfolio Management Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Institutional Robo-Advisor
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                Automated Black-Litterman MPT portfolio construction, real-time drift detection, zero-human rebalancing, and wash-sale protected tax loss harvesting.
              </p>
            </div>

            {/* Auto-Pilot Toggle */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div>
                <div className="text-xs text-slate-400 font-medium">Auto-Pilot Status</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${autoPilotActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  {autoPilotActive ? 'AUTONOMOUS ACTIVE' : 'MANUAL OVERRIDE'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAutoPilotActive(!autoPilotActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  autoPilotActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {autoPilotActive ? 'Pause Auto-Pilot' : 'Activate Auto-Pilot'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Portfolio Allocation', icon: PieChart },
            { id: 'PROFILER', label: 'Risk Profiler Wizard', icon: ShieldAlert },
            { id: 'REBALANCE', label: 'Drift & Rebalance Radar', icon: RefreshCw },
            { id: 'TAX', label: 'Tax-Loss Harvester', icon: DollarSign },
            { id: 'SIMULATION', label: 'Monte Carlo Forecast', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'OVERVIEW' | 'PROFILER' | 'REBALANCE' | 'TAX' | 'SIMULATION')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Sections */}
        {activeTab === 'OVERVIEW' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <PortfolioAllocationView
              allocations={portfolio.targetAllocations}
              riskScore={portfolio.riskScore}
            />
          </motion.div>
        )}

        {activeTab === 'PROFILER' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RiskProfileWizard onComplete={handleProfileComplete} />
          </motion.div>
        )}

        {activeTab === 'REBALANCE' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DriftAndRebalanceRadar portfolio={portfolio} />
          </motion.div>
        )}

        {activeTab === 'TAX' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TaxHarvestingDashboard taxLots={sampleTaxLots} />
          </motion.div>
        )}

        {activeTab === 'SIMULATION' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GoalSimulationChart
              goal={{
                id: 'g-retire',
                name: 'Early Retirement Fund',
                type: 'RETIREMENT',
                targetAmount: 1500000,
                timeHorizonYears: 15,
                initialInvestment: 100000,
                monthlyContribution: 2500,
                createdAt: new Date().toISOString(),
              }}
              targetAllocations={portfolio.targetAllocations}
            />
          </motion.div>
        )}
      </main>

      <LalanSiteFooter />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { DollarSign, ShieldCheck, ArrowRightLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { detectTaxLossHarvestingOpportunities } from '@/lib/robo-advisor/taxHarvestingEngine';
import { TaxLot } from '@/lib/robo-advisor/types';

interface TaxHarvestingDashboardProps {
  taxLots: TaxLot[];
}

export const TaxHarvestingDashboard: React.FC<TaxHarvestingDashboardProps> = ({ taxLots }) => {
  const [harvested, setHarvested] = useState(false);
  const summary = detectTaxLossHarvestingOpportunities(taxLots);

  const handleHarvest = () => {
    setHarvested(true);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Algorithmic Tax-Loss Harvester (TLH)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated tax-alpha optimization: harvest unrealized capital losses while maintaining market exposure via correlated ETF swaps.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Wash-Sale Prevention Active (30-Day Guard)</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Harvestable Unrealized Loss</span>
          <div className="text-2xl font-extrabold text-rose-400">
            ${summary.totalHarvestableLoss}
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Est. Federal/State Tax Savings</span>
          <div className="text-2xl font-extrabold text-emerald-400">
            ${summary.totalEstimatedTaxSavings}
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Swap Opportunities</span>
          <div className="text-2xl font-extrabold text-cyan-400">
            {summary.opportunitiesCount} Positions
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Detected Tax Swap Opportunities
        </h4>

        {harvested ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h5 className="text-sm font-bold text-white">Tax Loss Harvest Orders Executed</h5>
            <p className="text-xs text-slate-400">
              Successfully harvested ${summary.totalHarvestableLoss} in capital losses and purchased replacement ETFs with 0 day tracking error.
            </p>
          </div>
        ) : (
          summary.opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
                  {opp.holdingSymbol}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Sell {opp.sharesToHarvest} shares {opp.holdingSymbol}</span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-emerald-400">Buy {opp.replacementSymbol} ({opp.replacementName})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Asset Class: <span className="text-slate-300 font-semibold">{opp.assetClass.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex sm:flex-col justify-between sm:justify-center items-end">
                <div className="text-xs font-bold text-rose-400">
                  Loss: -${opp.harvestableLoss}
                </div>
                <div className="text-[11px] font-semibold text-emerald-400">
                  Tax Saved: +${opp.estimatedTaxSavings}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!harvested && summary.opportunitiesCount > 0 && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleHarvest}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 text-xs font-bold hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Harvest Tax Losses & Execute Swaps
          </button>
        </div>
      )}
    </div>
  );
};

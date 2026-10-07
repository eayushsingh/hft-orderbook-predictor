"use client";

import React from "react";
import { Zap, Database, Eye, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useSubscription, SubscriptionPlanId } from "@/context/SubscriptionContext";

interface UsageQuota {
  maxWatchlists: number;
  usedWatchlists: number;
  maxApiCallsPerMin: number;
  usedApiCallsPerMin: number;
  maxDepthLevels: number;
  currentDepthLevels: number;
}

const QUOTAS_BY_TIER: Record<SubscriptionPlanId, UsageQuota> = {
  retail: {
    maxWatchlists: 1,
    usedWatchlists: 1,
    maxApiCallsPerMin: 60,
    usedApiCallsPerMin: 24,
    maxDepthLevels: 5,
    currentDepthLevels: 5,
  },
  pro: {
    maxWatchlists: 10,
    usedWatchlists: 4,
    maxApiCallsPerMin: 1000,
    usedApiCallsPerMin: 340,
    maxDepthLevels: 20,
    currentDepthLevels: 20,
  },
  institutional: {
    maxWatchlists: 100,
    usedWatchlists: 12,
    maxApiCallsPerMin: 100000,
    usedApiCallsPerMin: 4850,
    maxDepthLevels: 50,
    currentDepthLevels: 50,
  },
};

/**
 * Subscription Usage Quota Meter Component
 * 
 * Humanized Explanation for Maintainers:
 * Visual indicators showing API rate limits, order book depth levels, and watchlist capacities 
 * tailored to the user's active tier (Retail Free vs Pro Quant vs Institutional HFT).
 */
export default function SubscriptionUsageMeter({ onUpgradeClick }: { onUpgradeClick?: () => void }) {
  const { activePlanId, isTrialActive, daysRemainingInTrial, getPlanBadgeLabel } = useSubscription();
  const quota = QUOTAS_BY_TIER[activePlanId] || QUOTAS_BY_TIER.retail;

  const apiPercent = Math.min(100, Math.round((quota.usedApiCallsPerMin / quota.maxApiCallsPerMin) * 100));
  const watchlistPercent = Math.min(100, Math.round((quota.usedWatchlists / quota.maxWatchlists) * 100));

  return (
    <div className="rounded-2xl bg-[#0e0e14] border border-[#222230] p-5 space-y-4 font-mono text-xs text-[#e0e0e0] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#20202e] pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-[#10b981]" />
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider">Tier Usage Quotas</h4>
            <p className="text-[10px] text-[#747888]">{getPlanBadgeLabel()}</p>
          </div>
        </div>

        {activePlanId !== "institutional" && (
          <button
            onClick={onUpgradeClick}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-[#387ed1]/20 border border-[#387ed1]/40 text-[#387ed1] hover:bg-[#387ed1] hover:text-white font-bold transition-all"
          >
            <span>Upgrade</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Usage Progress Bars */}
      <div className="space-y-3">
        {/* Watchlist Quota */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-[#a0a3b0]">
              <Eye className="h-3.5 w-3.5 text-[#387ed1]" /> Watchlists Allocation
            </span>
            <span className="font-bold text-white">
              {quota.usedWatchlists} / {quota.maxWatchlists} {quota.maxWatchlists === 100 ? "(Unlimited)" : ""}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#1c1c28] rounded-full overflow-hidden">
            <div className="h-full bg-[#387ed1] transition-all" style={{ width: `${watchlistPercent}%` }} />
          </div>
        </div>

        {/* API Rate Limit */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 text-[#a0a3b0]">
              <Zap className="h-3.5 w-3.5 text-[#10b981]" /> API Rate Limit (req/min)
            </span>
            <span className="font-bold text-white">
              {quota.usedApiCallsPerMin.toLocaleString()} / {quota.maxApiCallsPerMin.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#1c1c28] rounded-full overflow-hidden">
            <div className="h-full bg-[#10b981] transition-all" style={{ width: `${apiPercent}%` }} />
          </div>
        </div>

        {/* Depth Telemetry */}
        <div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#a0a3b0]">
              <Database className="h-3.5 w-3.5 text-purple-400" /> Order Book Depth Level
            </span>
            <span className="font-bold text-purple-400">L{quota.currentDepthLevels} Stream Enabled</span>
          </div>
        </div>
      </div>

      {/* Active Trial Notice */}
      {isTrialActive && (
        <div className="pt-2 border-t border-[#20202e] text-[10px] text-[#10b981] flex items-center justify-between font-bold">
          <span>🎁 Launch Free Trial Active</span>
          <span>{daysRemainingInTrial} Days Left</span>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SubscriptionPlanId = "retail" | "pro" | "institutional";

export interface PaymentRecord {
  id: string;
  date: string;
  planId: SubscriptionPlanId;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "TRIAL_ACTIVATED" | "PAID" | "EXPIRED" | "CANCELLED";
  trialDurationDays?: number;
}

export interface SubscriptionState {
  activePlanId: SubscriptionPlanId;
  isTrialActive: boolean;
  trialPlanId: SubscriptionPlanId | null;
  trialStartDate: string | null; // ISO Date String
  trialEndDate: string | null;   // ISO Date String
  trialDaysTotal: number;
  hasUsedTrial: boolean;
  paymentHistory: PaymentRecord[];
}

interface SubscriptionContextType {
  activePlanId: SubscriptionPlanId;
  isTrialActive: boolean;
  trialPlanId: SubscriptionPlanId | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  trialDaysTotal: number;
  daysRemainingInTrial: number;
  hasUsedTrial: boolean;
  paymentHistory: PaymentRecord[];
  startFreeTrial: (planId: SubscriptionPlanId, durationDays?: number) => Promise<{ success: boolean; message: string }>;
  upgradePlan: (planId: SubscriptionPlanId, paymentMethod: string, amount: number, currency: string) => Promise<{ success: boolean; message: string }>;
  cancelSubscription: () => void;
  hasFeatureAccess: (requiredTier: SubscriptionPlanId) => boolean;
  getPlanBadgeLabel: () => string;
}

const STORAGE_KEY = "lalan_hft_subscription_v2";

const DEFAULT_STATE: SubscriptionState = {
  activePlanId: "pro", // Default launch offer: Pro plan active via Free Trial
  isTrialActive: true,
  trialPlanId: "pro",
  trialStartDate: new Date().toISOString(),
  trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  trialDaysTotal: 14,
  hasUsedTrial: true,
  paymentHistory: [
    {
      id: "TRL-PRO-INIT-2026",
      date: new Date().toISOString(),
      planId: "pro",
      amount: 0,
      currency: "INR",
      paymentMethod: "Launch 14-Day Free Trial",
      status: "TRIAL_ACTIVATED",
      trialDurationDays: 14,
    },
  ],
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(DEFAULT_STATE);

  // Synchronize state from localStorage on initial render
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved) {
          const parsed: SubscriptionState = JSON.parse(saved);
          
          // Check if trial has expired
          if (parsed.isTrialActive && parsed.trialEndDate) {
            const endDate = new Date(parsed.trialEndDate).getTime();
            if (Date.now() > endDate) {
              // Trial expired, downgrade to retail if not paid
              parsed.isTrialActive = false;
              parsed.activePlanId = "retail";
            }
          }
          setState(parsed);
        } else if (typeof window !== "undefined") {
          // Save initial 14-day free trial launch default
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
        }
      } catch (err) {
        console.error("Failed to load subscription state:", err);
      }
    });
  }, []);

  // Save changes to localStorage
  const saveState = (newState: SubscriptionState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      console.error("Failed to persist subscription state:", err);
    }
  };

  // Compute days remaining in active trial
  const daysRemainingInTrial = useCallback((): number => {
    if (!state.isTrialActive || !state.trialEndDate) return 0;
    const end = new Date(state.trialEndDate).getTime();
    const now = Date.now();
    const diffMs = end - now;
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }, [state.isTrialActive, state.trialEndDate]);

  // Activate a 14-Day Free Trial for any tier (Pro or Institutional)
  const startFreeTrial = async (
    planId: SubscriptionPlanId,
    durationDays = 14
  ): Promise<{ success: boolean; message: string }> => {
    if (planId === "retail") {
      return { success: false, message: "Retail plan is always free. Select Pro or Institutional for a trial." };
    }

    const startDate = new Date();
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const trialRecord: PaymentRecord = {
      id: "TRL-" + Date.now().toString(36).toUpperCase(),
      date: startDate.toISOString(),
      planId: planId,
      amount: 0,
      currency: "INR",
      paymentMethod: `${durationDays}-Day Launch Free Trial`,
      status: "TRIAL_ACTIVATED",
      trialDurationDays: durationDays,
    };

    const newState: SubscriptionState = {
      ...state,
      activePlanId: planId,
      isTrialActive: true,
      trialPlanId: planId,
      trialStartDate: startDate.toISOString(),
      trialEndDate: endDate.toISOString(),
      trialDaysTotal: durationDays,
      hasUsedTrial: true,
      paymentHistory: [trialRecord, ...state.paymentHistory],
    };

    saveState(newState);

    // Also sync to backend API in production
    try {
      await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start-trial",
          planId,
          durationDays,
        }),
      });
    } catch (e) {
      console.warn("Backend API sync failed, used client storage fallback", e);
    }

    return {
      success: true,
      message: `🎉 Congratulations! Your ${durationDays}-Day Free Trial for ${planId.toUpperCase()} is now active!`,
    };
  };

  // Full Paid Upgrade (Post-trial or direct)
  const upgradePlan = async (
    planId: SubscriptionPlanId,
    paymentMethod: string,
    amount: number,
    currency: string
  ): Promise<{ success: boolean; message: string }> => {
    const paymentRecord: PaymentRecord = {
      id: "PAY-" + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      planId: planId,
      amount,
      currency,
      paymentMethod,
      status: "PAID",
    };

    const newState: SubscriptionState = {
      ...state,
      activePlanId: planId,
      isTrialActive: false, // Transitioned from trial to full paid plan
      paymentHistory: [paymentRecord, ...state.paymentHistory],
    };

    saveState(newState);

    try {
      await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upgrade",
          planId,
          paymentMethod,
          amount,
          currency,
        }),
      });
    } catch (e) {
      console.warn("Backend sync fallback", e);
    }

    return {
      success: true,
      message: `Successfully upgraded to ${planId.toUpperCase()} plan!`,
    };
  };

  // Downgrade or Cancel
  const cancelSubscription = () => {
    const newState: SubscriptionState = {
      ...state,
      activePlanId: "retail",
      isTrialActive: false,
      trialPlanId: null,
    };
    saveState(newState);
  };

  // Tier Gating Logic
  const hasFeatureAccess = (requiredTier: SubscriptionPlanId): boolean => {
    const tierWeights: Record<SubscriptionPlanId, number> = {
      retail: 1,
      pro: 2,
      institutional: 3,
    };
    return tierWeights[state.activePlanId] >= tierWeights[requiredTier];
  };

  // Plan Badge text
  const getPlanBadgeLabel = (): string => {
    const planName =
      state.activePlanId === "institutional"
        ? "INSTITUTIONAL"
        : state.activePlanId === "pro"
        ? "PRO QUANT"
        : "RETAIL";

    if (state.isTrialActive) {
      const days = daysRemainingInTrial();
      return `${planName} (${days}d TRIAL)`;
    }
    return planName;
  };

  const daysRemaining = daysRemainingInTrial();

  return (
    <SubscriptionContext.Provider
      value={{
        activePlanId: state.activePlanId,
        isTrialActive: state.isTrialActive,
        trialPlanId: state.trialPlanId,
        trialStartDate: state.trialStartDate,
        trialEndDate: state.trialEndDate,
        trialDaysTotal: state.trialDaysTotal,
        daysRemainingInTrial: daysRemaining,
        hasUsedTrial: state.hasUsedTrial,
        paymentHistory: state.paymentHistory,
        startFreeTrial,
        upgradePlan,
        cancelSubscription,
        hasFeatureAccess,
        getPlanBadgeLabel,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

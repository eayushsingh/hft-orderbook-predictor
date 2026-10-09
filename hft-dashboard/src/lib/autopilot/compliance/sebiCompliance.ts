/**
 * REGULATORY & STATUTORY COMPLIANCE MODULE
 * (SEBI Algorithmic Trading Guidelines & Risk Disclosures)
 */

export const SEBI_ALGO_DISCLOSURES = {
  regulatoryStatus: "NON_SEBI_REGISTERED_SELF_DIRECTED_TOOL",
  statutoryNotice: `
    RISK DISCLOSURE & STATUTORY NOTICE (SEBI / EXCHANGE COMPLIANCE):
    1. Self-Directed Algorithmic System: Nifty 50 Autopilot is an automated rule-based decision support and execution system for self-directed traders. It is NOT a SEBI-registered Portfolio Management Service (PMS), Research Analyst (RA), or Investment Adviser (RIA).
    2. No Return Guarantees: Algorithmic trading and equity investments are subject to market risks. There are NO guaranteed returns, profit assurances, or price predictions.
    3. Stop-Loss & Fill Disclaimers: Stop-loss orders and limit orders do not guarantee exact fill prices during circuit freezes, price gaps, or extreme volatility. Execution is subject to exchange liquidity and slippage.
    4. Broker API Compliance: Users connecting Angel One SmartAPI or Zerodha Kite Connect must comply with respective broker API terms, static IP whitelisting rules, and exchange algo guidelines (SEBI Circular SEBI/HO/MRD/DP/CIR/P/2018/62).
    5. Cash Equities Only: The system operates strictly on verified NSE Nifty 50 cash equity constituents. Bank Nifty, index derivatives, stock futures/options, and crypto are disallowed.
  `,
  mandatoryChecklist: [
    "I understand that trading in cash equities involves risk of capital loss.",
    "I acknowledge that automated stop losses do not guarantee slippage-free execution in gap-down openings.",
    "I confirm that live API keys and credentials are provided at my own discretion under my broker account terms.",
    "I acknowledge that this software does not constitute investment advice or solicitation.",
  ],
};

export class SebiComplianceValidator {
  public static validateLiveTradingReadiness(
    hasDisclaimerAccepted: boolean,
    broker: string,
    hasCredentials: boolean
  ): { ready: boolean; blockers: string[] } {
    const blockers: string[] = [];

    if (!hasDisclaimerAccepted) {
      blockers.push("Mandatory SEBI Algo Trading Risk Disclosure has not been accepted.");
    }

    if (broker !== "ANGEL_ONE" && broker !== "ZERODHA") {
      blockers.push(`Selected broker '${broker}' is not certified for live Indian cash equity execution.`);
    }

    if (!hasCredentials) {
      blockers.push(`Active server-side broker API credentials for ${broker} are missing.`);
    }

    return {
      ready: blockers.length === 0,
      blockers,
    };
  }
}

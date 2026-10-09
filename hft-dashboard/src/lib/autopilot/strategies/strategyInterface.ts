import {
  AutopilotConfig,
  AutopilotPosition,
  StrategySignal,
  StrategyType,
  TransactionCostBreakdown,
} from "../types";
import { MarketAnalysisSnapshot } from "../analysis/marketAnalysisEngine";

export interface IAutopilotStrategy {
  readonly version: string;
  readonly type: StrategyType;
  readonly description: string;

  /**
   * Evaluates universe market snapshot against active positions and capital
   * to produce deterministic signals (BUY, SELL, or NO_TRADE with explicit reason).
   */
  generateSignals(
    snapshot: MarketAnalysisSnapshot,
    config: AutopilotConfig,
    positions: AutopilotPosition[],
    availableFunds: number
  ): StrategySignal[];

  /**
   * Calculates deterministic risk-based share quantity
   */
  calculatePositionSize(
    capital: number,
    riskPerTradePct: number,
    entryPrice: number,
    stopLossPrice: number,
    maxPositionCapPct: number,
    maxOrderValue: number
  ): number;
}

/**
 * INDIAN CASH EQUITY TRANSACTION COST CALCULATOR
 * 
 * Computes exact SEBI / NSE statutory charges and estimated slippage:
 * - Brokerage: ₹0 for delivery / ₹20 for intraday
 * - STT (Securities Transaction Tax): 0.1% on delivery turnover (both buy & sell)
 * - Exchange Turnover Fee (NSE): 0.00345%
 * - SEBI Turnover Charge: 0.0001% (₹10 per Crore)
 * - Stamp Duty: 0.015% (Buy only)
 * - GST: 18% on (Brokerage + Exchange Charges + SEBI Charges)
 * - Slippage: user configured (default 5-15 bps)
 */
export function calculateIndianTransactionCosts(
  price: number,
  quantity: number,
  isBuy: boolean,
  isDelivery: boolean = true,
  slippageBps: number = 10
): TransactionCostBreakdown {
  if (price <= 0 || quantity <= 0) {
    return {
      brokerage: 0,
      stt: 0,
      exchangeTurnover: 0,
      sebiTurnover: 0,
      stampDuty: 0,
      gst: 0,
      totalCharges: 0,
      estimatedSlippage: 0,
      netImpact: 0,
    };
  }

  const turnover = price * quantity;

  // Brokerage: ₹0 for delivery in discounted models (or ₹20 flat)
  const brokerage = isDelivery ? 0 : Math.min(20, turnover * 0.0003);

  // STT: 0.1% on equity delivery buy and sell
  const stt = isDelivery ? turnover * 0.001 : (isBuy ? 0 : turnover * 0.00025);

  // Exchange turnover fee: 0.00345%
  const exchangeTurnover = turnover * 0.0000345;

  // SEBI turnover fee: 0.0001%
  const sebiTurnover = turnover * 0.000001;

  // Stamp duty: 0.015% on buy only
  const stampDuty = isBuy ? turnover * 0.00015 : 0;

  // GST: 18% on (brokerage + exchange + sebi)
  const gst = (brokerage + exchangeTurnover + sebiTurnover) * 0.18;

  const totalCharges = Math.round((brokerage + stt + exchangeTurnover + sebiTurnover + stampDuty + gst) * 100) / 100;

  // Slippage in INR
  const estimatedSlippage = Math.round((turnover * (slippageBps / 10000)) * 100) / 100;
  const netImpact = Math.round((totalCharges + estimatedSlippage) * 100) / 100;

  return {
    brokerage: Math.round(brokerage * 100) / 100,
    stt: Math.round(stt * 100) / 100,
    exchangeTurnover: Math.round(exchangeTurnover * 100) / 100,
    sebiTurnover: Math.round(sebiTurnover * 100) / 100,
    stampDuty: Math.round(stampDuty * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    totalCharges,
    estimatedSlippage,
    netImpact,
  };
}

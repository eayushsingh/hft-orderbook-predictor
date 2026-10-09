import {
  AutopilotConfig,
  AutopilotOrder,
  AutopilotPosition,
  ConstituentRanking,
  StrategySignal,
} from "../types";
import { AutopilotRepository } from "../db/autopilotDb";
import { MarketAnalysisEngine, MarketAnalysisSnapshot } from "../analysis/marketAnalysisEngine";
import { SwingStrategy } from "../strategies/swingStrategy";
import { LongTermStrategy } from "../strategies/longTermStrategy";
import { PortfolioRiskSnapshot, RiskEngine } from "../risk/riskEngine";
import { BrokerFactory } from "../brokers/brokerFactory";
import { OrderManager } from "./orderManager";
import { UniverseService } from "../universe/nifty50Universe";

export interface CycleRunResult {
  timestamp: string;
  config: AutopilotConfig;
  marketSnapshot: MarketAnalysisSnapshot;
  rankings: ConstituentRanking[];
  signals: StrategySignal[];
  createdOrders: AutopilotOrder[];
  executedOrders: AutopilotOrder[];
  rejectedSignals: { signal: StrategySignal; reason: string }[];
  activePositions: AutopilotPosition[];
  portfolioSnapshot: PortfolioRiskSnapshot;
}

export class AutopilotRunner {
  private static swingStrategy = new SwingStrategy();
  private static longTermStrategy = new LongTermStrategy();

  /**
   * Primary Execution Cycle for Nifty 50 Autopilot
   */
  public static async runCycle(): Promise<CycleRunResult> {
    const now = new Date().toISOString();
    const config = AutopilotRepository.getConfig();
    const broker = BrokerFactory.getAdapter(config);

    // 1. Fetch Market Analysis Snapshot
    const snapshot = MarketAnalysisEngine.getMarketSnapshot();

    // 2. Query Broker Funds & Positions
    const fundsResult = await broker.getFunds();
    let activePositions = AutopilotRepository.getPositions();
    const openOrders = AutopilotRepository.getOrders(50).filter(
      (o) => o.status === "PENDING_APPROVAL" || o.status === "PENDING_SUBMISSION" || o.status === "OPEN"
    );

    // 3. Update active position mark-to-market prices and unrealized P&L
    let totalInvestedValue = 0;
    let totalUnrealizedPnl = 0;
    let totalRealizedPnl = 0;

    activePositions = activePositions.map((pos) => {
      const stockData = snapshot.stocksData.get(pos.symbol);
      const currentLtp = stockData ? stockData.ltp : pos.currentLtp;
      const unrealizedPnl = (currentLtp - pos.avgEntryPrice) * pos.quantity;
      const unrealizedPnlPct = pos.avgEntryPrice > 0 ? ((currentLtp - pos.avgEntryPrice) / pos.avgEntryPrice) * 100 : 0;
      const highestPrice = Math.max(pos.highestPriceSinceEntry || pos.avgEntryPrice, currentLtp);

      const updated: AutopilotPosition = {
        ...pos,
        currentLtp,
        unrealizedPnl: Math.round(unrealizedPnl * 100) / 100,
        unrealizedPnlPct: Math.round(unrealizedPnlPct * 100) / 100,
        highestPriceSinceEntry: highestPrice,
        lastUpdatedTimestamp: now,
      };

      AutopilotRepository.savePosition(updated);

      totalInvestedValue += updated.quantity * currentLtp;
      totalUnrealizedPnl += unrealizedPnl;
      totalRealizedPnl += updated.realizedPnl;

      return updated;
    });

    const totalEquity = fundsResult.availableCash + totalInvestedValue;
    const totalDailyPnl = totalRealizedPnl + totalUnrealizedPnl;
    const peakEquity = Math.max(config.capital, totalEquity);
    const currentDrawdownPct = peakEquity > 0 ? Math.max(0, ((peakEquity - totalEquity) / peakEquity) * 100) : 0;

    const portfolioRiskSnapshot: PortfolioRiskSnapshot = {
      totalCapital: config.capital,
      availableCash: fundsResult.availableCash,
      investedValue: totalInvestedValue,
      realizedDailyPnl: totalRealizedPnl,
      unrealizedPnl: totalUnrealizedPnl,
      totalDailyPnl,
      peakEquity,
      currentDrawdownPct,
      activePositions,
      openOrders,
    };

    // 4. Compute Nifty 50 Constituent Rankings
    const constituents = UniverseService.getAllConstituents();
    const rankings: ConstituentRanking[] = [];

    for (const c of constituents) {
      const stock = snapshot.stocksData.get(c.symbol);
      if (!stock) continue;

      const isBullish = stock.ltp > stock.sma50;
      const trend = isBullish ? "BULLISH" : "BEARISH";
      const compositeScore = Math.round(((stock.rsRating * 0.5) + (stock.volumeSurgeRatio * 20) + (stock.changePct * 5)) * 10) / 10;

      let signalStatus: "BUY" | "SELL" | "NO_TRADE" = "NO_TRADE";
      let reason = "Watching market structure";

      if (isBullish && stock.rsRating >= 65 && stock.volumeSurgeRatio >= 1.15) {
        signalStatus = "BUY";
        reason = `RS rating ${stock.rsRating}/100 with ${stock.volumeSurgeRatio.toFixed(2)}x volume surge`;
      } else if (!isBullish && stock.rsRating < 40) {
        signalStatus = "SELL";
        reason = `Lagging index with weak RS rating ${stock.rsRating}/100 below 50-day EMA`;
      } else {
        reason = `RS ${stock.rsRating}/100, volume ${stock.volumeSurgeRatio.toFixed(2)}x (Thresholds: RS>=65, Vol>=1.15x)`;
      }

      rankings.push({
        rank: 0,
        symbol: c.symbol,
        name: c.name,
        sector: c.sector,
        ltp: stock.ltp,
        changePct: stock.changePct,
        rsRating: stock.rsRating,
        trend,
        volumeSurge: stock.volumeSurgeRatio,
        compositeScore,
        signal: signalStatus,
        reason,
        weightagePct: c.weightagePct,
        freshness: stock.freshness,
      });
    }

    rankings.sort((a, b) => b.compositeScore - a.compositeScore);
    rankings.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    AutopilotRepository.saveRankings(rankings);

    // 5. Generate Strategy Signals
    const strategy = config.strategy === "SWING" ? this.swingStrategy : this.longTermStrategy;
    const signals = strategy.generateSignals(snapshot, config, activePositions, fundsResult.availableCash);

    const createdOrders: AutopilotOrder[] = [];
    const executedOrders: AutopilotOrder[] = [];
    const rejectedSignals: { signal: StrategySignal; reason: string }[] = [];

    // 6. Process Actionable Signals through Risk Engine & Execution
    if (config.state !== "KILL_SWITCH_ENGAGED") {
      for (const sig of signals) {
        if (sig.action === "NO_TRADE") {
          continue; // Informational no-trade decision
        }

        const stockData = snapshot.stocksData.get(sig.symbol);

        // Run Independent Risk Check
        const riskChecks = RiskEngine.evaluateRisk(sig, stockData, config, portfolioRiskSnapshot);
        const failedCheck = riskChecks.find((r) => !r.passed);

        if (failedCheck) {
          const rejectReason = failedCheck.rejectReason || `Failed risk check: ${failedCheck.checkName}`;
          rejectedSignals.push({ signal: sig, reason: rejectReason });

          AutopilotRepository.logAudit({
            id: `AUDIT-RISK-REJ-${Date.now().toString(36)}`,
            timestamp: now,
            eventType: "RISK_CHECK_REJECTED",
            severity: "WARNING",
            actor: "RISK_GATEKEEPER",
            symbol: sig.symbol,
            details: `Risk check '${failedCheck.checkName}' rejected signal: ${rejectReason}`,
            metadataJson: JSON.stringify(failedCheck),
          });
          continue;
        }

        // Passed Risk Check - Create Order
        const order = OrderManager.createOrderFromSignal(sig, config);
        createdOrders.push(order);

        if (!config.requireApproval && config.state === "ACTIVE") {
          // Direct execution
          const execResult = await OrderManager.executeOrder(order, broker);
          if (execResult.success) {
            executedOrders.push(execResult.updatedOrder);
          }
        }
      }
    }

    return {
      timestamp: now,
      config,
      marketSnapshot: snapshot,
      rankings,
      signals,
      createdOrders,
      executedOrders,
      rejectedSignals,
      activePositions: AutopilotRepository.getPositions(),
      portfolioSnapshot: portfolioRiskSnapshot,
    };
  }

  /**
   * Engage Emergency Kill Switch
   */
  public static engageKillSwitch(reason: string, actor: string = "OPERATOR"): AutopilotConfig {
    const updated = AutopilotRepository.updateConfig({
      state: "KILL_SWITCH_ENGAGED",
    });

    AutopilotRepository.logAudit({
      id: `AUDIT-KILL-ENGAGE-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      eventType: "KILL_SWITCH_TRIGGERED",
      severity: "CRITICAL",
      actor,
      details: `EMERGENCY KILL SWITCH ENGAGED by ${actor}. Reason: ${reason}`,
    });

    return updated;
  }

  /**
   * Reset Kill Switch back to PAUSED (never directly to LIVE active)
   */
  public static resetKillSwitch(actor: string = "OPERATOR"): AutopilotConfig {
    const updated = AutopilotRepository.updateConfig({
      state: "PAUSED",
    });

    AutopilotRepository.logAudit({
      id: `AUDIT-KILL-RESET-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      eventType: "KILL_SWITCH_RESET",
      severity: "WARNING",
      actor,
      details: `Kill switch reset by ${actor}. Engine set to PAUSED. Operator review required before resuming trading.`,
    });

    return updated;
  }
}

/**
 * NIFTY 50 AUTOPILOT - CONTINUOUS BACKGROUND WORKER DAEMON
 * 
 * For running outside Vercel serverless (e.g. on VM, AWS ECS, or Docker container)
 * to maintain persistent tick streaming, periodic evaluation cycles, and broker reconciliation.
 * 
 * Usage:
 *   npx tsx scripts/autopilot-worker.ts
 */

import { AutopilotRunner } from "../src/lib/autopilot/execution/autopilotRunner";
import { AutopilotRepository } from "../src/lib/autopilot/db/autopilotDb";
import { BrokerFactory } from "../src/lib/autopilot/brokers/brokerFactory";
import { OrderManager } from "../src/lib/autopilot/execution/orderManager";
import { RiskEngine } from "../src/lib/autopilot/risk/riskEngine";

const CYCLE_INTERVAL_MS = 15000; // 15 seconds
let isRunning = true;

async function runWorker() {
  console.log("===============================================================");
  console.log("🚀 NIFTY 50 AUTOPILOT WORKER DAEMON STARTING...");
  console.log("===============================================================");

  const config = AutopilotRepository.getConfig();
  console.log(`[INIT] Config Loaded: Strategy=${config.strategy}, Mode=${config.mode}, Capital=₹${config.capital.toLocaleString("en-IN")}`);

  // Reconcile on boot
  const broker = BrokerFactory.getAdapter(config);
  console.log(`[INIT] Connecting to broker adapter: ${broker.brokerName}...`);
  await OrderManager.reconcileBrokerState(broker);

  console.log(`[LOOP] Starting continuous evaluation cycle (interval: ${CYCLE_INTERVAL_MS / 1000}s)...`);

  while (isRunning) {
    try {
      const currentConfig = AutopilotRepository.getConfig();
      const marketStatus = RiskEngine.isMarketOpen();

      if (currentConfig.state === "KILL_SWITCH_ENGAGED") {
        console.warn(`[WARN] Kill switch is ENGAGED. Cycle skipped at ${new Date().toLocaleTimeString()}`);
      } else if (currentConfig.state === "PAUSED") {
        console.log(`[INFO] Autopilot is PAUSED. Position telemetry active.`);
      } else {
        console.log(`[CYCLE] Running analysis cycle at ${new Date().toLocaleTimeString()} (Market: ${marketStatus.isOpen ? "OPEN" : "CLOSED"})...`);
        const result = await AutopilotRunner.runCycle();
        
        console.log(`[CYCLE RESULT] Scored ${result.rankings.length} Nifty 50 stocks. Signals: ${result.signals.length}, Created Orders: ${result.createdOrders.length}, Active Positions: ${result.activePositions.length}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Worker cycle error";
      console.error(`[ERROR] Cycle execution failed: ${msg}`);
    }

    await new Promise((resolve) => setTimeout(resolve, CYCLE_INTERVAL_MS));
  }

  console.log("🛑 Autopilot Worker daemon stopped gracefully.");
}

// Graceful shutdown handlers
process.on("SIGINT", () => {
  console.log("\n[SHUTDOWN] Received SIGINT. Terminating worker...");
  isRunning = false;
});

process.on("SIGTERM", () => {
  console.log("\n[SHUTDOWN] Received SIGTERM. Terminating worker...");
  isRunning = false;
});

runWorker().catch((err) => {
  console.error("Fatal Worker Daemon Startup Error:", err);
  process.exit(1);
});

import { AutopilotConfig } from "../types";
import { IBrokerAdapter } from "./brokerInterface";
import { AngelOneSmartApiAdapter } from "./angelOneAdapter";
import { ZerodhaKiteAdapter } from "./zerodhaAdapter";
import { PaperBrokerAdapter } from "./paperBrokerAdapter";
import { DemoBrokerAdapter } from "./demoBrokerAdapter";

export class BrokerFactory {
  private static paperSingleton: PaperBrokerAdapter | null = null;
  private static demoSingleton: DemoBrokerAdapter | null = null;

  public static getAdapter(config: AutopilotConfig): IBrokerAdapter {
    if (config.mode === "DEMO") {
      if (!this.demoSingleton) {
        this.demoSingleton = new DemoBrokerAdapter();
      }
      return this.demoSingleton;
    }

    if (config.mode === "PAPER") {
      if (!this.paperSingleton) {
        this.paperSingleton = new PaperBrokerAdapter(config.capital);
      }
      return this.paperSingleton;
    }

    // Live mode
    if (config.broker === "ANGEL_ONE") {
      return new AngelOneSmartApiAdapter("LIVE");
    }

    if (config.broker === "ZERODHA") {
      return new ZerodhaKiteAdapter("LIVE");
    }

    // Default fallback to Paper
    if (!this.paperSingleton) {
      this.paperSingleton = new PaperBrokerAdapter(config.capital);
    }
    return this.paperSingleton;
  }
}

package com.hft.engine;

import com.hft.engine.network.BinanceLiveFeed;
import com.hft.engine.simulator.MarketSimulator;

/**
 * Entry point for the containerized deployment.
 * Now connects to the live production Binance order book stream!
 */
public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("====================================================");
        System.out.println("Starting LIVE HFT Orderbook Predictor Pipeline...");
        System.out.println("====================================================");
        
        // Initialize the core HFT Node with a large Ring Buffer
        HFTNode node = new HFTNode(1024 * 16);
        node.start();

        /*
        // Deprecated: Synthetic Market Simulator logic
        MarketSimulator simulator = new MarketSimulator(node.getPublisher());
        long baselineMidPrice = 10000L;
        System.out.println("Firing synthetic market flows...");
        while (true) {
            simulator.simulate(5000, baselineMidPrice);
            Thread.sleep(500);
        }
        */

        // Connect to the Live Exchange
        System.out.println("Connecting to Live Binance Feed...");
        BinanceLiveFeed liveFeed = new BinanceLiveFeed(node.getPublisher());
        liveFeed.connect();
        
        // Keep the main thread alive indefinitely to listen to the WebSocket
        while (true) {
            Thread.sleep(10000);
        }
    }
}

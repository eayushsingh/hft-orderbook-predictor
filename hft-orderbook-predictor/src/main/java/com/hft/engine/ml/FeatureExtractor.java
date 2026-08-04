package com.hft.engine.ml;

import com.hft.engine.disruptor.OrderCommandEvent;
import com.hft.engine.disruptor.OrderCommandType;
import com.hft.engine.model.Side;
import com.hft.engine.network.MarketDataServer;
import com.lmax.disruptor.EventHandler;

/**
 * Acts as a separate, parallel consumer on the Disruptor Ring Buffer.
 * Extracts Top-of-Book state from the raw event flow and calculates real-time predictive ML features.
 */
public class FeatureExtractor implements EventHandler<OrderCommandEvent> {
    private final MarketDataServer server;
    private long lastBroadcastTime = 0;

    // Internal Level 1 State
    private long bestBidPrice = 0;
    private long bestAskPrice = 0;
    private long bestBidVolume = 0;
    private long bestAskVolume = 0;

    // Computed ML Features
    private double spread = 0.0;
    private double midPrice = 0.0;
    private double orderBookImbalance = 0.0;
    private double microPrice = 0.0;

    /**
     * Used for unit testing without a live network socket.
     */
    public FeatureExtractor() {
        this(null);
    }

    /**
     * Primary constructor linking the parallel consumer to the WebSocket broadcasting layer.
     */
    public FeatureExtractor(MarketDataServer server) {
        this.server = server;
    }

    @Override
    public void onEvent(OrderCommandEvent event, long sequence, boolean endOfBatch) {
        // Fast, naive tracker updating Top-of-Book state strictly via event data
        if (event.getType() == OrderCommandType.ADD) {
            long price = event.getOrder().getPrice();
            long size = event.getOrder().getSize();
            
            if (event.getOrder().getSide() == Side.BUY) {
                if (bestBidPrice == 0 || price > bestBidPrice) {
                    bestBidPrice = price;
                    bestBidVolume = size;
                } else if (price == bestBidPrice) {
                    bestBidVolume += size;
                }
            } else {
                if (bestAskPrice == 0 || price < bestAskPrice) {
                    bestAskPrice = price;
                    bestAskVolume = size;
                } else if (price == bestAskPrice) {
                    bestAskVolume += size;
                }
            }
        }
        
        // Calculate features on every event tick
        calculateFeatures();
    }

    /**
     * Computes structural features based on the microstructural Top-of-Book variables.
     */
    public void calculateFeatures() {
        if (bestBidPrice > 0 && bestAskPrice > 0) {
            spread = (double) bestAskPrice - bestBidPrice;
            midPrice = (bestAskPrice + bestBidPrice) / 2.0;
            
            double totalVolume = (double) bestBidVolume + bestAskVolume;
            if (totalVolume > 0) {
                // OBI ranges from -1 (heavy sell pressure) to +1 (heavy buy pressure)
                orderBookImbalance = (bestBidVolume - bestAskVolume) / totalVolume;
                
                // Volume-weighted Micro-Price
                microPrice = (bestAskVolume * bestBidPrice + bestBidVolume * bestAskPrice) / totalVolume;
            }

            // Broadcast metrics over WebSocket (throttled to max 1 update per 100ms)
            if (server != null) {
                long currentTime = System.currentTimeMillis();
                if (currentTime - lastBroadcastTime >= 100) {
                    server.broadcastDepth(bestBidPrice, bestBidVolume, bestAskPrice, bestAskVolume);
                    server.broadcastAnalytics(spread, midPrice, orderBookImbalance, microPrice);
                    lastBroadcastTime = currentTime;
                }
            }
        }
    }

    // Setters strictly used for isolating Unit Tests
    public void setTopLevel(long bidPrice, long bidVol, long askPrice, long askVol) {
        this.bestBidPrice = bidPrice;
        this.bestBidVolume = bidVol;
        this.bestAskPrice = askPrice;
        this.bestAskVolume = askVol;
    }

    public double getSpread() { return spread; }
    public double getMidPrice() { return midPrice; }
    public double getOrderBookImbalance() { return orderBookImbalance; }
    public double getMicroPrice() { return microPrice; }
}

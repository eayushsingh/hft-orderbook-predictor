package com.hft.engine.ml;

import com.hft.engine.core.OrderBook;
import com.hft.engine.disruptor.OrderCommandEvent;
import com.hft.engine.disruptor.OrderCommandType;
import com.hft.engine.microstructure.IcebergDetector;
import com.hft.engine.model.Side;
import com.hft.engine.network.MarketDataServer;
import com.lmax.disruptor.EventHandler;

/**
 * Ultra Low-Latency parallel consumer on the Disruptor Ring Buffer.
 * Extracts microstructure state, computes Order Book Imbalance (OBI), Volume-Weighted Micro-Price,
 * Volume-Synchronized Probability of Toxicity (VPIN), and AI Predictive Directional Drift.
 * Broadcasts updates with sub-10ms / batch-boundary microsecond timing.
 */
public class FeatureExtractor implements EventHandler<OrderCommandEvent> {
    private final MarketDataServer server;
    private final OrderBook orderBook;
    private final IcebergDetector icebergDetector;
    private long lastBroadcastTime = 0;

    // Internal Level 1 State
    private long bestBidPrice = 0;
    private long bestAskPrice = 0;
    private long bestBidVolume = 0;
    private long bestAskVolume = 0;

    // Volume Bucket Counters for Toxicity (VPIN)
    private long buyVolumeBucket = 0;
    private long sellVolumeBucket = 0;
    private double vpinToxicity = 0.15; // Baseline toxicity

    // Computed ML Features
    private double spread = 0.0;
    private double midPrice = 0.0;
    private double orderBookImbalance = 0.0;
    private double microPrice = 0.0;
    private String signal = "NEUTRAL";
    private double confidence = 0.0;
    private double predictedDriftBps = 0.0;

    public FeatureExtractor() {
        this(null, null);
    }

    public FeatureExtractor(MarketDataServer server) {
        this(server, null);
    }

    public FeatureExtractor(MarketDataServer server, OrderBook orderBook) {
        this.server = server;
        this.orderBook = orderBook;
        this.icebergDetector = new IcebergDetector();
    }

    @Override
    public void onEvent(OrderCommandEvent event, long sequence, boolean endOfBatch) {
        if (event.getType() == OrderCommandType.ADD) {
            long price = event.getOrder().getPrice();
            long size = event.getOrder().getSize();
            boolean isBuy = (event.getOrder().getSide() == Side.BUY);

            if (isBuy) {
                buyVolumeBucket += size;
                if (bestBidPrice == 0 || price > bestBidPrice) {
                    bestBidPrice = price;
                    bestBidVolume = size;
                } else if (price == bestBidPrice) {
                    long prevVol = bestBidVolume;
                    bestBidVolume += size;
                    
                    // Check Iceberg refills
                    IcebergDetector.SignalAlert alert = icebergDetector.checkRefill(price, bestBidVolume, prevVol, true);
                    if (alert != null && server != null) {
                        server.broadcastAlert(alert.getType(), alert.getPrice(), alert.getVolume(), alert.getMessage());
                    }
                }
            } else {
                sellVolumeBucket += size;
                if (bestAskPrice == 0 || price < bestAskPrice) {
                    bestAskPrice = price;
                    bestAskVolume = size;
                } else if (price == bestAskPrice) {
                    long prevVol = bestAskVolume;
                    bestAskVolume += size;
                    
                    IcebergDetector.SignalAlert alert = icebergDetector.checkRefill(price, bestAskVolume, prevVol, false);
                    if (alert != null && server != null) {
                        server.broadcastAlert(alert.getType(), alert.getPrice(), alert.getVolume(), alert.getMessage());
                    }
                }
            }
        }

        // If linked directly to OrderBook, sync authoritative best bid/ask
        if (orderBook != null) {
            long obBid = orderBook.getBestBidPrice();
            long obAsk = orderBook.getBestAskPrice();
            if (obBid > Long.MIN_VALUE) bestBidPrice = obBid;
            if (obAsk < Long.MAX_VALUE) bestAskPrice = obAsk;
        }

        calculateFeatures(endOfBatch);
    }

    public void calculateFeatures() {
        calculateFeatures(true);
    }

    /**
     * Computes quantitative features and broadcasts with sub-10ms latency or batch completion.
     */
    public void calculateFeatures(boolean endOfBatch) {
        if (bestBidPrice > 0 && bestAskPrice > 0 && bestAskPrice > bestBidPrice) {
            spread = (double) bestAskPrice - bestBidPrice;
            midPrice = (bestAskPrice + bestBidPrice) / 2.0;

            double totalVolume = (double) bestBidVolume + bestAskVolume;
            if (totalVolume > 0) {
                // Order Book Imbalance (OBI) [-1.0 to +1.0]
                orderBookImbalance = (bestBidVolume - bestAskVolume) / totalVolume;

                // Micro-Price: Volume-Weighted Mid Price
                microPrice = (bestAskVolume * bestBidPrice + bestBidVolume * bestAskPrice) / totalVolume;

                // Compute VPIN Toxicity
                long totalBucket = buyVolumeBucket + sellVolumeBucket;
                if (totalBucket > 50000) {
                    vpinToxicity = (double) Math.abs(buyVolumeBucket - sellVolumeBucket) / totalBucket;
                    buyVolumeBucket = 0;
                    sellVolumeBucket = 0;
                }

                // Micro-Price Drift (in basis points)
                predictedDriftBps = midPrice > 0 ? ((microPrice - midPrice) / midPrice) * 10000.0 : 0.0;

                // Directional Signal Matrix
                if (orderBookImbalance >= 0.35) {
                    signal = "STRONG BUY";
                    confidence = Math.min(99.4, 50.0 + (orderBookImbalance * 50.0));
                } else if (orderBookImbalance <= -0.35) {
                    signal = "STRONG SELL";
                    confidence = Math.min(99.4, 50.0 + (Math.abs(orderBookImbalance) * 50.0));
                } else if (orderBookImbalance > 0.10) {
                    signal = "BUY";
                    confidence = 50.0 + (orderBookImbalance * 30.0);
                } else if (orderBookImbalance < -0.10) {
                    signal = "SELL";
                    confidence = 50.0 + (Math.abs(orderBookImbalance) * 30.0);
                } else {
                    signal = "NEUTRAL";
                    confidence = 10.0;
                }
            }

            // Sub-10ms ultra low-latency WebSocket broadcast on batch boundaries
            if (server != null) {
                long currentTime = System.currentTimeMillis();
                if (endOfBatch || currentTime - lastBroadcastTime >= 10) {
                    server.broadcastDepth(bestBidPrice, bestBidVolume, bestAskPrice, bestAskVolume);
                    server.broadcastAnalytics(
                        spread,
                        midPrice,
                        orderBookImbalance,
                        microPrice,
                        signal,
                        confidence,
                        vpinToxicity,
                        predictedDriftBps
                    );
                    lastBroadcastTime = currentTime;
                }
            }
        }
    }

    // Direct state setters for Unit Testing
    public void setTopLevel(long bidPrice, long bidVol, long askPrice, long askVol) {
        this.bestBidPrice = bidPrice;
        this.bestBidVolume = bidVol;
        this.bestAskPrice = askPrice;
        this.bestAskVolume = askVol;
        calculateFeatures(true);
    }

    public double getSpread() { return spread; }
    public double getMidPrice() { return midPrice; }
    public double getOrderBookImbalance() { return orderBookImbalance; }
    public double getMicroPrice() { return microPrice; }
    public String getSignal() { return signal; }
    public double getConfidence() { return confidence; }
    public double getVpinToxicity() { return vpinToxicity; }
    public double getPredictedDriftBps() { return predictedDriftBps; }
}

package com.hft.engine.network;

/**
 * Unified Exchange Data Feed Interface.
 * Standardizes WebSocket and binary feeds across Binance, DhanHQ, Zerodha, Upstox, and simulated feeds.
 */
public interface ExchangeFeedAdapter {
    /**
     * Connects to the exchange market data feed.
     */
    void connectFeed();

    /**
     * Disconnects safely from the feed.
     */
    void disconnectFeed();

    /**
     * Returns whether the socket/feed is currently connected and active.
     */
    boolean isConnected();

    /**
     * Gets the identifier name of this market data feed.
     */
    String getFeedName();
}

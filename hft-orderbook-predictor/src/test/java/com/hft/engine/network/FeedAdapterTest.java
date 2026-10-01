package com.hft.engine.network;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class FeedAdapterTest {

    @Test
    public void testDhanFeedAdapterStandbyMode() {
        DhanFeedAdapter adapter = new DhanFeedAdapter(null, "CLIENT_123", "");
        assertFalse(adapter.isConnected());
        assertEquals("DhanHQ Direct L2 Feed (NSE/BSE)", adapter.getFeedName());
        
        adapter.connectFeed();
        assertFalse(adapter.isConnected()); // Standby mode due to empty access token
    }

    @Test
    public void testZerodhaKiteFeedAdapterStandbyMode() {
        ZerodhaKiteFeedAdapter adapter = new ZerodhaKiteFeedAdapter(null, "", "");
        assertFalse(adapter.isConnected());
        assertEquals("Zerodha Kite Connect Ticker", adapter.getFeedName());
        
        adapter.connectFeed();
        assertFalse(adapter.isConnected());
    }
}

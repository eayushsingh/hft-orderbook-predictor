package com.hft.engine.ml;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class FeatureExtractorTest {

    @Test
    public void testCalculateFeatures() {
        FeatureExtractor extractor = new FeatureExtractor();
        
        // Setup mock level 1 book:
        // Bid: Price 1000, Volume 80 (Heavy bid pressure)
        // Ask: Price 1010, Volume 20 (Weak ask pressure)
        extractor.setTopLevel(1000L, 80L, 1010L, 20L);
        extractor.calculateFeatures();

        // Spread = 1010 - 1000 = 10
        assertEquals(10.0, extractor.getSpread(), 0.001);
        
        // Mid Price = (1010 + 1000) / 2 = 1005
        assertEquals(1005.0, extractor.getMidPrice(), 0.001);
        
        // Order Book Imbalance (OBI) = (80 - 20) / (80 + 20) = 60 / 100 = 0.6
        assertEquals(0.6, extractor.getOrderBookImbalance(), 0.001);
        
        // Micro-Price = (20 * 1000 + 80 * 1010) / 100 = (20000 + 80800) / 100 = 1008
        assertEquals(1008.0, extractor.getMicroPrice(), 0.001);
    }
}

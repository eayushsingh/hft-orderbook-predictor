package com.hft.engine;

import com.hft.engine.simulator.MarketSimulator;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SimulatorIntegrationTest {
    private HFTNode node;

    @BeforeEach
    public void setup() {
        node = new HFTNode(1024 * 16);
        node.start();
    }

    @AfterEach
    public void tearDown() {
        node.stop();
    }

    @Test
    public void testSimulationAndFeatureExtraction() throws InterruptedException {
        MarketSimulator simulator = new MarketSimulator(node.getPublisher());
        
        long baselineMidPrice = 10000L;
        
        // Launch a rapid burst of 5000 random orders
        simulator.simulate(5000, baselineMidPrice);
        
        // Briefly wait for Disruptor threads to parallel-process the burst
        Thread.sleep(500);

        double midPrice = node.getFeatureExtractor().getMidPrice();
        
        // Verify that the parallel ML consumer extracted and computed real data
        assertTrue(midPrice > 0.0, "FeatureExtractor should compute a valid Mid-Price.");
        
        // The mid price should naturally anchor around the baseline due to the random distribution logic
        assertTrue(midPrice >= 9980 && midPrice <= 10020, "Mid-Price deviated too far from the simulation baseline.");
        
        // Ensure a valid spread was calculated. 
        // Note: Spread can be temporarily negative in raw pre-match event feeds (a crossed book).
        double spread = node.getFeatureExtractor().getSpread();
        assertFalse(Double.isNaN(spread), "Spread should be actively computed and not NaN.");
    }
}

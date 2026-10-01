package com.hft.engine.microstructure;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class IcebergDetectorTest {
    private IcebergDetector detector;

    @BeforeEach
    public void setUp() {
        detector = new IcebergDetector();
    }

    @Test
    public void testIcebergDetectionOnBuyRefills() {
        long price = 100000;
        
        // 1st refill
        IcebergDetector.SignalAlert alert1 = detector.checkRefill(price, 50, 10, true);
        assertNull(alert1);

        // 2nd refill
        IcebergDetector.SignalAlert alert2 = detector.checkRefill(price, 60, 20, true);
        assertNull(alert2);

        // 3rd refill threshold reached
        IcebergDetector.SignalAlert alert3 = detector.checkRefill(price, 70, 30, true);
        assertNotNull(alert3);
        assertEquals("ICEBERG_BUY", alert3.getType());
        assertEquals(price, alert3.getPrice());
        assertTrue(alert3.getMessage().contains("Refilled 3x"));
    }

    @Test
    public void testWallDetection() {
        long price = 105000;
        long volume = 50000;
        double avgVolume = 10000;

        IcebergDetector.SignalAlert alert = detector.checkWall(price, volume, avgVolume, false);
        assertNotNull(alert);
        assertEquals("ASK_WALL", alert.getType());
        assertTrue(alert.getMessage().contains("Ask Wall Resistance"));
    }
}

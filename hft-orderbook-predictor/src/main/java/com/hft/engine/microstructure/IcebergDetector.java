package com.hft.engine.microstructure;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Institutional Iceberg & Spoofing Wall Detector.
 * Identifies hidden liquidity refills and high-frequency spoofing order walls
 * by tracking fill-to-refill patterns and abnormal volume concentrations.
 */
public class IcebergDetector {
    private final Map<Long, Integer> bidRefillCounts = new ConcurrentHashMap<>();
    private final Map<Long, Integer> askRefillCounts = new ConcurrentHashMap<>();
    
    private static final int ICEBERG_REFILL_THRESHOLD = 3;
    private static final double WALL_MULTIPLIER = 4.0; // Volume > 4x avg is flagged as wall

    public static class SignalAlert {
        private final String type; // "ICEBERG_BUY", "ICEBERG_SELL", "SPOOF_BUY_WALL", "SPOOF_ASK_WALL", "NORMAL"
        private final long price;
        private final long volume;
        private final String message;
        private final long timestamp;

        public SignalAlert(String type, long price, long volume, String message) {
            this.type = type;
            this.price = price;
            this.volume = volume;
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getType() { return type; }
        public long getPrice() { return price; }
        public long getVolume() { return volume; }
        public String getMessage() { return message; }
        public long getTimestamp() { return timestamp; }
    }

    /**
     * Inspects a price level update for hidden refill patterns (Iceberg orders).
     */
    public SignalAlert checkRefill(long price, long newVolume, long prevVolume, boolean isBuy) {
        if (newVolume > prevVolume && prevVolume > 0) {
            Map<Long, Integer> map = isBuy ? bidRefillCounts : askRefillCounts;
            int count = map.getOrDefault(price, 0) + 1;
            map.put(price, count);

            if (count >= ICEBERG_REFILL_THRESHOLD) {
                String sideStr = isBuy ? "BUY (Bid)" : "SELL (Ask)";
                String typeStr = isBuy ? "ICEBERG_BUY" : "ICEBERG_SELL";
                return new SignalAlert(
                    typeStr,
                    price,
                    newVolume,
                    "Institutional Iceberg Order Detected on " + sideStr + " at price " + price + " (Refilled " + count + "x)"
                );
            }
        }
        return null;
    }

    /**
     * Checks if a level volume constitutes a massive order book liquidity wall (potential spoof or real support/resistance).
     */
    public SignalAlert checkWall(long price, long volume, double averageVolume, boolean isBuy) {
        if (averageVolume > 0 && volume >= averageVolume * WALL_MULTIPLIER) {
            String sideStr = isBuy ? "Buy Wall Support" : "Ask Wall Resistance";
            String typeStr = isBuy ? "BUY_WALL" : "ASK_WALL";
            return new SignalAlert(
                typeStr,
                price,
                volume,
                "Massive " + sideStr + " of " + volume + " units detected at " + price
            );
        }
        return null;
    }

    public void clear() {
        bidRefillCounts.clear();
        askRefillCounts.clear();
    }
}

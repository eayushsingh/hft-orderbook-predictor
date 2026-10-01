package com.hft.engine.simulator;

import com.hft.engine.disruptor.OrderCommandPublisher;
import com.hft.engine.model.OrderType;
import com.hft.engine.model.Side;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * High-Throughput Historical Tick Replay & Backtester Engine.
 * Reads recorded Level 2 order book tick datasets (CSV format) and streams them
 * through the LMAX Disruptor ring buffer at configurable playback speeds (1x to Max Throughput).
 */
public class TickReplayEngine {
    private final OrderCommandPublisher publisher;

    public TickReplayEngine(OrderCommandPublisher publisher) {
        this.publisher = publisher;
    }

    /**
     * Replays a dataset file.
     * Expected CSV format: timestampMs,side(BUY/SELL),priceScaled,quantity,orderId
     */
    public long replayCsvFile(File file, double speedMultiplier) throws IOException, InterruptedException {
        if (!file.exists()) {
            System.err.println("[TickReplayEngine] File not found: " + file.getAbsolutePath());
            return 0;
        }

        long ticksProcessed = 0;
        long lastTimestamp = 0;

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine(); // Header line
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;

                String[] parts = line.split(",");
                if (parts.length < 4) continue;

                long timestamp = Long.parseLong(parts[0]);
                Side side = "BUY".equalsIgnoreCase(parts[1]) ? Side.BUY : Side.SELL;
                long price = Long.parseLong(parts[2]);
                long quantity = Long.parseLong(parts[3]);
                long orderId = parts.length >= 5 ? Long.parseLong(parts[4]) : (ticksProcessed + 1);

                // Throttle simulation based on timestamp deltas if speedMultiplier > 0
                if (speedMultiplier > 0 && lastTimestamp > 0 && timestamp > lastTimestamp) {
                    long delta = (long) ((timestamp - lastTimestamp) / speedMultiplier);
                    if (delta > 0 && delta < 5000) {
                        Thread.sleep(delta);
                    }
                }
                lastTimestamp = timestamp;

                publisher.publishAddOrder(orderId, price, quantity, side, OrderType.LIMIT, timestamp);
                ticksProcessed++;
            }
        }

        System.out.println("[TickReplayEngine] Completed replaying " + ticksProcessed + " ticks from dataset.");
        return ticksProcessed;
    }
}

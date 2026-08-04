package com.hft.engine.simulator;

import com.hft.engine.disruptor.OrderCommandPublisher;
import com.hft.engine.model.OrderType;
import com.hft.engine.model.Side;
import java.util.Random;

/**
 * Simulates a stochastic, noisy high-frequency market data feed.
 */
public class MarketSimulator {
    private final OrderCommandPublisher publisher;
    private final Random random;

    public MarketSimulator(OrderCommandPublisher publisher) {
        this.publisher = publisher;
        this.random = new Random();
    }

    /**
     * Fires a burst of random orders around a given baseline mid-price.
     * @param iterations The number of orders to simulate.
     * @param baselineMidPrice The arbitrary starting mid-price axis.
     */
    public void simulate(int iterations, long baselineMidPrice) {
        long orderIdCounter = 1;
        for (int i = 0; i < iterations; i++) {
            boolean isBuy = random.nextBoolean();
            
            // Introduce a random spread / noise up to +/- 5 ticks away from mid
            long priceOffset = random.nextInt(10) - 5; 
            long price = baselineMidPrice + priceOffset;
            
            // Random sizes heavily shifting market pressure
            long size = 10 + random.nextInt(100);
            
            Side side = isBuy ? Side.BUY : Side.SELL;
            publisher.publishAddOrder(orderIdCounter++, price, size, side, OrderType.LIMIT, System.currentTimeMillis());
        }
    }
}

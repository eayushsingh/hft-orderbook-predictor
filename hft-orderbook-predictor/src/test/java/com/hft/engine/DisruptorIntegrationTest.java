package com.hft.engine;

import com.hft.engine.model.OrderType;
import com.hft.engine.model.Side;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DisruptorIntegrationTest {
    private HFTNode node;

    @BeforeEach
    public void setup() {
        // Power of 2 ring buffer size as required by Disruptor
        node = new HFTNode(1024 * 16);
        node.start();
    }

    @AfterEach
    public void tearDown() {
        node.stop();
    }

    @Test
    public void testHighThroughputMatching() throws InterruptedException {
        int orderCount = 10_000;
        long startTime = System.nanoTime();
        
        // Publish 5000 buys at price 1000
        for (int i = 1; i <= 5000; i++) {
            node.getPublisher().publishAddOrder(
                i, 1000L, 10L, Side.BUY, OrderType.LIMIT, System.currentTimeMillis()
            );
        }

        // Publish 5000 sells at price 1000 (which will cross and perfectly match the buys)
        for (int i = 5001; i <= 10000; i++) {
            node.getPublisher().publishAddOrder(
                i, 1000L, 10L, Side.SELL, OrderType.LIMIT, System.currentTimeMillis()
            );
        }

        // Await asynchronous processing. With BusySpin on a modern CPU, this is sub-millisecond.
        Thread.sleep(200); 

        // Verification: Since every single buy was matched by a corresponding sell, 
        // the order book should be completely barren of limit orders at price 1000.
        assertNull(node.getOrderBook().getBidLevel(1000L));
        assertNull(node.getOrderBook().getAskLevel(1000L));
        
        // Assert the internal metric resets
        assertEquals(Long.MIN_VALUE, node.getOrderBook().getBestBidPrice());
        assertEquals(Long.MAX_VALUE, node.getOrderBook().getBestAskPrice());
    }

    @Test
    public void testDisruptorOrderCancellation() throws InterruptedException {
        // Publish 1 buy order
        node.getPublisher().publishAddOrder(
            1L, 500L, 100L, Side.BUY, OrderType.LIMIT, System.currentTimeMillis()
        );
        
        // Publish a command to cancel the exact order
        node.getPublisher().publishCancelOrder(1L);

        Thread.sleep(100);

        // Verification: Book must be empty
        assertNull(node.getOrderBook().getBidLevel(500L));
    }
}

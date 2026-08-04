package com.hft.engine.core;

import com.hft.engine.model.Order;
import com.hft.engine.model.OrderType;
import com.hft.engine.model.Side;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MatchingEngineTest {
    private OrderBook orderBook;
    private MatchingEngine engine;

    @BeforeEach
    public void setup() {
        orderBook = new OrderBook();
        engine = new MatchingEngine(orderBook);
    }

    @Test
    public void testFullMatchBuyAgainstRestingSell() {
        // Rest a SELL order: size 100 @ price 1000
        Order sellOrder = new Order(1L, 1000L, 100L, 1L, Side.SELL, OrderType.LIMIT);
        engine.process(sellOrder);

        assertEquals(1000L, orderBook.getBestAskPrice());
        assertNotNull(orderBook.getAskLevel(1000L));
        assertEquals(100L, orderBook.getAskLevel(1000L).getVolume());

        // Process a BUY order: size 100 @ price 1000
        Order buyOrder = new Order(2L, 1000L, 100L, 2L, Side.BUY, OrderType.LIMIT);
        engine.process(buyOrder);

        // Buy order should be fully filled (size 0)
        assertEquals(0L, buyOrder.getSize());
        
        // Sell order should also be fully filled and removed
        assertEquals(0L, sellOrder.getSize());
        
        // The price level should be deleted
        assertNull(orderBook.getAskLevel(1000L));
    }

    @Test
    public void testPartialFillReducesSizeAndVolume() {
        // Rest a SELL order: size 100 @ price 1000
        Order sellOrder = new Order(1L, 1000L, 100L, 1L, Side.SELL, OrderType.LIMIT);
        engine.process(sellOrder);

        // Process a BUY order: size 40 @ price 1000
        Order buyOrder = new Order(2L, 1000L, 40L, 2L, Side.BUY, OrderType.LIMIT);
        engine.process(buyOrder);

        // Buy order should be fully filled
        assertEquals(0L, buyOrder.getSize());

        // Sell order should be partially filled (100 - 40 = 60)
        assertEquals(60L, sellOrder.getSize());

        // The price level volume should be updated to 60
        assertNotNull(orderBook.getAskLevel(1000L));
        assertEquals(60L, orderBook.getAskLevel(1000L).getVolume());
    }

    @Test
    public void testOrderCancellation() {
        // Rest a BUY order: size 100 @ price 900
        Order buyOrder = new Order(1L, 900L, 100L, 1L, Side.BUY, OrderType.LIMIT);
        engine.process(buyOrder);

        assertEquals(900L, orderBook.getBestBidPrice());
        assertEquals(100L, orderBook.getBidLevel(900L).getVolume());

        // Cancel the order
        orderBook.cancelOrder(1L);

        // The price level should be deleted
        assertNull(orderBook.getBidLevel(900L));
        
        // Best bid should be reset to Long.MIN_VALUE since it's the only bid
        assertEquals(Long.MIN_VALUE, orderBook.getBestBidPrice());
    }
}

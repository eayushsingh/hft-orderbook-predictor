package com.hft.engine.core;

import com.hft.engine.model.Order;
import com.hft.engine.model.Side;
import com.hft.engine.structure.OrderNode;
import com.hft.engine.util.LongObjectHashMap;

/**
 * The core order book implementation.
 * Maintains bid/ask price levels and a direct order index for O(1) order cancellations.
 * Avoids object allocation and autoboxing during standard operations.
 */
public class OrderBook {
    // Arbitrarily large maps for a typical day of trading (to avoid resizing in this simple implementation)
    private static final int INITIAL_CAPACITY_PRICES = 1024 * 256; 
    private static final int INITIAL_CAPACITY_ORDERS = 1024 * 1024;

    private final LongObjectHashMap<PriceLevel> bidLevels;
    private final LongObjectHashMap<PriceLevel> askLevels;
    private final LongObjectHashMap<OrderNode> orderIndex;

    private long bestBidPrice = Long.MIN_VALUE;
    private long bestAskPrice = Long.MAX_VALUE;

    public OrderBook() {
        this.bidLevels = new LongObjectHashMap<>(INITIAL_CAPACITY_PRICES);
        this.askLevels = new LongObjectHashMap<>(INITIAL_CAPACITY_PRICES);
        this.orderIndex = new LongObjectHashMap<>(INITIAL_CAPACITY_ORDERS);
    }

    /**
     * Adds an order to the order book.
     * @param order The order to add.
     */
    public void addOrder(Order order) {
        LongObjectHashMap<PriceLevel> levels = (order.getSide() == Side.BUY) ? bidLevels : askLevels;
        
        long price = order.getPrice();
        PriceLevel level = levels.get(price);
        
        if (level == null) {
            level = new PriceLevel(price);
            levels.put(price, level);
        }

        OrderNode node = new OrderNode(order);
        level.addOrder(node);
        
        // Add to direct index for O(1) cancellations
        orderIndex.put(order.getOrderId(), node);

        // Update best prices
        if (order.getSide() == Side.BUY && price > bestBidPrice) {
            bestBidPrice = price;
        } else if (order.getSide() == Side.SELL && price < bestAskPrice) {
            bestAskPrice = price;
        }
    }

    /**
     * Cancels an order using its order ID in O(1) time.
     * @param orderId The ID of the order to cancel.
     */
    public void cancelOrder(long orderId) {
        OrderNode node = orderIndex.get(orderId);
        
        if (node != null) {
            Order order = node.getOrder();
            LongObjectHashMap<PriceLevel> levels = (order.getSide() == Side.BUY) ? bidLevels : askLevels;
            
            long price = order.getPrice();
            PriceLevel level = levels.get(price);
            
            if (level != null) {
                level.removeOrder(node);
                
                // If the price level is now empty, we can optionally remove it to save memory/cleanup
                if (level.getVolume() == 0 && level.getOrders().isEmpty()) {
                    levels.remove(price);
                    if (order.getSide() == Side.BUY && price == bestBidPrice) {
                        recalculateBestBid();
                    } else if (order.getSide() == Side.SELL && price == bestAskPrice) {
                        recalculateBestAsk();
                    }
                }
            }
            
            // Remove from direct index
            orderIndex.remove(orderId);
        }
    }

    public long getBestBidPrice() {
        return bestBidPrice;
    }

    public long getBestAskPrice() {
        return bestAskPrice;
    }

    public PriceLevel getBidLevel(long price) {
        return bidLevels.get(price);
    }

    public PriceLevel getAskLevel(long price) {
        return askLevels.get(price);
    }

    public void removeBidPrice(long price) {
        bidLevels.remove(price);
        if (price == bestBidPrice) {
            recalculateBestBid();
        }
    }

    public void removeAskPrice(long price) {
        askLevels.remove(price);
        if (price == bestAskPrice) {
            recalculateBestAsk();
        }
    }

    private void recalculateBestBid() {
        long best = Long.MIN_VALUE;
        long[] keys = bidLevels.getKeys();
        for (int i = 0; i < keys.length; i++) {
            long k = keys[i];
            if (k != 0L && k != -1L && k > best) {
                best = k;
            }
        }
        bestBidPrice = best;
    }

    private void recalculateBestAsk() {
        long best = Long.MAX_VALUE;
        long[] keys = askLevels.getKeys();
        for (int i = 0; i < keys.length; i++) {
            long k = keys[i];
            if (k != 0L && k != -1L && k < best) {
                best = k;
            }
        }
        bestAskPrice = best;
    }
}

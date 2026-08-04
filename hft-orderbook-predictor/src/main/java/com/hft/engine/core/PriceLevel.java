package com.hft.engine.core;

import com.hft.engine.structure.DoublyLinkedList;
import com.hft.engine.structure.OrderNode;

/**
 * Represents a single price level in the limit order book.
 * Aggregates the total volume at this price and maintains a FIFO queue of orders.
 */
public class PriceLevel {
    private long price;
    private long volume;
    private DoublyLinkedList orders;

    public PriceLevel(long price) {
        this.price = price;
        this.volume = 0L;
        this.orders = new DoublyLinkedList();
    }

    /**
     * Adds an order node to this price level and increases the total volume.
     * @param orderNode The order node to add.
     */
    public void addOrder(OrderNode orderNode) {
        if (orderNode == null || orderNode.getOrder() == null) {
            return;
        }
        orders.append(orderNode);
        volume += orderNode.getOrder().getSize();
    }

    /**
     * Removes an order node from this price level and decreases the total volume.
     * @param orderNode The order node to remove.
     */
    public void removeOrder(OrderNode orderNode) {
        if (orderNode == null || orderNode.getOrder() == null) {
            return;
        }
        orders.remove(orderNode);
        volume -= orderNode.getOrder().getSize();
    }

    public long getPrice() {
        return price;
    }

    public long getVolume() {
        return volume;
    }

    public DoublyLinkedList getOrders() {
        return orders;
    }

    public void reduceVolume(long size) {
        this.volume -= size;
    }
}

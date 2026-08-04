package com.hft.engine.model;

/**
 * Represents an Order in the HFT engine.
 * Uses strictly primitive types for numerical fields to prevent JVM garbage collection pauses.
 */
public class Order {
    private long orderId;
    private long price;
    private long size;
    private long timestamp;
    private Side side;
    private OrderType type;

    public Order() {
    }

    public Order(long orderId, long price, long size, long timestamp, Side side, OrderType type) {
        this.orderId = orderId;
        this.price = price;
        this.size = size;
        this.timestamp = timestamp;
        this.side = side;
        this.type = type;
    }

    public long getOrderId() {
        return orderId;
    }

    public void setOrderId(long orderId) {
        this.orderId = orderId;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public Side getSide() {
        return side;
    }

    public void setSide(Side side) {
        this.side = side;
    }

    public OrderType getType() {
        return type;
    }

    public void setType(OrderType type) {
        this.type = type;
    }

    /**
     * Reuses this object to prevent allocations. 
     */
    public void update(long orderId, long price, long size, long timestamp, Side side, OrderType type) {
        this.orderId = orderId;
        this.price = price;
        this.size = size;
        this.timestamp = timestamp;
        this.side = side;
        this.type = type;
    }
}

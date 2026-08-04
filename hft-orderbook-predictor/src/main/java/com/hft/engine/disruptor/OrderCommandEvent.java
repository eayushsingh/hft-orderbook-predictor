package com.hft.engine.disruptor;

import com.hft.engine.model.Order;

/**
 * The data container that lives inside the LMAX Disruptor Ring Buffer.
 * Pre-allocated to prevent JVM GC pauses during high-throughput messaging.
 */
public class OrderCommandEvent {
    private OrderCommandType type;
    private final Order order = new Order(); // Zero-allocation inner object
    private long targetOrderId; // Specifically used for O(1) cancel commands

    public OrderCommandType getType() {
        return type;
    }

    public void setType(OrderCommandType type) {
        this.type = type;
    }

    public Order getOrder() {
        return order;
    }

    public long getTargetOrderId() {
        return targetOrderId;
    }

    public void setTargetOrderId(long targetOrderId) {
        this.targetOrderId = targetOrderId;
    }
}

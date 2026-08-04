package com.hft.engine.disruptor;

import com.hft.engine.model.OrderType;
import com.hft.engine.model.Side;
import com.lmax.disruptor.RingBuffer;

/**
 * Publishes raw orders into the Disruptor Ring Buffer safely.
 */
public class OrderCommandPublisher {
    private final RingBuffer<OrderCommandEvent> ringBuffer;

    public OrderCommandPublisher(RingBuffer<OrderCommandEvent> ringBuffer) {
        this.ringBuffer = ringBuffer;
    }

    /**
     * Publishes a new ADD command into the ring buffer without creating any JVM objects.
     */
    public void publishAddOrder(long orderId, long price, long size, Side side, OrderType type, long timestamp) {
        long sequence = ringBuffer.next();
        try {
            OrderCommandEvent event = ringBuffer.get(sequence);
            event.setType(OrderCommandType.ADD);
            event.getOrder().update(orderId, price, size, timestamp, side, type);
        } finally {
            ringBuffer.publish(sequence);
        }
    }

    /**
     * Publishes a CANCEL command into the ring buffer.
     */
    public void publishCancelOrder(long orderId) {
        long sequence = ringBuffer.next();
        try {
            OrderCommandEvent event = ringBuffer.get(sequence);
            event.setType(OrderCommandType.CANCEL);
            event.setTargetOrderId(orderId);
        } finally {
            ringBuffer.publish(sequence);
        }
    }
}

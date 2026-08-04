package com.hft.engine.disruptor;

import com.lmax.disruptor.EventFactory;

/**
 * Pre-allocates OrderCommandEvent objects during Disruptor startup.
 */
public class OrderCommandEventFactory implements EventFactory<OrderCommandEvent> {
    @Override
    public OrderCommandEvent newInstance() {
        return new OrderCommandEvent();
    }
}

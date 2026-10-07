package com.hft.engine.disruptor;

import com.hft.engine.core.MatchingEngine;
import com.lmax.disruptor.EventHandler;

/**
 * Single-threaded Disruptor Ring Buffer Event Consumer.
 * 
 * Humanized Explanation for Maintainers:
 * Dedicated single-thread event handler pinned to an execution core:
 * 1. Single Writer Principle: Eliminates concurrency locks on the inner `MatchingEngine`.
 * 2. Event Dispatch: Synchronously routes `ADD` commands to orderbook matching and `CANCEL` commands to O(1) order cancellation.
 */
public class EngineEventHandler implements EventHandler<OrderCommandEvent> {
    private final MatchingEngine matchingEngine;

    public EngineEventHandler(MatchingEngine matchingEngine) {
        this.matchingEngine = matchingEngine;
    }

    @Override
    public void onEvent(OrderCommandEvent event, long sequence, boolean endOfBatch) {
        if (event.getType() == OrderCommandType.ADD) {
            matchingEngine.process(event.getOrder());
        } else if (event.getType() == OrderCommandType.CANCEL) {
            matchingEngine.cancelOrder(event.getTargetOrderId());
        }
    }
}

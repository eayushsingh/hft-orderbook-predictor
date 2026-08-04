package com.hft.engine.disruptor;

import com.hft.engine.core.MatchingEngine;
import com.lmax.disruptor.EventHandler;

/**
 * Single-threaded consumer that polls events from the Ring Buffer and delegates 
 * them synchronously to the Matching Engine.
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

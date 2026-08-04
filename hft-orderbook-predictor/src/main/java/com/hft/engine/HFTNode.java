package com.hft.engine;

import com.hft.engine.core.MatchingEngine;
import com.hft.engine.core.OrderBook;
import com.hft.engine.disruptor.EngineEventHandler;
import com.hft.engine.disruptor.OrderCommandEvent;
import com.hft.engine.disruptor.OrderCommandEventFactory;
import com.hft.engine.disruptor.OrderCommandPublisher;
import com.hft.engine.ml.FeatureExtractor;
import com.hft.engine.network.MarketDataServer;
import com.lmax.disruptor.BusySpinWaitStrategy;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.dsl.ProducerType;
import com.lmax.disruptor.util.DaemonThreadFactory;

/**
 * The unified HFT system bootstrap that links the Disruptor to the Matching Engine
 * and ML Feature Extractor consumers in parallel.
 */
public class HFTNode {
    private final Disruptor<OrderCommandEvent> disruptor;
    private final OrderCommandPublisher publisher;
    private final OrderBook orderBook;
    private final MatchingEngine matchingEngine;
    private final FeatureExtractor featureExtractor;
    private final MarketDataServer marketDataServer;

    public HFTNode(int ringBufferSize) {
        this(ringBufferSize, 8887); // Default to port 8887
    }

    public HFTNode(int ringBufferSize, int websocketPort) {
        this.orderBook = new OrderBook();
        this.matchingEngine = new MatchingEngine(this.orderBook);

        // Initialize the WebSocket server
        this.marketDataServer = new MarketDataServer(websocketPort);

        OrderCommandEventFactory factory = new OrderCommandEventFactory();

        // SingleProducerSequencer and BusySpinWaitStrategy guarantee extreme low-latency execution
        this.disruptor = new Disruptor<>(
                factory,
                ringBufferSize,
                DaemonThreadFactory.INSTANCE,
                ProducerType.SINGLE,
                new BusySpinWaitStrategy()
        );

        EngineEventHandler matchingHandler = new EngineEventHandler(matchingEngine);
        this.featureExtractor = new FeatureExtractor(marketDataServer);

        // Multicasting: Attach consumers in parallel. 
        disruptor.handleEventsWith(matchingHandler, featureExtractor);

        this.publisher = new OrderCommandPublisher(disruptor.getRingBuffer());
    }

    public void start() {
        // Start the WebSocket server and block for 1 second to ensure successful port binding
        marketDataServer.start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Start the disruptor engine
        disruptor.start();
    }

    public void stop() {
        disruptor.shutdown();
        try {
            marketDataServer.stop();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public OrderCommandPublisher getPublisher() {
        return publisher;
    }

    public OrderBook getOrderBook() {
        return orderBook;
    }

    public FeatureExtractor getFeatureExtractor() {
        return featureExtractor;
    }
}

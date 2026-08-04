package com.hft.engine.network;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.hft.engine.disruptor.OrderCommandPublisher;
import com.hft.engine.model.OrderType;
import com.hft.engine.model.Side;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;

/**
 * Connects directly to the live Binance WebSockets API to ingest raw L2 Order Book updates.
 * Parses the payloads natively and publishes them into our lock-free Ring Buffer.
 */
public class BinanceLiveFeed extends WebSocketClient {
    private final OrderCommandPublisher publisher;
    private final Gson gson;
    private long orderIdCounter = 1;

    public BinanceLiveFeed(OrderCommandPublisher publisher) {
        // Connect to BTC/USDT live depth stream
        super(URI.create("wss://stream.binance.com:9443/ws/btcusdt@depth"));
        this.publisher = publisher;
        this.gson = new Gson();
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        System.out.println("Connected to LIVE Binance L2 Order Book Stream (BTC/USDT)");
    }

    @Override
    public void onMessage(String message) {
        try {
            JsonObject json = gson.fromJson(message, JsonObject.class);
            
            // Binance payload signature contains "b" (Bids) and "a" (Asks)
            if (json.has("b") && json.has("a")) {
                JsonArray bids = json.getAsJsonArray("b");
                JsonArray asks = json.getAsJsonArray("a");

                long timestamp = System.currentTimeMillis();

                // Parse Bids
                for (JsonElement bid : bids) {
                    JsonArray bidLevel = bid.getAsJsonArray();
                    // Multiply string decimals by 10000 to maintain precision natively within Java primitives
                    long price = (long) (Double.parseDouble(bidLevel.get(0).getAsString()) * 10000);
                    long quantity = (long) (Double.parseDouble(bidLevel.get(1).getAsString()) * 10000);
                    
                    // Skip 0 quantities or parse them as cancellations if our matching engine supported size 0 updates
                    if (quantity > 0) {
                        publisher.publishAddOrder(orderIdCounter++, price, quantity, Side.BUY, OrderType.LIMIT, timestamp);
                    }
                }

                // Parse Asks
                for (JsonElement ask : asks) {
                    JsonArray askLevel = ask.getAsJsonArray();
                    long price = (long) (Double.parseDouble(askLevel.get(0).getAsString()) * 10000);
                    long quantity = (long) (Double.parseDouble(askLevel.get(1).getAsString()) * 10000);
                    
                    if (quantity > 0) {
                        publisher.publishAddOrder(orderIdCounter++, price, quantity, Side.SELL, OrderType.LIMIT, timestamp);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing Binance feed: " + e.getMessage());
        }
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        System.out.println("Binance Live Feed Disconnected: " + reason);
    }

    @Override
    public void onError(Exception ex) {
        System.err.println("Binance Live Feed Error: " + ex.getMessage());
    }
}

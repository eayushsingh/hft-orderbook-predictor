package com.hft.engine.network;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;

/**
 * A low-latency WebSocket server to broadcast real-time order book depth
 * and Machine Learning predictive features to external dashboards.
 */
public class MarketDataServer extends WebSocketServer {
    private final Gson gson;

    public MarketDataServer(int port) {
        super(new InetSocketAddress(port));
        this.gson = new Gson();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("New client connected: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("Client disconnected: " + conn.getRemoteSocketAddress() + " with reason: " + reason);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        // Typically a read-only broadcast feed; incoming messages are ignored or logged
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.err.println("An error occurred on connection " 
            + (conn != null ? conn.getRemoteSocketAddress() : "null") + ":" + ex);
    }

    @Override
    public void onStart() {
        System.out.println("MarketDataServer started successfully on port: " + getPort());
        setConnectionLostTimeout(0);
        setConnectionLostTimeout(100);
    }

    /**
     * Broadcasts the computed ML features in real-time.
     */
    public void broadcastAnalytics(double spread, double midPrice, double obi, double microPrice) {
        JsonObject json = new JsonObject();
        json.addProperty("type", "analytics");
        json.addProperty("spread", spread);
        json.addProperty("midPrice", midPrice);
        json.addProperty("obi", obi);
        json.addProperty("microPrice", microPrice);
        json.addProperty("timestamp", System.currentTimeMillis());

        broadcast(gson.toJson(json));
    }

    /**
     * Broadcasts the top-of-book depth (Level 1 structure).
     */
    public void broadcastDepth(long bestBid, long bidVol, long bestAsk, long askVol) {
        JsonObject json = new JsonObject();
        json.addProperty("type", "depth");
        json.addProperty("bestBid", bestBid);
        json.addProperty("bidVolume", bidVol);
        json.addProperty("bestAsk", bestAsk);
        json.addProperty("askVolume", askVol);
        json.addProperty("timestamp", System.currentTimeMillis());

        broadcast(gson.toJson(json));
    }
}

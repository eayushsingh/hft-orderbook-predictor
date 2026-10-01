package com.hft.engine.network;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;

/**
 * Institutional low-latency WebSocket server.
 * Broadcasts real-time Level 2 depth, OBI metrics, micro-price drift,
 * AI predictive signals, and iceberg/spoofing alerts to external client terminals.
 */
public class MarketDataServer extends WebSocketServer {
    private final Gson gson;

    public MarketDataServer(int port) {
        super(new InetSocketAddress(port));
        this.gson = new Gson();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("[MarketDataServer] Client connected: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("[MarketDataServer] Client disconnected: " + conn.getRemoteSocketAddress() + " (" + reason + ")");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        // Broadcast engine is read-only push
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.err.println("[MarketDataServer] Error on " 
            + (conn != null ? conn.getRemoteSocketAddress() : "socket") + ": " + ex.getMessage());
    }

    @Override
    public void onStart() {
        System.out.println("[MarketDataServer] WebSocket Server started on port: " + getPort());
        setConnectionLostTimeout(100);
    }

    /**
     * Broadcasts real-time quantitative microstructure analytics and predictive signals.
     */
    public void broadcastAnalytics(
            double spread,
            double midPrice,
            double obi,
            double microPrice,
            String signal,
            double confidence,
            double vpinToxicity,
            double predictedDriftBps
    ) {
        JsonObject json = new JsonObject();
        json.addProperty("type", "analytics");
        json.addProperty("spread", spread);
        json.addProperty("midPrice", midPrice);
        json.addProperty("obi", obi);
        json.addProperty("microPrice", microPrice);
        json.addProperty("signal", signal);
        json.addProperty("confidence", confidence);
        json.addProperty("vpinToxicity", vpinToxicity);
        json.addProperty("predictedDriftBps", predictedDriftBps);
        json.addProperty("timestamp", System.currentTimeMillis());

        broadcast(gson.toJson(json));
    }

    /**
     * Broadcasts top-of-book depth (Level 1 structure).
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

    /**
     * Broadcasts microstructure alerts (Icebergs, Spoofing Walls, Volatility Spikes).
     */
    public void broadcastAlert(String alertType, long price, long volume, String message) {
        JsonObject json = new JsonObject();
        json.addProperty("type", "alert");
        json.addProperty("alertType", alertType);
        json.addProperty("price", price);
        json.addProperty("volume", volume);
        json.addProperty("message", message);
        json.addProperty("timestamp", System.currentTimeMillis());

        broadcast(gson.toJson(json));
    }
}

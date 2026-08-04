import { useState, useEffect } from 'react';

export interface DepthData {
  type: string;
  bestBid: number;
  bidVolume: number;
  bestAsk: number;
  askVolume: number;
  timestamp: number;
}

export interface AnalyticsData {
  type: string;
  spread: number;
  midPrice: number;
  obi: number;
  microPrice: number;
  timestamp: number;
}

export function useMarketData() {
  const [depth, setDepth] = useState<DepthData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Connect to the Java HFT WebSocket Server
    const ws = new WebSocket('wss://localhost:8887');

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to Market Data Server');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'depth') {
          setDepth(data);
        } else if (data.type === 'analytics') {
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from Market Data Server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup function: Close the socket on component unmount to prevent memory leaks
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  return { depth, analytics, isConnected };
}

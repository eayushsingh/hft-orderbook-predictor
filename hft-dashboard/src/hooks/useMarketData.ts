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
  signal?: string;
  confidence?: number;
  vpinToxicity?: number;
  predictedDriftBps?: number;
  timestamp: number;
}

export interface AlertData {
  type: string;
  alertType: string;
  price: number;
  volume: number;
  message: string;
  timestamp: number;
}

export function useMarketData() {
  const [depth, setDepth] = useState<DepthData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Connect to the Java HFT WebSocket Server
    const ws = new WebSocket('ws://localhost:8887');

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to HFT Market Data Engine');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'depth') {
          setDepth(data);
        } else if (data.type === 'analytics') {
          setAnalytics(data);
        } else if (data.type === 'alert') {
          setAlerts((prev) => [data, ...prev.slice(0, 19)]);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from HFT Market Data Engine');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  return { depth, analytics, alerts, isConnected };
}

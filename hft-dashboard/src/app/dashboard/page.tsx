"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  Wifi,
  Zap,
  ListFilter,
  Briefcase,
  Layers,
  X,
} from "lucide-react";

import LalanNavbar from "@/components/LalanNavbar";
import LalanWatchlist, { WatchlistStock, INITIAL_WATCHLIST } from "@/components/LalanWatchlist";
import LalanOrderTicketModal, { ExecutedOrder } from "@/components/LalanOrderTicketModal";
import LalanPositionsAndOrders, { ActivePosition } from "@/components/LalanPositionsAndOrders";
import LalanOrderBook from "@/components/LalanOrderBook";
import SubscriptionPricingModal from "@/components/SubscriptionPricingModal";
import AboutUsModal from "@/components/AboutUsModal";
import OnboardingGuideModal from "@/components/OnboardingGuideModal";
import ConsensusMatrix from "@/components/ConsensusMatrix";
import IndianMarketMatrix from "@/components/IndianMarketMatrix";
import MultiSourceIntelligenceHub from "@/components/MultiSourceIntelligenceHub";
import VPINSpoofingRadar from "@/components/VPINSpoofingRadar";
import MarketImpactCalculator from "@/components/MarketImpactCalculator";
import QueuePositionPredictor from "@/components/QueuePositionPredictor";
import { useSubscription } from "@/context/SubscriptionContext";


/* ============================================================
   TYPES — strict WebSocket & Engine payload contracts
   ============================================================ */

interface RawDepthLevel {
  price: number;
  qty: number;
}

interface RawDepthPayload {
  bids: RawDepthLevel[];
  asks: RawDepthLevel[];
  ts: number;
}

interface DepthLevel {
  price: number;
  qty: number;
}

interface EngineMetrics {
  bestBid: DepthLevel;
  bestAsk: DepthLevel;
  bids: DepthLevel[];
  asks: DepthLevel[];
  spread: number;
  spreadBps: number;
  midPrice: number;
  microPrice: number;
  obi: number;
  signal: "STRONG BUY" | "STRONG SELL" | "NEUTRAL";
  confidence: number;
  totalOrdersProcessed: number;
  latencyMs: number;
  connected: boolean;
}

type ConnectionState = "connecting" | "live" | "reconnecting" | "offline";

/* ============================================================
   CONSTANTS
   ============================================================ */

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/btcusdt@depth20@100ms";
const PRICE_SCALE = 10000.0;
const SPARKLINE_LENGTH = 30;
const OBI_STRONG_THRESHOLD = 0.35;

const EMPTY_LEVEL: DepthLevel = { price: 0, qty: 0 };

const DEFAULT_METRICS: EngineMetrics = {
  bestBid: EMPTY_LEVEL,
  bestAsk: EMPTY_LEVEL,
  bids: [],
  asks: [],
  spread: 0,
  spreadBps: 0,
  midPrice: 0,
  microPrice: 0,
  obi: 0,
  signal: "NEUTRAL",
  confidence: 0,
  totalOrdersProcessed: 0,
  latencyMs: 0,
  connected: false,
};

/* ============================================================
   UTILITIES
   ============================================================ */

function safeDivScale(raw: number | undefined | null): number {
  return (raw || 0) / PRICE_SCALE;
}

function formatUsd(value: number | undefined | null): string {
  const v = value || 0;
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatBtc(value: number | undefined | null): string {
  const v = value || 0;
  return v.toFixed(4);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function useCountUp(target: number, durationMs = 100): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    const start = performance.now();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = clamp(elapsed / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (to - from) * eased;
      setDisplay(value);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return display;
}

function CountUpDisplay({
  end,
  decimals = 0,
  duration = 500,
  prefix = "",
  separator = "",
  suffix = "",
}: {
  end: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  separator?: string;
  suffix?: string;
}) {
  const value = useCountUp(end, duration);
  const formatted = separator
    ? value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toFixed(decimals);

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

function computeMetrics(
  raw: RawDepthPayload,
  prevTotal: number,
  latencyMs: number
): EngineMetrics {
  const bids: DepthLevel[] = (raw.bids || [])
    .slice(0, 5)
    .map((l) => ({ price: safeDivScale(l?.price), qty: l?.qty || 0 }));
  const asks: DepthLevel[] = (raw.asks || [])
    .slice(0, 5)
    .map((l) => ({ price: safeDivScale(l?.price), qty: l?.qty || 0 }));

  const bestBid = bids[0] || EMPTY_LEVEL;
  const bestAsk = asks[0] || EMPTY_LEVEL;

  const spread = (bestAsk.price || 0) - (bestBid.price || 0);
  const midPrice = ((bestAsk.price || 0) + (bestBid.price || 0)) / 2;
  const spreadBps = midPrice > 0 ? (spread / midPrice) * 10000 : 0;

  const bidWeight = bestBid.qty || 0;
  const askWeight = bestAsk.qty || 0;
  const totalWeight = bidWeight + askWeight;

  const microPrice =
    totalWeight > 0
      ? (bestBid.price * askWeight + bestAsk.price * bidWeight) / totalWeight
      : midPrice;

  const obi = totalWeight > 0 ? (bidWeight - askWeight) / totalWeight : 0;

  let signal: EngineMetrics["signal"] = "NEUTRAL";
  if (obi > OBI_STRONG_THRESHOLD) signal = "STRONG BUY";
  else if (obi < -OBI_STRONG_THRESHOLD) signal = "STRONG SELL";

  const confidence = clamp(Math.abs(obi) / 1.0, 0, 1) * 100;

  return {
    bestBid,
    bestAsk,
    bids,
    asks,
    spread,
    spreadBps,
    midPrice,
    microPrice,
    obi,
    signal,
    confidence,
    totalOrdersProcessed: prevTotal + 1,
    latencyMs,
    connected: true,
  };
}

function useMarketEngine() {
  const [metrics, setMetrics] = useState<EngineMetrics>(DEFAULT_METRICS);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [sparkline, setSparkline] = useState<number[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const totalOrdersRef = useRef<number>(0);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPingRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);

  const pushSparkline = useCallback((price: number) => {
    if (!price) return;
    setSparkline((prev) => {
      const next = [...prev, price];
      if (next.length > SPARKLINE_LENGTH) next.shift();
      return next;
    });
  }, []);

  const connect = useCallback(function doConnect() {
    if (!mountedRef.current) return;

    try {
      setConnectionState((prev) => (prev === "live" ? "reconnecting" : "connecting"));

      const ws = new WebSocket(BINANCE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        reconnectAttemptsRef.current = 0;
        setConnectionState("live");
        lastPingRef.current = performance.now();
      };

      ws.onmessage = (event: MessageEvent) => {
        if (!mountedRef.current) return;
        const t0 = lastPingRef.current || performance.now();
        const t1 = performance.now();
        const latencyMs = Math.max(0, Math.round((t1 - t0) * 100) / 100);
        lastPingRef.current = t1;

        try {
          const parsed = JSON.parse(event.data as string);

          const bids: RawDepthLevel[] = Array.isArray(parsed?.bids)
            ? parsed.bids.map((b: [string, string]) => ({
                price: Math.round(parseFloat(b?.[0] || "0") * PRICE_SCALE),
                qty: parseFloat(b?.[1] || "0"),
              }))
            : [];

          const asks: RawDepthLevel[] = Array.isArray(parsed?.asks)
            ? parsed.asks.map((a: [string, string]) => ({
                price: Math.round(parseFloat(a?.[0] || "0") * PRICE_SCALE),
                qty: parseFloat(a?.[1] || "0"),
              }))
            : [];

          const raw: RawDepthPayload = { bids, asks, ts: Date.now() };
          const next = computeMetrics(raw, totalOrdersRef.current, latencyMs);
          totalOrdersRef.current = next.totalOrdersProcessed;
          setMetrics(next);
          pushSparkline(next.microPrice);
        } catch {
          // Handled frame parse fallback
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setMetrics((prev) => ({ ...prev, connected: false }));
        reconnectAttemptsRef.current += 1;

        if (reconnectAttemptsRef.current > 5) {
          setConnectionState("offline");
          return;
        }

        setConnectionState("reconnecting");
        const backoffMs = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 15000);
        reconnectTimerRef.current = setTimeout(doConnect, backoffMs);
      };
    } catch {
      setConnectionState("offline");
    }
  }, [pushSparkline]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { metrics, connectionState, sparkline };
}

/* ============================================================
   SUB-COMPONENTS: AI Predictor Card & Depth Cards
   ============================================================ */

function PredictorCard({ metrics }: { metrics: EngineMetrics }) {
  const signalStyles: Record<
    EngineMetrics["signal"],
    { text: string; glow: string; ring: string }
  > = {
    "STRONG BUY": {
      text: "text-[#10b981]",
      glow: "drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]",
      ring: "ring-emerald-500/30",
    },
    "STRONG SELL": {
      text: "text-[#f43f5e]",
      glow: "drop-shadow-[0_0_25px_rgba(244,63,94,0.35)]",
      ring: "ring-rose-500/30",
    },
    NEUTRAL: {
      text: "text-zinc-300",
      glow: "drop-shadow-[0_0_15px_rgba(161,161,170,0.2)]",
      ring: "ring-white/10",
    },
  };

  const style = signalStyles[metrics.signal];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative col-span-1 sm:col-span-2 overflow-hidden rounded-2xl border border-[#262634] bg-[#14141a] p-5 backdrop-blur-xl ring-1 ${style.ring} lg:col-span-2 font-sans`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-[#747888] font-mono">
          AI Predictor Matrix (LALAN HFT)
        </span>
        <Gauge className="h-4 w-4 text-[#747888]" />
      </div>

      <div className="mt-4 flex flex-col items-center justify-center py-4 text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={metrics.signal}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`text-3xl sm:text-5xl font-black font-mono tracking-tight ${style.text} ${style.glow}`}
          >
            {metrics.signal}
          </motion.span>
        </AnimatePresence>

        <div className="mt-4 w-full max-w-xs">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-[#747888] font-mono">
            <span>Confidence</span>
            <span className="text-white font-bold">
              <CountUpDisplay end={metrics.confidence} decimals={1} duration={100} />%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#242432]">
            <motion.div
              animate={{ width: `${metrics.confidence}%` }}
              className={`h-full rounded-full ${
                metrics.signal === "STRONG BUY"
                  ? "bg-[#10b981]"
                  : metrics.signal === "STRONG SELL"
                  ? "bg-[#f43f5e]"
                  : "bg-[#747888]"
              }`}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center space-x-1.5 text-xs text-[#747888] font-mono">
          <span>OBI Drift</span>
          <span className="font-bold text-white">
            {metrics.obi >= 0 ? "+" : ""}
            {metrics.obi.toFixed(3)}
          </span>
          {metrics.obi >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-[#10b981]" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-[#f43f5e]" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DepthCard({ side, level, maxQty }: { side: "ask" | "bid"; level: DepthLevel; maxQty: number }) {
  const isAsk = side === "ask";
  const pct = maxQty > 0 ? clamp((level.qty / maxQty) * 100, 0, 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#262634] bg-[#14141a] p-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#747888] font-mono">
          Best {isAsk ? "Ask (Sell)" : "Bid (Buy)"}
        </span>
        {isAsk ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-[#f43f5e]" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-[#10b981]" />
        )}
      </div>

      <div
        className={`mt-2 font-mono text-xl sm:text-2xl font-black tabular-nums ${
          isAsk ? "text-[#f43f5e]" : "text-[#10b981]"
        }`}
      >
        <CountUpDisplay end={level.price || 0} decimals={2} duration={100} prefix="$" separator="," />
      </div>

      <div className="mt-1 text-[11px] text-[#747888] font-mono">
        Depth Volume: <span className="text-white font-bold">{formatBtc(level.qty)} BTC</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#242432]">
        <motion.div
          animate={{ width: `${pct}%` }}
          className={`h-full rounded-full ${isAsk ? "bg-[#f43f5e]" : "bg-[#10b981]"}`}
        />
      </div>
    </div>
  );
}

function DepthLadder({ bids, asks }: { bids: DepthLevel[]; asks: DepthLevel[] }) {
  const rows = Array.from({ length: 5 });
  const maxQty = Math.max(1, ...bids.map((b) => b.qty || 0), ...asks.map((a) => a.qty || 0));

  return (
    <div className="col-span-1 sm:col-span-2 overflow-hidden rounded-2xl border border-[#262634] bg-[#14141a] p-4 font-sans lg:col-span-1">
      <div className="mb-2 flex items-center justify-between font-mono">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#747888]">
          Microstructure L2 Ladder
        </span>
        <span className="text-[9px] text-[#747888]">5 Depth Levels</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-mono text-[#747888] border-b border-[#242432] pb-1">
        <span>Bids (Buy)</span>
        <span className="text-right">Asks (Sell)</span>
      </div>

      <div className="mt-1 space-y-1">
        {rows.map((_, i) => {
          const bid = bids[i];
          const ask = asks[i];
          const bidPct = bid ? clamp(((bid.qty || 0) / maxQty) * 100, 0, 100) : 0;
          const askPct = ask ? clamp(((ask.qty || 0) / maxQty) * 100, 0, 100) : 0;

          return (
            <div key={i} className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="relative flex items-center justify-between overflow-hidden rounded px-1.5 py-0.5 bg-[#10b981]/5">
                <div
                  className="absolute inset-y-0 right-0 rounded bg-[#10b981]/15"
                  style={{ width: `${bidPct}%` }}
                />
                <span className="relative z-10 text-[#10b981] font-bold text-[11px]">
                  {bid ? formatUsd(bid.price) : "—"}
                </span>
                <span className="relative z-10 text-white text-[10px]">{bid ? formatBtc(bid.qty) : ""}</span>
              </div>

              <div className="relative flex items-center justify-between overflow-hidden rounded px-1.5 py-0.5 bg-[#f43f5e]/5">
                <div
                  className="absolute inset-y-0 left-0 rounded bg-[#f43f5e]/15"
                  style={{ width: `${askPct}%` }}
                />
                <span className="relative z-10 text-white text-[10px]">{ask ? formatBtc(ask.qty) : ""}</span>
                <span className="relative z-10 text-[#f43f5e] font-bold text-[11px]">
                  {ask ? formatUsd(ask.price) : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalyticsPanel({ metrics }: { metrics: EngineMetrics }) {
  const obiPct = ((clamp(metrics.obi, -1, 1) + 1) / 2) * 100;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-[#262634] bg-[#14141a] p-4 font-sans">
      <div>
        <p className="text-[10px] uppercase font-mono text-[#747888]">Spread</p>
        <p className="mt-1 font-mono text-base font-bold text-white">{formatUsd(metrics.spread)}</p>
        <p className="text-[10px] font-mono text-[#747888]">{metrics.spreadBps.toFixed(2)} bps</p>
      </div>

      <div>
        <p className="text-[10px] uppercase font-mono text-[#747888]">Mid-Price</p>
        <p className="mt-1 font-mono text-base font-bold text-white">{formatUsd(metrics.midPrice)}</p>
        <p className="text-[10px] font-mono text-[#747888]">Geometric Mid</p>
      </div>

      <div>
        <p className="text-[10px] uppercase font-mono text-[#747888]">Micro-Price</p>
        <p className="mt-1 font-mono text-base font-bold text-[#387ed1]">{formatUsd(metrics.microPrice)}</p>
        <p className="text-[10px] font-mono text-[#747888]">VWAP Weighted</p>
      </div>

      <div>
        <p className="text-[10px] uppercase font-mono text-[#747888]">Order Book Imbalance</p>
        <div className="relative mt-2 h-1.5 w-full rounded-full bg-[#242432]">
          <motion.div
            animate={{ left: `${obiPct}%` }}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#387ed1] shadow-lg border border-white"
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[9px] font-mono text-[#747888]">
          <span>-1.0</span>
          <span className="text-white font-bold">{metrics.obi >= 0 ? `+${metrics.obi.toFixed(2)}` : metrics.obi.toFixed(2)}</span>
          <span>+1.0</span>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const { path, lastPoint, width, height } = useMemo(() => {
    const w = 600;
    const h = 100;
    if (data.length < 2) {
      return { path: "", lastPoint: null as [number, number] | null, width: w, height: h };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points: [number, number][] = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 20) - 10;
      return [x, y];
    });

    const d = points
      .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ");

    return { path: d, lastPoint: points[points.length - 1], width: w, height: h };
  }, [data]);

  return (
    <div className="rounded-2xl border border-[#262634] bg-[#14141a] p-4 font-sans">
      <div className="mb-2 flex items-center justify-between font-mono">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#747888]">
          Micro-Price Tick Stream
        </span>
        <span className="text-[9px] text-[#747888]">Last {SPARKLINE_LENGTH} Ticks</span>
      </div>

      {data.length < 2 ? (
        <div className="flex h-[90px] items-center justify-center text-xs font-mono text-[#747888]">
          Awaiting live tick stream…
        </div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[90px] w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#387ed1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#387ed1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {path && <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#sparklineGrad)" />}
          {path && <path d={path} fill="none" stroke="#387ed1" strokeWidth="2" />}
          {lastPoint && (
            <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4" fill="#387ed1" className="animate-ping" />
          )}
        </svg>
      )}
    </div>
  );
}

/* ============================================================
   MAIN DASHBOARD PAGE COMPOSITION
   ============================================================ */

export default function DashboardPage() {
  const { metrics, connectionState, sparkline } = useMarketEngine();

  const { activePlanId, isTrialActive, daysRemainingInTrial } = useSubscription();
  const [activeTab, setActiveTab] = useState<string>("terminal");
  const [availableFunds, setAvailableFunds] = useState<number>(542800.0);
  const [selectedStock, setSelectedStock] = useState<WatchlistStock>(INITIAL_WATCHLIST[0]);
  const [pricingModalOpen, setPricingModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [guideModalOpen, setGuideModalOpen] = useState<boolean>(false);
  const [mobileWatchlistOpen, setMobileWatchlistOpen] = useState<boolean>(false);


  // Order Ticket Modal state
  const [orderModal, setOrderModal] = useState<{
    isOpen: boolean;
    symbol: string;
    price: number;
    type: "BUY" | "SELL";
  }>({
    isOpen: false,
    symbol: "RELIANCE",
    price: 2984.5,
    type: "BUY",
  });

  // Orders and Positions state
  const [orders, setOrders] = useState<ExecutedOrder[]>([
    {
      orderId: "84920412",
      timestamp: "09:15:04",
      symbol: "RELIANCE",
      type: "BUY",
      product: "MIS",
      orderType: "MARKET",
      qty: 25,
      price: 2984.5,
      status: "COMPLETE",
    },
    {
      orderId: "84920108",
      timestamp: "09:15:01",
      symbol: "TATAMOTORS",
      type: "BUY",
      product: "CNC",
      orderType: "MARKET",
      qty: 50,
      price: 985.1,
      status: "COMPLETE",
    },
  ]);

  const [positions, setPositions] = useState<ActivePosition[]>([
    {
      symbol: "RELIANCE",
      product: "MIS",
      qty: 25,
      avgPrice: 2984.5,
      ltp: 2984.5,
      pnl: 0.0,
      pnlPct: 0.0,
    },
    {
      symbol: "TATAMOTORS",
      product: "CNC",
      qty: 50,
      avgPrice: 985.1,
      ltp: 985.1,
      pnl: 0.0,
      pnlPct: 0.0,
    },
  ]);

  // Live P&L tick updates
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;
      setPositions((prev) =>
        prev.map((pos, idx) => {
          const ltpChange = Math.sin((tickCount + idx) * 0.5) * (pos.avgPrice * 0.001);
          const newLtp = Math.max(1, Math.round((pos.ltp + ltpChange) * 100) / 100);
          const pnl = (newLtp - pos.avgPrice) * pos.qty;
          const pnlPct = ((newLtp - pos.avgPrice) / pos.avgPrice) * 100;
          return {
            ...pos,
            ltp: newLtp,
            pnl: Math.round(pnl * 100) / 100,
            pnlPct: Math.round(pnlPct * 100) / 100,
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleOpenBuyModal = (symbol?: string, price?: number) => {
    const s = symbol || selectedStock.symbol;
    const p = price || selectedStock.price;
    setOrderModal({ isOpen: true, symbol: s, price: p, type: "BUY" });
  };

  const handleOpenSellModal = (symbol?: string, price?: number) => {
    const s = symbol || selectedStock.symbol;
    const p = price || selectedStock.price;
    setOrderModal({ isOpen: true, symbol: s, price: p, type: "SELL" });
  };

  const handleExecuteOrder = (newOrder: ExecutedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Update funds
    const marginRequired =
      newOrder.product === "MIS"
        ? newOrder.qty * newOrder.price * 0.2
        : newOrder.qty * newOrder.price;
    
    if (newOrder.type === "BUY") {
      setAvailableFunds((f) => Math.max(0, f - marginRequired));
    }

    // Update or add position
    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === newOrder.symbol);
      if (existing) {
        if (newOrder.type === "BUY") {
          const newQty = existing.qty + newOrder.qty;
          const newAvg = (existing.avgPrice * existing.qty + newOrder.price * newOrder.qty) / newQty;
          return prev.map((p) =>
            p.symbol === newOrder.symbol
              ? { ...p, qty: newQty, avgPrice: newAvg }
              : p
          );
        } else {
          const newQty = existing.qty - newOrder.qty;
          if (newQty <= 0) return prev.filter((p) => p.symbol !== newOrder.symbol);
          return prev.map((p) => (p.symbol === newOrder.symbol ? { ...p, qty: newQty } : p));
        }
      } else {
        if (newOrder.type === "BUY") {
          return [
            ...prev,
            {
              symbol: newOrder.symbol,
              product: newOrder.product,
              qty: newOrder.qty,
              avgPrice: newOrder.price,
              ltp: newOrder.price,
              pnl: 0,
              pnlPct: 0,
            },
          ];
        }
      }
      return prev;
    });
  };

  const handleExitPosition = (symbol: string) => {
    const targetPos = positions.find((p) => p.symbol === symbol);
    if (!targetPos) return;

    // Refund margin
    setAvailableFunds((f) => f + targetPos.qty * targetPos.ltp);
    setPositions((prev) => prev.filter((p) => p.symbol !== symbol));
    setOrders((prev) => [
      {
        orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
        symbol,
        type: "SELL",
        product: targetPos.product,
        orderType: "MARKET",
        qty: targetPos.qty,
        price: targetPos.ltp,
        status: "COMPLETE",
      },
      ...prev,
    ]);
  };

  const handleSquareOffAll = () => {
    positions.forEach((p) => handleExitPosition(p.symbol));
  };

  const maxQty = Math.max(metrics.bestAsk.qty || 0, metrics.bestBid.qty || 0, 1);

  return (
    <main className="min-h-screen bg-[#0d0d12] text-[#dedede] font-sans antialiased overflow-x-hidden">
      {/* ── TOP LALAN NAVBAR ── */}
      <LalanNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        latencyMs={metrics.latencyMs}
        availableFunds={availableFunds}
        niftyPrice={24850.75}
        niftyChange={0.62}
        bankNiftyPrice={52340.1}
        bankNiftyChange={0.85}
        btcPrice={metrics.bestBid.price || 84572.52}
        btcChange={2.1}
        selectedSymbol={selectedStock.symbol}
        onOpenBuyModal={handleOpenBuyModal}
        onOpenSellModal={handleOpenSellModal}
        onOpenPricingModal={() => setPricingModalOpen(true)}
        onOpenAboutModal={() => setAboutModalOpen(true)}
        onOpenGuideModal={() => setGuideModalOpen(true)}
      />

      {/* ── MAIN WORKSPACE LAYOUT: Watchlist Sidebar + Main Panel ── */}
      <div className="flex h-[calc(100vh-52px-28px)] overflow-hidden">
        
        {/* LEFT SIDEBAR: LALAN MarketWatch (Fixed on Desktop) */}
        <aside className="w-80 shrink-0 hidden md:block h-full border-r border-[#222230]">
          <LalanWatchlist
            onSelectStock={(st) => setSelectedStock(st)}
            selectedSymbol={selectedStock.symbol}
            onOpenBuyModal={handleOpenBuyModal}
            onOpenSellModal={handleOpenSellModal}
            liveBtcPrice={metrics.bestBid.price}
          />
        </aside>

        {/* RIGHT CONTENT WORKSPACE */}
        <section className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-5 pb-20 md:pb-6 space-y-4">

          {/* ── TAB 1: TERMINAL & L2 DEPTH ── */}
          {activeTab === "terminal" && (
            <>
              {/* Backpack-Style Pair Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#222230] p-3.5 sm:p-4 rounded-xl shadow-md gap-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/40 font-mono font-extrabold text-[11px] uppercase">
                    {selectedStock.exchange}
                  </span>
                  <div>
                    <h1 className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      {selectedStock.symbol}
                    </h1>
                    <p className="text-[11px] text-slate-600 dark:text-[#747888] font-mono font-semibold">{selectedStock.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex flex-col text-right font-mono">
                    <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      {selectedStock.exchange === "BINANCE"
                        ? `$${metrics.bestBid.price ? metrics.bestBid.price.toLocaleString("en-US", { minimumFractionDigits: 2 }) : selectedStock.price.toFixed(2)}`
                        : `₹${selectedStock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        selectedStock.changePct >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
                      }`}
                    >
                      {selectedStock.changePct >= 0
                        ? `+${selectedStock.changePct}%`
                        : `${selectedStock.changePct}%`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenBuyModal(selectedStock.symbol, selectedStock.price)}
                      className="bg-[#10b981] hover:bg-[#0da673] text-black font-mono text-xs font-extrabold px-3.5 py-2 rounded-lg transition-all active:scale-95 shadow"
                    >
                      BUY
                    </button>
                    <button
                      onClick={() => handleOpenSellModal(selectedStock.symbol, selectedStock.price)}
                      className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-mono text-xs font-extrabold px-3.5 py-2 rounded-lg transition-all active:scale-95 shadow"
                    >
                      SELL
                    </button>
                  </div>
                </div>
              </div>



              {/* Bento Grid Core Cards & Institutional Order Book */}
              <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-3">
                {/* Left 2 Columns: AI Predictor, Best Ask/Bid, Analytics & Tick Sparkline */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <PredictorCard metrics={metrics} />
                    <div className="space-y-3">
                      <DepthCard side="ask" level={metrics.bestAsk} maxQty={maxQty} />
                      <DepthCard side="bid" level={metrics.bestBid} maxQty={maxQty} />
                    </div>
                  </div>
                  <AnalyticsPanel metrics={metrics} />
                  <Sparkline data={sparkline} />
                </div>

                {/* Right Column: Professional Level 2 Order Book Widget */}
                <div className="lg:col-span-1">
                  <LalanOrderBook
                    bids={metrics.bids}
                    asks={metrics.asks}
                    spread={metrics.spread}
                    spreadBps={metrics.spreadBps}
                    midPrice={metrics.midPrice}
                    obi={metrics.obi}
                    currencySymbol={selectedStock.exchange === "BINANCE" ? "$" : "₹"}
                    onSelectPrice={(price, type) => {
                      if (type === "BUY") {
                        handleOpenBuyModal(selectedStock.symbol, price);
                      } else {
                        handleOpenSellModal(selectedStock.symbol, price);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Live Positions Summary Card */}
              <LalanPositionsAndOrders
                orders={orders}
                positions={positions}
                onExitPosition={handleExitPosition}
                onSquareOffAll={handleSquareOffAll}
              />
              <VPINSpoofingRadar />
            </>
          )}

          {/* ── TAB 2: ORDERS & TRADES ── */}
          {activeTab === "orders" && (
            <LalanPositionsAndOrders
              orders={orders}
              positions={positions}
              onExitPosition={handleExitPosition}
              onSquareOffAll={handleSquareOffAll}
            />
          )}

          {/* ── TAB 3: POSITIONS & PNL ── */}
          {activeTab === "positions" && (
            <LalanPositionsAndOrders
              orders={orders}
              positions={positions}
              onExitPosition={handleExitPosition}
              onSquareOffAll={handleSquareOffAll}
            />
          )}

          {/* ── TAB 4: MULTI-SOURCE INTELLIGENCE HUB (Screener, NSE, TradingView) ── */}
          {activeTab === "allinone" && <MultiSourceIntelligenceHub />}

          {/* ── TAB 5: MULTI-BROKER LIQUIDITY MATRIX ── */}
          {activeTab === "multibroker" && <IndianMarketMatrix />}

          {/* ── TAB 6: AI MICROSTRUCTURE ANALYTICS & INSTITUTIONAL MMIP HUB ── */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <VPINSpoofingRadar />
              <MarketImpactCalculator />
              <QueuePositionPredictor />
              <MultiSourceIntelligenceHub />
              <ConsensusMatrix />
              <IndianMarketMatrix />
            </div>
          )}

        </section>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (Sleek App Experience) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e0e14]/95 border-t border-[#262634] backdrop-blur-xl flex items-center justify-around py-2 px-1 text-[10px] font-mono font-bold text-[#8a8d9b]">
        <button
          onClick={() => setMobileWatchlistOpen(true)}
          className="flex flex-col items-center gap-1 p-1 hover:text-white"
        >
          <ListFilter className="h-4 w-4 text-[#387ed1]" />
          <span>Watchlist</span>
        </button>

        <button
          onClick={() => setActiveTab("terminal")}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === "terminal" ? "text-[#387ed1]" : "hover:text-white"
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab("positions")}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === "positions" || activeTab === "orders" ? "text-[#387ed1]" : "hover:text-white"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Positions</span>
        </button>

        <button
          onClick={() => setActiveTab("multibroker")}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === "multibroker" ? "text-[#387ed1]" : "hover:text-white"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Matrix</span>
        </button>
      </div>

      {/* ── MOBILE WATCHLIST SLIDE-UP DRAWER ── */}
      <AnimatePresence>
        {mobileWatchlistOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="flex-1 mt-12 bg-[#121216] border-t border-[#262634] rounded-t-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-3 border-b border-[#262630] bg-[#0c0c0f]">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Select Instrument / MarketWatch
                </span>
                <button
                  onClick={() => setMobileWatchlistOpen(false)}
                  className="p-1 rounded bg-[#1c1c24] text-[#8a8d9b] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <LalanWatchlist
                  onSelectStock={(st) => {
                    setSelectedStock(st);
                    setMobileWatchlistOpen(false);
                  }}
                  selectedSymbol={selectedStock.symbol}
                  onOpenBuyModal={(sym, pr) => {
                    setMobileWatchlistOpen(false);
                    handleOpenBuyModal(sym, pr);
                  }}
                  onOpenSellModal={(sym, pr) => {
                    setMobileWatchlistOpen(false);
                    handleOpenSellModal(sym, pr);
                  }}
                  liveBtcPrice={metrics.bestBid.price}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PRODUCTION-GRADE LALAN ORDER TICKET MODAL ── */}
      <LalanOrderTicketModal
        isOpen={orderModal.isOpen}
        onClose={() => setOrderModal((m) => ({ ...m, isOpen: false }))}
        symbol={orderModal.symbol}
        initialPrice={orderModal.price}
        initialType={orderModal.type}
        availableFunds={availableFunds}
        onExecuteOrder={handleExecuteOrder}
      />

      {/* ── INDIAN HFT SUBSCRIPTION PRICING MODAL ── */}
      <SubscriptionPricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        currentPlanId={activePlanId}
      />


      {/* ── ABOUT US & TECHNICAL SPECS MODAL ── */}
      <AboutUsModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      {/* ── FIRST-TIME TRADER ONBOARDING GUIDE MODAL ── */}
      <OnboardingGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </main>
  );
}

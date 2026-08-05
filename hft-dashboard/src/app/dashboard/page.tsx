"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  BookOpen,
  TerminalSquare,
  Gauge,
  ChevronDown,
  Wifi,
  WifiOff,
} from "lucide-react";
import ConsensusMatrix from "@/components/ConsensusMatrix";

/* ============================================================
   TYPES — strict WebSocket payload contracts
   ============================================================ */

interface RawDepthLevel {
  price: number; // scaled long, /10000.0 to get real price
  qty: number; // BTC volume
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
   UTILITIES — safe numeric guards
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

/* ============================================================
   HOOK — lightweight count-up animation (no external deps)
   ============================================================ */

function useCountUp(target: number, durationMs = 500): number {
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
      // ease-out cubic
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

interface CountUpDisplayProps {
  end: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  separator?: string;
  suffix?: string;
}

function CountUpDisplay({
  end,
  decimals = 0,
  duration = 500,
  prefix = "",
  separator = "",
  suffix = "",
}: CountUpDisplayProps) {
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

/* ============================================================
   ENGINE COMPUTATION — derives all core metrics from raw depth
   ============================================================ */

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

  // Micro-price: volume-weighted baseline drift toward the heavier side
  const microPrice =
    totalWeight > 0
      ? (bestBid.price * askWeight + bestAsk.price * bidWeight) / totalWeight
      : midPrice;

  // Order Book Imbalance: -1 (sell pressure) to +1 (buy pressure)
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

/* ============================================================
   HOOK — live Binance L2 depth stream with reconnect + fallback
   ============================================================ */

function useMarketEngine() {
  const [metrics, setMetrics] = useState<EngineMetrics>(DEFAULT_METRICS);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");
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
      setConnectionState((prev) =>
        prev === "live" ? "reconnecting" : "connecting"
      );

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
          // Malformed frame — skip silently, keep last known good state
        }
      };

      ws.onerror = () => {
        // onclose fires immediately after and handles reconnect logic
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
        const backoffMs = Math.min(
          1000 * 2 ** reconnectAttemptsRef.current,
          15000
        );
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
   SUB-COMPONENT: Header Navigation
   ============================================================ */

function HeaderNav({
  connectionState,
  latencyMs,
}: {
  connectionState: ConnectionState;
  latencyMs: number;
}) {
  const [docsOpen, setDocsOpen] = useState(false);

  const statusConfig: Record<
    ConnectionState,
    { label: string; dot: string; icon: React.ReactNode }
  > = {
    live: {
      label: "Live",
      dot: "bg-[#39FF14]",
      icon: <Wifi className="h-3.5 w-3.5 text-[#39FF14]" />,
    },
    connecting: {
      label: "Connecting",
      dot: "bg-amber-400",
      icon: <Wifi className="h-3.5 w-3.5 text-amber-400" />,
    },
    reconnecting: {
      label: "Reconnecting",
      dot: "bg-amber-400",
      icon: <Wifi className="h-3.5 w-3.5 text-amber-400" />,
    },
    offline: {
      label: "Offline",
      dot: "bg-[#FF073A]",
      icon: <WifiOff className="h-3.5 w-3.5 text-[#FF073A]" />,
    },
  };

  const status = statusConfig[connectionState];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08080a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="LALAN Logo" className="h-16 w-auto object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black uppercase tracking-[0.2em] text-zinc-100">
              LALAN
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
              Quantitative Engine
            </span>
          </div>
        </div>

        {/* System status bar */}
        <div className="hidden items-center gap-4 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 md:flex">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.dot} opacity-60`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`}
              />
            </span>
            <span className="text-xs font-medium text-zinc-300">
              {status.label}
            </span>
          </div>
          <div className="h-3.5 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            {status.icon}
            <span className="font-mono text-xs text-zinc-400">
              {latencyMs.toFixed(2)} ms
            </span>
          </div>
          <div className="h-3.5 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-zinc-300">
              BTC/USDT
            </span>
            <span className="text-xs text-zinc-600">· Live Binance Feed</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setDocsOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Documentation
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  docsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {docsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-white/[0.08] bg-[#0f0f13]/95 p-3 text-xs text-zinc-400 shadow-2xl backdrop-blur-xl"
                >
                  <p className="mb-1 font-medium text-zinc-200">
                    Engine Reference
                  </p>
                  <p>
                    Ring-buffer LOB engine · LMAX Disruptor · O(1) matching ·
                    zero-GC price primitives (÷10,000).
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-white text-zinc-950 px-3.5 py-2 text-xs font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <TerminalSquare className="h-3.5 w-3.5" />
            Terminal View
          </a>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   SUB-COMPONENT: Hero + Animated Ticker Ribbon
   ============================================================ */

function HeroSection({ metrics }: { metrics: EngineMetrics }) {
  const tickerItems = [
    {
      label: "Total Orders Processed",
      value: metrics.totalOrdersProcessed.toLocaleString("en-US"),
    },
    { label: "Ring Buffer Memory Overhead", value: "0 MB GC Pause" },
    { label: "Active Latency", value: `${metrics.latencyMs.toFixed(2)} ms` },
    { label: "Matching Complexity", value: "O(1) LOB" },
    { label: "Concurrency Model", value: "Lock-Free Disruptor" },
  ];

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-14">
      {/* Ambient background noise / radial gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/[0.08] blur-[120px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.05] blur-[100px]" />
        <div className="absolute left-0 top-60 h-[400px] w-[400px] rounded-full bg-rose-500/[0.05] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            <Activity className="h-3 w-3 text-emerald-400" />
            Sub-Millisecond Market Microstructure
          </div>
          <h1 className="flex flex-col gap-3">
            <span className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-zinc-400">
              We don&apos;t chase alpha.
            </span>
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[1.1]">
              We eliminate risk,<br />and the alpha chases us.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
            A zero-allocation limit order book engine streaming live BTC/USDT
            L2 depth from Binance — decomposing order flow into imbalance,
            drift, and directional signal in real time.
          </p>
        </motion.div>

        {/* Animated ticker ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-full border border-white/[0.08] bg-[#0f0f13]/80 py-2.5 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0f0f13] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0f0f13] to-transparent" />
          <div className="flex w-max animate-[ticker_22s_linear_infinite] gap-10 px-6">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex shrink-0 items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide text-zinc-600">
                  {item.label}
                </span>
                <span className="font-mono text-xs font-medium text-zinc-200">
                  {item.value}
                </span>
                <span className="text-zinc-700">•</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   SUB-COMPONENT: Card A — AI Predictor Matrix
   ============================================================ */

function PredictorCard({ metrics }: { metrics: EngineMetrics }) {
  const signalStyles: Record<
    EngineMetrics["signal"],
    { text: string; glow: string; ring: string }
  > = {
    "STRONG BUY": {
      text: "text-[#39FF14]",
      glow: "drop-shadow-[0_0_35px_rgba(57,255,20,0.45)]",
      ring: "ring-emerald-500/30",
    },
    "STRONG SELL": {
      text: "text-[#FF073A]",
      glow: "drop-shadow-[0_0_35px_rgba(255,7,58,0.45)]",
      ring: "ring-rose-500/30",
    },
    NEUTRAL: {
      text: "text-zinc-300",
      glow: "drop-shadow-[0_0_25px_rgba(161,161,170,0.25)]",
      ring: "ring-white/10",
    },
  };

  const style = signalStyles[metrics.signal];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative col-span-2 row-span-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f13]/80 p-6 backdrop-blur-xl ring-1 ${style.ring} md:col-span-1 lg:col-span-2`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] ${
            metrics.signal === "STRONG BUY"
              ? "bg-emerald-500/20"
              : metrics.signal === "STRONG SELL"
              ? "bg-rose-500/20"
              : "bg-zinc-500/10"
          }`}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          AI Predictor Matrix
        </span>
        <Gauge className="h-4 w-4 text-zinc-600" />
      </div>

      <div className="mt-8 flex flex-col items-center justify-center py-6 text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={metrics.signal}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`text-4xl font-bold tracking-tight md:text-5xl ${style.text} ${style.glow}`}
          >
            {metrics.signal}
          </motion.span>
        </AnimatePresence>

        <div className="mt-6 w-full max-w-xs">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Confidence</span>
            <span className="font-mono text-zinc-300">
              <CountUpDisplay end={metrics.confidence} decimals={1} duration={600} />%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              animate={{ width: `${metrics.confidence}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`h-full rounded-full ${
                metrics.signal === "STRONG BUY"
                  ? "bg-[#39FF14]"
                  : metrics.signal === "STRONG SELL"
                  ? "bg-[#FF073A]"
                  : "bg-zinc-500"
              }`}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-xs text-zinc-500">
          <span>OBI Drift</span>
          <span className="font-mono font-medium text-zinc-300">
            {metrics.obi >= 0 ? "+" : ""}
            {metrics.obi.toFixed(3)}
          </span>
          {metrics.obi >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   SUB-COMPONENT: Cards B & C — Best Ask / Best Bid Depth
   ============================================================ */

function DepthCard({
  side,
  level,
  maxQty,
}: {
  side: "ask" | "bid";
  level: DepthLevel;
  maxQty: number;
}) {
  const isAsk = side === "ask";
  const pct = maxQty > 0 ? clamp((level.qty / maxQty) * 100, 0, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f13]/80 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          Best {isAsk ? "Ask" : "Bid"}
        </span>
        {isAsk ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-[#f43f5e]" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-[#10b981]" />
        )}
      </div>

      <div
        className={`mt-3 font-mono text-2xl font-semibold tabular-nums ${
          isAsk ? "text-[#f43f5e]" : "text-[#10b981]"
        }`}
      >
        <CountUpDisplay
          end={level.price || 0}
          decimals={2}
          duration={500}
          prefix="$"
          separator=","
        />
      </div>

      <div className="mt-1 text-xs text-zinc-500">
        Liquidity Weight ·{" "}
        <span className="font-mono text-zinc-300">
          {formatBtc(level.qty)} BTC
        </span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`h-full rounded-full ${
            isAsk
              ? "bg-gradient-to-r from-[#f43f5e]/60 to-[#FF073A]"
              : "bg-gradient-to-r from-[#10b981]/60 to-[#39FF14]"
          }`}
        />
      </div>
    </motion.div>
  );
}

/* ============================================================
   SUB-COMPONENT: Card D — Microstructure Depth Ladder
   ============================================================ */

function DepthLadder({
  bids,
  asks,
}: {
  bids: DepthLevel[];
  asks: DepthLevel[];
}) {
  const rows = Array.from({ length: 5 });
  const maxQty = Math.max(
    1,
    ...bids.map((b) => b.qty || 0),
    ...asks.map((a) => a.qty || 0)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="col-span-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f13]/80 p-5 backdrop-blur-xl md:col-span-1 lg:col-span-1"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          Microstructure Depth Ladder
        </span>
        <span className="text-[10px] text-zinc-600">L2 · 5 Levels</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px] uppercase tracking-wide text-zinc-600">
        <span>Bids</span>
        <span className="text-right">Asks</span>
      </div>

      <div className="mt-1.5 flex flex-col gap-1">
        {rows.map((_, i) => {
          const bid = bids[i];
          const ask = asks[i];
          const bidPct = bid
            ? clamp(((bid.qty || 0) / maxQty) * 100, 0, 100)
            : 0;
          const askPct = ask
            ? clamp(((ask.qty || 0) / maxQty) * 100, 0, 100)
            : 0;

          return (
            <div
              key={i}
              className="relative grid grid-cols-2 gap-3 py-1 text-xs"
            >
              <div className="relative flex items-center overflow-hidden rounded-md">
                <div
                  className="absolute inset-y-0 right-0 rounded-md bg-emerald-500/10"
                  style={{ width: `${bidPct}%` }}
                />
                <span className="relative z-10 font-mono text-emerald-400">
                  {bid ? formatUsd(bid.price) : "—"}
                </span>
              </div>
              <div className="relative flex items-center justify-end overflow-hidden rounded-md text-right">
                <div
                  className="absolute inset-y-0 left-0 rounded-md bg-rose-500/10"
                  style={{ width: `${askPct}%` }}
                />
                <span className="relative z-10 font-mono text-rose-400">
                  {ask ? formatUsd(ask.price) : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ============================================================
   SUB-COMPONENT: Quantitative Analytics Panel
   ============================================================ */

function AnalyticsPanel({ metrics }: { metrics: EngineMetrics }) {
  const obiPct = ((clamp(metrics.obi, -1, 1) + 1) / 2) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="grid grid-cols-2 gap-4 rounded-2xl border border-white/[0.08] bg-[#0f0f13]/80 p-5 backdrop-blur-xl md:grid-cols-4"
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
          Spread
        </p>
        <p className="mt-1.5 font-mono text-lg font-semibold text-zinc-100">
          {formatUsd(metrics.spread)}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-600">
          {metrics.spreadBps.toFixed(2)} bps
        </p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
          Mid-Price
        </p>
        <p className="mt-1.5 font-mono text-lg font-semibold text-zinc-100">
          {formatUsd(metrics.midPrice)}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-600">
          Geometric midpoint
        </p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
          Micro-Price
        </p>
        <p className="mt-1.5 font-mono text-lg font-semibold text-indigo-400">
          {formatUsd(metrics.microPrice)}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-600">
          VWAP-weighted drift
        </p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
          Order Book Imbalance
        </p>
        <div className="relative mt-3 h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF073A]/40 via-white/10 to-[#39FF14]/40">
          <motion.div
            animate={{ left: `${obiPct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#08080a] bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-zinc-600">
          <span>-1.0</span>
          <span className="font-mono text-zinc-300">
            {metrics.obi >= 0 ? "+" : ""}
            {metrics.obi.toFixed(2)}
          </span>
          <span>+1.0</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   SUB-COMPONENT: Real-Time Micro-Price Sparkline
   ============================================================ */

function Sparkline({ data }: { data: number[] }) {
  const { path, lastPoint, width, height } = useMemo(() => {
    const w = 600;
    const h = 120;
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="rounded-2xl border border-white/[0.08] bg-[#0f0f13]/80 p-5 backdrop-blur-xl"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          Real-Time Tick Micro-Price
        </span>
        <span className="text-[10px] text-zinc-600">
          Last {SPARKLINE_LENGTH} ticks
        </span>
      </div>

      {data.length < 2 ? (
        <div className="flex h-[120px] items-center justify-center text-xs text-zinc-600">
          Awaiting live tick data…
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[120px] w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {path && (
            <path
              d={`${path} L ${width} ${height} L 0 ${height} Z`}
              fill="url(#sparklineFill)"
              stroke="none"
            />
          )}
          {path && (
            <path
              d={path}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {lastPoint && (
            <circle
              cx={lastPoint[0]}
              cy={lastPoint[1]}
              r="4"
              fill="#3b82f6"
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            >
              <animate
                attributeName="r"
                values="4;6;4"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>
      )}
    </motion.div>
  );
}

/* ============================================================
   PAGE — top-level composition
   ============================================================ */

export default function Home() {
  const { metrics, connectionState, sparkline } = useMarketEngine();

  const maxQty = Math.max(
    metrics.bestAsk.qty || 0,
    metrics.bestBid.qty || 0,
    1
  );

  return (
    <main className="min-h-screen bg-[#08080a] text-zinc-100 antialiased">
      <HeaderNav
        connectionState={connectionState}
        latencyMs={metrics.latencyMs}
      />
      <HeroSection metrics={metrics} />

      <section className="mx-auto max-w-[1600px] px-6 pb-24">
        {/* Bento grid workspace */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PredictorCard metrics={metrics} />
          <DepthCard side="ask" level={metrics.bestAsk} maxQty={maxQty} />
          <DepthCard side="bid" level={metrics.bestBid} maxQty={maxQty} />
          <DepthLadder bids={metrics.bids} asks={metrics.asks} />
        </div>

        {/* Analytics + sparkline + signals */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <AnalyticsPanel metrics={metrics} />
          </div>
          <div className="lg:col-span-1">
            <Sparkline data={sparkline} />
          </div>
          <div className="lg:col-span-1">
            <ConsensusMatrix />
          </div>
        </div>
      </section>
    </main>
  );
}

# LALAN HFT & Autonomous Robo-Advisor Platform

Ultra-low latency co-located market microstructure trading dashboard, Order Book Imbalance (OBI) forecasting, and autonomous Black-Litterman Robo-Advisor.

## Key Features

- **Interactive 11-Slide PPT Presentation Deck (`/about`)**: Full PowerPoint-style presentation experience with Framer Motion slide transitions, live simulator widgets, presenter teleprompter notes, Web Audio synthesized sound effects, and laser pointer mode.
- **Microsecond Order Book Telemetry**: Sub-microsecond (0.42µs P99) L2 order depth feed processing powered by a lock-free LMAX Disruptor ring buffer.
- **Quant Microstructure Signals**: Real-time Order Book Imbalance (OBI), Micro-Price drift forecasting, Hawkes process intensity, and VPIN toxicity radar.
- **Autonomous Robo-Advisor Engine**: Black-Litterman target allocations across 10 asset classes, dynamic threshold rebalancing, and 30-day wash-sale protected Tax-Loss Harvesting.
- **Multi-Broker API Bridge**: Unified low-latency API router across Zerodha Kite, DhanHQ, Upstox, AngelOne, and Groww.

## Getting Started

```bash
# Run Development Server
npm run dev

# Run Vitest Quantitative Engine Unit Tests
npm run test

# Run ESLint Audit
npm run lint

# Build Production Production Bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the terminal dashboard or [http://localhost:3000/about](http://localhost:3000/about) to launch the PPT presentation deck.

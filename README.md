# Predictive Market Microstructure Engine: O(1) Limit Order Book & High-Frequency Price Forecasting

A completely containerized, ultra-low latency quantitative trading platform. This project blends classical High-Frequency Trading (HFT) infrastructure with real-time Machine Learning feature extraction, streaming predictive signals directly to a Next.js dashboard.

## Architecture

```text
 [ Synthetic Market Simulator ] 
              │
              ▼
   (Lock-Free Ring Buffer)
      LMAX DISRUPTOR
              │
      ┌───────┴────────┐
      ▼                ▼
[ Matching ]     [ Analytics ]
[  Engine  ]     [ Extractor ]
 (O(1) LOB)     (ML Features)
      │                │
      └───────┬────────┘
              ▼
    [ MarketDataServer ]
       (WebSockets)
              │
              ▼
   [ Next.js Dashboard ]
      (React + Tailwind)
```

## Core Technical Achievements
* **Zero-Allocation Memory Architecture:** Natively uses raw primitive variables alongside a custom lock-free `LongObjectHashMap` to actively bypass Java Garbage Collection (GC) pauses during runtime.
* **LMAX Disruptor Concurrency:** Bypasses conventional threading locks. Leverages a `SingleProducerSequencer` paired with a `BusySpinWaitStrategy` to ensure threads stay indefinitely hot on the CPU, stripping away deadly context-switching delays.
* **O(1) Time Complexity Matching:** Order placements, fills, and cancellations map mathematically to Double-Linked Lists on the Level 1 depth chart, fulfilling strict constant-time algorithms.
* **Asynchronous ML Feature Extraction:** A parallel pipeline natively intercepts event feeds simultaneously to the execution engine. It derives quantitative Machine Learning parameters (`Spread`, `Mid-Price`, `Micro-Price`, and `Order Book Imbalance`) lock-free!

## Quick Start (Docker Compose)

You can launch the entire HFT execution core and the predictive front-end dashboard instantly utilizing Docker. 

From the root of this repository, simply run:

```bash
docker-compose up --build
```

- **Next.js Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Java WebSocket Feed:** `ws://localhost:8887`

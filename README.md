# LALAN (Market Microstructure & Order Flow Engine)

LALAN is a high-frequency trading intelligence terminal designed to provide institutional-grade microstructure analysis to retail traders. 

Instead of relying on trailing indicators or historical candlestick charts, LALAN connects directly to live exchange WebSocket feeds (such as Binance or DhanHQ), capturing Level 2 order book data in real-time. By processing this hidden liquidity, LALAN acts as an "X-Ray," identifying trade intent, order book imbalances, and hidden iceberg orders before price physically moves.

## Core Value Proposition

* **Traditional Exchanges:** Show what has *already* happened (Price Action / Candlesticks).
* **LALAN:** Shows what is *about to* happen (Order Intent / Imbalance / Icebergs).
* **Objective:** Give retail and options traders the exact mathematical edge used by quantitative hedge funds, enabling sniper entries and extreme risk mitigation.

## System Architecture

LALAN is built for extreme low-latency processing, utilizing a bifurcated architecture:

### 1. The X-Ray Engine (Backend)
Built in **Java 17+**, leveraging the **LMAX Disruptor** design pattern.
* **Why LMAX Disruptor?** It provides a lock-free ring buffer that eliminates Garbage Collection pauses and memory allocation overhead. It allows the engine to process millions of incoming Bid/Ask events per second with sub-millisecond latency.
* **Institutional Microstructure Suite**:
  * **Iceberg & Spoofing Detector (`IcebergDetector`)**: Detects hidden volume refills and abnormal liquidity walls in real-time.
  * **Order Flow Toxicity (VPIN)**: Volume-Synchronized Probability of Toxicity tracking buyer/seller aggressive volume imbalances.
  * **AI Predictor Matrix**: Computes directional mid-price drift probability (in basis points) and signal state (`STRONG BUY`, `BUY`, `NEUTRAL`, `SELL`, `STRONG SELL`).
* **Multi-Broker Feed Adapters**: Modular architecture supporting Binance L2 Depth, **DhanHQ Direct L2 Feed**, **Zerodha Kite Connect Ticker**, and synthetic market flow simulators.

### 2. The Intelligence Terminal (Frontend)
Built with **Next.js 15**, **React**, and **TypeScript**, styled for an elite, Bloomberg-terminal aesthetic.
* Streams live WebSocket signals directly from the Java Engine (`ws://localhost:8887`).
* Replaces standard charts with quantitative gauges: Order Book Imbalance (OBI), Micro-Price Drift, VPIN Toxicity, and AI Predictive Directional Flow.
* **Indian Market Intelligence & Multi-Broker Matrix**: Live L2 depth, tick-level Order Book Imbalance, and cross-platform buying vs. selling ratio breakdowns for top NSE/BSE stocks & indices (NIFTY 50, RELIANCE, HDFCBANK, TATAMOTORS, INFY) across major Indian brokers (**DhanHQ, Zerodha Kite, Groww, Angel One, Upstox, ICICI Direct**).

## Core Mathematical Models

### Order Book Imbalance (OBI)
OBI measures the immediate pressure difference between buyers and sellers sitting at the top of the order book:

$$\text{OBI} = \frac{V_{\text{bid}} - V_{\text{ask}}}{V_{\text{bid}} + V_{\text{ask}}}$$

**Interpretation:**
* **OBI = +1.0:** 100% Buying Pressure (Extreme Bullish Imbalance)
* **OBI = -1.0:** 100% Selling Pressure (Extreme Bearish Imbalance)
* **OBI = 0:** Perfect Equilibrium

### Volume-Weighted Micro-Price
$$\text{Micro-Price} = \frac{P_{\text{bid}} \cdot V_{\text{ask}} + P_{\text{ask}} \cdot V_{\text{bid}}}{V_{\text{bid}} + V_{\text{ask}}}$$

Directly predicts the direction toward which price will slip based on relative liquidity weight at the top levels.

---

## Technical Stack & Features Summary

| Component | Technology | Highlights |
| :--- | :--- | :--- |
| **Engine Core** | Java 17, LMAX Disruptor | Lock-Free Ring Buffer, Zero-GC Primitives, $O(1)$ Matching |
| **Microstructure ML** | Custom Feature Extractor | OBI, Micro-Price Drift, VPIN Toxicity, Iceberg Detection |
| **Network Protocol** | Java-WebSocket & JSON | High-Frequency Throttled Broadcasts (100ms) |
| **Terminal UI** | Next.js, Framer Motion, Lucide | Bloomberg Dark Aesthetics, CountUp Animations, Mobile Responsive |
| **Broker Suite** | DhanHQ, Zerodha Kite, Upstox, Binance | Multi-Broker Depth & Liquidity Matrix |

---

## Licensing & Usage

* **Frontend UI (Public):** Showcase design capability and architectural implementation.
* **Backend Java LMAX Engine (Private):** Core quantitative moat, low-latency Disruptor ring buffer, and proprietary signal generation algorithms.

# LALAN (Market Microstructure & Order Flow Engine)

LALAN is a high-frequency trading intelligence terminal designed to provide institutional-grade microstructure analysis to retail traders. 

Instead of relying on trailing indicators or historical candlestick charts, LALAN connects directly to live exchange WebSocket feeds (such as Binance or DhanHQ), capturing Level 2 order book data in real-time. By processing this hidden liquidity, LALAN acts as an "X-Ray," identifying trade intent and order book imbalances before the price physically moves.

## Core Value Proposition

* **Traditional Exchanges:** Show what has *already* happened (Price Action / Candlesticks).
* **LALAN:** Shows what is *about to* happen (Order Intent / Imbalance).
* **Objective:** Give retail and options traders the exact mathematical edge used by quantitative hedge funds, enabling sniper entries and extreme risk mitigation.

## System Architecture

LALAN is built for extreme low-latency processing, utilizing a bifurcated architecture:

### 1. The X-Ray Engine (Backend)
Built in **Java**, leveraging the **LMAX Disruptor** design pattern.
* **Why LMAX Disruptor?** It provides a lock-free ring buffer that eliminates Garbage Collection pauses and memory allocation overhead. It allows the engine to process millions of incoming Bid/Ask events per second with sub-millisecond latency.
* **Data Ingestion:** Currently engineered for Binance WebSocket feeds, with active integration mapping for Indian Broker APIs (DhanHQ) to support NSE/BSE Options & Equities.

### 2. The Intelligence Terminal (Frontend)
Built with **Next.js** and **React**, styled for an elite, Bloomberg-terminal aesthetic.
* Streams live WebSocket signals directly from the Java Engine.
* Replaces standard charts with proprietary quantitative gauges: OBI (Order Book Imbalance), Micro-Price Drift, and AI Predictive Directional Flow.

## Core Mathematical Models

LALAN does not guess price action; it calculates market weight. The primary quantitative model driving the AI Predictor Matrix is the **Order Book Imbalance (OBI)**.

### Order Book Imbalance (OBI)
OBI measures the immediate pressure difference between buyers and sellers sitting at the top of the order book. 

**The Formula:**
```
OBI = (Volume_Bid - Volume_Ask) / (Volume_Bid + Volume_Ask)
```
*Where Volume is calculated from the Top 5 or Top 10 levels of the Level 2 depth.*

**Interpretation:**
* **OBI = +1.0:** 100% Buying Pressure (Extreme Bullish Imbalance)
* **OBI = -1.0:** 100% Selling Pressure (Extreme Bearish Imbalance)
* **OBI = 0:** Perfect Equilibrium

*Example:* If a massive invisible sell wall appears just above the current price, the OBI instantly drops to a heavy negative value. LALAN detects this mathematical blockade and flashes a "High Buy-Side Risk" warning, preventing a trader from entering a doomed long position.

## Licensing & Usage

**Should this repository be Public or Private?**
* **Frontend UI (Public):** The Next.js dashboard code can be public. It showcases your design capability and architectural skills.
* **Backend Java LMAX Engine (Private):** It is highly recommended to keep the core LMAX quantitative engine **Private**. The proprietary math, low-latency optimizations, and specific broker API implementations are your core business "moat." If published publicly, algorithmic trading firms can clone your execution strategy for free. 

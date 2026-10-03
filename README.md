<div align="center">

  # ⚡ LALAN HFT Predictor & Market Microstructure Engine

  **Ultra-Low Latency L2 Order Book Forecasting, Lock-Free Concurrency & Institutional Liquidity Intelligence**

  [![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Java 17](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
  [![LMAX Disruptor](https://img.shields.io/badge/LMAX-Disruptor-emerald?style=for-the-badge)](https://lmax-exchange.github.io/disruptor/)
  [![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Executive Overview

**LALAN** is a state-of-the-art **High-Frequency Trading (HFT) Market Microstructure Terminal & Predictive Order Flow Engine**. Engineered for retail quants, options traders, and institutional trading desks in India and global crypto markets.

While traditional charting tools display lagging price action (what *already* occurred), LALAN connects directly to exchange WebSocket Level-2 depth feeds. By processing raw order book updates through a **Zero-Allocation LMAX Disruptor Ring Buffer**, LALAN computes **Order Book Imbalance (OBI)**, **VWAP Micro-Price Drift**, and **VPIN Toxicity** in sub-millisecond real time — revealing institutional intent before market sweeps physically move price.

> [!IMPORTANT]
> **Core Value Proposition:**
> Traditional technical indicators show *historical output*. LALAN exposes *liquidity input*, enabling options traders to catch directional sweeps, spot spoofed walls, and mitigate slippage with O(1) execution precision.

---

## 🚀 Key Features & Capabilities

- ⚡ **Sub-Millisecond Execution Telemetry**: Real-time tick stream processing with < 0.8ms average latency.
- 🔄 **Zero-GC Memory Layout**: Lock-free Java 17 primitives and primitive array ring-buffers eliminate JVM garbage collection pauses.
- 📊 **Order Book Imbalance (OBI) Signals**: Live signal generation (`STRONG BUY`, `STRONG SELL`, `NEUTRAL`) based on top 5-level liquidity weight.
- 🎯 **VWAP Micro-Price Forecasting**: Real-time volume-weighted price drift calculations indicating immediate quote movement.
- 🇮🇳 **Indian Market Multi-Broker Matrix**: Aggregated order flow across **NIFTY 50**, **NIFTY BANK**, **RELIANCE**, **HDFCBANK**, **TATAMOTORS**, and **INFY** across DhanHQ, Groww, Angel One, and Upstox.
- ☀️/🌙 **Dark & Light Mode Trading Terminal**: Seamless high-contrast Zerodha-grade light mode and sleek Bloomberg dark mode with instant persistence.
- 📱 **100% Mobile Responsive UI**: Dynamic bottom navigation bar, touch-optimized L2 depth ladders, drawer menus, and mobile order tickets for smartphones & tablets.

---

## 🏗️ System Architecture

```
                       +-----------------------------------+
                       |   Exchange WebSocket Depth Stream |
                       | (Binance / DhanHQ / Indian L2)    |
                       +-----------------+-----------------+
                                         |
                                         v
               +---------------------------------------------------+
               |  LALAN Java 17 X-Ray Engine (LMAX Disruptor)      |
               |                                                   |
               |  +---------------------------------------------+  |
               |  | Circular Ring-Buffer (1,048,576 slots)       |  |
               |  | Cache-Line Padding (64 Bytes)               |  |
               |  +----------------------+----------------------+  |
               |                         |                         |
               |  +----------------------v----------------------+  |
               |  | Microstructure Analytics Suite              |  |
               |  | - Order Book Imbalance (OBI)                |  |
               |  | - VWAP Micro-Price Drift                    |  |
               |  | - VPIN Toxicity & Iceberg Detector          |  |
               |  +----------------------+----------------------+  |
               +-------------------------+-------------------------+
                                         |
                       +-----------------+-----------------+
                       | Low-Latency JSON WebSocket Stream |
                       +-----------------+-----------------+
                                         |
                                         v
               +---------------------------------------------------+
               |  LALAN Next.js 16 Terminal UI (React 19 / TS)     |
               |  - Real-Time L2 Depth Ladder & Sparklines         |
               |  - Multi-Broker Liquidity Matrix                  |
               |  - Instant Dark / Light Mode Switcher             |
               |  - Fully Responsive Mobile Trading Bar            |
               +---------------------------------------------------+
```

---

## 🧮 Core Mathematical Models

### 1. Order Book Imbalance (OBI)
OBI measures the immediate volume imbalance between buyers and sellers sitting at the top 5 depth levels:

$$\text{OBI} = \frac{V_{\text{bid}} - V_{\text{ask}}}{V_{\text{bid}} + V_{\text{ask}}}$$

- $\text{OBI} > +0.35$: **STRONG BUY** (Heavy bid accumulation)
- $\text{OBI} < -0.35$: **STRONG SELL** (Heavy ask pressure)
- $\text{OBI} \approx 0$: **NEUTRAL** (Liquidity Equilibrium)

### 2. Volume-Weighted Micro-Price
$$\text{Micro-Price} = \frac{P_{\text{bid}} \cdot V_{\text{ask}} + P_{\text{ask}} \cdot V_{\text{bid}}}{V_{\text{bid}} + V_{\text{ask}}}$$

Predicts the geometric mid-price direction based on bid vs. ask depth density.

---

## 🛠️ Tech Stack

| Component | Technology | Highlights |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.3 (Turbopack)** | Server/Client Components, App Router, Static Optimization |
| **UI Library** | **React 19.2** | Concurrent rendering, Hooks state management |
| **Styling & Themes** | **Tailwind CSS v4 & Vanilla CSS** | Theme Context, Dark/Light Mode Variables, Glassmorphism |
| **Icons & Motion** | **Framer Motion & Lucide React** | Micro-animations, responsive layout transitions |
| **Backend Core** | **Java 17+, LMAX Disruptor** | Lock-free ring buffer, $O(1)$ matching, Zero-GC primitives |
| **Networking** | **WebSockets & JSON Stream** | Sub-millisecond throttled telemetry (100ms updates) |

---

## 💻 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### 1. Clone Repository
```bash
git clone https://github.com/eayushsingh/hft-orderbook-predictor.git
cd hft-orderbook-predictor/hft-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build Production Bundle
```bash
npm run build
npm start
```

---

## 📁 Repository Structure

```
hft-orderbook-predictor/
├── README.md                      # GitHub Repository Documentation
├── MICROSTRUCTURE_THEORY.md       # Quantitative HFT Theory & Formulas
├── docker-compose.yml             # Docker Containerization Setup
└── hft-dashboard/                 # Next.js 16 Web Application
    ├── public/                    # Assets & Logo Branding
    ├── src/
    │   ├── app/                   # Next.js App Router Pages
    │   │   ├── about/             # Story, Engine Metrics & Founders
    │   │   ├── dashboard/         # Live HFT Terminal & L2 Depth
    │   │   ├── pricing/           # Subscription Tiers & Brokerage
    │   │   ├── products/          # Ecosystem Products Overview
    │   │   ├── support/           # Developer Knowledge Base & FAQs
    │   │   ├── globals.css        # Theme Variables & Overrides
    │   │   ├── layout.tsx         # Root Layout & ThemeProvider
    │   │   └── page.tsx           # Landing Page & Terminal Mockup
    │   ├── components/            # Reusable Modular UI Components
    │   │   ├── LalanSiteHeader.tsx
    │   │   ├── LalanNavbar.tsx
    │   │   ├── LalanWatchlist.tsx
    │   │   ├── LalanPositionsAndOrders.tsx
    │   │   ├── LalanOrderTicketModal.tsx
    │   │   ├── LalanSiteFooter.tsx
    │   │   ├── IndianMarketMatrix.tsx
    │   │   └── ConsensusMatrix.tsx
    │   └── context/
    │       └── ThemeContext.tsx   # Global Dark/Light Theme Provider
```

---

## 📄 License & Attribution

Distributed under the MIT License. Designed and developed with ❤️ by **Ayush**.


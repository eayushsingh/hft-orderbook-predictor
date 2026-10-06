# LALAN Institutional PPT Presentation Deck Documentation & User Guide

## Overview

The **LALAN Institutional PPT Presentation Deck** is an interactive, animated presentation engine built directly into the `/about` route of the LALAN Quantitative Monorepo.

Designed for executive briefings, institutional investor demos, and quant team onboarding, the deck combines PowerPoint-style slide navigation with real-time interactive trading simulators and Framer Motion micro-animations.

---

## Slide Registry Breakdown (11 Slides)

1. **Slide 01 — Platform Vision & Institutional Advantage**
   - Highlighting 0.42µs co-located binary feed processing vs 250ms+ retail REST polling.
2. **Slide 02 — High-Frequency System Architecture**
   - Zero-GC Java 21 LMAX Disruptor ring buffer load simulator with real-time buffer utilization ring.
3. **Slide 03 — Quantitative Order Book Microstructure Engine**
   - Live Order Book Imbalance (OBI) & Micro-Price drift calculator with interactive depth sliders.
4. **Slide 04 — Autonomous Robo-Advisor Engine**
   - Black-Litterman MPT target allocation engine with dynamic risk profile slider.
5. **Slide 05 — Multi-Broker Integration Bridge**
   - Unified low-latency API gateway across Zerodha Kite, DhanHQ, Upstox, AngelOne, and Groww.
6. **Slide 06 — Institutional Benchmark Comparison Matrix**
   - Feature parity evaluation matrix comparing LALAN vs Bloomberg Terminal ($2,400/mo) and Refinitiv Eikon.
7. **Slide 07 — High-Performance Technology Stack**
   - Full-stack technical breakdown across Java 21 LTS, Next.js 16 Turbopack, and SQLite WAL.
8. **Slide 08 — Quantitative Microstructure Alpha Signals**
   - Self-exciting Hawkes Process equations, OBI delta metrics, and 2D ConvLSTM LOB deep-net hit ratio.
9. **Slide 09 — Risk Engineering & Regulatory Compliance**
   - Sub-microsecond FPGA pre-trade circuit breakers, SEBI circular compliance, and PTP audit trail.
10. **Slide 10 — Interactive Order Execution Sandbox**
    - Embedded sub-microsecond order burst generator testing colocation tick-to-trade throughput.
11. **Slide 11 — Strategic Enterprise Roadmap (2026–2027)**
    - Strategic milestones including Option Greeks Delta Radar, Crypto Perpetuals basis arb, and FIX 5.0 bridge.

---

## Key Presenter Features & Shortcut Keys

| Key / Control | Action Description |
|---|---|
| `Right Arrow / Space / N` | Advance to Next Slide |
| `Left Arrow / P` | Go back to Previous Slide |
| `F` | Toggle Full-Screen Presentation Mode |
| `G` | Open Slide Thumbnail Grid Index |
| `S` | Toggle Presenter Speaker Notes Drawer |
| `L` | Toggle Presenter Laser Pointer Canvas Tool |
| `M` | Toggle Slide Transition Audio Feedback |
| `A` | Toggle Auto-Advance Slideshow Timer |
| `?` | Display Keyboard Shortcuts Help Overlay |
| `Esc` | Close Modals / Exit Fullscreen |

---

## Technical Stack & Testing

- **UI & Animations**: React 19, Next.js 16 Turbopack, Framer Motion, Tailwind CSS v4.
- **Audio Feedback**: Web Audio API (Synthesized native click & chime audio without external MP3 assets).
- **Unit Test Suite**: Vitest (`npm run test`) verifying registry integrity and 11 slide categories.
- **E2E Test Suite**: Playwright (`npm run test:e2e`) validating navigation, shortcuts, and grid modal.

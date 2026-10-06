# Institutional PPT Presentation Deck Architecture & User Guide

## 1. Executive Overview

The **Interactive PPT Presentation Deck** is a production-grade, full-screen slide deck system integrated directly into the LALAN Quantitative Platform at `/about` and within the `AboutUsModal.tsx` modal.

Key features include:
- **Interactive Slide Navigation**: Keyboard arrow navigation (`ArrowLeft` / `ArrowRight`), slide counter, and quick progress bar.
- **Auto-Play Slideshow Engine**: Configurable slideshow timer with Play/Pause controls.
- **Presenter Speaker Notes Drawer**: Toggleable notes overlay providing detailed talking points for each slide.
- **Slide Grid Overview Modal**: Jump to any of the 8 slides instantly.
- **Summary Exporter**: One-click export of presentation briefing summaries to downloadable Markdown files.
- **Embedded Interactive Widgets**: Live interactive sliders for Order Book Imbalance (OBI), Micro-Price, Disruptor throughput, and Robo-Advisor risk models directly inside slides.

---

## 2. Slide Index & Topics

| Slide # | Title | Category | Interactive Widget | Key Takeaway |
| :--- | :--- | :--- | :--- | :--- |
| **Slide 01** | Platform Vision & Institutional Advantage | OVERVIEW | Comparison Matrix | Sub-microsecond co-located edge |
| **Slide 02** | HFT Engine & LMAX Disruptor Architecture | ARCHITECTURE | Live Disruptor Load Simulator | Zero-GC lock-free ring buffer |
| **Slide 03** | Quantitative Order Book Microstructure Engine | MICROSTRUCTURE | Live OBI & Micro-Price Calculator | OBI & Micro-Price equations |
| **Slide 04** | Autonomous Robo-Advisor & Portfolio Model | ROBO_ADVISOR | Live Risk Score Slider | Black-Litterman & Tax Loss Harvesting |
| **Slide 05** | Multi-Broker Low-Latency API Bridge | MULTI_BROKER | Gateway Matrix | Zerodha, DhanHQ, Upstox, AngelOne, Groww |
| **Slide 06** | Institutional Benchmark Comparison Matrix | BENCHMARK | Feature Table | LALAN vs Bloomberg ($2,400/mo) |
| **Slide 07** | High-Performance Tech Stack | TECH_STACK | Stack Breakdown | Java 21, Next.js 16, SQLite WAL |
| **Slide 08** | Strategic Enterprise Roadmap (2026-2027) | ROADMAP | Timeline Grid | Delta hedging & FIX 5.0 bridge |

---

## 3. Directory Structure

```
hft-dashboard/src/components/presentation/
├── types.ts                                # Slide domain models & deck state interface
├── WhatWeDoOverview.tsx                    # Executive "What We Do" summary & platform metrics
├── PresentationNavbarControls.tsx          # Navigation bar, auto-play & fullscreen buttons
├── SlideGridModal.tsx                      # 8-Slide overview thumbnail grid modal
├── SpeakerNotesDrawer.tsx                  # Presenter speaker notes overlay drawer
├── usePresentationKeyboardNav.ts           # Keyboard shortcuts (Arrows, Space, F, Esc)
├── presentationExporter.ts                 # Markdown presentation deck summary exporter
├── InteractivePresentationDeck.tsx         # Master deck container & slide registry
└── slides/                                 # Production Slide Components
    ├── SlideVisionAndMission.tsx           # Slide 1
    ├── SlideArchitecturePPT.tsx            # Slide 2 (with Disruptor Load Simulator)
    ├── SlideOrderBookTheoryPPT.tsx         # Slide 3 (with OBI Calculator)
    ├── SlideRoboAdvisorPPT.tsx             # Slide 4 (with Risk Slider)
    ├── SlideMultiBrokerPPT.tsx             # Slide 5
    ├── SlideBenchmarkPPT.tsx               # Slide 6
    ├── SlideTechStackPPT.tsx               # Slide 7
    └── SlideRoadmapPPT.tsx                 # Slide 8
```

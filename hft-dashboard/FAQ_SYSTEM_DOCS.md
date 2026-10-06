# LALAN Production FAQ & Knowledge Base Documentation

## Overview

The **LALAN FAQ & Knowledge Base** is a production-grade, instant-search documentation system integrated into the `/support` route and accessible via an in-terminal quick drawer in `/dashboard`.

Built with zero-delay client filtering, fuzzy keyword tag matching, and local voting analytics, the FAQ engine delivers sub-millisecond answers to active quant traders, retail investors, and enterprise compliance auditors.

---

## FAQ Categories (8 Modules)

1. **General Platform (`general`)**: Platform vision, no-code visual signals, cross-market exchange feeds (NSE, BSE, Binance).
2. **L2 Terminal Engine (`terminal`)**: Order Book Imbalance (OBI) formula, VWAP Micro-Price drift, and multi-source marketwatch hub.
3. **Robo-Advisor AI (`robo`)**: Black-Litterman asset allocation, dynamic drift threshold rebalancing, and Monte Carlo wealth simulations.
4. **Tax-Loss Harvesting (`tax`)**: 30-day wash-sale protection rules, correlated ETF swaps, and capital gain tax offset limits.
5. **Multi-Broker Gateway (`brokers`)**: Zerodha Kite, DhanHQ, Upstox Pro v3, AngelOne, Groww API hot-failover and OAuth security.
6. **HFT & Co-Location (`hft`)**: Java 21 LTS, LMAX Disruptor zero-GC ring buffer, Solarflare 10GbE network cards, and PTP GPS clocks.
7. **Risk & Compliance (`compliance`)**: SEBI circular compliance, pre-trade circuit breaker collars, and SOC 2 Type II cryptographic audit logs.
8. **Pricing & Billing (`pricing`)**: 14-Day PRO QUANT Free Trial, automatic plan transitions, and zero-brokerage delivery structures.

---

## Technical Features

- **Instant Multi-Term Search**: Filters questions, answers, and tags concurrently.
- **Helpful / Unhelpful Feedback Engine**: Stores user feedback votes in browser `localStorage`.
- **Deep Link Sharing**: Generates shareable URLs with `?faq=id` parameter for instant scrolling to specific questions.
- **In-Terminal Drawer (`QuickFAQDrawerModal.tsx`)**: Allows traders on `/dashboard` to search documentation without leaving their active order ticket setup.
- **Vitest & Playwright Tests**: Automated CI test suites (`faqEngine.test.ts` and `faq.spec.ts`) validating zero broken links or empty answers.

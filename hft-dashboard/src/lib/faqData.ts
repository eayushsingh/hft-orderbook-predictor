export type FAQCategory =
  | 'general'
  | 'terminal'
  | 'robo'
  | 'tax'
  | 'brokers'
  | 'hft'
  | 'compliance'
  | 'pricing';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  categoryLabel: string;
  question: string;
  answer: string;
  tags: string[];
  helpfulCount: number;
  unhelpfulCount: number;
  lastUpdated: string;
}

export interface FAQCategoryMeta {
  id: FAQCategory | 'all';
  label: string;
  description: string;
  iconName: string;
}

export const FAQ_CATEGORIES: FAQCategoryMeta[] = [
  { id: 'all', label: 'All Questions', description: 'Browse all production FAQs', iconName: 'HelpCircle' },
  { id: 'general', label: 'General Platform', description: 'Core platform features and capabilities', iconName: 'Sparkles' },
  { id: 'terminal', label: 'L2 Terminal Engine', description: 'Micro-Price drift, OBI, and depth ladders', iconName: 'Terminal' },
  { id: 'robo', label: 'Robo-Advisor AI', description: 'Black-Litterman model and portfolio rebalancing', iconName: 'Bot' },
  { id: 'tax', label: 'Tax-Loss Harvesting', description: '30-day wash-sale protection and ETF swaps', iconName: 'DollarSign' },
  { id: 'brokers', label: 'Multi-Broker Gateway', description: 'Zerodha, DhanHQ, Upstox, Angel, Groww APIs', iconName: 'Globe' },
  { id: 'hft', label: 'HFT & Co-Location', description: 'Sub-microsecond FPGA zero-GC execution', iconName: 'Zap' },
  { id: 'compliance', label: 'Risk & Compliance', description: 'SEBI circulars, SOC2, and PTP audit logs', iconName: 'ShieldCheck' },
  { id: 'pricing', label: 'Pricing & Billing', description: 'Subscriptions, free trials, and plans', iconName: 'CreditCard' },
];

export const GENERAL_FAQS: FAQItem[] = [
  {
    id: 'faq-gen-1',
    category: 'general',
    categoryLabel: 'General & Platform',
    question: 'What is LALAN HFT Predictor and how does it differ from traditional charting tools?',
    answer:
      'Traditional charting tools like Zerodha Kite or TradingView render historical candlestick output (what already occurred). LALAN connects directly to exchange Level-2 WebSocket streams, running a zero-allocation LMAX Disruptor engine to compute Order Book Imbalance (OBI), VWAP Micro-Price drift, and VPIN liquidity toxicity in sub-millisecond real time. This exposes institutional liquidity input before price moves.',
    tags: ['platform', 'hft', 'charting', 'lmax'],
    helpfulCount: 342,
    unhelpfulCount: 4,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-gen-2',
    category: 'general',
    categoryLabel: 'General & Platform',
    question: 'Can retail traders use institutional HFT signals without coding experience?',
    answer:
      'Yes! LALAN provides pre-built visual HFT predictor signals (STRONG BUY, STRONG SELL, OBI Drift, Micro-Price trend) with real-time confidence percentages so retail options and intraday traders can trade alongside institutional sweeps with zero programming required.',
    tags: ['retail', 'no-code', 'signals', 'intraday'],
    helpfulCount: 289,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-gen-3',
    category: 'general',
    categoryLabel: 'General & Platform',
    question: 'Which stock exchanges and crypto markets does LALAN support?',
    answer:
      'LALAN natively supports Indian equity indices (NIFTY 50, BANK NIFTY, FINNIFTY), top NSE/BSE stocks (RELIANCE, HDFCBANK, TATAMOTORS, INFY, TCS), and Binance Crypto perpetual feeds (BTC/USDT, ETH/USDT, SOL/USDT).',
    tags: ['nse', 'bse', 'nifty', 'crypto', 'binance'],
    helpfulCount: 198,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-gen-4',
    category: 'general',
    categoryLabel: 'General & Platform',
    question: 'Is LALAN web-based or do I need to install desktop software?',
    answer:
      'LALAN is a high-performance Web application built with Next.js 16 Server Components and WebSockets. It runs directly inside any modern web browser (Chrome, Edge, Safari, Firefox) on desktop, laptop, or tablet without needing local software installation.',
    tags: ['web-app', 'browser', 'nextjs', 'cross-platform'],
    helpfulCount: 176,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-gen-5',
    category: 'general',
    categoryLabel: 'General & Platform',
    question: 'How does Binance Crypto Perpetual vs NSE Futures basis arbitrage work?',
    answer:
      'LALAN measures real-time basis divergence between spot asset quotes and perpetual derivative contracts. When funding rate arbitrage windows open, automated cross-market signals trigger cash-and-carry execution strategies.',
    tags: ['crypto', 'perpetual', 'basis-arbitrage', 'funding-rate'],
    helpfulCount: 215,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
];

export const TERMINAL_FAQS: FAQItem[] = [
  {
    id: 'faq-term-1',
    category: 'terminal',
    categoryLabel: 'L2 Terminal Engine',
    question: 'What is Order Book Imbalance (OBI) and how is it calculated?',
    answer:
      'OBI measures immediate top-5 level liquidity imbalance: OBI = (V_bid - V_ask) / (V_bid + V_ask). Values above +0.35 trigger a STRONG BUY signal indicating heavy bid accumulation, while values below -0.35 signal heavy ask liquidity walls.',
    tags: ['obi', 'formula', 'imbalance', 'order-book'],
    helpfulCount: 412,
    unhelpfulCount: 5,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-term-2',
    category: 'terminal',
    categoryLabel: 'L2 Terminal Engine',
    question: 'What is Volume-Weighted Micro-Price and why is it better than Mid-Price?',
    answer:
      'Standard mid-price assumes equal weight between bid and ask. Micro-price weights quote prices by opposite volume density: Micro-Price = (P_bid * V_ask + P_ask * V_bid) / (V_bid + V_ask). If bid volume is 10x ask volume, Micro-Price shifts toward the ask, accurately predicting the next tick sweep.',
    tags: ['micro-price', 'vwap', 'mid-price', 'bid-ask'],
    helpfulCount: 385,
    unhelpfulCount: 3,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-term-3',
    category: 'terminal',
    categoryLabel: 'L2 Terminal Engine',
    question: 'How does the Multi-Source Intelligence Hub work?',
    answer:
      'The Screener & NSE Hub aggregates live metrics from Screener.in (P/E, ROCE, Shareholding), NSE India (SEBI Reg 30 disclosures & block deals), TradingView (technical rating consensus), Moneycontrol (FII/DII net flows), and Trendlyne (delivery volume %) into a single zero-context-switch workspace.',
    tags: ['multi-source', 'screener', 'nse', 'moneycontrol'],
    helpfulCount: 264,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-term-4',
    category: 'terminal',
    categoryLabel: 'L2 Terminal Engine',
    question: 'How do I execute instant buy and sell orders from the L2 Depth Ladder?',
    answer:
      'Click B or S on any stock in the Marketwatch sidebar or use the quick Buy/Sell action buttons in the top navbar. The order ticket modal allows you to configure MIS (Intraday), CNC (Delivery), or Limit/Market parameters with instant fill confirmation.',
    tags: ['order-ticket', 'mis', 'cnc', 'execution'],
    helpfulCount: 221,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-term-5',
    category: 'terminal',
    categoryLabel: 'L2 Terminal Engine',
    question: 'What mathematical equation models Level-2 Micro-Price tick drift?',
    answer:
      'Micro-Price tick drift P_drift = Micro-Price_t + \\exp(-\\lambda * \\Delta t) * (VWAP_b - VWAP_a). The exponential decay factor \\lambda (0.015 ms^-1) accounts for rapid order cancellation and fill depletion across 1-10 tick horizons.',
    tags: ['drift-equation', 'micro-price-math', 'exponential-decay'],
    helpfulCount: 290,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-term-6',
    category: 'terminal',
    categoryLabel: 'L2 Terminal Engine',
    question: 'How is SABR Implied Volatility Surface fitting computed in options terminal?',
    answer:
      'SABR model parameters (Alpha, Beta, Rho, Nu) are fitted to NIFTY/BANKNIFTY option strike chains using Levenberg-Marquardt non-linear least squares optimization to prevent arbitrage along volatility smile curves.',
    tags: ['sabr-model', 'iv-surface', 'volatility-smile', 'options-greeks'],
    helpfulCount: 395,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-term-7',
    category: 'terminal',
    categoryLabel: 'L2 Terminal Engine',
    question: 'What second-order Greeks (Vanna, Volga, Charm) are monitored for tail-risk?',
    answer:
      'Vanna (dDelta/dVol) tracks option delta sensitivity to volatility shifts, Volga (dVega/dVol) monitors vega convexity during vol expansion, and Charm (dDelta/dTime) measures delta decay as expiry approaches.',
    tags: ['second-order-greeks', 'vanna', 'volga', 'charm', 'tail-risk'],
    helpfulCount: 420,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
];

export const ROBO_FAQS: FAQItem[] = [
  {
    id: 'faq-robo-1',
    category: 'robo',
    categoryLabel: 'Robo-Advisor AI',
    question: 'How does the Black-Litterman Asset Allocation model work?',
    answer:
      'Unlike naive Markowitz mean-variance optimization which produces erratic hyper-concentrated portfolios, Black-Litterman begins with market-equilibrium risk weights and incorporates investor risk scores to generate robust, diversified target allocations across 10 asset classes.',
    tags: ['black-litterman', 'mpt', 'allocation', 'portfolio'],
    helpfulCount: 310,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-robo-2',
    category: 'robo',
    categoryLabel: 'Robo-Advisor AI',
    question: 'When does the Autonomous Rebalancing Engine trigger a portfolio rebalance?',
    answer:
      'The drift engine continuously monitors portfolio holdings against target allocation weights. If an asset class weight strays by more than ±5.0% from target (or custom tolerance threshold), an automated rebalance plan is generated to re-establish optimal weights.',
    tags: ['rebalance', 'drift', 'tolerance', 'automation'],
    helpfulCount: 275,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-robo-3',
    category: 'robo',
    categoryLabel: 'Robo-Advisor AI',
    question: 'What asset classes and ETFs are included in the Robo-Advisor universe?',
    answer:
      'The allocation engine covers 10 liquid ETF asset categories: US Large Cap (VOO), US Small Cap (VB), International Developed (VEA), Emerging Markets (VWO), Core Bonds (BND), High Yield Bonds (JNK), Inflation TIPS (TIP), Real Estate REITs (VNQ), Gold Commodities (IAU), and Cash Equivalents (BIL).',
    tags: ['etf', 'asset-classes', 'voo', 'bnd', 'vnq'],
    helpfulCount: 250,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-robo-4',
    category: 'robo',
    categoryLabel: 'Robo-Advisor AI',
    question: 'How does Monte Carlo simulation forecast my retirement wealth?',
    answer:
      'Our simulation engine runs 1,000 stochastic geometric Brownian motion paths using historical return distributions and covariance matrices. It computes 10th, 50th (median), and 90th percentile wealth trajectories over 10-30 year horizons to measure goal probability of success.',
    tags: ['monte-carlo', 'simulation', 'retirement', 'probability'],
    helpfulCount: 295,
    unhelpfulCount: 3,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-robo-5',
    category: 'robo',
    categoryLabel: 'Robo-Advisor AI',
    question: 'How is the Black-Litterman Portfolio Asset Taxonomy configured?',
    answer:
      'Target weights are dynamically adjusted based on risk score (1-100). High risk scores (80+) allocate up to 90% in equities (VOO, VB, VEA, VWO) and 10% in bonds/gold, while conservative scores (20-) allocate 70% in fixed income (BND, TIP, BIL).',
    tags: ['taxonomy', 'risk-weights', 'equities', 'fixed-income'],
    helpfulCount: 230,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
];

export const TAX_FAQS: FAQItem[] = [
  {
    id: 'faq-tax-1',
    category: 'tax',
    categoryLabel: 'Tax-Loss Harvesting',
    question: 'What is Tax-Loss Harvesting (TLH) and how does it save on taxes?',
    answer:
      'Tax-Loss Harvesting involves selling positions trading at an unrealized loss to harvest tax deductions that offset taxable capital gains (or up to $3,000 / ₹2,50,000 of ordinary income). The proceeds are immediately reinvested into a correlated substitute asset to maintain market exposure.',
    tags: ['tax-loss-harvesting', 'tlh', 'capital-gains', 'deduction'],
    helpfulCount: 334,
    unhelpfulCount: 3,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-tax-2',
    category: 'tax',
    categoryLabel: 'Tax-Loss Harvesting',
    question: 'How does LALAN prevent IRS & Income Tax Wash-Sale rule violations?',
    answer:
      'The wash-sale rule disallows tax deductions if a substantially identical security is purchased within 30 days before or after the loss sale. LALAN automatically maps non-identical secondary proxy ETFs (e.g. swapping VOO for SCHX, or BND for AGG) so asset exposure stays intact without triggering wash-sale penalties.',
    tags: ['wash-sale', 'irs', '30-day', 'etf-swaps'],
    helpfulCount: 312,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-tax-3',
    category: 'tax',
    categoryLabel: 'Tax-Loss Harvesting',
    question: 'What is the minimum loss threshold for automated tax harvesting?',
    answer:
      'By default, LALAN triggers tax harvesting opportunities when unrealized losses exceed $100 (or ₹5,000) and represent at least 3.0% of the tax lot value, ensuring transaction costs do not diminish tax savings.',
    tags: ['threshold', 'minimum-loss', 'tax-lots'],
    helpfulCount: 245,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-tax-4',
    category: 'tax',
    categoryLabel: 'Tax-Loss Harvesting',
    question: 'What is the step-by-step automated workflow for harvesting tax losses?',
    answer:
      '1) Scans tax lots for losses > $100 & >3.0%. 2) Identifies non-substantially-identical ETF proxy. 3) Executes loss sale. 4) Instantly buys replacement proxy. 5) Logs loss tax savings in cryptographic audit ledger.',
    tags: ['workflow', 'step-by-step', 'proxy-etf', 'automation'],
    helpfulCount: 278,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
];

export const BROKER_FAQS: FAQItem[] = [
  {
    id: 'faq-broker-1',
    category: 'brokers',
    categoryLabel: 'Multi-Broker Gateway',
    question: 'Which Indian brokerages can I link to LALAN for automated trading?',
    answer:
      'LALAN features native low-latency API bridges for Zerodha Kite, DhanHQ, Upstox Pro v3, AngelOne SmartAPI, and Groww Trade API. You can link multiple broker accounts simultaneously for automated order routing.',
    tags: ['zerodha', 'dhan', 'upstox', 'angelone', 'groww'],
    helpfulCount: 367,
    unhelpfulCount: 4,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-broker-2',
    category: 'brokers',
    categoryLabel: 'Multi-Broker Gateway',
    question: 'How does automatic Hot-Failover order routing protect my trades?',
    answer:
      'If your primary broker API experiences latency spikes above 50ms or HTTP 5xx errors, LALAN automatic hot-failover instantly reroutes unexecuted order slices to your configured backup broker within microseconds to guarantee fill execution.',
    tags: ['hot-failover', 'routing', 'redundancy', 'latency-spike'],
    helpfulCount: 288,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-broker-3',
    category: 'brokers',
    categoryLabel: 'Multi-Broker Gateway',
    question: 'Are my broker API keys and TOTP sessions stored securely?',
    answer:
      'Yes! API keys and OAuth access tokens are encrypted using AES-256 GCM in your browser local storage. Daily TOTP login authentication is handled via automated secure session renewal without exposing plain-text credentials.',
    tags: ['aes-256', 'encryption', 'totp', 'oauth'],
    helpfulCount: 312,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-broker-4',
    category: 'brokers',
    categoryLabel: 'Multi-Broker Gateway',
    question: 'How do I configure Zerodha Kite & DhanHQ API hot-failover parameters?',
    answer:
      'In LALAN Settings -> Broker Bridges, enter your Kite API Key and Dhan Client ID. Toggle "Enable Hot-Failover" and set max allowed primary latency (default 50ms). The engine will run active heartbeat ping telemetry.',
    tags: ['zerodha-setup', 'dhan-setup', 'heartbeat', 'ping'],
    helpfulCount: 240,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
];

export const HFT_FAQS: FAQItem[] = [
  {
    id: 'faq-hft-1',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'How does LALAN achieve sub-microsecond engine execution latency?',
    answer:
      'Built on Java 21 primitives and the LMAX Disruptor lock-free circular ring buffer (1,048,576 slots with 64-byte cache-line padding), LALAN processes raw WebSocket ticks with O(1) memory allocation to eliminate JVM garbage collection pauses.',
    tags: ['java21', 'disruptor', 'ring-buffer', 'zero-gc'],
    helpfulCount: 450,
    unhelpfulCount: 6,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-hft-2',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'What colocation facilities and network hardware are utilized?',
    answer:
      'LALAN server clusters are co-located directly inside NSE BKC Mumbai and BSE Fort data centers, connected via Solarflare EF_VI 10GbE fiber network cards with OS kernel-bypass acceleration.',
    tags: ['nse-bkc', 'bse-fort', 'colocation', 'solarflare', 'kernel-bypass'],
    helpfulCount: 380,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-hft-3',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'What is PTP UTC clock synchronization precision?',
    answer:
      'LALAN servers synchronize hardware PTP (Precision Time Protocol IEEE 1588v2) clocks directly to atomic GPS time standards, ensuring sub-100 nanosecond timestamp accuracy across all audit events.',
    tags: ['ptp', 'ieee-1588', 'gps', 'timestamp'],
    helpfulCount: 298,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-hft-4',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'What is the technical breakdown of FPGA Kernel-Bypass zero-GC Disruptor architecture?',
    answer:
      'Solarflare OpenOnload bypasses the OS TCP/IP stack directly to FPGA hardware. Messages enter ring buffer slots without object instantiation, preventing heap allocation and guaranteeing 0.42µs P99 latency.',
    tags: ['fpga', 'openonload', 'disruptor', 'architecture'],
    helpfulCount: 315,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-hft-5',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'How is PTP UTC Nanosecond Clock Synchronization verified in colocation?',
    answer:
      'Hardware network cards capture hardware timestamps upon physical PHY packet arrival. PTP grandmaster clocks poll atomic GPS receivers every 1 second to eliminate time drift across distributed nodes.',
    tags: ['ptp-setup', 'phy-layer', 'grandmaster', 'gps-clock'],
    helpfulCount: 260,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-hft-6',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'How does Avellaneda-Stoikov market making inventory skew work?',
    answer:
      'The Avellaneda-Stoikov model shifts bid and ask quote placement away from mid-price based on current inventory position q and risk aversion gamma: r(s, q, t) = s - q * gamma * sigma^2 * (T - t). As inventory grows long, bid prices drop to discourage buys and ask prices drop to encourage inventory unwinding.',
    tags: ['avellaneda-stoikov', 'inventory-skew', 'market-making', 'gamma'],
    helpfulCount: 388,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-hft-7',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'What kernel density estimation is used to predict order arrival rates?',
    answer:
      'LALAN uses adaptive Epanechnikov kernel density estimation over a rolling 500ms sliding window of L2 depth changes to compute instantaneous intensity rate lambda(t).',
    tags: ['kde', 'epanechnikov', 'intensity-rate', 'order-arrival'],
    helpfulCount: 310,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-hft-8',
    category: 'hft',
    categoryLabel: 'HFT & Co-Location',
    question: 'How are microstructure noise and bid-ask bounce filtered out in delta calculation?',
    answer:
      'Microstructure noise is filtered using a Kalman Filter state-space model with dynamic noise covariance matrix Q, separating true price drift from transient bid-ask bounce tick noise.',
    tags: ['kalman-filter', 'microstructure-noise', 'bid-ask-bounce', 'drift'],
    helpfulCount: 345,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
];

export const COMPLIANCE_FAQS: FAQItem[] = [
  {
    id: 'faq-comp-1',
    category: 'compliance',
    categoryLabel: 'Risk & Compliance',
    question: 'Is LALAN compliant with SEBI Algorithmic Trading regulations?',
    answer:
      'Yes! LALAN incorporates SEBI circular SEBI/HO/MRD/DP/CIR/P/2018/62 guidelines, including pre-trade risk controls (max order value caps, fat-finger price collars, order modification rate limits) and automated self-trade prevention.',
    tags: ['sebi', 'regulations', 'algo-trading', 'pre-trade'],
    helpfulCount: 320,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-comp-2',
    category: 'compliance',
    categoryLabel: 'Risk & Compliance',
    question: 'How do I access the Admin Telemetry & User Audit Panel (/admin)?',
    answer:
      'Authorized administrators can access the /admin route by clicking "Admin Telemetry Panel" in the profile dropdown or navigating to /admin. The panel provides live sub-millisecond latency monitoring, user subscription upgrades, access suspensions, and SEBI compliance CSV export.',
    tags: ['admin', 'telemetry', 'audit', 'sebi-csv'],
    helpfulCount: 260,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-comp-3',
    category: 'compliance',
    categoryLabel: 'Risk & Compliance',
    question: 'Are system security and SOC 2 Type II audit logs available?',
    answer:
      'Yes! All system events, order execution hashes, and pre-trade risk validations are recorded with nanosecond PTP timestamps in an immutable cryptographic audit ledger compliant with SOC 2 Type II and ISO 27001 standards.',
    tags: ['soc2', 'iso27001', 'audit-log', 'cryptographic'],
    helpfulCount: 284,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-comp-4',
    category: 'compliance',
    categoryLabel: 'Risk & Compliance',
    question: 'What pre-trade circuit breaker limits are mandated by SEBI Reg 2018?',
    answer:
      '1) Max single order value <= ₹50,00,000. 2) Price collar <= ±0.8% of BBO. 3) Order modification count <= 500/sec. 4) Self-trade matching prevention active across all internal sub-accounts.',
    tags: ['sebi-2018', 'price-collar', 'circuit-breaker', 'limits'],
    helpfulCount: 290,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-comp-5',
    category: 'compliance',
    categoryLabel: 'Risk & Compliance',
    question: 'How do I export SOC 2 Type II cryptographic audit logs for compliance audits?',
    answer:
      'In /admin -> Telemetry Panel, click "Export SEBI & SOC2 Audit CSV". The engine generates a SHA-256 signed CSV file containing PTP nanosecond execution logs and checksum validations.',
    tags: ['soc2-export', 'sha-256', 'csv-export', 'audit-trail'],
    helpfulCount: 275,
    unhelpfulCount: 0,
    lastUpdated: '2026-10-06',
  },
];

export const PRICING_FAQS: FAQItem[] = [
  {
    id: 'faq-price-1',
    category: 'pricing',
    categoryLabel: 'Pricing & Billing',
    question: 'Is there a Free Trial available for new quantitative traders?',
    answer:
      'Yes! Every new account automatically gets a 14-Day Free Trial of the PRO QUANT plan with $0 required today and zero credit card required.',
    tags: ['free-trial', 'pro-quant', 'no-credit-card', 'billing'],
    helpfulCount: 420,
    unhelpfulCount: 4,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-price-2',
    category: 'pricing',
    categoryLabel: 'Pricing & Billing',
    question: 'What happens when my 14-day Free Trial finishes?',
    answer:
      'When your trial finishes, your account safely transitions to the free RETAIL plan (₹0/mo forever) with zero interruption to basic trading capabilities unless you choose to upgrade.',
    tags: ['trial-expiry', 'retail-plan', 'downgrade', 'free-forever'],
    helpfulCount: 390,
    unhelpfulCount: 2,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-price-3',
    category: 'pricing',
    categoryLabel: 'Pricing & Billing',
    question: 'Are there any hidden brokerage charges for equity delivery investments?',
    answer:
      'None! Equity delivery investments are 100% free with ₹0 brokerage. Intraday and F&O option trades are charged at flat ₹20 per executed order.',
    tags: ['brokerage', 'free-delivery', 'intraday', 'options-flat-fee'],
    helpfulCount: 355,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
  {
    id: 'faq-price-4',
    category: 'pricing',
    categoryLabel: 'Pricing & Billing',
    question: 'How does 14-Day PRO QUANT Free Trial automatic renewal work?',
    answer:
      'No credit card is required to start your trial. You will receive an email reminder on Day 12. If you do not choose to subscribe to PRO QUANT (₹999/mo), your account auto-switches to the free RETAIL plan with zero charges.',
    tags: ['trial-renewal', 'auto-downgrade', 'no-charge', 'billing-faq'],
    helpfulCount: 310,
    unhelpfulCount: 1,
    lastUpdated: '2026-10-06',
  },
];

export const ALL_FAQS: FAQItem[] = [
  ...GENERAL_FAQS,
  ...TERMINAL_FAQS,
  ...ROBO_FAQS,
  ...TAX_FAQS,
  ...BROKER_FAQS,
  ...HFT_FAQS,
  ...COMPLIANCE_FAQS,
  ...PRICING_FAQS,
];

/**
 * Filter FAQs by category and multi-term search query
 */
export function filterFAQs(category: FAQCategory | 'all', query: string = ''): FAQItem[] {
  const cleanQuery = query.toLowerCase().trim();
  return ALL_FAQS.filter((faq) => {
    const matchesCategory = category === 'all' || faq.category === category;
    if (!matchesCategory) return false;

    if (!cleanQuery) return true;

    const inQuestion = faq.question.toLowerCase().includes(cleanQuery);
    const inAnswer = faq.answer.toLowerCase().includes(cleanQuery);
    const inTags = faq.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));

    return inQuestion || inAnswer || inTags;
  });
}

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQItem | undefined {
  return ALL_FAQS.find((f) => f.id === id);
}

/**
 * Count total FAQs per category
 */
export function getFAQCategoryCount(category: FAQCategory | 'all'): number {
  if (category === 'all') return ALL_FAQS.length;
  return ALL_FAQS.filter((f) => f.category === category).length;
}

/**
 * Returns top popular FAQs sorted by helpfulness score.
 */
export function getPopularFAQs(faqs: FAQItem[] = ALL_FAQS, limit = 10): FAQItem[] {
  return [...faqs]
    .sort((a, b) => (b.helpfulCount - b.unhelpfulCount) - (a.helpfulCount - a.unhelpfulCount))
    .slice(0, limit);
}

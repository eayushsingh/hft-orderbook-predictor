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
];

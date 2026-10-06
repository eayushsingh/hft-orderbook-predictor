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

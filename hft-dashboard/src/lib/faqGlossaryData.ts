export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

export const FAQ_GLOSSARY: Record<string, GlossaryTerm> = {
  'limit order book': {
    term: 'Limit Order Book (LOB)',
    definition: 'A real-time record of all outstanding buy (bid) and sell (ask) limit orders submitted by market participants, sorted by price levels.',
    category: 'Microstructure',
  },
  'micro-price': {
    term: 'Micro-Price',
    definition: 'An refined estimate of true fundamental price that incorporates order book queue imbalance across bid/ask top-of-book depth.',
    category: 'Quantitative Math',
  },
  'hawkes process': {
    term: 'Hawkes Process',
    definition: 'A self-exciting point process model used to simulate clustered financial market order flow bursts and volatility spikes.',
    category: 'Stochastics',
  },
  'co-location': {
    term: 'Co-Location',
    definition: 'Placing trading servers in the exact same data center cage as the exchange match engine to minimize fiber latency to <1 microsecond.',
    category: 'Infrastructure',
  },
  'vwap': {
    term: 'Volume Weighted Average Price (VWAP)',
    definition: 'The benchmark execution target calculated by dividing total transaction dollar value by aggregate volume traded over a time interval.',
    category: 'Algorithms',
  },
  'order imbalance': {
    term: 'Order Imbalance (OFI)',
    definition: 'The net difference between bid depth additions and ask depth subtractions indicating immediate directional buying or selling pressure.',
    category: 'Microstructure',
  },
};

/**
 * Returns glossary definition if term exists in registry.
 */
export function getGlossaryDefinition(termKey: string): GlossaryTerm | undefined {
  return FAQ_GLOSSARY[termKey.toLowerCase()];
}

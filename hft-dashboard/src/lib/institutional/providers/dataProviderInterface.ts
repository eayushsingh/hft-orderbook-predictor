/**
 * Market Data Provider Contract & Abstract Interfaces
 * Enables registering new market data providers (e.g. NSE, BSE, NSDL, CDSL, Bloomberg, Refinitiv) easily.
 */

export interface ProviderHealth {
  providerName: string;
  datasetType: string;
  lastSyncedAt: string;
  status: "HEALTHY" | "DEGRADED" | "UNAVAILABLE";
  latencyMs: number;
  dataQualityScore: number; // 0.0 to 1.0
}

export interface ShareholdingSnapshotPayload {
  quarter: string;
  year: number;
  snapshotDate: string;
  promoterPct: number;
  fiiFpiPct: number;
  mutualFundPct: number;
  insurancePct: number;
  banksFiPct: number;
  aifPct: number;
  otherInstPct: number;
  retailNonInstPct: number;
  totalInstPct: number;
}

export interface DisclosedDealPayload {
  dealDate: string;
  rawInstitutionName: string;
  buyerSellerName: string;
  dealType: "BUY" | "SELL";
  transactionType: "BULK" | "BLOCK";
  shares: number;
  price: number;
  valueCr: number;
  exchange: "NSE" | "BSE";
}

export interface MarketPriceVolumePayload {
  tradeDate: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  prevClose: number;
  changePct: number;
  totalTradedVolume: number;
  avgVolume20d: number;
  volumeAnomalyRatio: number;
  deliveryVolume: number;
  deliveryPct: number;
  avgDeliveryVolume20d: number;
  deliveryAnomalyRatio: number;
}

export interface IMarketDataProvider {
  readonly providerName: string;
  getHealthStatus(): Promise<ProviderHealth>;
  fetchShareholdingSnapshots(symbol: string): Promise<ShareholdingSnapshotPayload[]>;
  fetchBulkBlockDeals(symbol: string, days?: number): Promise<DisclosedDealPayload[]>;
  fetchMarketTelemetry(symbol: string): Promise<MarketPriceVolumePayload[]>;
}

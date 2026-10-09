import { AutopilotOrder, AutopilotPosition, TradingMode } from "../types";

export interface BrokerCredentials {
  apiKey?: string;
  apiSecret?: string;
  clientCode?: string;
  password?: string;
  totpSecret?: string;
  accessToken?: string;
  requestToken?: string;
}

export interface BrokerAuthResult {
  success: boolean;
  message: string;
  sessionExpiry?: string;
  token?: string;
}

export interface BrokerFundsResult {
  availableCash: number;
  usedMargin: number;
  totalEquity: number;
  source: string;
  timestamp: string;
}

export interface BrokerQuoteResult {
  symbol: string;
  ltp: number;
  bid: number;
  ask: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface BrokerOrderResult {
  success: boolean;
  brokerOrderId?: string;
  status: "OPEN" | "FILLED" | "REJECTED" | "CANCELLED";
  filledQty?: number;
  avgFillPrice?: number;
  rejectReason?: string;
  message?: string;
}

export interface IBrokerAdapter {
  readonly brokerName: "ANGEL_ONE" | "ZERODHA" | "PAPER" | "DEMO";
  readonly mode: TradingMode;

  authenticate(credentials?: BrokerCredentials): Promise<BrokerAuthResult>;
  getFunds(): Promise<BrokerFundsResult>;
  getPositions(): Promise<AutopilotPosition[]>;
  getOrders(): Promise<AutopilotOrder[]>;
  getQuote(symbol: string): Promise<BrokerQuoteResult>;
  placeOrder(order: AutopilotOrder): Promise<BrokerOrderResult>;
  cancelOrder(brokerOrderId: string): Promise<{ success: boolean; message?: string }>;
  reconcilePositions(localPositions: AutopilotPosition[]): Promise<{
    reconciled: boolean;
    discrepancies: string[];
    brokerPositions: AutopilotPosition[];
  }>;
}

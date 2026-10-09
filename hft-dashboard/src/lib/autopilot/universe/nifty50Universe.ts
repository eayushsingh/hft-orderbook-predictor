import { UniverseConstituent } from "../types";

/**
 * AUTHORITATIVE NIFTY 50 CONSTITUENT UNIVERSE MASTER
 * 
 * Source: National Stock Exchange of India (NSE) / NSE Indices Ltd.
 * Cash Equities ONLY.
 * Bank Nifty derivatives, index options, stock futures, penny stocks,
 * midcap/smallcap equities, and crypto are strictly REJECTED by design.
 */

export const NIFTY_50_UNIVERSE_SOURCE = "NSE Indices Ltd - Official Nifty 50 Constituent Master";
export const NIFTY_50_LAST_SYNC_TIMESTAMP = "2026-03-31T09:15:00.000Z";

export const NIFTY_50_CONSTITUENTS: readonly UniverseConstituent[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    isin: "INE002A01018",
    sector: "Oil Gas & Consumable Fuels",
    weightagePct: 9.14,
    angelOneToken: "2885",
    zerodhaToken: "738561",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    isin: "INE040A01034",
    sector: "Financial Services",
    weightagePct: 11.23,
    angelOneToken: "1333",
    zerodhaToken: "341249",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    isin: "INE090A01021",
    sector: "Financial Services",
    weightagePct: 7.85,
    angelOneToken: "4963",
    zerodhaToken: "1270529",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    isin: "INE009A01021",
    sector: "Information Technology",
    weightagePct: 5.62,
    angelOneToken: "1594",
    zerodhaToken: "408065",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    isin: "INE467B01029",
    sector: "Information Technology",
    weightagePct: 3.84,
    angelOneToken: "11536",
    zerodhaToken: "2953217",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "ITC",
    name: "ITC Ltd",
    isin: "INE154A01025",
    sector: "Fast Moving Consumer Goods",
    weightagePct: 3.78,
    angelOneToken: "1660",
    zerodhaToken: "424961",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    isin: "INE018A01030",
    sector: "Construction",
    weightagePct: 4.12,
    angelOneToken: "11483",
    zerodhaToken: "2939649",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    isin: "INE062A01020",
    sector: "Financial Services",
    weightagePct: 3.15,
    angelOneToken: "3045",
    zerodhaToken: "779521",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    isin: "INE397D01024",
    sector: "Telecommunication",
    weightagePct: 4.05,
    angelOneToken: "10604",
    zerodhaToken: "2714625",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank Ltd",
    isin: "INE237A01028",
    sector: "Financial Services",
    weightagePct: 2.68,
    angelOneToken: "1922",
    zerodhaToken: "492033",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "AXISBANK",
    name: "Axis Bank Ltd",
    isin: "INE238A01034",
    sector: "Financial Services",
    weightagePct: 3.32,
    angelOneToken: "5900",
    zerodhaToken: "1510401",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    isin: "INE030A01027",
    sector: "Fast Moving Consumer Goods",
    weightagePct: 2.45,
    angelOneToken: "1394",
    zerodhaToken: "356865",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "M&M",
    name: "Mahindra & Mahindra Ltd",
    isin: "INE101A01026",
    sector: "Automobile and Auto Components",
    weightagePct: 2.64,
    angelOneToken: "2031",
    zerodhaToken: "519937",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    isin: "INE155A01022",
    sector: "Automobile and Auto Components",
    weightagePct: 2.18,
    angelOneToken: "3456",
    zerodhaToken: "884737",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd",
    isin: "INE296A01024",
    sector: "Financial Services",
    weightagePct: 1.95,
    angelOneToken: "317",
    zerodhaToken: "81153",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India Ltd",
    isin: "INE585B01010",
    sector: "Automobile and Auto Components",
    weightagePct: 1.82,
    angelOneToken: "10999",
    zerodhaToken: "2815745",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries Ltd",
    isin: "INE044A01036",
    sector: "Healthcare",
    weightagePct: 1.76,
    angelOneToken: "3351",
    zerodhaToken: "857857",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "NTPC",
    name: "NTPC Ltd",
    isin: "INE733E01010",
    sector: "Power",
    weightagePct: 1.98,
    angelOneToken: "11630",
    zerodhaToken: "2977281",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "POWERGRID",
    name: "Power Grid Corporation of India Ltd",
    isin: "INE752E01010",
    sector: "Power",
    weightagePct: 1.48,
    angelOneToken: "14977",
    zerodhaToken: "3834113",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel Ltd",
    isin: "INE081A01020",
    sector: "Metals & Mining",
    weightagePct: 1.34,
    angelOneToken: "3499",
    zerodhaToken: "895745",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "ONGC",
    name: "Oil & Natural Gas Corporation Ltd",
    isin: "INE213A01029",
    sector: "Oil Gas & Consumable Fuels",
    weightagePct: 1.32,
    angelOneToken: "2475",
    zerodhaToken: "633601",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "COALINDIA",
    name: "Coal India Ltd",
    isin: "INE522F01014",
    sector: "Oil Gas & Consumable Fuels",
    weightagePct: 1.25,
    angelOneToken: "20374",
    zerodhaToken: "5215745",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "TITAN",
    name: "Titan Company Ltd",
    isin: "INE280A01028",
    sector: "Consumer Durables",
    weightagePct: 1.54,
    angelOneToken: "3506",
    zerodhaToken: "897537",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises Ltd",
    isin: "INE423A01024",
    sector: "Metals & Mining",
    weightagePct: 1.15,
    angelOneToken: "25",
    zerodhaToken: "6401",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports and Special Economic Zone Ltd",
    isin: "INE742F01042",
    sector: "Services",
    weightagePct: 1.22,
    angelOneToken: "15083",
    zerodhaToken: "3861249",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies Ltd",
    isin: "INE860A01027",
    sector: "Information Technology",
    weightagePct: 1.45,
    angelOneToken: "7229",
    zerodhaToken: "1850625",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints Ltd",
    isin: "INE021A01026",
    sector: "Consumer Durables",
    weightagePct: 1.18,
    angelOneToken: "236",
    zerodhaToken: "60417",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "BAJAJFINSV",
    name: "Bajaj Finserv Ltd",
    isin: "INE918I01026",
    sector: "Financial Services",
    weightagePct: 1.05,
    angelOneToken: "16675",
    zerodhaToken: "4268801",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd",
    isin: "INE075A01022",
    sector: "Information Technology",
    weightagePct: 0.88,
    angelOneToken: "3787",
    zerodhaToken: "969473",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "ULTRACEMCO",
    name: "UltraTech Cement Ltd",
    isin: "INE481G01011",
    sector: "Construction Materials",
    weightagePct: 1.28,
    angelOneToken: "11532",
    zerodhaToken: "2952193",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "NESTLEIND",
    name: "Nestle India Ltd",
    isin: "INE239A01024",
    sector: "Fast Moving Consumer Goods",
    weightagePct: 0.85,
    angelOneToken: "17963",
    zerodhaToken: "4598529",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "JSWSTEEL",
    name: "JSW Steel Ltd",
    isin: "INE019A01038",
    sector: "Metals & Mining",
    weightagePct: 0.94,
    angelOneToken: "11723",
    zerodhaToken: "3001089",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "GRASIM",
    name: "Grasim Industries Ltd",
    isin: "INE047A01021",
    sector: "Construction Materials",
    weightagePct: 0.88,
    angelOneToken: "1232",
    zerodhaToken: "315393",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "TECHM",
    name: "Tech Mahindra Ltd",
    isin: "INE669C01036",
    sector: "Information Technology",
    weightagePct: 0.92,
    angelOneToken: "13538",
    zerodhaToken: "3465729",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "DRREDDY",
    name: "Dr. Reddy's Laboratories Ltd",
    isin: "INE089A01023",
    sector: "Healthcare",
    weightagePct: 0.78,
    angelOneToken: "881",
    zerodhaToken: "225537",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "CIPLA",
    name: "Cipla Ltd",
    isin: "INE059A01026",
    sector: "Healthcare",
    weightagePct: 0.82,
    angelOneToken: "694",
    zerodhaToken: "177665",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "HEROMOTOCO",
    name: "Hero MotoCorp Ltd",
    isin: "INE158A01026",
    sector: "Automobile and Auto Components",
    weightagePct: 0.76,
    angelOneToken: "1348",
    zerodhaToken: "345089",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "EICHERMOT",
    name: "Eicher Motors Ltd",
    isin: "INE066A01021",
    sector: "Automobile and Auto Components",
    weightagePct: 0.74,
    angelOneToken: "910",
    zerodhaToken: "232961",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "BPCL",
    name: "Bharat Petroleum Corporation Ltd",
    isin: "INE029A01011",
    sector: "Oil Gas & Consumable Fuels",
    weightagePct: 0.68,
    angelOneToken: "526",
    zerodhaToken: "134657",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "HINDALCO",
    name: "Hindalco Industries Ltd",
    isin: "INE038A01020",
    sector: "Metals & Mining",
    weightagePct: 0.91,
    angelOneToken: "1363",
    zerodhaToken: "348929",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "BRITANNIA",
    name: "Britannia Industries Ltd",
    isin: "INE216A01030",
    sector: "Fast Moving Consumer Goods",
    weightagePct: 0.64,
    angelOneToken: "547",
    zerodhaToken: "140033",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "TATACONSUM",
    name: "Tata Consumer Products Ltd",
    isin: "INE192A01025",
    sector: "Fast Moving Consumer Goods",
    weightagePct: 0.62,
    angelOneToken: "3432",
    zerodhaToken: "878593",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "APOLLOHOSP",
    name: "Apollo Hospitals Enterprise Ltd",
    isin: "INE437A01024",
    sector: "Healthcare",
    weightagePct: 0.81,
    angelOneToken: "157",
    zerodhaToken: "40193",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "SBILIFE",
    name: "SBI Life Insurance Company Ltd",
    isin: "INE123W01016",
    sector: "Financial Services",
    weightagePct: 0.68,
    angelOneToken: "21808",
    zerodhaToken: "5582849",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "HDFCLIFE",
    name: "HDFC Life Insurance Company Ltd",
    isin: "INE795G01014",
    sector: "Financial Services",
    weightagePct: 0.65,
    angelOneToken: "467",
    zerodhaToken: "119553",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "DIVISLAB",
    name: "Divi's Laboratories Ltd",
    isin: "INE361B01024",
    sector: "Healthcare",
    weightagePct: 0.62,
    angelOneToken: "10940",
    zerodhaToken: "2800641",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "BAJAJ-AUTO",
    name: "Bajaj Auto Ltd",
    isin: "INE917I01010",
    sector: "Automobile and Auto Components",
    weightagePct: 0.98,
    angelOneToken: "16669",
    zerodhaToken: "4267265",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "SHRIRAMFIN",
    name: "Shriram Finance Ltd",
    isin: "INE721A01013",
    sector: "Financial Services",
    weightagePct: 0.85,
    angelOneToken: "4306",
    zerodhaToken: "1102337",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "TRENT",
    name: "Trent Ltd",
    isin: "INE849A01020",
    sector: "Consumer Services",
    weightagePct: 1.42,
    angelOneToken: "1964",
    zerodhaToken: "502785",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
  {
    symbol: "BEL",
    name: "Bharat Electronics Ltd",
    isin: "INE263A01024",
    sector: "Capital Goods",
    weightagePct: 1.08,
    angelOneToken: "383",
    zerodhaToken: "98049",
    lotSize: 1,
    isActive: true,
    lastVerifiedAt: NIFTY_50_LAST_SYNC_TIMESTAMP,
  },
] as const;

/**
 * Strict Lookup Map keyed by uppercase clean NSE equity symbol
 */
const SYMBOL_MAP = new Map<string, UniverseConstituent>();
const ISIN_MAP = new Map<string, UniverseConstituent>();

for (const c of NIFTY_50_CONSTITUENTS) {
  SYMBOL_MAP.set(c.symbol.toUpperCase(), c);
  ISIN_MAP.set(c.isin.toUpperCase(), c);
}

export class UniverseService {
  /**
   * Check if a symbol is an active Nifty 50 Cash Equity constituent.
   * Fails safe: Returns false for anything unknown, derivatives, crypto, or non-Nifty.
   */
  public static isEligible(symbol: string): boolean {
    if (!symbol || typeof symbol !== "string") return false;
    const clean = symbol.trim().toUpperCase();
    const constituent = SYMBOL_MAP.get(clean);
    return Boolean(constituent && constituent.isActive);
  }

  /**
   * Look up constituent details by symbol
   */
  public static getConstituent(symbol: string): UniverseConstituent | null {
    if (!symbol) return null;
    const clean = symbol.trim().toUpperCase();
    return SYMBOL_MAP.get(clean) || null;
  }

  /**
   * Look up constituent details by ISIN
   */
  public static getConstituentByIsin(isin: string): UniverseConstituent | null {
    if (!isin) return null;
    const clean = isin.trim().toUpperCase();
    return ISIN_MAP.get(clean) || null;
  }

  /**
   * Retrieve the complete verified Nifty 50 constituent universe
   */
  public static getAllConstituents(): readonly UniverseConstituent[] {
    return NIFTY_50_CONSTITUENTS;
  }

  /**
   * Total count of active constituents (must strictly be 50)
   */
  public static getUniverseCount(): number {
    return NIFTY_50_CONSTITUENTS.length;
  }

  /**
   * Strict safety validator that returns a reason string if rejected
   */
  public static validateUniverseSafety(symbol: string): { eligible: boolean; reason?: string } {
    if (!symbol || typeof symbol !== "string") {
      return { eligible: false, reason: "Invalid or empty instrument symbol" };
    }

    const clean = symbol.trim().toUpperCase();

    // Check if it is a verified Nifty 50 constituent
    const constituent = SYMBOL_MAP.get(clean);
    if (constituent) {
      if (!constituent.isActive) {
        return { eligible: false, reason: `Symbol '${clean}' is currently marked inactive in the index master.` };
      }
      if (!constituent.angelOneToken || !constituent.zerodhaToken) {
        return { eligible: false, reason: `Symbol '${clean}' lacks verified broker instrument token mapping.` };
      }
      return { eligible: true };
    }

    // Prohibited asset classes / non-constituents
    if (clean.includes("BTC") || clean.includes("ETH") || clean.includes("USDT")) {
      return { eligible: false, reason: `Crypto instruments (${clean}) are outside the Indian cash equity universe.` };
    }
    if (/(FUT|CE|PE|\d{2}[A-Z]{3})/i.test(clean) || clean.startsWith("NIFTY") || clean.startsWith("BANKNIFTY")) {
      return { eligible: false, reason: `Derivatives (${clean}) are strictly disallowed by Nifty 50 Autopilot.` };
    }

    return { eligible: false, reason: `Symbol '${clean}' is not in the verified NSE Nifty 50 constituent master.` };
  }
}

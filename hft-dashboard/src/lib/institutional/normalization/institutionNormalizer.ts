import Database from "better-sqlite3";

export type InstitutionCategory =
  | "MUTUAL_FUND"
  | "FII_FPI"
  | "INSURANCE"
  | "BANK_FI"
  | "AIF"
  | "OTHER_INSTITUTION";

export interface NormalizedInstitution {
  id?: number;
  rawName: string;
  normalizedName: string;
  category: InstitutionCategory;
  parentEntity?: string;
}

// Pre-defined mapping dictionary for Indian institutional entities & international FPIs
const ALIAS_RULES: Array<{
  patterns: RegExp[];
  canonicalName: string;
  category: InstitutionCategory;
  parentEntity: string;
}> = [
  // HDFC MF
  {
    patterns: [/hdfc\s+mutual\s+fund/i, /hdfc\s+mf/i, /hdfc\s+asset\s+management/i, /hdfc\s+trustee/i],
    canonicalName: "HDFC Mutual Fund",
    category: "MUTUAL_FUND",
    parentEntity: "HDFC Asset Management Company Ltd",
  },
  // SBI MF
  {
    patterns: [/sbi\s+mutual\s+fund/i, /sbimutualfund/i, /sbi\s+mf/i, /sbi\s+funds\s+management/i],
    canonicalName: "SBI Mutual Fund",
    category: "MUTUAL_FUND",
    parentEntity: "SBI Funds Management Ltd",
  },
  // ICICI PRUDENTIAL MF
  {
    patterns: [/icici\s+prudential\s+mutual\s+fund/i, /icici\s+pru\s+mf/i, /icici\s+pru\s+mutual/i],
    canonicalName: "ICICI Prudential Mutual Fund",
    category: "MUTUAL_FUND",
    parentEntity: "ICICI Prudential Asset Management Co Ltd",
  },
  // NIPPON INDIA MF
  {
    patterns: [/nippon\s+india\s+mutual\s+fund/i, /nippon\s+mf/i, /reliance\s+mutual\s+fund/i],
    canonicalName: "Nippon India Mutual Fund",
    category: "MUTUAL_FUND",
    parentEntity: "Nippon Life India Asset Management Ltd",
  },
  // KOTAK MF
  {
    patterns: [/kotak\s+mutual\s+fund/i, /kotak\s+mf/i, /kotak\s+mahindra\s+mf/i],
    canonicalName: "Kotak Mutual Fund",
    category: "MUTUAL_FUND",
    parentEntity: "Kotak Mahindra Asset Management Co Ltd",
  },
  // AXIS MF
  {
    patterns: [/axis\s+mutual\s+fund/i, /axis\s+mf/i],
    canonicalName: "Axis Mutual Fund",
    category: "MUTUAL_FUND",
    parentEntity: "Axis Asset Management Co Ltd",
  },
  // MIRAE ASSET MF
  {
    patterns: [/mirae\s+asset\s+mutual\s+fund/i, /mirae\s+asset\s+mf/i, /mirae\s+asset/i],
    canonicalName: "Mirae Asset Mutual Fund",
    category: "MUTUAL_FUND",
    parentEntity: "Mirae Asset Investment Managers (India) Pvt Ltd",
  },
  // LIC (INSURANCE)
  {
    patterns: [/life\s+insurance\s+corporation/i, /lic\s+of\s+india/i, /lic\s+housing/i, /^lic$/i],
    canonicalName: "Life Insurance Corporation of India (LIC)",
    category: "INSURANCE",
    parentEntity: "Life Insurance Corporation of India",
  },
  // HDFC LIFE
  {
    patterns: [/hdfc\s+life\s+insurance/i, /hdfc\s+standard\s+life/i],
    canonicalName: "HDFC Life Insurance Co Ltd",
    category: "INSURANCE",
    parentEntity: "HDFC Life",
  },
  // SBI LIFE
  {
    patterns: [/sbi\s+life\s+insurance/i],
    canonicalName: "SBI Life Insurance Co Ltd",
    category: "INSURANCE",
    parentEntity: "State Bank of India",
  },
  // VANGUARD (FII/FPI)
  {
    patterns: [/vanguard/i, /vanguard\s+emerging\s+markets/i, /vanguard\s+total\s+international/i],
    canonicalName: "Vanguard Group",
    category: "FII_FPI",
    parentEntity: "The Vanguard Group, Inc.",
  },
  // BLACKROCK (FII/FPI)
  {
    patterns: [/blackrock/i, /ishares/i, /blackrock\s+global/i],
    canonicalName: "BlackRock Fund Advisors",
    category: "FII_FPI",
    parentEntity: "BlackRock, Inc.",
  },
  // GOVERNMENT PENSION FUND GLOBAL (NORWAY)
  {
    patterns: [/government\s+pension\s+fund\s+global/i, /norges\s+bank/i],
    canonicalName: "Government Pension Fund Global (Norges Bank)",
    category: "FII_FPI",
    parentEntity: "Norges Bank Investment Management",
  },
  // MORGAN STANLEY
  {
    patterns: [/morgan\s+stanley/i, /morgan\s+stanley\s+asia/i],
    canonicalName: "Morgan Stanley Investment Management",
    category: "FII_FPI",
    parentEntity: "Morgan Stanley",
  },
  // GOLDMAN SACHS
  {
    patterns: [/goldman\s+sachs/i, /goldman\s+sachs\s+india/i],
    canonicalName: "Goldman Sachs Asset Management",
    category: "FII_FPI",
    parentEntity: "Goldman Sachs Group, Inc.",
  },
  // SOCIETE GENERALE
  {
    patterns: [/societe\s+generale/i, /socgen/i],
    canonicalName: "Societe Generale",
    category: "FII_FPI",
    parentEntity: "Societe Generale S.A.",
  },
];

/**
 * Normalizes raw, messy regulatory institutional strings (FPI filings, shareholding pattern dumps, bulk deal feeds)
 * into clean canonical entity titles and categories.
 * 
 * Humanized Explanation for Maintainers:
 * Shareholding pattern disclosures submitted to BSE/NSE contain vast variations for the same institution
 * (e.g. "HDFC MF", "HDFC Asset Management Co", "HDFC Trustee Ltd").
 * This module uses regex pattern matching against a curated dictionary of Indian & global institutional entities
 * (Mutual Funds, FIIs/FPIs, Insurance Companies, Banks, AIFs) to unify all variations into single canonical entities.
 * 
 * @param rawName Raw string from exchange bulk/block deal or shareholding pattern disclosure.
 * @returns Object with normalizedName, category enum, and parentEntity string.
 */
export function normalizeInstitutionName(rawName: string): {
  normalizedName: string;
  category: InstitutionCategory;
  parentEntity: string;
} {
  const trimmed = rawName.trim();

  // Step 1: Check curated regex alias dictionary
  for (const rule of ALIAS_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(trimmed))) {
      return {
        normalizedName: rule.canonicalName,
        category: rule.category,
        parentEntity: rule.parentEntity,
      };
    }
  }

  // Step 2: Fallback heuristic keyword analysis if entity is not in alias dictionary
  let category: InstitutionCategory = "OTHER_INSTITUTION";
  const lower = trimmed.toLowerCase();

  if (lower.includes("mutual fund") || lower.includes(" mf") || lower.includes("schemes")) {
    category = "MUTUAL_FUND";
  } else if (lower.includes("fpi") || lower.includes("fii") || lower.includes("foreign") || lower.includes("fund")) {
    category = "FII_FPI";
  } else if (lower.includes("insurance") || lower.includes("life") || lower.includes("assurance")) {
    category = "INSURANCE";
  } else if (lower.includes("bank") || lower.includes("financial corporation")) {
    category = "BANK_FI";
  } else if (lower.includes("aif") || lower.includes("alternative")) {
    category = "AIF";
  }

  // Step 3: Strip corporate suffixes (Ltd, Inc, Corp, Pvt) for a clean display title
  const cleanTitle = trimmed
    .replace(/\s+/g, " ")
    .replace(/\b(ltd|limited|pvt|private|inc|llc|corp|corporation)\b/gi, "")
    .trim();

  return {
    normalizedName: cleanTitle,
    category,
    parentEntity: cleanTitle,
  };
}

/**
 * Retrieves existing normalized institution record from SQLite database or registers a new entry.
 */
export function getOrRegisterInstitution(
  db: Database.Database,
  rawName: string
): NormalizedInstitution {
  const existing = db
    .prepare("SELECT * FROM institutions WHERE raw_name = ?")
    .get(rawName) as {
    id: number;
    raw_name: string;
    normalized_name: string;
    category: string;
    parent_entity?: string;
  } | undefined;

  if (existing) {
    return {
      id: existing.id,
      rawName: existing.raw_name,
      normalizedName: existing.normalized_name,
      category: existing.category as InstitutionCategory,
      parentEntity: existing.parent_entity,
    };
  }

  const { normalizedName, category, parentEntity } = normalizeInstitutionName(rawName);

  const stmt = db.prepare(`
    INSERT INTO institutions (raw_name, normalized_name, category, parent_entity)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(rawName, normalizedName, category, parentEntity);

  return {
    id: Number(result.lastInsertRowid),
    rawName,
    normalizedName,
    category,
    parentEntity,
  };
}

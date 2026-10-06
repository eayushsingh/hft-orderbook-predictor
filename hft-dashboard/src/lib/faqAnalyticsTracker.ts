const SEARCH_HISTORY_KEY = 'hft_faq_search_analytics_v1';
const POPULAR_SEARCH_MAX = 10;

export interface SearchLogEntry {
  query: string;
  timestamp: number;
  resultsCount: number;
}

/**
 * Tracks a user search query in localStorage for analytics insight.
 */
export function trackFAQSearch(query: string, resultsCount: number): void {
  if (typeof window === 'undefined' || !query.trim()) return;

  try {
    const existing = getSearchHistory();
    const newEntry: SearchLogEntry = {
      query: query.trim().toLowerCase(),
      timestamp: Date.now(),
      resultsCount,
    };
    const updated = [newEntry, ...existing].slice(0, 100);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to log FAQ search analytics', err);
  }
}

/**
 * Retrieves full list of historical search log entries.
 */
export function getSearchHistory(): SearchLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Computes top search query terms aggregated by frequency.
 */
export function getTopSearchTerms(): { term: string; count: number }[] {
  const history = getSearchHistory();
  const counts: Record<string, number> = {};

  history.forEach((entry) => {
    counts[entry.query] = (counts[entry.query] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, POPULAR_SEARCH_MAX);
}

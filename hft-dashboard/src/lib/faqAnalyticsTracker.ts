/**
 * FAQ Search Query Analytics Tracker
 * 
 * Humanized Explanation for Maintainers:
 * Tracks user search queries executed within the FAQ hub to collect query frequency metrics.
 * 1. `trackFAQSearch`: Logs non-empty search terms along with the result count to `localStorage`.
 * 2. `getSearchHistory`: Retrieves search history entries (safely falling back to memory if SSR).
 * 3. `getTopSearchTerms`: Aggregates query strings by frequency to populate "Popular / Trending" pills.
 */
const SEARCH_HISTORY_KEY = 'hft_faq_search_analytics_v1';
const POPULAR_SEARCH_MAX = 10;
let inMemoryHistory: SearchLogEntry[] = [];

export interface SearchLogEntry {
  query: string;
  timestamp: number;
  resultsCount: number;
}

/**
 * Tracks a user search query in localStorage or memory.
 */
export function trackFAQSearch(query: string, resultsCount: number): void {
  if (!query.trim()) return;

  try {
    const existing = getSearchHistory();
    const newEntry: SearchLogEntry = {
      query: query.trim().toLowerCase(),
      timestamp: Date.now(),
      resultsCount,
    };
    // Keep most recent 100 search logs to prevent unbounded storage growth
    const updated = [newEntry, ...existing].slice(0, 100);
    inMemoryHistory = updated;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Failed to log FAQ search analytics', err);
  }
}

/**
 * Retrieves full list of historical search log entries.
 */
export function getSearchHistory(): SearchLogEntry[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return inMemoryHistory;
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : inMemoryHistory;
  } catch {
    return inMemoryHistory;
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

const BOOKMARKS_STORAGE_KEY = 'hft_faq_bookmarks_v1';
let inMemoryBookmarks: string[] = [];

/**
 * Gets array of bookmarked FAQ IDs.
 */
export function getBookmarkedFAQIds(): string[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return inMemoryBookmarks;
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : inMemoryBookmarks;
  } catch {
    return inMemoryBookmarks;
  }
}

/**
 * Toggles bookmark status for an FAQ ID.
 */
export function toggleFAQBookmark(faqId: string): { isBookmarked: boolean; updatedIds: string[] } {
  const current = getBookmarkedFAQIds();
  const exists = current.includes(faqId);
  const updated = exists ? current.filter((id) => id !== faqId) : [...current, faqId];
  inMemoryBookmarks = updated;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save FAQ bookmarks', err);
    }
  }
  return { isBookmarked: !exists, updatedIds: updated };
}

/**
 * Checks if a specific FAQ ID is bookmarked.
 */
export function isFAQBookmarked(faqId: string): boolean {
  return getBookmarkedFAQIds().includes(faqId);
}

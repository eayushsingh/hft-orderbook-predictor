const BOOKMARKS_STORAGE_KEY = 'hft_faq_bookmarks_v1';

/**
 * Gets array of bookmarked FAQ IDs from localStorage.
 */
export function getBookmarkedFAQIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse FAQ bookmarks', err);
    return [];
  }
}

/**
 * Toggles bookmark status for an FAQ ID.
 * Returns updated array of bookmarked IDs and new toggle state.
 */
export function toggleFAQBookmark(faqId: string): { isBookmarked: boolean; updatedIds: string[] } {
  if (typeof window === 'undefined') return { isBookmarked: false, updatedIds: [] };
  const current = getBookmarkedFAQIds();
  const exists = current.includes(faqId);
  const updated = exists ? current.filter((id) => id !== faqId) : [...current, faqId];
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save FAQ bookmarks', err);
  }
  return { isBookmarked: !exists, updatedIds: updated };
}

/**
 * Checks if a specific FAQ ID is bookmarked.
 */
export function isFAQBookmarked(faqId: string): boolean {
  return getBookmarkedFAQIds().includes(faqId);
}

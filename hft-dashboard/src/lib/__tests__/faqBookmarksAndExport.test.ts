import { describe, it, expect, beforeEach } from 'vitest';
import { getBookmarkedFAQIds, toggleFAQBookmark, isFAQBookmarked } from '../faqBookmarks';

describe('FAQ Bookmarks Storage Test Suite', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should toggle bookmark status for an FAQ ID', () => {
    expect(isFAQBookmarked('faq-gen-1')).toBe(false);

    const { isBookmarked, updatedIds } = toggleFAQBookmark('faq-gen-1');
    expect(isBookmarked).toBe(true);
    expect(updatedIds).toContain('faq-gen-1');
    expect(isFAQBookmarked('faq-gen-1')).toBe(true);

    const result2 = toggleFAQBookmark('faq-gen-1');
    expect(result2.isBookmarked).toBe(false);
    expect(isFAQBookmarked('faq-gen-1')).toBe(false);
  });
});

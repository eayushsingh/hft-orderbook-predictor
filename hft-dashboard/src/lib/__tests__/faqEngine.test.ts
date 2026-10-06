import { describe, expect, it } from 'vitest';
import { ALL_FAQS, FAQ_CATEGORIES, filterFAQs, getFAQById, getFAQCategoryCount } from '../faqData';

describe('Production FAQ Engine & Data Registry Suite', () => {
  it('should contain at least 25 FAQs in the master registry with unique non-empty IDs', () => {
    expect(ALL_FAQS.length).toBeGreaterThanOrEqual(25);

    const ids = new Set<string>();
    ALL_FAQS.forEach((faq) => {
      expect(faq.id).toBeDefined();
      expect(ids.has(faq.id)).toBe(false);
      ids.add(faq.id);
      expect(faq.question.length).toBeGreaterThan(10);
      expect(faq.answer.length).toBeGreaterThan(20);
      expect(faq.tags.length).toBeGreaterThan(0);
    });
  });

  it('should filter FAQs correctly by category', () => {
    const roboFaqs = filterFAQs('robo');
    expect(roboFaqs.length).toBeGreaterThan(0);
    roboFaqs.forEach((f) => expect(f.category).toBe('robo'));

    const hftFaqs = filterFAQs('hft');
    expect(hftFaqs.length).toBeGreaterThan(0);
    hftFaqs.forEach((f) => expect(f.category).toBe('hft'));
  });

  it('should filter FAQs accurately using text search query', () => {
    const obiResults = filterFAQs('all', 'OBI');
    expect(obiResults.length).toBeGreaterThan(0);

    const zeroResults = filterFAQs('all', 'nonexistent_query_xyz_123');
    expect(zeroResults.length).toBe(0);
  });

  it('should match search queries against tags and answers case-insensitively', () => {
    const tagMatches = filterFAQs('all', 'disruptor');
    expect(tagMatches.length).toBeGreaterThan(0);

    const uppercaseMatches = filterFAQs('all', 'MICRO-PRICE');
    expect(uppercaseMatches.length).toBeGreaterThan(0);
  });

  it('should retrieve individual FAQ items by ID', () => {
    const target = ALL_FAQS[0];
    const retrieved = getFAQById(target.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.question).toBe(target.question);
  });

  it('should calculate category counts matching category meta length', () => {
    expect(getFAQCategoryCount('all')).toBe(ALL_FAQS.length);
    FAQ_CATEGORIES.filter((c) => c.id !== 'all').forEach((cat) => {
      expect(getFAQCategoryCount(cat.id)).toBeGreaterThan(0);
    });
  });
});

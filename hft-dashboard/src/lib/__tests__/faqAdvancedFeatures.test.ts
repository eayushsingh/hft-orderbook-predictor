import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateFAQJsonLd, generateFAQJsonLdString } from '../faqSchemaGenerator';
import { trackFAQSearch, getSearchHistory, getTopSearchTerms } from '../faqAnalyticsTracker';
import { getPopularFAQs, ALL_FAQS } from '../faqData';

describe('FAQ Advanced Utilities Test Suite', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('FAQ JSON-LD Schema Generator', () => {
    it('should generate valid Schema.org FAQPage data', () => {
      const sample = ALL_FAQS.slice(0, 2);
      const jsonLd = generateFAQJsonLd(sample);

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('FAQPage');
      expect(jsonLd.mainEntity).toHaveLength(2);
      expect(jsonLd.mainEntity[0]['@type']).toBe('Question');
      expect(jsonLd.mainEntity[0].name).toBe(sample[0].question);
    });

    it('should output clean stringified JSON-LD without raw backticks', () => {
      const sample = ALL_FAQS.slice(0, 1);
      const str = generateFAQJsonLdString(sample);
      expect(str).toContain('"@type":"FAQPage"');
    });
  });

  describe('FAQ Search Analytics Tracker', () => {
    it('should log search queries and compute top search terms', () => {
      trackFAQSearch('micro-price', 5);
      trackFAQSearch('micro-price', 5);
      trackFAQSearch('zerodha', 2);

      const history = getSearchHistory();
      expect(history.length).toBeGreaterThanOrEqual(2);

      const topTerms = getTopSearchTerms();
      expect(topTerms[0].term).toBe('micro-price');
      expect(topTerms[0].count).toBe(2);
    });
  });

  describe('Popular FAQs Helper', () => {
    it('should return top FAQs sorted by net helpful count', () => {
      const popular = getPopularFAQs(ALL_FAQS, 5);
      expect(popular).toHaveLength(5);
      expect(popular[0].helpfulCount).toBeGreaterThanOrEqual(popular[1].helpfulCount);
    });
  });
});

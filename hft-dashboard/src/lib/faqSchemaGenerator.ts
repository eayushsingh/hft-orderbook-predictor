import { FAQItem } from './faqData';

/**
 * Schema.org JSON-LD FAQPage Generator for Search Engine Optimization (SEO)
 * 
 * Humanized Explanation for Maintainers:
 * Generates Schema.org `FAQPage` microdata for Google Search indexing.
 * Strips code backticks and line breaks to output clean plain text schema required by Google Search Console.
 * 
 * @param faqs List of FAQ items to format into JSON-LD
 * @returns JSON-LD object compliant with schema.org/FAQPage specification
 */
export function generateFAQJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/`([^`]+)`/g, '$1').replace(/\n+/g, ' '),
      },
    })),
  };
}

/**
 * Returns serialized JSON-LD string ready to be injected into script tags.
 */
export function generateFAQJsonLdString(faqs: FAQItem[]): string {
  return JSON.stringify(generateFAQJsonLd(faqs));
}

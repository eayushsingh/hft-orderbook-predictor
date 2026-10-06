import { FAQItem } from './faqData';

/**
 * Generates Schema.org JSON-LD structured data object for Google Search rich results (FAQPage schema).
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

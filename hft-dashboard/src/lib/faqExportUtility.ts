import { FAQItem } from './faqData';

/**
 * Downloads a list of FAQs as a formatted JSON file.
 */
export function exportFAQsAsJSON(faqs: FAQItem[], filename = 'hft-faq-knowledgebase.json') {
  if (typeof window === 'undefined') return;
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(faqs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Downloads FAQs as a plain text Markdown document.
 */
export function exportFAQsAsMarkdown(faqs: FAQItem[], filename = 'hft-faq-knowledgebase.md') {
  if (typeof window === 'undefined') return;
  let mdContent = `# HFT Orderbook Predictor - Technical FAQ Knowledge Base\n\n`;
  mdContent += `Generated on: ${new Date().toISOString()}\nTotal Articles: ${faqs.length}\n\n---\n\n`;

  faqs.forEach((item, idx) => {
    mdContent += `### ${idx + 1}. [${item.category.toUpperCase()}] ${item.question}\n\n`;
    mdContent += `${item.answer}\n\n`;
    mdContent += `*Tags: ${item.tags.join(', ')}*\n\n---\n\n`;
  });

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

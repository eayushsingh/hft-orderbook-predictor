import { PresentationSlide } from './types';

export function exportPresentationSummaryMarkdown(slides: PresentationSlide[]) {
  let content = `# LALAN Institutional HFT & Autonomous Robo-Advisor Presentation Deck Summary\n\n`;
  content += `*Generated automatically from LALAN Quantitative Platform*\n\n`;
  content += `---\n\n`;

  slides.forEach((slide) => {
    content += `## Slide 0${slide.slideNumber}: ${slide.title}\n`;
    content += `**Category:** ${slide.category.replace(/_/g, ' ')}\n\n`;
    content += `**Subtitle:** ${slide.subtitle}\n\n`;
    content += `### Presenter Notes:\n${slide.speakerNotes}\n\n`;

    if (slide.takeaways && slide.takeaways.length > 0) {
      content += `### Key Takeaways:\n`;
      slide.takeaways.forEach((t) => {
        content += `- **${t.title}:** ${t.description}\n`;
      });
      content += `\n`;
    }

    content += `---\n\n`;
  });

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `LALAN_Presentation_Deck_Briefing.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

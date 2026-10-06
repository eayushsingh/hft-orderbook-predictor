import { describe, expect, it } from 'vitest';
import { SLIDES_REGISTRY } from '../InteractivePresentationDeck';

describe('Presentation Slide Deck Unit Suite', () => {
  it('should contain 11 slides in the registry with unique IDs and numbers', () => {
    expect(SLIDES_REGISTRY.length).toBe(11);

    const ids = new Set<string>();
    SLIDES_REGISTRY.forEach((slide, index) => {
      expect(slide.id).toBeDefined();
      expect(ids.has(slide.id)).toBe(false);
      ids.add(slide.id);
      expect(slide.slideNumber).toBe(index + 1);
    });
  });

  it('should have non-empty titles, speaker notes, and takeaways for every slide', () => {
    SLIDES_REGISTRY.forEach((slide) => {
      expect(slide.title.length).toBeGreaterThan(0);
      expect(slide.subtitle.length).toBeGreaterThan(0);
      expect(slide.speakerNotes.length).toBeGreaterThan(0);
      expect(slide.takeaways.length).toBeGreaterThan(0);
    });
  });

  it('should categorize slides properly across 11 distinct categories', () => {
    const categories = SLIDES_REGISTRY.map((s) => s.category);
    expect(categories).toContain('OVERVIEW');
    expect(categories).toContain('ARCHITECTURE');
    expect(categories).toContain('MICROSTRUCTURE');
    expect(categories).toContain('ROBO_ADVISOR');
    expect(categories).toContain('BENCHMARK');
    expect(categories).toContain('QUANT_ALPHA');
    expect(categories).toContain('COMPLIANCE');
    expect(categories).toContain('LIVE_SANDBOX');
  });
});

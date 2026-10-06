import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About & Institutional PPT Briefing | LALAN HFT Platform',
  description:
    'Interactive 11-slide PowerPoint briefing deck detailing LALAN Quantitative HFT co-location architecture, order book microstructure alpha signals, and autonomous Robo-Advisor engine.',
  openGraph: {
    title: 'About LALAN Quantitative Platform & Institutional PPT Briefing',
    description:
      'Sub-microsecond co-location architecture, order book microstructure forecasting, and autonomous Black-Litterman Robo-Advisor.',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

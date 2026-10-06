import { LucideIcon } from 'lucide-react';

export type SlideCategory =
  | 'OVERVIEW'
  | 'ARCHITECTURE'
  | 'MICROSTRUCTURE'
  | 'ROBO_ADVISOR'
  | 'MULTI_BROKER'
  | 'BENCHMARK'
  | 'TECH_STACK'
  | 'ROADMAP';

export interface SlideTakeaway {
  title: string;
  description: string;
  metric?: string;
}

export interface PresentationSlide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle: string;
  category: SlideCategory;
  iconName: string;
  speakerNotes: string;
  durationSeconds: number;
  takeaways: SlideTakeaway[];
}

export interface PresentationDeckState {
  currentSlideIndex: number;
  isAutoPlaying: boolean;
  autoPlaySpeedSec: number;
  showSpeakerNotes: boolean;
  showGridModal: boolean;
  isFullScreen: boolean;
  viewMode: 'PRESENTATION' | 'DOCUMENT' | 'GRID';
}

export interface PlatformMetricItem {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
}

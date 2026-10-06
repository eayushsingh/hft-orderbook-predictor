export type SlideCategory =
  | 'OVERVIEW'
  | 'MICROSTRUCTURE'
  | 'ARCHITECTURE'
  | 'ROBO_ADVISOR'
  | 'BENCHMARK'
  | 'MULTI_BROKER'
  | 'TECH_STACK'
  | 'QUANT_ALPHA'
  | 'COMPLIANCE'
  | 'LIVE_SANDBOX'
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
  showKeyboardHelp: boolean;
  isFullScreen: boolean;
  isLaserPointerActive: boolean;
  isSoundEnabled: boolean;
  isPresenterMode: boolean;
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

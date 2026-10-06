'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  FileText,
  Grid,
  Download,
} from 'lucide-react';
import { PresentationDeckState } from './types';

interface PresentationNavbarControlsProps {
  deckState: PresentationDeckState;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onToggleAutoPlay: () => void;
  onToggleFullScreen: () => void;
  onToggleSpeakerNotes: () => void;
  onToggleGridModal: () => void;
  onExportSummary?: () => void;
}

export const PresentationNavbarControls: React.FC<PresentationNavbarControlsProps> = ({
  deckState,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onToggleAutoPlay,
  onToggleFullScreen,
  onToggleSpeakerNotes,
  onToggleGridModal,
  onExportSummary,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Slide Navigation Buttons & Counter */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onPrevSlide}
          disabled={deckState.currentSlideIndex === 0}
          className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Previous Slide (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
          Slide <strong className="text-emerald-400">{deckState.currentSlideIndex + 1}</strong> of {totalSlides}
        </span>

        <button
          type="button"
          onClick={onNextSlide}
          disabled={deckState.currentSlideIndex === totalSlides - 1}
          className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Next Slide (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center space-x-2">
        {/* Auto Play Toggle */}
        <button
          type="button"
          onClick={onToggleAutoPlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            deckState.isAutoPlaying
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Auto-Play Slideshow"
        >
          {deckState.isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{deckState.isAutoPlaying ? 'Pause' : 'Auto-Play'}</span>
        </button>

        {/* Speaker Notes Toggle */}
        <button
          type="button"
          onClick={onToggleSpeakerNotes}
          className={`p-2 rounded-xl border transition-all ${
            deckState.showSpeakerNotes
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Presenter Notes"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Slide Grid Modal Toggle */}
        <button
          type="button"
          onClick={onToggleGridModal}
          className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all"
          title="Overview Grid View"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Export Briefing Summary */}
        {onExportSummary && (
          <button
            type="button"
            onClick={onExportSummary}
            className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all"
            title="Export Presentation Deck Summary"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullScreen}
          className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all"
          title="Toggle Fullscreen Mode"
        >
          {deckState.isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

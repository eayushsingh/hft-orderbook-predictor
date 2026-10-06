'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { PresentationSlide } from './types';

interface SpeakerNotesDrawerProps {
  slide: PresentationSlide;
  isOpen: boolean;
}

export const SpeakerNotesDrawer: React.FC<SpeakerNotesDrawerProps> = ({ slide, isOpen }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="mt-4 bg-slate-950/95 border border-cyan-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>Presenter Teleprompter &amp; Speaker Notes &bull; Slide {slide.slideNumber}</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            <Clock className="w-3 h-3 text-cyan-400" /> Target Duration: {slide.durationSeconds}s
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-sans">{slide.speakerNotes}</p>

        {slide.takeaways && slide.takeaways.length > 0 && (
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Key Presenter Talking Points
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {slide.takeaways.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">{t.title}:</strong> {t.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

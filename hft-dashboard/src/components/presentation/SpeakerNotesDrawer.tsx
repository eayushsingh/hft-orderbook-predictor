'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2 } from 'lucide-react';
import { PresentationSlide } from './types';

interface SpeakerNotesDrawerProps {
  slide: PresentationSlide;
  isOpen: boolean;
}

export const SpeakerNotesDrawer: React.FC<SpeakerNotesDrawerProps> = ({ slide, isOpen }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
        <FileText className="w-4 h-4" />
        <span>Presenter Speaker Notes • Slide {slide.slideNumber}</span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-sans">{slide.speakerNotes}</p>

      {slide.takeaways && slide.takeaways.length > 0 && (
        <div className="pt-2 border-t border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Key Presenter Takeaways
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {slide.takeaways.map((t, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>{t.title}:</strong> {t.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

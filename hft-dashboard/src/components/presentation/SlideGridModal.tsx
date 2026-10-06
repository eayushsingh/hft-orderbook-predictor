'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, X, CheckCircle2 } from 'lucide-react';
import { PresentationSlide } from './types';

interface SlideGridModalProps {
  slides: PresentationSlide[];
  currentSlideIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
}

export const SlideGridModal: React.FC<SlideGridModalProps> = ({
  slides,
  currentSlideIndex,
  isOpen,
  onClose,
  onSelectSlide,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-5xl w-full max-h-[85vh] flex flex-col space-y-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Presentation Slide Index Grid</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid Thumbnails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pr-1 flex-1">
            {slides.map((slide, idx) => {
              const isActive = currentSlideIndex === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    onSelectSlide(idx);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all relative ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Slide 0{idx + 1}
                    </span>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{slide.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{slide.subtitle}</p>
                  </div>

                  <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 self-start">
                    {slide.category.replace(/_/g, ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

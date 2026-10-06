'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Sparkles } from 'lucide-react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Right Arrow / Space / N', description: 'Next slide' },
  { key: 'Left Arrow / P', description: 'Previous slide' },
  { key: 'Home / End', description: 'Jump to first / last slide' },
  { key: 'F', description: 'Toggle full-screen presentation mode' },
  { key: 'G', description: 'Toggle slide thumbnail grid overview' },
  { key: 'S', description: 'Toggle speaker notes drawer' },
  { key: 'L', description: 'Toggle presenter laser pointer tool' },
  { key: 'M', description: 'Toggle presentation sound effects' },
  { key: 'P', description: 'Toggle Presenter Dual-Screen mode' },
  { key: 'A', description: 'Toggle auto-advance slideshow' },
  { key: '?', description: 'Open / close keyboard shortcuts help' },
  { key: 'Esc', description: 'Exit full-screen / Close modals' },
];

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Keyboard Shortcuts &amp; Presenter Controls
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-400">Navigate the PPT slide deck seamlessly like a pro</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {SHORTCUTS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <span className="text-xs font-medium text-slate-300">{item.description}</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-emerald-400 text-xs font-mono font-semibold rounded border border-slate-700 shadow-sm">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 text-center">
              <span className="text-xs text-slate-500">
                Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 font-mono rounded">Esc</kbd> or click anywhere to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

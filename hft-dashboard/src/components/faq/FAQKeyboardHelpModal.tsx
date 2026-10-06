import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface FAQKeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQKeyboardHelpModal: React.FC<FAQKeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus FAQ search bar' },
    { key: 'Esc', description: 'Clear search query / close modals' },
    { key: 'J or ↓', description: 'Navigate to next FAQ item' },
    { key: 'K or ↑', description: 'Navigate to previous FAQ item' },
    { key: '?', description: 'Toggle keyboard shortcuts menu' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1f1f2c]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#387ed1]/10 text-[#387ed1]">
              <Keyboard className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a1a24] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141e] border border-slate-100 dark:border-[#1f1f2c]">
              <span className="text-xs text-slate-600 dark:text-[#8a8d9b] font-medium">{sc.description}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-slate-700 dark:text-cyan-400 bg-white dark:bg-[#09090d] border border-slate-300 dark:border-[#2a2a3c] rounded-md shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold font-mono text-white bg-[#387ed1] hover:bg-[#306ec0] rounded-xl transition-colors shadow-md shadow-[#387ed1]/20"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

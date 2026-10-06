'use client';

import React from 'react';
import { Tag } from 'lucide-react';

interface FAQSearchSuggestionsPillsProps {
  onSelectKeyword: (keyword: string) => void;
}

const SUGGESTIONS = [
  'OBI Formula',
  'Micro-Price',
  'Black-Litterman',
  'Wash-Sale Rule',
  'Zerodha Hot-Failover',
  'Disruptor Ring Buffer',
  'SEBI Regulations',
  '14-Day Free Trial',
];

export const FAQSearchSuggestionsPills: React.FC<FAQSearchSuggestionsPillsProps> = ({
  onSelectKeyword,
}) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
      <span className="text-slate-500 dark:text-[#747888] font-mono flex items-center gap-1 mr-1">
        <Tag className="w-3 h-3 text-[#387ed1]" /> Suggested Topics:
      </span>
      {SUGGESTIONS.map((kw, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectKeyword(kw)}
          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-[#12121a] hover:bg-[#387ed1]/20 text-slate-700 dark:text-slate-300 hover:text-[#387ed1] dark:hover:text-[#387ed1] border border-slate-300 dark:border-[#1f1f2c] font-mono text-[11px] transition-all"
        >
          {kw}
        </button>
      ))}
    </div>
  );
};

'use client';

import React from 'react';
import { SearchX, RotateCcw, MessageSquarePlus } from 'lucide-react';

interface FAQEmptyStateProps {
  searchQuery: string;
  onReset: () => void;
  onOpenAskModal: () => void;
}

export const FAQEmptyState: React.FC<FAQEmptyStateProps> = ({
  searchQuery,
  onReset,
  onOpenAskModal,
}) => {
  return (
    <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] space-y-4 shadow-sm">
      <SearchX className="w-10 h-10 text-slate-400 dark:text-[#747888] mx-auto" />
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">No FAQ articles matching &quot;{searchQuery}&quot;</h4>
        <p className="text-xs text-slate-500 dark:text-[#747888]">
          Try broadening your search term or selecting a different category.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-200 dark:bg-[#14141e] text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-[#1c1c2b] flex items-center gap-2 border border-slate-300 dark:border-[#1f1f2c] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Search Filters
        </button>
        <button
          type="button"
          onClick={onOpenAskModal}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#387ed1] hover:bg-[#306ec0] text-white flex items-center gap-2 shadow-md transition-all"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" /> Ask a Support Question
        </button>
      </div>
    </div>
  );
};

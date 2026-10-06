'use client';

import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface FAQSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export const FAQSearchBar: React.FC<FAQSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-[#747888]" />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search eg: OBI formula, Google sign-in, free trial, disruptor ring buffer..."
        className="w-full bg-white dark:bg-[#0e0e14] text-xs sm:text-sm text-slate-900 dark:text-white pl-11 pr-10 py-3.5 rounded-xl border border-slate-300 dark:border-[#1f1f2c] focus:outline-none focus:border-[#387ed1] transition-colors font-mono shadow-sm"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            onClear();
            inputRef.current?.focus();
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Clear search query"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

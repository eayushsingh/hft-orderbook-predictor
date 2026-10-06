'use client';

import React from 'react';
import { FAQCategory, FAQ_CATEGORIES, getFAQCategoryCount } from '@/lib/faqData';

interface FAQCategoryFilterPillsProps {
  selectedCategory: FAQCategory | 'all';
  onSelectCategory: (category: FAQCategory | 'all') => void;
}

export const FAQCategoryFilterPills: React.FC<FAQCategoryFilterPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto no-scrollbar pb-2 pt-1">
      {FAQ_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = getFAQCategoryCount(cat.id);

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              isSelected
                ? 'bg-[#387ed1] text-white shadow-md font-extrabold shadow-[#387ed1]/20'
                : 'bg-slate-200 dark:bg-[#0e0e14] text-slate-800 dark:text-[#8a8d9b] hover:bg-slate-300 dark:hover:bg-[#161622] hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-[#1f1f2c]'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isSelected
                  ? 'bg-white/20 text-white font-bold'
                  : 'bg-slate-300 dark:bg-[#181824] text-slate-600 dark:text-[#747888]'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

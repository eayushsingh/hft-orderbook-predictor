'use client';

import React from 'react';
import { HelpCircle, Clock, ShieldCheck, Zap } from 'lucide-react';
import { ALL_FAQS, FAQ_CATEGORIES } from '@/lib/faqData';

export const FAQStatsHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
      <div className="p-3 rounded-xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] text-center space-y-0.5 shadow-sm">
        <span className="text-[10px] text-slate-500 dark:text-[#747888] font-mono uppercase flex items-center justify-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#387ed1]" /> Total Verified FAQs
        </span>
        <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono">
          {ALL_FAQS.length} Articles
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] text-center space-y-0.5 shadow-sm">
        <span className="text-[10px] text-slate-500 dark:text-[#747888] font-mono uppercase flex items-center justify-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" /> Topic Categories
        </span>
        <div className="text-base sm:text-lg font-extrabold text-emerald-500 dark:text-emerald-400 font-mono">
          {FAQ_CATEGORIES.length - 1} Modules
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] text-center space-y-0.5 shadow-sm">
        <span className="text-[10px] text-slate-500 dark:text-[#747888] font-mono uppercase flex items-center justify-center gap-1">
          <Clock className="w-3 h-3 text-teal-400" /> Support Reply SLA
        </span>
        <div className="text-base sm:text-lg font-extrabold text-teal-500 dark:text-teal-400 font-mono">
          &lt; 2 Hours
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] text-center space-y-0.5 shadow-sm">
        <span className="text-[10px] text-slate-500 dark:text-[#747888] font-mono uppercase flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-amber-400" /> Audit Compliance
        </span>
        <div className="text-base sm:text-lg font-extrabold text-amber-500 dark:text-amber-400 font-mono">
          SEBI / SOC2
        </div>
      </div>
    </div>
  );
};

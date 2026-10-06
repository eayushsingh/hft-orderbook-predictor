'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQItem } from '@/lib/faqData';
import { FAQFeedbackButtons } from './FAQFeedbackButtons';
import { FAQShareButton } from './FAQShareButton';

interface FAQAccordionItemProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({
  faq,
  isExpanded,
  onToggle,
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isExpanded
          ? 'bg-slate-100/90 dark:bg-[#0e0e16] border-[#387ed1] shadow-lg ring-1 ring-[#387ed1]/30'
          : 'bg-white dark:bg-[#0e0e14] border-slate-200 dark:border-[#1f1f2c] hover:border-[#387ed1]/50 shadow-sm'
      }`}
    >
      <div className="w-full p-5 flex items-start justify-between gap-4 font-sans cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3 flex-1">
          <HelpCircle
            className={`h-5 w-5 shrink-0 mt-0.5 transition-colors ${
              isExpanded ? 'text-[#387ed1]' : 'text-slate-400 dark:text-[#747888]'
            }`}
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-[#161622] text-[#0284c7] dark:text-[#387ed1]">
                {faq.categoryLabel}
              </span>
              {faq.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[9px] font-mono text-slate-500 dark:text-[#747888]">
                  #{tag}
                </span>
              ))}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              {faq.question}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <FAQShareButton faqId={faq.id} />
          <ChevronDown
            className={`h-5 w-5 text-slate-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-[#387ed1]' : ''
            }`}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-[#1f1f2e] mt-1 overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-slate-700 dark:text-[#a0a3b0] leading-relaxed pt-3 pl-8 font-medium">
              {faq.answer}
            </p>

            <div className="pl-8 pt-3">
              <FAQFeedbackButtons
                faqId={faq.id}
                initialHelpful={faq.helpfulCount}
                initialUnhelpful={faq.unhelpfulCount}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

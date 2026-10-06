'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Search, Sparkles } from 'lucide-react';
import { filterFAQs } from '@/lib/faqData';
import { FAQAccordionItem } from './FAQAccordionItem';

interface QuickFAQDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickFAQDrawerModal: React.FC<QuickFAQDrawerModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-gen-1');

  if (!isOpen) return null;

  const faqs = filterFAQs('all', searchQuery);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#387ed1]/10 border border-[#387ed1]/30 text-[#387ed1]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Terminal Quick FAQ Drawer
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400">Search trading formulas &amp; microsecond signals</p>
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

          {/* Search Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/30">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search FAQ keywords (eg: OBI, Micro-Price, Rebalance)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#387ed1] font-mono"
              />
            </div>
          </div>

          {/* FAQ Content List */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {faqs.map((faq) => (
              <FAQAccordionItem
                key={faq.id}
                faq={faq}
                isExpanded={expandedFaqId === faq.id}
                onToggle={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-center">
            <span className="text-xs text-slate-500">
              Need direct help? Contact <a href="mailto:ayushsinghe07@gmail.com" className="text-[#387ed1] font-bold">Quant Support</a>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

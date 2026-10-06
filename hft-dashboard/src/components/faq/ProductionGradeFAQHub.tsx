'use client';

import React, { useState, useMemo } from 'react';
import { FAQCategory, ALL_FAQS, filterFAQs } from '@/lib/faqData';
import { FAQSearchBar } from './FAQSearchBar';
import { FAQCategoryFilterPills } from './FAQCategoryFilterPills';
import { FAQSearchSuggestionsPills } from './FAQSearchSuggestionsPills';
import { FAQStatsHeader } from './FAQStatsHeader';
import { FAQAccordionItem } from './FAQAccordionItem';
import { FAQEmptyState } from './FAQEmptyState';
import { FAQAskQuestionModal } from './FAQAskQuestionModal';
import { MessageSquarePlus, Sparkles } from 'lucide-react';

export const ProductionGradeFAQHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-gen-1');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  const filteredFaqs = useMemo(() => {
    return filterFAQs(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-8 max-w-[1150px] w-full mx-auto">
      {/* Top Header & Search Area */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#387ed1]/15 border border-[#387ed1]/35 text-[#387ed1] text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Developer &amp; Trader Knowledge Base</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#8a8d9b] leading-relaxed">
          Search our quantitative engine documentation, OBI signal formulas, Google OAuth setup, and trading FAQs.
        </p>

        {/* Main Search Input */}
        <FAQSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Quick Keyword Pills */}
        <FAQSearchSuggestionsPills onSelectKeyword={(kw) => setSearchQuery(kw)} />
      </div>

      {/* Stats Overview Header */}
      <FAQStatsHeader />

      {/* Category Pills Filter */}
      <FAQCategoryFilterPills
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* FAQs List Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#747888] px-1">
          <span>
            SHOWING <strong className="text-slate-900 dark:text-white">{filteredFaqs.length}</strong> OF{' '}
            {ALL_FAQS.length} VERIFIED QUESTIONS
          </span>

          <button
            type="button"
            onClick={() => setIsAskModalOpen(true)}
            className="text-[#387ed1] hover:underline font-bold flex items-center gap-1"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" /> Ask New Question
          </button>
        </div>

        {filteredFaqs.length === 0 ? (
          <FAQEmptyState
            searchQuery={searchQuery}
            onReset={handleResetFilters}
            onOpenAskModal={() => setIsAskModalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <FAQAccordionItem
                key={faq.id}
                faq={faq}
                isExpanded={expandedFaqId === faq.id}
                onToggle={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ask Modal */}
      <FAQAskQuestionModal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} />
    </div>
  );
};

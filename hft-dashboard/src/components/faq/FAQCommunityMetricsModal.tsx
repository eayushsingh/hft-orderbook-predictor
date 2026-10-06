import React from 'react';
import { ALL_FAQS } from '@/lib/faqData';
import { ThumbsUp, Award, BarChart3, X } from 'lucide-react';

interface FAQCommunityMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQCommunityMetricsModal: React.FC<FAQCommunityMetricsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const totalHelpful = ALL_FAQS.reduce((acc, f) => acc + f.helpfulCount, 0);
  const totalUnhelpful = ALL_FAQS.reduce((acc, f) => acc + f.unhelpfulCount, 0);
  const satisfactionRate = Math.round((totalHelpful / (totalHelpful + totalUnhelpful || 1)) * 100);

  const topFaqs = [...ALL_FAQS]
    .sort((a, b) => b.helpfulCount - a.helpfulCount)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1f1f2c]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Helpfulness Metrics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-[#181824]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#14141e] border border-slate-200 dark:border-[#1f1f2c] text-center">
            <div className="text-xl font-bold font-mono text-emerald-500">{satisfactionRate}%</div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-[#8a8d9b] uppercase">Satisfaction Rate</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#14141e] border border-slate-200 dark:border-[#1f1f2c] text-center">
            <div className="text-xl font-bold font-mono text-[#387ed1]">{totalHelpful.toLocaleString()}</div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-[#8a8d9b] uppercase">Helpful Votes</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#14141e] border border-slate-200 dark:border-[#1f1f2c] text-center col-span-2 sm:col-span-1">
            <div className="text-xl font-bold font-mono text-cyan-400">{ALL_FAQS.length}</div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-[#8a8d9b] uppercase">Verified FAQs</div>
          </div>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Top Rated Articles:
          </h4>
          <div className="space-y-2">
            {topFaqs.map((faq) => (
              <div
                key={faq.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141e] border border-slate-100 dark:border-[#1f1f2c] flex items-center justify-between text-xs"
              >
                <span className="truncate max-w-[280px] font-medium text-slate-800 dark:text-slate-200">{faq.question}</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {faq.helpfulCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#387ed1] hover:bg-[#306ec0] text-white text-xs font-mono font-bold shadow-md shadow-[#387ed1]/20 transition-colors"
          >
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
};

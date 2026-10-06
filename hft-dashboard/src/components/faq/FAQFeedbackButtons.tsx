'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface FAQFeedbackButtonsProps {
  faqId: string;
  initialHelpful: number;
  initialUnhelpful: number;
}

export const FAQFeedbackButtons: React.FC<FAQFeedbackButtonsProps> = ({
  faqId,
  initialHelpful,
  initialUnhelpful,
}) => {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [unhelpfulCount, setUnhelpfulCount] = useState(initialUnhelpful);
  const [userVote, setUserVote] = useState<'HELPFUL' | 'UNHELPFUL' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedVote = localStorage.getItem(`faq_vote_${faqId}`);
    if (savedVote === 'HELPFUL' || savedVote === 'UNHELPFUL') {
      setUserVote(savedVote);
    }
  }, [faqId]);

  const handleVote = (vote: 'HELPFUL' | 'UNHELPFUL') => {
    if (userVote) return; // Prevent double voting

    if (vote === 'HELPFUL') {
      setHelpfulCount((c) => c + 1);
      setUserVote('HELPFUL');
      if (typeof window !== 'undefined') {
        localStorage.setItem(`faq_vote_${faqId}`, 'HELPFUL');
      }
    } else {
      setUnhelpfulCount((c) => c + 1);
      setUserVote('UNHELPFUL');
      if (typeof window !== 'undefined') {
        localStorage.setItem(`faq_vote_${faqId}`, 'UNHELPFUL');
      }
    }
  };

  return (
    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-[#747888] pt-2">
      <span>Was this answer helpful?</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleVote('HELPFUL')}
          disabled={userVote !== null}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
            userVote === 'HELPFUL'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
              : 'bg-slate-100 dark:bg-[#14141e] border-slate-200 dark:border-[#1f1f2c] text-slate-700 dark:text-slate-300 hover:text-white'
          }`}
        >
          {userVote === 'HELPFUL' ? <Check className="w-3 h-3 text-emerald-400" /> : <ThumbsUp className="w-3 h-3" />}
          <span>Yes ({helpfulCount})</span>
        </button>

        <button
          type="button"
          onClick={() => handleVote('UNHELPFUL')}
          disabled={userVote !== null}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
            userVote === 'UNHELPFUL'
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold'
              : 'bg-slate-100 dark:bg-[#14141e] border-slate-200 dark:border-[#1f1f2c] text-slate-700 dark:text-slate-300 hover:text-white'
          }`}
        >
          <ThumbsDown className="w-3 h-3" />
          <span>No ({unhelpfulCount})</span>
        </button>
      </div>
    </div>
  );
};

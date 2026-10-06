'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface FAQShareButtonProps {
  faqId: string;
}

export const FAQShareButton: React.FC<FAQShareButtonProps> = ({ faqId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?faq=${faqId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopyLink}
      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-200 dark:hover:bg-[#161622] transition-colors"
      title="Copy direct link to this question"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
    </button>
  );
};

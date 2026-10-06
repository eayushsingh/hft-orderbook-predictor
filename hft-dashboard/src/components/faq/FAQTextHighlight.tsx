import React from 'react';

interface FAQTextHighlightProps {
  text: string;
  highlight: string;
  className?: string;
}

export const FAQTextHighlight: React.FC<FAQTextHighlightProps> = ({ text, highlight, className = '' }) => {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escapeRegex = (str: string) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapeRegex(highlight)})`, 'gi'));

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-400/20 text-amber-600 dark:text-amber-300 font-semibold px-1 rounded-xs border-b border-amber-400/40"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

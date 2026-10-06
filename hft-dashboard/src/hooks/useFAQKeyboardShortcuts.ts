import { useEffect } from 'react';

interface UseFAQKeyboardShortcutsProps {
  onFocusSearch: () => void;
  onClearSearch: () => void;
  onToggleHelpModal: () => void;
  onNextFAQ?: () => void;
  onPrevFAQ?: () => void;
}

export function useFAQKeyboardShortcuts({
  onFocusSearch,
  onClearSearch,
  onToggleHelpModal,
  onNextFAQ,
  onPrevFAQ,
}: UseFAQKeyboardShortcutsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is currently typing inside an input or textarea element
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        onFocusSearch();
      } else if (e.key === 'Escape') {
        onClearSearch();
      } else if (e.key === '?' && !isInputActive) {
        e.preventDefault();
        onToggleHelpModal();
      } else if (!isInputActive && (e.key === 'j' || e.key === 'ArrowDown')) {
        if (onNextFAQ) {
          e.preventDefault();
          onNextFAQ();
        }
      } else if (!isInputActive && (e.key === 'k' || e.key === 'ArrowUp')) {
        if (onPrevFAQ) {
          e.preventDefault();
          onPrevFAQ();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFocusSearch, onClearSearch, onToggleHelpModal, onNextFAQ, onPrevFAQ]);
}

'use client';

import { useEffect } from 'react';

interface KeyboardNavProps {
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onToggleFullScreen?: () => void;
  onCloseModals?: () => void;
  enabled?: boolean;
}

export function usePresentationKeyboardNav({
  onPrevSlide,
  onNextSlide,
  onToggleFullScreen,
  onCloseModals,
  enabled = true,
}: KeyboardNavProps) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore key events when typing inside inputs or textareas
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevSlide();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        onNextSlide();
      } else if (e.key === 'Escape' && onCloseModals) {
        onCloseModals();
      } else if ((e.key === 'f' || e.key === 'F') && onToggleFullScreen) {
        onToggleFullScreen();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrevSlide, onNextSlide, onToggleFullScreen, onCloseModals, enabled]);
}

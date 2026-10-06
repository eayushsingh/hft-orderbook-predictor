'use client';

import { useEffect } from 'react';

interface KeyboardNavProps {
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onToggleFullScreen?: () => void;
  onCloseModals?: () => void;
  onToggleLaserPointer?: () => void;
  onToggleSound?: () => void;
  onToggleSpeakerNotes?: () => void;
  onToggleGridModal?: () => void;
  onToggleKeyboardHelp?: () => void;
  enabled?: boolean;
}

export function usePresentationKeyboardNav({
  onPrevSlide,
  onNextSlide,
  onToggleFullScreen,
  onCloseModals,
  onToggleLaserPointer,
  onToggleSound,
  onToggleSpeakerNotes,
  onToggleGridModal,
  onToggleKeyboardHelp,
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

      if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        onPrevSlide();
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onNextSlide();
      } else if (e.key === 'Escape' && onCloseModals) {
        onCloseModals();
      } else if ((e.key === 'f' || e.key === 'F') && onToggleFullScreen) {
        onToggleFullScreen();
      } else if ((e.key === 'l' || e.key === 'L') && onToggleLaserPointer) {
        onToggleLaserPointer();
      } else if ((e.key === 'm' || e.key === 'M') && onToggleSound) {
        onToggleSound();
      } else if ((e.key === 's' || e.key === 'S') && onToggleSpeakerNotes) {
        onToggleSpeakerNotes();
      } else if ((e.key === 'g' || e.key === 'G') && onToggleGridModal) {
        onToggleGridModal();
      } else if (e.key === '?' && onToggleKeyboardHelp) {
        onToggleKeyboardHelp();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onPrevSlide,
    onNextSlide,
    onToggleFullScreen,
    onCloseModals,
    onToggleLaserPointer,
    onToggleSound,
    onToggleSpeakerNotes,
    onToggleGridModal,
    onToggleKeyboardHelp,
    enabled,
  ]);
}

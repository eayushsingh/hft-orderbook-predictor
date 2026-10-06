'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

function NavigationProgressLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Stop loading on route change complete
  useEffect(() => {
    queueMicrotask(() => {
      setIsLoading(false);
      setProgress(100);
    });
    const timeout = setTimeout(() => {
      setProgress(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Intercept anchor clicks to start loading feedback instantly
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        const url = new URL(anchor.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsLoading(true);
          setProgress(30);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Increment progress line while loading
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 100);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      {/* Laser Top Progress Bar */}
      <motion.div
        initial={{ width: '0%', opacity: 1 }}
        animate={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 shadow-[0_0_15px_rgba(16,185,129,0.9)]"
      />

      {/* Floating Latency Pulse Badge during route transition */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-3 right-4 z-[101] bg-slate-950/90 border border-emerald-500/40 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold text-emerald-400 shadow-xl backdrop-blur-md flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SWITCHING TERMINAL ROUTE (0.42µs)...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const NavigationProgressLoader: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <NavigationProgressLoaderContent />
    </Suspense>
  );
};

export default NavigationProgressLoader;

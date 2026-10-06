import React from 'react';
import TerminalLoadingOverlay from '@/components/TerminalLoadingOverlay';

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-[#060609] flex items-center justify-center p-6">
      <TerminalLoadingOverlay
        message="LOADING QUANT PRESENTATION & SPECS..."
        subtext="Fetching LMAX Disruptor benchmark tables & market microstructure mathematical models"
        fullscreen={false}
      />
    </div>
  );
}

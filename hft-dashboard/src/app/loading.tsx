import React from 'react';
import TerminalLoadingOverlay from '@/components/TerminalLoadingOverlay';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#060609] flex items-center justify-center">
      <TerminalLoadingOverlay
        message="LOADING LALAN QUANT TELEMETRY..."
        subtext="Synchronizing market order book depth & sub-microsecond tick feeds"
        fullscreen={false}
      />
    </div>
  );
}

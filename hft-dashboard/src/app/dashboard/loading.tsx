import React from 'react';
import TerminalLoadingOverlay from '@/components/TerminalLoadingOverlay';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#060609] flex items-center justify-center p-6">
      <TerminalLoadingOverlay
        message="LOADING HFT TERMINAL DASHBOARD..."
        subtext="Initializing Level-2 order book depth ladder, OBI gauges, and live Indian market stream"
        fullscreen={false}
      />
    </div>
  );
}

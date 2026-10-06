import React from 'react';
import TerminalLoadingOverlay from '@/components/TerminalLoadingOverlay';

export default function SupportLoading() {
  return (
    <div className="min-h-screen bg-[#060609] flex items-center justify-center p-6">
      <TerminalLoadingOverlay
        message="LOADING QUANT SUPPORT & DOCUMENTATION..."
        subtext="Fetching developer API guides, WebSocket schemas, and order ticket troubleshooting"
        fullscreen={false}
      />
    </div>
  );
}

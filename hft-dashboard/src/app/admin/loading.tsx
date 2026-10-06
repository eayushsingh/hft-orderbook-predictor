import React from 'react';
import TerminalLoadingOverlay from '@/components/TerminalLoadingOverlay';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#060609] flex items-center justify-center p-6">
      <TerminalLoadingOverlay
        message="LOADING ENTERPRISE SYSTEM TELEMETRY..."
        subtext="Authenticating administrator access and gathering node ring-buffer health metrics"
        fullscreen={false}
      />
    </div>
  );
}

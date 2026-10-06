import React from 'react';
import TerminalLoadingOverlay from '@/components/TerminalLoadingOverlay';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-[#060609] flex items-center justify-center p-6">
      <TerminalLoadingOverlay
        message="LOADING INSTITUTIONAL PLANS & SUBSCRIPTIONS..."
        subtext="Fetching live API access limits, co-location tier specs, and gateway seats"
        fullscreen={false}
      />
    </div>
  );
}

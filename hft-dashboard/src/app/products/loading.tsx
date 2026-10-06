import React from 'react';
import TerminalLoadingOverlay from '@/components/TerminalLoadingOverlay';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#060609] flex items-center justify-center p-6">
      <TerminalLoadingOverlay
        message="LOADING QUANT PRODUCT SUITE..."
        subtext="Loading order book imbalance predictors, VPIN radar modules, and DhanHQ integration specs"
        fullscreen={false}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Sparkles, CheckCircle2, Award } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";

interface TrialExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LALAN HFT 7-Day Free Trial Extension Request Modal
 * 
 * Humanized Explanation for Maintainers:
 * Enables active trial users to claim an additional 7 days of Pro Quant / Institutional
 * access by answering brief feedback questions or connecting their brokerage API.
 */
export default function TrialExtensionModal({ isOpen, onClose }: TrialExtensionModalProps) {
  const { startFreeTrial, activePlanId, daysRemainingInTrial } = useSubscription();
  const [feedback, setFeedback] = useState("");
  const [useCase, setUseCase] = useState("BankNifty Futures Scalping");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleGrantExtension = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const newDuration = (daysRemainingInTrial || 0) + 7;
    await startFreeTrial(activePlanId, newDuration);

    setIsProcessing(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFeedback("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg rounded-2xl bg-[#12131c] border border-[#262738] shadow-2xl overflow-hidden my-auto text-[#e0e0e0]"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#242536] bg-[#0c0d14] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/30">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  Extend Free Trial (+7 Days)
                </h3>
                <p className="text-xs text-[#747888] font-mono">
                  Claim 7 extra days of <span className="text-[#387ed1] uppercase font-bold">{activePlanId}</span> access
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-[#747888] hover:text-white hover:bg-[#1a1b28] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleGrantExtension} className="p-6 space-y-4">
              <div className="bg-[#181926] p-4 rounded-xl border border-[#387ed1]/30 space-y-2">
                <div className="flex items-center space-x-2 text-[#387ed1]">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-mono font-bold text-white">Quant Feedback Bonus</span>
                </div>
                <p className="text-xs text-[#8a8d9b] font-mono">
                  Share how you are using LALAN HFT microstructure telemetry to get +7 complimentary trial days added instantly.
                </p>
              </div>

              <div className="space-y-3 font-mono">
                <div>
                  <label className="text-xs font-bold text-[#8a8d9b] block mb-1">
                    Primary Quant Use Case *
                  </label>
                  <select
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="w-full bg-[#181926] text-xs text-white p-3 rounded-xl border border-[#2a2b3d] focus:outline-none focus:border-[#387ed1]"
                  >
                    <option>BankNifty Futures Scalping</option>
                    <option>Nifty 50 Options Orderbook Imbalance (OBI)</option>
                    <option>Crypto Delta Neutral Market Making</option>
                    <option>Algorithmic Arbitrage (DhanHQ / Angel One)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#8a8d9b] block mb-1">
                    Quick Feedback / Feature Request
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what order book feature or signal helped your trading performance..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-[#181926] text-xs text-white p-3 rounded-xl border border-[#2a2b3d] focus:outline-none focus:border-[#387ed1]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold text-[#747888] hover:text-white"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl font-mono text-xs font-black bg-[#387ed1] hover:bg-[#306ec0] text-white shadow-lg flex items-center space-x-2 transition-all active:scale-95"
                >
                  <Award className="h-4 w-4" />
                  <span>{isProcessing ? "Extending..." : "Claim +7 Days Extension"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/40 mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-bold font-mono text-white">Trial Extended! 🎉</h4>
              <p className="text-xs text-[#8a8d9b] max-w-md mx-auto leading-relaxed font-mono">
                Your free trial for <strong className="text-white uppercase">{activePlanId}</strong> has been extended by <strong className="text-[#10b981]">7 additional days</strong>! You now have {daysRemainingInTrial} days remaining.
              </p>
              <button
                onClick={handleReset}
                className="bg-[#387ed1] text-white font-mono text-xs font-bold px-8 py-3 rounded-xl transition-all shadow-lg mt-2"
              >
                Continue Trading
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

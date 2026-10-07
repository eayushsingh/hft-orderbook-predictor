"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, Send, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";

interface EnterpriseQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LALAN HFT Enterprise Custom Quote & Co-Location Request Modal
 * 
 * Humanized Explanation for Maintainers:
 * Custom inquiry modal for institutional customers needing NSE/BSE co-location gateways,
 * dedicated FPGA hardware acceleration, 99.999% SLA uptime, or bespoke C++ execution pipelines.
 */
export default function EnterpriseQuoteModal({ isOpen, onClose }: EnterpriseQuoteModalProps) {
  const [firmName, setFirmName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [tradingVolume, setTradingVolume] = useState("₹100Cr - ₹1000Cr / Month");
  const [customRequirements, setCustomRequirements] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFirmName("");
    setContactEmail("");
    setCustomRequirements("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl rounded-2xl bg-[#12131c] border border-[#262738] shadow-2xl overflow-hidden my-auto text-[#e0e0e0]"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#242536] bg-[#0c0d14] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  Institutional & Co-Location Gateway Quote
                </h3>
                <p className="text-xs text-[#747888] font-mono">
                  Bespoke NSE/BSE Rack Allocation, FPGA Feeds & Sub-Microsecond Execution
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono font-bold text-[#8a8d9b] block mb-1">
                    Quant Firm / Capital Management Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Alpha Capital Ltd"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full bg-[#181926] text-xs font-mono text-white p-3 rounded-xl border border-[#2a2b3d] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[#8a8d9b] block mb-1">
                    Institutional Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="head-of-trading@apexalpha.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#181926] text-xs font-mono text-white p-3 rounded-xl border border-[#2a2b3d] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[#8a8d9b] block mb-1">
                    Estimated Monthly Notional Volume
                  </label>
                  <select
                    value={tradingVolume}
                    onChange={(e) => setTradingVolume(e.target.value)}
                    className="w-full bg-[#181926] text-xs font-mono text-white p-3 rounded-xl border border-[#2a2b3d] focus:outline-none focus:border-[#10b981]"
                  >
                    <option>₹50Cr - ₹100Cr / Month</option>
                    <option>₹100Cr - ₹1000Cr / Month</option>
                    <option>₹1000Cr+ / Month (Institutional Tier)</option>
                    <option>Proprietary HFT Desk (&gt; ₹5000Cr / Month)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[#8a8d9b] block mb-1">
                    Custom Setup / Direct Feed Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention specific needs: NSE Colo Rack 41, Direct Binary UDP Feed, Custom C++ SDK, Order Cancellation Thresholds..."
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    className="w-full bg-[#181926] text-xs font-mono text-white p-3 rounded-xl border border-[#2a2b3d] focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              <div className="bg-[#181926] p-4 rounded-xl border border-[#242536] flex items-center space-x-3 text-xs text-[#9a9db0] font-mono">
                <ShieldCheck className="h-5 w-5 text-[#10b981] shrink-0" />
                <span>NDA protected. Dedicated Quant Solutions Architect assigned within 2 business hours.</span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold text-[#747888] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-mono text-xs font-extrabold bg-[#10b981] hover:bg-[#0da673] text-black shadow-lg flex items-center space-x-2 transition-all active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>Request Custom Enterprise Quote</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-bold font-mono text-white">Inquiry Received! 🎉</h4>
              <p className="text-xs text-[#9a9db0] max-w-md mx-auto leading-relaxed font-mono">
                Thank you, <strong className="text-white">{firmName || "Quant Partner"}</strong>. Our Senior Quant Solutions Architect will contact <strong className="text-[#10b981]">{contactEmail}</strong> with bespoke pricing and latency SLA benchmarks.
              </p>
              <button
                onClick={handleReset}
                className="bg-[#10b981] text-black font-mono text-xs font-bold px-8 py-3 rounded-xl transition-all shadow-lg mt-2"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

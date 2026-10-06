"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  BookOpen,
  Presentation,
  Info,
} from "lucide-react";
import { WhatWeDoOverview } from "./presentation/WhatWeDoOverview";
import { InteractivePresentationDeck } from "./presentation/InteractivePresentationDeck";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const [activeTab, setActiveTab] = useState<"WHAT_WE_DO" | "PRESENTATION_DECK">("WHAT_WE_DO");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="w-full max-w-5xl rounded-3xl bg-[#0d0d14] border border-[#282836] shadow-2xl overflow-hidden my-auto text-[#e0e0e0] flex flex-col max-h-[90vh]"
        >
          {/* ── MODAL HEADER ── */}
          <div className="p-5 border-b border-[#262634] bg-[#09090e] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  LALAN Platform Specs &amp; Presentation
                </h2>
                <p className="text-xs text-[#8a8d9b]">
                  Institutional High-Frequency Architecture &amp; Executive Deck
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Modal Tabs */}
              <div className="flex items-center bg-[#161622] p-1 rounded-xl border border-[#262638]">
                <button
                  type="button"
                  onClick={() => setActiveTab("WHAT_WE_DO")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "WHAT_WE_DO"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md"
                      : "text-[#9e9ea8] hover:text-white"
                  }`}
                >
                  <Info className="w-3.5 h-3.5" /> What We Do
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("PRESENTATION_DECK")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "PRESENTATION_DECK"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md"
                      : "text-[#9e9ea8] hover:text-white"
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" /> Presentation Deck (PPT)
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a8d9b] hover:bg-[#1a1a24] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── MODAL BODY ── */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === "WHAT_WE_DO" ? (
              <WhatWeDoOverview />
            ) : (
              <InteractivePresentationDeck />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

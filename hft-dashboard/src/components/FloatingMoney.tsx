"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FloatingMoney() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none">
      {/* A single, ultra-minimal, subtle glowing dollar symbol floating softly in the background */}
      <motion.div
        initial={{ y: "105vh", x: "82vw", opacity: 0, scale: 0.8 }}
        animate={{
          y: "-15vh",
          x: ["82vw", "85vw", "80vw", "83vw"],
          opacity: [0, 0.25, 0.35, 0],
          scale: [0.8, 1, 0.9],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.25, 0.75, 1],
        }}
        className="absolute top-0 left-0 font-mono font-bold text-emerald-500/30 text-3xl sm:text-5xl drop-shadow-[0_0_15px_rgba(16,185,129,0.25)]"
      >
        $
      </motion.div>
    </div>
  );
}

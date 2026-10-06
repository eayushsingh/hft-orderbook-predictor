"use client";

import React from "react";
import { motion } from "framer-motion";

interface SmoothPageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothPageWrapper({ children, className = "" }: SmoothPageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.995 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full h-full transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}

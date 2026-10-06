"use client";

import React from "react";

interface SmoothSkeletonProps {
  className?: string;
}

export default function SmoothSkeleton({ className = "" }: SmoothSkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800/60 transform-gpu ${className}`}
    />
  );
}

"use client";

import React from "react";
import Link from "next/link";
import LalanSiteHeader from "@/components/LalanSiteHeader";
import LalanSiteFooter from "@/components/LalanSiteFooter";
import { Zap, Layers, Cpu, Code2, ArrowRight, Activity, Terminal } from "lucide-react";

export default function ProductsPage() {
  const products = [
    {
      title: "LALAN HFT Terminal",
      badge: "Flagship Terminal",
      desc: "Our ultra-fast, lock-free order execution & L2 depth visualization platform with built-in LALAN Direct and DhanHQ order tickets.",
      icon: Terminal,
      href: "/dashboard",
      color: "text-[#387ed1]",
    },
    {
      title: "LMAX Disruptor Core",
      badge: "Zero-GC Pipeline",
      desc: "Java 17 ring-buffer pipeline processing over 1,000,000 order events per second with zero JVM garbage collection pauses.",
      icon: Cpu,
      href: "/dashboard",
      color: "text-[#10b981]",
    },
    {
      title: "Order Book Imbalance (OBI) Engine",
      badge: "Microstructure Alpha",
      desc: "Decomposes buying vs selling volume pressure across 5 depth levels to predict directional price drift before sweeps occur.",
      icon: Activity,
      href: "/dashboard",
      color: "text-[#ff5722]",
    },
    {
      title: "Multi-Broker Liquidity Matrix",
      badge: "Unified Liquidity",
      desc: "Aggregates real-time feeds from LALAN Direct Engine, DhanHQ, Groww, Angel One, and Upstox into a single institutional view.",
      icon: Layers,
      href: "/dashboard",
      color: "text-[#a855f7]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060609] text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col">
      <LalanSiteHeader />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-8 max-w-[1200px] mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            LALAN HFT Quantitative Ecosystem
          </h1>
          <p className="text-sm sm:text-lg text-[#8a8d9b]">
            Sleek, modern, ultra-fast trading platforms and quantitative infrastructure for Indian quants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-8 rounded-2xl bg-[#0e0e14] border border-[#1f1f2c] hover:border-[#387ed1]/40 transition-all space-y-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl bg-[#141420] border border-[#222232] ${p.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#181824] text-[#8a8d9b] border border-[#262636]">
                    {p.badge}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight">{p.title}</h2>
                <p className="text-xs sm:text-sm text-[#8a8d9b] leading-relaxed">{p.desc}</p>

                <Link
                  href={p.href}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-[#387ed1] hover:text-[#306ec0] transition-colors pt-2"
                >
                  <span>Launch Component</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <LalanSiteFooter />
    </div>
  );
}

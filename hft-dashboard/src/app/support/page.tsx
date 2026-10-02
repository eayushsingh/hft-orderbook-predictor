"use client";

import React, { useState } from "react";
import Link from "next/link";
import LalanSiteHeader from "@/components/LalanSiteHeader";
import LalanSiteFooter from "@/components/LalanSiteFooter";
import { Search, HelpCircle, BookOpen, Terminal, ShieldCheck, Mail, ChevronRight } from "lucide-react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "How does LALAN achieve sub-millisecond execution latency?",
      a: "LALAN uses Java 17 LMAX Disruptor primitive ring buffers, cache-line padding (64 bytes), and TCP_NODELAY sockets to eliminate thread locks and JVM garbage collection pauses.",
    },
    {
      q: "How do I connect my LALAN Direct or DhanHQ API keys?",
      a: "Open the LALAN HFT Terminal, click on settings/profile, enter your LALAN Direct API Key and Access Token. Ticks will stream directly into the L2 order book.",
    },
    {
      q: "What is Order Book Imbalance (OBI)?",
      a: "OBI measures the volume difference between bids and asks across top 5 depth levels: OBI = (Bids - Asks) / (Bids + Asks). Values above +0.35 trigger a STRONG BUY signal.",
    },
    {
      q: "Is there any brokerage charge for equity delivery?",
      a: "No! All equity delivery trades and basic L1 depth stream are 100% free with ₹0 brokerage.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060609] text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col">
      <LalanSiteHeader />

      <main className="flex-1 py-16 px-4 sm:px-8 max-w-[1100px] mx-auto space-y-12">
        {/* Search Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Support &amp; Developer Portal
          </h1>
          <p className="text-sm text-[#8a8d9b]">
            Search our knowledge base for HFT engine configuration, LALAN Direct WebSocket guides, and FAQs.
          </p>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#747888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Eg: how to connect LALAN direct API, disruptor ring buffer, OBI..."
              className="w-full bg-[#0e0e14] text-xs sm:text-sm text-white pl-11 pr-4 py-3.5 rounded-xl border border-[#1f1f2c] focus:outline-none focus:border-[#387ed1] transition-colors font-mono"
            />
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-bold font-mono text-white mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0e0e14] border border-[#1f1f2c] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-start space-x-2">
                  <HelpCircle className="h-4 w-4 text-[#387ed1] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-[#8a8d9b] leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Banner */}
        <div className="p-8 rounded-2xl bg-[#0e0e14] border border-[#1f1f2c] text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Need custom HFT algorithm deployment?</h3>
          <p className="text-xs text-[#8a8d9b] max-w-lg mx-auto">
            Our quant infrastructure team provides 1-on-1 co-location server setup for prop trading firms in India.
          </p>
          <a
            href="mailto:support@lalan-hft.internal"
            className="inline-flex items-center space-x-2 bg-[#387ed1] text-white font-mono text-xs font-bold px-6 py-2.5 rounded-xl shadow"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Quant Support</span>
          </a>
        </div>
      </main>

      <LalanSiteFooter />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";

export default function LalanSiteFooter() {
  return (
    <footer className="bg-[#08080c] border-t border-[#1f1f2b] text-[#8a8d9b] font-sans text-xs pt-12 pb-8">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-8 space-y-10">
        
        {/* Main 4-Column Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="LALAN Logo" className="h-7 w-auto object-contain" />
              <span className="text-white font-black text-base uppercase tracking-wider">LALAN</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#6a6d7b]">
              © 2026 LALAN HFT Predictor Engine. High-frequency market microstructure &amp; order book forecasting for Indian markets.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <p className="text-white font-bold text-sm mb-3">Company</p>
            <ul className="space-y-2 text-[#a0a3b0]">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Ecosystem &amp; Products</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Brokerage &amp; Pricing</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support &amp; FAQ</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <p className="text-white font-bold text-sm mb-3">Products &amp; Feeds</p>
            <ul className="space-y-2 text-[#a0a3b0]">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">LALAN HFT Terminal</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">L2 Direct Feed</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Order Book Imbalance (OBI)</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Disruptor Engine</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <p className="text-white font-bold text-sm mb-3">Legal &amp; Compliance</p>
            <ul className="space-y-2 text-[#a0a3b0]">
              <li><span className="hover:text-white cursor-pointer">SEBI Quant Guidelines</span></li>
              <li><span className="hover:text-white cursor-pointer">NSE/BSE API Terms</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Risk Disclosure</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Line */}
        <div className="border-t border-[#181822] pt-6 text-[10px] text-[#545766] space-y-2 font-mono">
          <p>
            Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances.
          </p>
          <p>
            Investments in securities market are subject to market risks; read all the related documents carefully before investing. Multi-broker platform integrations are provided via standard exchange APIs.
          </p>
        </div>

        {/* Made by Ayush Credit */}
        <div className="border-t border-[#181822] pt-4 text-center font-mono text-xs text-[#a0a3b0]">
          Made with ❤️ by <span className="font-bold text-white">Ayush</span>
        </div>


      </div>
    </footer>
  );
}

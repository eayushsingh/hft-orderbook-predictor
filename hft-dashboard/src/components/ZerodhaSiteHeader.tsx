"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Zap } from "lucide-react";

export default function ZerodhaSiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/pricing", label: "Pricing" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0e]/90 backdrop-blur-xl border-b border-[#1f1f2b] text-[#e0e0e0] font-sans">
      <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="LALAN Logo"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black uppercase tracking-[0.18em] text-white">
                LALAN
              </span>
              <span className="bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/40 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                ZERODHA HFT
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? "text-[#387ed1] font-bold"
                    : "text-[#a0a3b0] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 bg-[#387ed1] hover:bg-[#306ec0] text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-[#387ed1]/20 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Open Terminal</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#a0a3b0] hover:text-white md:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1f1f2b] bg-[#0c0c10] px-4 py-4 space-y-3 font-medium text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#a0a3b0] hover:text-white py-1"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center bg-[#387ed1] text-white font-bold py-2.5 rounded-lg"
          >
            Open Live Terminal
          </Link>
        </div>
      )}
    </header>
  );
}

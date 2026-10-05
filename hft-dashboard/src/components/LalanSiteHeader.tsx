"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, Sun, Moon, LogIn, User as UserIcon, LogOut, ChevronDown, ShieldAlert } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function LalanSiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, openSignIn, logout } = useAuth();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/pricing", label: "Pricing" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0a0e]/90 backdrop-blur-xl border-b border-zinc-200 dark:border-[#1f1f2b] text-slate-800 dark:text-[#e0e0e0] font-sans transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="LALAN Logo"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">
              LALAN
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#387ed1]/15 border border-[#387ed1]/50 shadow-sm backdrop-blur-md shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-black tracking-wider text-[#1d4ed8] dark:text-[#60a5fa] uppercase">
                HFT QUANT ENGINE
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
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

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262634] bg-[#14141a] hover:bg-[#1f1f28] text-xs font-semibold font-mono text-[#a0a3b0] hover:text-white transition-all shadow-sm active:scale-95"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Sign In / User Profile Button */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-[#161622] hover:bg-[#1f1f30] border border-[#262638] px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#387ed1] text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-white max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0e0e16] border border-[#222234] rounded-xl shadow-2xl py-2 z-50 text-xs font-mono">
                  <div className="px-3 py-2 border-b border-[#1f1f2e]">
                    <div className="font-bold text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{user.email}</div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#161624] transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#387ed1]" />
                    <span>HFT Terminal</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-amber-400 hover:bg-[#161624] transition-colors font-bold"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-[#161624] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center space-x-1.5 bg-[#161622] hover:bg-[#1f1f30] border border-[#2a2a3f] text-white font-mono text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5 text-[#387ed1]" />
              <span>Sign In</span>
            </button>
          )}

          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 bg-[#387ed1] hover:bg-[#306ec0] text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-[#387ed1]/20 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Open Terminal</span>
          </Link>
        </nav>

        {/* Mobile Actions & Hamburger Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-2 rounded-lg border border-[#262634] bg-[#14141a] text-[#a0a3b0] hover:text-white"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-400" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#a0a3b0] hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
          <div className="pt-2 border-t border-[#1f1f2b] flex items-center justify-between">
            <span className="text-xs text-[#a0a3b0] font-mono">Theme Mode</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#14141a] border border-[#262634] text-xs font-mono font-bold"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center bg-[#387ed1] text-white font-bold py-2.5 rounded-lg mt-2"
          >
            Open Live Terminal
          </Link>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wifi,
  Bell,
  ChevronDown,
  Zap,
  Briefcase,
  Layers,
  BarChart3,
  BookOpen,
  Crown,
  Info,
  Sun,
  Moon,
  Gift,
  Clock,
  Menu,
  X,
  Activity,
  LogIn,
  LogOut,
  Globe,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";
import WorldMarketClock from "@/components/WorldMarketClock";

interface LalanNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  latencyMs: number;
  availableFunds: number;
  niftyPrice: number;
  niftyChange: number;
  bankNiftyPrice: number;
  bankNiftyChange: number;
  btcPrice: number;
  btcChange: number;
  selectedSymbol?: string;
  onOpenBuyModal?: (ticker?: string) => void;
  onOpenSellModal?: (ticker?: string) => void;
  onOpenPricingModal?: () => void;
  onOpenAboutModal?: () => void;
}

export default function LalanNavbar({
  activeTab,
  setActiveTab,
  latencyMs,
  availableFunds,
  niftyPrice,
  niftyChange,
  bankNiftyPrice,
  bankNiftyChange,
  btcPrice,
  btcChange,
  selectedSymbol = "BTC/USDT",
  onOpenBuyModal,
  onOpenSellModal,
  onOpenPricingModal,
  onOpenAboutModal,
}: LalanNavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { activePlanId, isTrialActive, daysRemainingInTrial } = useSubscription();
  const { user, isLoggedIn, openSignIn, logout } = useAuth();

  const navItems = [
    { id: "terminal", label: "Terminal", icon: Zap },
    { id: "allinone", label: "Screener & NSE Hub", icon: Globe },
    { id: "orders", label: "Orders", icon: BookOpen },
    { id: "positions", label: "Positions", icon: Briefcase },
    { id: "multibroker", label: "Multi-Broker", icon: Layers },
    { id: "analytics", label: "AI Microstructure", icon: BarChart3 },
    { id: "pricing", label: "Pricing", icon: Crown },
    { id: "about", label: "Specs", icon: Info },
  ];

  const planBadgeText = isTrialActive
    ? `${activePlanId.toUpperCase()} (${daysRemainingInTrial}d TRIAL)`
    : activePlanId.toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-[#22222e] dark:border-[#22222e] bg-[#0c0c10] text-[#e0e0e0] font-sans transition-colors duration-200">
      {/* ── TOP BACKPACK-STYLE TICKER & STATUS BAR ── */}
      <div className="flex h-7 items-center justify-between border-b border-[#181822] bg-[#08080c] px-3 text-[11px] font-mono text-[#8a8d9b]">
        {/* Indices Ticker */}
        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="font-bold text-[#a0a3b0]">NIFTY 50</span>
            <span className="font-semibold text-white">
              {niftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                niftyChange >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {niftyChange >= 0 ? "+" : ""}
              {niftyChange.toFixed(2)}%
            </span>
          </div>

          <div className="h-3 w-px bg-[#22222e] shrink-0" />

          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="font-bold text-[#a0a3b0]">BANK NIFTY</span>
            <span className="font-semibold text-white">
              {bankNiftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                bankNiftyChange >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {bankNiftyChange >= 0 ? "+" : ""}
              {bankNiftyChange.toFixed(2)}%
            </span>
          </div>

          <div className="h-3 w-px bg-[#22222e] shrink-0 hidden sm:block" />

          <div className="hidden sm:flex items-center space-x-1.5 shrink-0">
            <span className="font-bold text-[#a0a3b0]">BTC/USDT</span>
            <span className="font-semibold text-white">
              ${btcPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                btcChange >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {btcChange >= 0 ? "+" : ""}
              {btcChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Real-Time Telemetry Status & World Market Clock */}
        <div className="flex items-center space-x-3 shrink-0">
          <WorldMarketClock compact />

          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
            <span className="text-[#10b981] font-bold hidden lg:inline">LALAN STREAM</span>
          </div>

          <div className="hidden xs:flex items-center space-x-1 text-[#8a8d9b]">
            <Wifi className="h-3 w-3 text-[#10b981]" />
            <span>{latencyMs.toFixed(1)} ms</span>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR (BACKPACK.EXCHANGE UI REF) ── */}
      <div className="mx-auto flex h-13 items-center justify-between px-3 sm:px-5">
        {/* Left Section: Logo + Symbol Selector + Plan Badge */}
        <div className="flex items-center space-x-2.5">
          <a href="/" className="flex items-center space-x-2 group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="LALAN Logo"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-base font-black uppercase tracking-wider text-white">
              LALAN
            </span>
          </a>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#387ed1]/15 border border-[#387ed1]/50 shadow-sm backdrop-blur-md shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono font-black tracking-wider text-[#1d4ed8] dark:text-[#60a5fa] uppercase">
              HFT QUANT ENGINE
            </span>
          </div>

          <div className="h-4 w-px bg-[#22222e] hidden xs:block" />

          {/* Pair Selector Pill */}
          <div className="hidden xs:flex items-center space-x-1.5 bg-[#161620] border border-[#262636] px-2.5 py-1 rounded-lg text-xs font-mono">
            <span className="font-bold text-white">{selectedSymbol}</span>
            <span className="text-[10px] text-[#10b981] font-bold">+2.10%</span>
          </div>

          {/* Sleek Free Trial / Plan Badge */}
          <button
            onClick={() => onOpenPricingModal && onOpenPricingModal()}
            className="hidden md:flex items-center space-x-1 bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/35 text-[#10b981] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full transition-all active:scale-95"
          >
            {isTrialActive && <Clock className="h-3 w-3 animate-spin" />}
            <span>{planBadgeText}</span>
          </button>
        </div>

        {/* Center Section: Compact Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#14141c] p-1 rounded-xl border border-[#222230]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "pricing" && onOpenPricingModal) {
                    onOpenPricingModal();
                  } else if (item.id === "about" && onOpenAboutModal) {
                    onOpenAboutModal();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  isActive
                    ? "bg-[#387ed1] text-white shadow-md font-bold"
                    : "text-[#9e9ea8] hover:bg-[#1e1e2a] hover:text-white"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-[#747888]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center space-x-2">
          {/* Quick Buy & Sell Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onOpenBuyModal && onOpenBuyModal(selectedSymbol)}
              className="bg-[#10b981] hover:bg-[#0da673] text-black font-mono text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow"
            >
              BUY
            </button>
            <button
              onClick={() => onOpenSellModal && onOpenSellModal(selectedSymbol)}
              className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-mono text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow"
            >
              SELL
            </button>
          </div>

          <div className="h-4 w-px bg-[#22222e] hidden sm:block" />

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            className="p-1.5 rounded-lg bg-[#161620] border border-[#262636] text-[#a0a3b0] hover:text-white hover:border-[#387ed1] transition-all text-xs font-mono font-semibold active:scale-95"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setNotificationsOpen((v) => !v)}
              className="relative p-1.5 rounded-lg text-[#9e9ea8] hover:bg-[#1f1f28] hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#10b981]" />
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 rounded-xl border border-[#262636] bg-[#14141c] p-3 text-xs shadow-2xl z-50"
                >
                  <div className="flex items-center justify-between border-b border-[#222230] pb-2 mb-2 font-bold text-white">
                    <span>System Notifications</span>
                    <span className="text-[10px] text-[#10b981] font-mono">14D Trial Active</span>
                  </div>
                  <div className="space-y-2 text-[#b0b3c0]">
                    <div className="p-2 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[11px]">
                      <span className="font-bold text-[#10b981]">14-Day Free Trial:</span> Full access enabled. $0 charge.
                    </div>
                    <div className="p-2 rounded bg-[#387ed1]/10 border border-[#387ed1]/20 text-[11px]">
                      <span className="font-bold text-[#387ed1]">Disruptor Ring-Buffer:</span> Sub-millisecond latency.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile / Auth Button */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((v) => !v)}
                className="flex items-center space-x-1.5 rounded-lg bg-[#161620] border border-[#262636] px-2.5 py-1 hover:border-[#387ed1] transition-all"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#387ed1] text-white font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-mono text-xs font-bold text-white hidden sm:inline max-w-[110px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 text-[#747888]" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-[#262636] bg-[#14141c] p-3 text-xs shadow-2xl z-50"
                  >
                    <div className="border-b border-[#222230] pb-2.5 mb-2.5">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="font-mono text-[11px] text-[#747888] truncate">{user.email}</p>
                    </div>
                    <div className="space-y-1.5 text-[#b0b3c0]">
                      <div className="flex justify-between py-1 items-center">
                        <span>Display Theme</span>
                        <button
                          onClick={toggleTheme}
                          className="flex items-center gap-1 text-xs font-mono font-bold text-[#387ed1] hover:underline"
                        >
                          {theme === "dark" ? <Sun className="h-3 w-3 text-amber-400" /> : <Moon className="h-3 w-3 text-indigo-400" />}
                          <span>{theme === "dark" ? "Light" : "Dark"}</span>
                        </button>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Active Plan</span>
                        <span className="font-mono font-bold text-[#10b981]">{planBadgeText}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Available Funds</span>
                        <span className="font-mono font-bold text-white">
                          ₹{availableFunds.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAboutModal && onOpenAboutModal();
                        }}
                        className="w-full mt-2 py-1.5 bg-[#181824] hover:bg-[#222230] text-white border border-[#282838] font-mono font-bold text-[11px] rounded-lg transition-all"
                      >
                        About Specs &amp; Architecture
                      </button>
                      <a
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full mt-1 py-1.5 bg-[#387ed1]/15 hover:bg-[#387ed1]/25 text-[#387ed1] border border-[#387ed1]/35 font-mono font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Admin Telemetry Panel</span>
                      </a>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full mt-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-mono font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center space-x-1.5 rounded-lg bg-[#387ed1] hover:bg-[#306ec0] text-white px-3 py-1 font-mono text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Drawer Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#9e9ea8] hover:text-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER NAVIGATION MENU ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#222230] bg-[#0e0e14] px-4 py-3 space-y-2 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-lg font-bold ${
                    isActive ? "bg-[#387ed1] text-white" : "bg-[#161620] text-[#a0a3b0]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

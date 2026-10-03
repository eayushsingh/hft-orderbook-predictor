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
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSubscription } from "@/context/SubscriptionContext";

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
  activePlanId?: string;
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
  onOpenBuyModal,
  onOpenSellModal,
  onOpenPricingModal,
  onOpenAboutModal,
}: LalanNavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { activePlanId, isTrialActive, daysRemainingInTrial, getPlanBadgeLabel } = useSubscription();

  const navItems = [
    { id: "terminal", label: "Terminal / L2", icon: Zap },
    { id: "orders", label: "Orders & Trades", icon: BookOpen },
    { id: "positions", label: "Positions & P&L", icon: Briefcase },
    { id: "multibroker", label: "Multi-Broker", icon: Layers },
    { id: "analytics", label: "AI Microstructure", icon: BarChart3 },
    { id: "pricing", label: "Pricing & Plans", icon: Crown },
    { id: "about", label: "About & Specs", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#262630] bg-[#121216] text-[#e0e0e0] font-sans shadow-md transition-colors duration-200">
      {/* ── TOP INDICES & LATENCY BAR ── */}
      <div className="flex h-7 items-center justify-between border-b border-[#1f1f26] bg-[#0c0c0f] px-3 text-[11px] font-mono text-[#8a8d9b]">
        {/* Indices Ticker */}
        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="font-bold text-[#b0b3c0]">NIFTY 50</span>
            <span className="font-semibold text-white">
              {niftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                niftyChange >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {niftyChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5" />
              )}
              {niftyChange >= 0 ? `+${niftyChange.toFixed(2)}%` : `${niftyChange.toFixed(2)}%`}
            </span>
          </div>

          <div className="h-3 w-px bg-[#262630] shrink-0" />

          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="font-bold text-[#b0b3c0]">NIFTY BANK</span>
            <span className="font-semibold text-white">
              {bankNiftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                bankNiftyChange >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {bankNiftyChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5" />
              )}
              {bankNiftyChange >= 0
                ? `+${bankNiftyChange.toFixed(2)}%`
                : `${bankNiftyChange.toFixed(2)}%`}
            </span>
          </div>

          <div className="h-3 w-px bg-[#262630] shrink-0 hidden sm:block" />

          <div className="hidden sm:flex items-center space-x-1.5 shrink-0">
            <span className="font-bold text-[#b0b3c0]">BTC/USDT</span>
            <span className="font-semibold text-white">
              ${btcPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                btcChange >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {btcChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5" />
              )}
              {btcChange >= 0 ? `+${btcChange.toFixed(2)}%` : `${btcChange.toFixed(2)}%`}
            </span>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
            <span className="text-[#10b981] font-bold hidden md:inline">LALAN HFT STREAM</span>
          </div>

          <div className="flex items-center space-x-1 text-[#a0a3b0]">
            <Wifi className="h-3 w-3 text-[#10b981]" />
            <span>{latencyMs.toFixed(1)} ms</span>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <div className="mx-auto flex h-14 max-w-[1700px] items-center justify-between px-3 sm:px-6">
        {/* Brand Logo & LALAN Badge */}
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="LALAN Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black uppercase tracking-[0.15em] text-white">
                  LALAN
                </span>
                <span className="bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase flex items-center gap-1">
                  {isTrialActive && <Clock className="h-2.5 w-2.5 animate-spin" />}
                  {getPlanBadgeLabel()}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#747888] uppercase tracking-wider hidden sm:block">
                Institutional Microstructure Engine
              </span>
            </div>
          </a>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1">
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
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#1f1f28] text-white border-b-2 border-[#387ed1] shadow-inner"
                    : "text-[#9e9ea8] hover:bg-[#1a1a20] hover:text-white"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive || item.id === "pricing" || item.id === "about" ? "text-[#387ed1]" : "text-[#747888]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right User Actions & Quick Orders */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Free Trial / Upgrade Plan Button */}
          <button
            onClick={() => onOpenPricingModal && onOpenPricingModal()}
            className="hidden xl:flex items-center space-x-1 bg-gradient-to-r from-[#10b981]/20 to-[#387ed1]/20 hover:from-[#10b981]/30 hover:to-[#387ed1]/30 border border-[#10b981]/40 text-white text-[11px] font-bold font-mono px-3 py-1.5 rounded transition-all active:scale-95 shadow"
          >
            <Gift className="h-3.5 w-3.5 text-[#10b981]" />
            <span>{isTrialActive ? `Free Trial (${daysRemainingInTrial}d left)` : "14-Day Free Trial"}</span>
          </button>

          {/* Quick Buy/Sell Buttons */}
          <div className="hidden sm:flex items-center space-x-1.5">
            <button
              onClick={() => onOpenBuyModal && onOpenBuyModal("RELIANCE")}
              className="bg-[#387ed1] hover:bg-[#306ec0] text-white text-xs font-bold px-3 py-1.5 rounded transition-all active:scale-95 shadow"
            >
              BUY (B)
            </button>
            <button
              onClick={() => onOpenSellModal && onOpenSellModal("RELIANCE")}
              className="bg-[#ff5722] hover:bg-[#e64a19] text-white text-xs font-bold px-3 py-1.5 rounded transition-all active:scale-95 shadow"
            >
              SELL (S)
            </button>
          </div>

          <div className="h-4 w-px bg-[#262630] hidden sm:block" />

          {/* Account Margin / Funds Display */}
          <div className="flex flex-col text-right leading-tight hidden xs:flex">
            <span className="text-[10px] text-[#747888] uppercase tracking-wider font-mono">
              Margin Available
            </span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[#10b981]">
              ₹{availableFunds.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="h-4 w-px bg-[#262630] hidden xs:block" />

          {/* Dark & Light Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-md bg-[#1c1c24] border border-[#282834] text-[#a0a3b0] hover:text-white hover:border-[#387ed1] transition-all text-xs font-mono font-semibold active:scale-95"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((v) => !v)}
              className="relative p-2 rounded-md text-[#9e9ea8] hover:bg-[#1f1f28] hover:text-white transition-colors"
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
                  className="absolute right-0 mt-2 w-72 rounded-lg border border-[#262630] bg-[#16161c] p-3 text-xs shadow-2xl z-50"
                >
                  <div className="flex items-center justify-between border-b border-[#262630] pb-2 mb-2 font-bold text-white">
                    <span>System Alerts</span>
                    <span className="text-[10px] text-[#10b981] font-mono">Launch Offer Active</span>
                  </div>
                  <div className="space-y-2 text-[#b0b3c0]">
                    <div className="p-2 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[11px]">
                      <span className="font-bold text-[#10b981]">14-Day Free Trial:</span> Activated for new account setup. $0 charge.
                    </div>
                    <div className="p-2 rounded bg-[#387ed1]/10 border border-[#387ed1]/20 text-[11px]">
                      <span className="font-bold text-[#387ed1]">Disruptor Ring-Buffer:</span> Zero GC pause verified.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Badge */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen((v) => !v)}
              className="flex items-center space-x-1.5 rounded-md bg-[#1c1c24] border border-[#282834] px-2.5 py-1.5 hover:border-[#387ed1] transition-all"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#387ed1]/20 text-[#387ed1] font-bold text-xs">
                AY
              </div>
              <span className="font-mono text-xs font-bold text-white hidden sm:inline">
                AY8899
              </span>
              <ChevronDown className="h-3 w-3 text-[#747888]" />
            </button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-lg border border-[#282834] bg-[#16161c] p-3 text-xs shadow-2xl z-50"
                >
                  <div className="border-b border-[#262630] pb-2.5 mb-2.5">
                    <p className="font-bold text-white">Ayush Singh</p>
                    <p className="font-mono text-[11px] text-[#747888]">AY8899 · LALAN Direct API</p>
                  </div>
                  <div className="space-y-1.5 text-[#b0b3c0]">
                    <div className="flex justify-between py-1 items-center">
                      <span>Display Mode</span>
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
                      <span className="font-mono font-bold text-[#10b981]">{getPlanBadgeLabel()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Trial Status</span>
                      <span className="font-mono font-bold text-[#10b981]">
                        {isTrialActive ? `${daysRemainingInTrial} Days Left ($0)` : "Paid Plan"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Available Cash</span>
                      <span className="font-mono font-bold text-white">
                        ₹{availableFunds.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenAboutModal && onOpenAboutModal();
                      }}
                      className="w-full mt-2 py-1.5 bg-[#181822] hover:bg-[#242432] text-white border border-[#282838] font-mono font-bold text-[11px] rounded transition-all"
                    >
                      About Engine &amp; Specs
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenPricingModal && onOpenPricingModal();
                      }}
                      className="w-full mt-1 py-1.5 bg-[#10b981] hover:bg-[#0da673] text-black font-mono font-bold text-[11px] rounded transition-all"
                    >
                      Manage 14-Day Free Trial
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

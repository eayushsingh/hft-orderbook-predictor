"use client";

import React, { useState, useEffect } from "react";
import { Clock, Globe, ChevronDown, Check } from "lucide-react";

export interface CountryTimezone {
  code: string;
  country: string;
  flag: string;
  timezone: string;
  utcOffset: string;
  exchange: string;
  marketOpenHour: number; // 24h format in local market time
  marketOpenMinute: number;
  marketCloseHour: number;
  marketCloseMinute: number;
}

export const COUNTRIES: CountryTimezone[] = [
  {
    code: "IN",
    country: "India",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    utcOffset: "UTC+5:30",
    exchange: "NSE / BSE India",
    marketOpenHour: 9,
    marketOpenMinute: 15,
    marketCloseHour: 15,
    marketCloseMinute: 30,
  },
  {
    code: "US",
    country: "United States",
    flag: "🇺🇸",
    timezone: "America/New_York",
    utcOffset: "UTC-4:00",
    exchange: "NYSE / NASDAQ",
    marketOpenHour: 9,
    marketOpenMinute: 30,
    marketCloseHour: 16,
    marketCloseMinute: 0,
  },
  {
    code: "GB",
    country: "United Kingdom",
    flag: "🇬🇧",
    timezone: "Europe/London",
    utcOffset: "UTC+1:00",
    exchange: "London LSE",
    marketOpenHour: 8,
    marketOpenMinute: 0,
    marketCloseHour: 16,
    marketCloseMinute: 30,
  },
  {
    code: "SG",
    country: "Singapore",
    flag: "🇸🇬",
    timezone: "Asia/Singapore",
    utcOffset: "UTC+8:00",
    exchange: "SGX Singapore",
    marketOpenHour: 9,
    marketOpenMinute: 0,
    marketCloseHour: 17,
    marketCloseMinute: 0,
  },
  {
    code: "JP",
    country: "Japan",
    flag: "🇯🇵",
    timezone: "Asia/Tokyo",
    utcOffset: "UTC+9:00",
    exchange: "Tokyo TSE",
    marketOpenHour: 9,
    marketOpenMinute: 0,
    marketCloseHour: 15,
    marketCloseMinute: 0,
  },
  {
    code: "AE",
    country: "UAE / Dubai",
    flag: "🇦🇪",
    timezone: "Asia/Dubai",
    utcOffset: "UTC+4:00",
    exchange: "DFM / ADX Dubai",
    marketOpenHour: 10,
    marketOpenMinute: 0,
    marketCloseHour: 15,
    marketCloseMinute: 0,
  },
  {
    code: "DE",
    country: "Germany / EU",
    flag: "🇩🇪",
    timezone: "Europe/Berlin",
    utcOffset: "UTC+2:00",
    exchange: "Frankfurt DAX",
    marketOpenHour: 9,
    marketOpenMinute: 0,
    marketCloseHour: 17,
    marketCloseMinute: 30,
  },
];

interface WorldMarketClockProps {
  compact?: boolean;
}

export default function WorldMarketClock({ compact = false }: WorldMarketClockProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryTimezone>(COUNTRIES[0]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
      // Detect stored country or match browser timezone
      const storedCode = typeof window !== "undefined" ? localStorage.getItem("lalan_country_code") : null;
      if (storedCode) {
        const match = COUNTRIES.find((c) => c.code === storedCode);
        if (match) setSelectedCountry(match);
      } else if (typeof Intl !== "undefined") {
        try {
          const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const match = COUNTRIES.find((c) => c.timezone === userTz);
          if (match) {
            setSelectedCountry(match);
            localStorage.setItem("lalan_country_code", match.code);
          }
        } catch (e) {
          console.warn("Timezone resolution fallback to India IST", e);
        }
      }
    });
  }, []);

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        // Format time in selected country timezone
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: selectedCountry.timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        setCurrentTime(timeFormatter.format(now));

        // Compute Market Open / Close status
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: selectedCountry.timezone,
          hour: "numeric",
          minute: "numeric",
          hour12: false,
          weekday: "short",
        }).formatToParts(now);

        let hour = 0;
        let minute = 0;
        let weekday = "";

        parts.forEach((p) => {
          if (p.type === "hour") hour = parseInt(p.value, 10);
          if (p.type === "minute") minute = parseInt(p.value, 10);
          if (p.type === "weekday") weekday = p.value;
        });

        const isWeekend = weekday === "Sat" || weekday === "Sun";
        const totalMinutes = hour * 60 + minute;
        const openMinutes = selectedCountry.marketOpenHour * 60 + selectedCountry.marketOpenMinute;
        const closeMinutes = selectedCountry.marketCloseHour * 60 + selectedCountry.marketCloseMinute;

        const openNow = !isWeekend && totalMinutes >= openMinutes && totalMinutes <= closeMinutes;
        setIsMarketOpen(openNow);
      } catch (err) {
        console.error("Clock update error", err);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [selectedCountry]);

  const handleSelectCountry = (country: CountryTimezone) => {
    setSelectedCountry(country);
    localStorage.setItem("lalan_country_code", country.code);
    setDropdownOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="relative inline-flex items-center font-mono">
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#12121c] border border-slate-300 dark:border-[#242436] hover:border-[#387ed1] transition-all text-xs shadow-sm active:scale-95 ${
          compact ? "text-[10px] py-0.5 px-2" : ""
        }`}
      >
        <span className="text-sm">{selectedCountry.flag}</span>
        <span className="font-black text-slate-950 dark:text-white uppercase">{selectedCountry.code}</span>
        <span className="text-slate-400 dark:text-zinc-500 font-bold">|</span>

        {/* Live Ticking Clock Text */}
        <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-black tracking-wider">
          <Clock className="w-3 h-3 text-[#387ed1] animate-pulse" />
          <span className="font-mono">{currentTime || "00:00:00 AM"}</span>
        </div>

        {/* Market Live Status Pill */}
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
            isMarketOpen
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isMarketOpen ? "bg-emerald-500 animate-ping" : "bg-rose-500"
            }`}
          />
          <span className="hidden xs:inline">{isMarketOpen ? "LIVE" : "CLOSED"}</span>
        </span>

        <ChevronDown className="w-3 h-3 text-slate-500 dark:text-zinc-500" />
      </button>

      {/* Country Selection Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#0e0e16] border border-slate-200 dark:border-[#222234] rounded-2xl shadow-2xl p-2 z-50 text-xs font-mono">
          <div className="px-3 py-2 border-b border-slate-200 dark:border-[#1f1f2e] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
              <Globe className="w-3.5 h-3.5 text-[#387ed1]" />
              <span>Select Your Country / Market</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400">
              Live clock &amp; market trading session will adapt to your country.
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 mt-1">
            {COUNTRIES.map((c) => {
              const isSelected = c.code === selectedCountry.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelectCountry(c)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? "bg-[#387ed1]/20 border border-[#387ed1]/40 text-slate-900 dark:text-white font-bold"
                      : "hover:bg-slate-100 dark:hover:bg-[#161624] text-slate-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{c.country}</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-500">{c.exchange} · {c.utcOffset}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#387ed1]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

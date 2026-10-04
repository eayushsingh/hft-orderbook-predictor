"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Coins, CircleDollarSign, ArrowUpRight } from "lucide-react";

interface MoneyItem {
  id: string;
  x: number; // percentage across screen width
  size: number; // font or icon scale
  duration: number; // float duration in seconds
  delay: number;
  rotation: number;
  type: "symbol" | "badge" | "icon";
  content: string;
  iconType?: number;
  color: string;
}

const MONEY_SYMBOLS = ["💵", "💸", "💰", "🪙", "$", "₹", "€", "₿", "£", "🤑"];

const PROFIT_BADGES = [
  "+$12,450.00",
  "+₹1,50,000",
  "+$4,892.30",
  "+$98,400",
  "+0.85 BTC",
  "+$2,150/sec",
  "ALPHA GAIN +14.2%",
  "+$50,000",
  "+₹85,500",
  "+$312.40",
];

const COLORS = [
  "text-emerald-400 border-emerald-500/30 bg-emerald-950/40 shadow-emerald-500/20",
  "text-green-400 border-green-500/30 bg-green-950/40 shadow-green-500/20",
  "text-cyan-400 border-cyan-500/30 bg-cyan-950/40 shadow-cyan-500/20",
  "text-amber-300 border-amber-500/30 bg-amber-950/40 shadow-amber-500/20",
  "text-teal-300 border-teal-500/30 bg-teal-950/40 shadow-teal-500/20",
];

export default function FloatingMoney() {
  const [items, setItems] = useState<MoneyItem[]>([]);
  const [clickBursts, setClickBursts] = useState<
    { id: string; x: number; y: number; text: string }[]
  >([]);

  useEffect(() => {
    // Generate initial set of floating money items
    const generated: MoneyItem[] = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      const isBadge = i % 4 === 0;
      const isIcon = i % 5 === 0;
      const type = isBadge ? "badge" : isIcon ? "icon" : "symbol";

      let content = "";
      if (type === "badge") {
        content = PROFIT_BADGES[i % PROFIT_BADGES.length];
      } else if (type === "symbol") {
        content = MONEY_SYMBOLS[i % MONEY_SYMBOLS.length];
      } else {
        content = "$";
      }

      generated.push({
        id: `money-${i}-${Math.random()}`,
        x: Math.random() * 92 + 4, // 4% to 96%
        size: Math.random() * 1.2 + 0.8,
        duration: Math.random() * 12 + 10, // 10s to 22s
        delay: Math.random() * 8,
        rotation: (Math.random() - 0.5) * 60,
        type,
        content,
        iconType: i % 3,
        color: COLORS[i % COLORS.length],
      });
    }

    setItems(generated);

    // Global click listener to create money burst on click anywhere on hero
    const handleClick = (e: MouseEvent) => {
      // Don't spawn if user clicked on button or interactive elements directly
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("iframe")) return;

      const randomText = PROFIT_BADGES[Math.floor(Math.random() * PROFIT_BADGES.length)];
      const newBurst = {
        id: `burst-${Date.now()}-${Math.random()}`,
        x: e.clientX,
        y: e.clientY,
        text: randomText,
      };

      setClickBursts((prev) => [...prev.slice(-10), newBurst]);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none">
      {/* Background ambient glowing currency particle canvas */}
      {items.map((item) => {
        return (
          <motion.div
            key={item.id}
            initial={{
              y: "105vh",
              x: `${item.x}vw`,
              opacity: 0,
              rotate: item.rotation - 20,
              scale: item.size * 0.7,
            }}
            animate={{
              y: "-15vh",
              x: [
                `${item.x}vw`,
                `${item.x + (item.rotation > 0 ? 3 : -3)}vw`,
                `${item.x - (item.rotation > 0 ? 2 : -2)}vw`,
                `${item.x}vw`,
              ],
              opacity: [0, 0.85, 0.9, 0],
              rotate: [item.rotation - 20, item.rotation + 20, item.rotation - 10],
              scale: [item.size * 0.7, item.size * 1.05, item.size * 0.8],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear",
              times: [0, 0.2, 0.8, 1],
            }}
            className="absolute top-0 left-0"
          >
            {item.type === "badge" ? (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs sm:text-sm font-mono font-bold backdrop-blur-md shadow-lg ${item.color}`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{item.content}</span>
              </div>
            ) : item.type === "icon" ? (
              <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm text-emerald-400 shadow-lg shadow-emerald-500/10">
                {item.iconType === 0 ? (
                  <CircleDollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : item.iconType === 1 ? (
                  <Coins className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                )}
              </div>
            ) : (
              <div className="text-2xl sm:text-4xl drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform hover:scale-125">
                {item.content}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Interactive Click Bursts */}
      <AnimatePresence>
        {clickBursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{
              x: burst.x - 40,
              y: burst.y - 20,
              opacity: 1,
              scale: 0.5,
            }}
            animate={{
              y: burst.y - 120,
              opacity: 0,
              scale: 1.25,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            onAnimationComplete={() => {
              setClickBursts((prev) => prev.filter((b) => b.id !== burst.id));
            }}
            className="fixed top-0 left-0 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono text-sm font-extrabold shadow-2xl backdrop-blur-md">
              <span>💸</span>
              <span>{burst.text}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

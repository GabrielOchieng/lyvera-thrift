"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

// You can pass a few recently sold items here or hardcode some for the vibe
const RECENT_SALES = [
  { name: "Vintage Leather Blazer", time: "2 mins ago", city: "Nairobi" },
  { name: "90s Oversized Denim", time: "15 mins ago", city: "Mombasa" },
  { name: "Silk Slip Dress", time: "1 hour ago", city: "Kisumu" },
];

export default function RecentSoldToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [sale, setSale] = useState(RECENT_SALES[0]);

  useEffect(() => {
    // Show after 5 seconds
    const showTimer = setTimeout(() => {
      const randomSale =
        RECENT_SALES[Math.floor(Math.random() * RECENT_SALES.length)];
      setSale(randomSale);
      setIsVisible(true);
    }, 5000);

    // Hide after 11 seconds (5s delay + 6s display)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 11000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-left-10 fade-in duration-700">
      <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-xs">
        <div className="bg-maroon-primary/10 p-3 rounded-xl">
          <ShoppingBag className="h-5 w-5 text-maroon-primary" />
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-black text-maroon-primary uppercase tracking-widest">
            Just Purchased
          </p>
          <p className="text-sm font-bold text-zinc-900 line-clamp-1">
            {sale.name}
          </p>
          <p className="text-[10px] text-zinc-400 font-medium">
            {sale.time} in {sale.city}
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-zinc-300 hover:text-zinc-900 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

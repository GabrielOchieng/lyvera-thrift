"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => window.location.reload();
    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setIsRetrying(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F3F4F6] px-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center w-full max-w-sm">
        <div className="bg-red-50 p-4 rounded-full mb-6">
          <WifiOff className="w-12 h-12 text-maroon-primary" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Connection Lost
        </h1>

        <p className="text-gray-500 mb-8 max-w-70">
          It looks like you&apos;re in a low-signal area. Check your data or
          Wi-Fi settings to keep shopping.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex cursor-pointer items-center justify-center gap-2 w-full bg-maroon-primary text-white px-8 py-3 rounded-xl font-semibold uppercase tracking-wider text-sm transition-all active:scale-95 disabled:opacity-70"
          >
            {isRetrying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              "Try Again"
            )}
          </button>

          {/* New Back to Home Link */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-semibold uppercase tracking-wider text-sm transition-all hover:bg-gray-50 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400 italic">
          We&apos;ll automatically reconnect you once you&apos;re back online.
        </p>
      </div>
    </div>
  );
}

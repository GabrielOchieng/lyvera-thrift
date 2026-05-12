"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

export default function PWAUpdater() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const serwist = (window as any).serwist;

      if (serwist) {
        // This fires when a new service worker has installed but is waiting
        // OR if skipWaiting: true is on, it fires when the new one takes over.
        serwist.addEventListener("installed", (event: any) => {
          if (event.isUpdate) {
            setShow(true);
          }
        });
      }
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md">
      <div className="bg-white border border-gray-100 shadow-2xl p-4 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col text-left">
          <p className="font-bold text-gray-900 text-sm">Update Available</p>
          <p className="text-gray-500 text-xs">
            New features are ready for Lyvera Store.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-maroon-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
        >
          <RefreshCcw className="w-3 h-3" />
          Update
        </button>
      </div>
    </div>
  );
}

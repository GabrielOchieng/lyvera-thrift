"use client";

import { useState, useEffect } from "react";

import { X } from "lucide-react";
import { registerPush } from "@/lib/pwa/notifications";

export default function PushBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if permission is still 'default'
    if ("Notification" in window && Notification.permission === "default") {
      const dismissed = localStorage.getItem("push_banner_dismissed");
      if (!dismissed) {
        setTimeout(() => setIsVisible(true), 2500);
      }
    }
  }, []);

  const handleOk = async () => {
    setIsVisible(false);
    try {
      await registerPush();
    } catch (err) {
      console.error("User dismissed the browser prompt", err);
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    // Optional: Hide for 24 hours if they click cancel
    localStorage.setItem("push_banner_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Dimmed Backdrop to draw focus like in your image */}
      <div className="fixed inset-0 bg-black/40 z-60 backdrop-blur-sm animate-in fade-in" />

      {/* Big Top Banner */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in slide-in-from-top-10 duration-500">
        <div className="p-8 text-center">
          {/* Close button in top right */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-maroon-primary mb-3">
            "Lyvera Store" Would like to send you notifications
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Notifications may include new bale alerts, flash sales, and order
            delivery updates. These can be configured in your browser settings
            at any time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCancel}
              className="px-10 py-3 border-2 border-maroon-primary text-maroon-primary rounded-full font-semibold hover:bg-maroon-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleOk}
              className="px-10 py-3 bg-maroon-primary text-white rounded-full font-semibold hover:bg-maroon-dark shadow-lg shadow-maroon-primary/30 order-1 sm:order-2"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

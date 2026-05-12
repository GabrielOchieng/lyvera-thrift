"use client";

import { useState, useEffect } from "react";

import { Bell, X } from "lucide-react";
import { registerPush } from "@/lib/pwa/notifications";

export default function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we should show the banner
    const checkStatus = async () => {
      if (!("Notification" in window)) return;

      // Only show if they haven't made a choice yet
      if (Notification.permission === "default") {
        const dismissed = localStorage.getItem("push_banner_dismissed");
        if (!dismissed) {
          // Delay showing it for 2 seconds
          setTimeout(() => setIsVisible(true), 2000);
        }
      }
    };

    checkStatus();
  }, []);

  const handleEnable = async () => {
    try {
      await registerPush();
      setIsVisible(false); // Hide after successful (or attempted) registration
    } catch (err) {
      console.error("Subscription failed", err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show it again for 7 days if they close it
    localStorage.setItem("push_banner_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white border-2 border-maroon-primary rounded-xl shadow-2xl p-4 flex items-start gap-4">
        <div className="bg-maroon-primary/10 p-2 rounded-full text-maroon-primary">
          <Bell size={24} />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm">
            Don't miss the next drop!
          </h3>
          <p className="text-gray-600 text-xs mt-1">
            Get alerts for new thrift bales and order updates.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleEnable}
              className="bg-maroon-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-maroon-dark transition-colors"
            >
              Enable Notifications
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 px-2 py-1.5 text-xs"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

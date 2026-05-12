"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Or your preferred toast library

export default function NotifyDropButton() {
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    if (!confirm("Send 'New Bale Drop' notification to all subscribers?"))
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/notify-drop", {
        method: "POST",
        body: JSON.stringify({
          title: "New Drop at Lyvera Store! 👗",
          body: "Our latest camera-grade bale is now live. Tap to shop the new arrivals!",
        }),
      });

      if (res.ok) {
        toast.success("Notifications sent successfully!");
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      toast.error("Could not send notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleNotify}
      disabled={loading}
      className="flex items-center gap-2 bg-maroon-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-maroon-dark transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bell className="h-4 w-4" />
      )}
      Notify New Drop
    </button>
  );
}

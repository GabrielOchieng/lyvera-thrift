"use client";

import { useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

export default function PushTestPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Import your registration logic
      const { registerPush } = await import("../../lib/pwa/notifications");
      await registerPush();

      alert("Success! Check Prisma Studio to see your record.");
    } catch (err) {
      console.error(err);
      alert("Failed to subscribe. Check console for errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Notification Settings</h2>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="flex items-center gap-2 bg-maroon-primary text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Bell size={18} />}
        {loading ? "Registering..." : "Enable Push Notifications"}
      </button>
    </div>
  );
}

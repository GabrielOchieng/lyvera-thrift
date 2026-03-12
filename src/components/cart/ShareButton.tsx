"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-zinc-400 hover:text-maroon-primary transition-colors group"
    >
      <div className="p-2 rounded-full bg-zinc-50 group-hover:bg-maroon-primary/10 transition-colors">
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">
        {copied ? "Link Copied!" : "Share this piece"}
      </span>
    </button>
  );
}

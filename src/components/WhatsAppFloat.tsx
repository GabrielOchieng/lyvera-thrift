"use client";

import { MessageCircle } from "lucide-react"; // Using Lucide icon to match your style

export default function WhatsAppFloat() {
  const whatsappNumber = "254745046468";

  const handleClick = () => {
    const message = "Hi Lyvera! I have a question about your thrift pieces.";
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed cursor-pointer bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></span>

      <MessageCircle className="w-8 h-8 relative z-10" />

      {/* Tooltip */}
      <span className="absolute right-16 bg-white text-zinc-900 text-xs font-bold px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-100 pointer-events-none">
        Questions? Chat with us! 🛍️
      </span>
    </button>
  );
}

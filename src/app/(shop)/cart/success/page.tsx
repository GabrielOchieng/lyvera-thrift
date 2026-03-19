"use client";

import Link from "next/link";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function OrderSuccessPage() {
  useEffect(() => {
    // Trigger celebration!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#800000", "#D4AF37", "#000000"],
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl border border-zinc-100 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping" />
        </div>

        <div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-2">
            Order Received!
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Your payment is being verified. We'll contact you shortly to
            coordinate delivery of your unique thrift finds.
          </p>
        </div>

        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 text-left">
          <div className="flex items-center gap-3 text-maroon-primary mb-2">
            <Package className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              What's Next?
            </span>
          </div>
          <p className="text-xs text-zinc-600 italic">
            "Keep your M-Pesa message handy. Our team usually verifies and
            dispatches within 1-2 hours."
          </p>
        </div>

        <div className="grid gap-3">
          <Link
            href="/orders"
            className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            Track My Order <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="text-maroon-primary font-bold text-sm hover:underline flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

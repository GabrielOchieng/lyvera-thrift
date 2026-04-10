// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import {
//   CheckCircle2,
//   Loader2,
//   Package,
//   ShoppingBag,
//   XCircle,
// } from "lucide-react";
// import { getOrderStatus, releaseOrderItems } from "@/actions/order";
// import { useCart } from "../../../../../store/useCart";

// export default function SuccessPage() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId");
//   const { clearCart } = useCart();

//   const [status, setStatus] = useState<string>("PENDING");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!orderId) return;

//     // Function to check status and handle cart clearing
//     const checkStatus = async () => {
//       try {
//         const currentStatus = await getOrderStatus(orderId);
//         setStatus(currentStatus);

//         if (currentStatus === "VERIFIED") {
//           // ✅ Success: Clear the cart now that payment is confirmed
//           clearCart();
//           setLoading(false);
//           return true; // Stop the interval
//         }

//         if (currentStatus === "CANCELLED") {
//           // ❌ Failed: Stop loading but DON'T clear cart (allows user to retry)
//           await releaseOrderItems(orderId);
//           setStatus("CANCELLED");
//           setLoading(false);
//           return true;
//         }
//       } catch (error) {
//         console.error("Error polling order status:", error);
//       }
//       return false;
//     };

//     // Initial check
//     checkStatus();

//     // Poll every 3 seconds
//     const interval = setInterval(async () => {
//       const isDone = await checkStatus();
//       if (isDone) clearInterval(interval);
//     }, 3000);

//     // Timeout after 60 seconds (prevents infinite polling)
//     const timeout = setTimeout(() => {
//       clearInterval(interval);
//       setLoading(false);
//     }, 60000);

//     return () => {
//       clearInterval(interval);
//       clearTimeout(timeout);
//     };
//   }, [orderId, clearCart]);

//   // --- VIEW 1: WAITING FOR CALLBACK (STK Push sent, waiting for PIN/Processor) ---
//   if (loading && status === "PENDING") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in duration-500">
//         <div className="relative mb-6">
//           <div className="absolute inset-0 rounded-full bg-maroon-primary/10 animate-ping" />
//           <div className="bg-white p-6 rounded-full relative border border-maroon-primary/20">
//             <Loader2 className="w-16 h-16 text-maroon-primary animate-spin" />
//           </div>
//         </div>
//         <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
//           Verifying Payment...
//         </h1>
//         <p className="text-gray-500 max-w-sm">
//           Please keep this page open. We are waiting for M-Pesa to confirm your
//           transaction.
//         </p>
//       </div>
//     );
//   }

//   // --- VIEW 2: PAYMENT FAILED / CANCELLED ---
//   if (status === "CANCELLED") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in slide-in-from-bottom-4 duration-500">
//         <XCircle className="w-20 h-20 text-red-500 mb-6" />
//         <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
//           Payment Failed
//         </h1>
//         <p className="text-gray-600 mb-8 max-w-sm">
//           The transaction was cancelled or timed out. Don't worry, your items
//           are still in your bag.
//         </p>
//         <Link
//           href="/cart"
//           className="bg-maroon-primary text-white px-10 py-4 rounded-2xl font-black uppercase italic tracking-tighter shadow-lg hover:bg-zinc-900 transition-all"
//         >
//           Return to Cart & Retry
//         </Link>
//       </div>
//     );
//   }

//   // --- VIEW 3: SUCCESS (VERIFIED) ---
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 text-center animate-in zoom-in duration-300">
//       <div className="bg-green-50 p-6 rounded-full mb-6 border border-green-100">
//         <CheckCircle2 className="w-16 h-16 text-green-500" />
//       </div>

//       <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
//         Order Received!
//       </h1>
//       <p className="text-gray-600 mb-10 max-w-md font-medium">
//         Your payment is verified. We'll contact you shortly to coordinate
//         delivery of your unique thrift finds.
//       </p>

//       <div className="w-full max-w-md border rounded-[2.5rem] p-8 bg-white shadow-sm mb-10 text-left border-zinc-100">
//         <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400 mb-6">
//           What's Next?
//         </h3>
//         <ul className="space-y-8">
//           <li className="flex gap-5">
//             <div className="bg-zinc-50 p-3 rounded-2xl h-fit border border-zinc-100">
//               <Package className="w-6 h-6 text-maroon-primary" />
//             </div>
//             <div>
//               <p className="font-black text-sm text-zinc-800 uppercase tracking-tight">
//                 Order Processing
//               </p>
//               <p className="text-xs text-zinc-500 leading-relaxed mt-1">
//                 Our team usually verifies and dispatches within 1-2 hours.
//               </p>
//             </div>
//           </li>
//           <li className="flex gap-5">
//             <div className="bg-zinc-50 p-3 rounded-2xl h-fit border border-zinc-100">
//               <ShoppingBag className="w-6 h-6 text-maroon-primary" />
//             </div>
//             <div>
//               <p className="font-black text-sm text-zinc-800 uppercase tracking-tight">
//                 Rider Dispatch
//               </p>
//               <p className="text-xs text-zinc-500 leading-relaxed mt-1">
//                 Keep your M-Pesa message handy. You'll get a call when the rider
//                 is near.
//               </p>
//             </div>
//           </li>
//         </ul>
//       </div>

//       <div className="flex flex-col gap-4 w-full max-w-xs">
//         <Link
//           href="/shop"
//           className="bg-maroon-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-tighter shadow-xl shadow-maroon-primary/20 hover:scale-[1.02] transition-transform"
//         >
//           Continue Shopping
//         </Link>
//         <Link
//           href="/"
//           className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-maroon-primary transition-colors"
//         >
//           Back to Home
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  CheckCircle2,
  Package,
  ShoppingBag,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../../../../../store/useCart";

export default function ManualSuccessPage() {
  const { clearCart } = useCart();

  // Clear the cart immediately on mount since they've "Confirm Payment"
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-32 px-4 text-center animate-in zoom-in duration-500">
      {/* Animated Success Badge */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20" />
        <div className="bg-green-50 p-6 rounded-full relative border border-green-100">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
      </div>

      <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-2 italic">
        Order Received!
      </h1>
      <p className="text-zinc-500 mb-12 max-w-md font-medium">
        Your order has been logged in our system. We are now awaiting manual
        confirmation of your M-Pesa payment.
      </p>

      {/* Manual Timeline Card */}
      <div className="w-full max-w-md border-2 border-zinc-100 rounded-[3rem] p-10 bg-white shadow-2xl shadow-zinc-200/50 text-left relative overflow-hidden">
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0 bg-thrift-gold px-6 py-2 rounded-bl-3xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-maroon-primary">
            Archive Secured
          </span>
        </div>

        <h3 className="font-black text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-8">
          Next Steps for You
        </h3>

        <div className="space-y-10">
          <div className="flex gap-6">
            <div className="bg-maroon-primary/5 p-4 rounded-2xl h-fit border border-maroon-primary/10">
              <MessageSquare className="w-6 h-6 text-maroon-primary" />
            </div>
            <div>
              <p className="font-black text-sm text-zinc-800 uppercase tracking-tight">
                Payment Verification
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                Our team will match your M-Pesa message with your order details.
                This usually takes{" "}
                <span className="text-zinc-900 font-bold">15–30 minutes</span>{" "}
                during business hours.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="bg-maroon-primary/5 p-4 rounded-2xl h-fit border border-maroon-primary/10">
              <Package className="w-6 h-6 text-maroon-primary" />
            </div>
            <div>
              <p className="font-black text-sm text-zinc-800 uppercase tracking-tight">
                Preparation & Dispatch
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                Once verified, your unique pieces are packaged and handed to our
                rider. You will receive a call for coordination.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col gap-4 w-full max-w-xs mt-12">
        <Link
          href="/shop"
          className="bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase italic tracking-tighter shadow-xl hover:bg-maroon-primary transition-all group flex items-center justify-center gap-3"
        >
          Explore More Archives
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/"
          className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-maroon-primary transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* Support Note */}
      <p className="mt-12 text-[10px] text-zinc-400 font-mono uppercase tracking-tight">
        Need help? WhatsApp us at +254 [745 046 468]
      </p>
    </div>
  );
}

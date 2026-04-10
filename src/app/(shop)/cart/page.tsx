"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Loader2,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

import { createOrder } from "@/actions/order";
import { useCart } from "../../../../store/useCart";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soldOutIds, setSoldOutIds] = useState<string[]>([]);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    setMounted(true);
    if (cart.length === 0) return;

    const checkAvailability = async () => {
      try {
        const res = await fetch("/api/products/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: cart.map((item) => item.id) }),
        });
        const data = await res.json();
        setSoldOutIds(data.soldOutIds || []);
      } catch (err) {
        console.error("Availability check failed", err);
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 5000);
    return () => clearInterval(interval);
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const hasSoldOutItems = soldOutIds.length > 0;

  const handleNextStep = () => {
    if (!formData.name || !formData.phone || !formData.location) {
      alert("Please fill in all delivery details");
      return;
    }
    // Basic phone validation for 254 format
    if (formData.phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    setStep(2);
  };

  // const handleSubmitOrder = async () => {
  //   setIsSubmitting(true);

  //   try {
  //     // 1. Create the Pending Order in Database
  //     const result = await createOrder({
  //       name: formData.name,
  //       phone: formData.phone,
  //       location: formData.location,
  //       transCode: `PENDING_${crypto.randomUUID().substring(0, 8)}`, // Placeholder until callback
  //       items: cart,
  //       total: total,
  //     });

  //     if (result.success) {
  //       // 2. Trigger M-Pesa STK Push
  //       const mpesaRes = await fetch("/api/checkout/mpesa", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           phone: formData.phone,
  //           amount: total,
  //           orderId: result.orderId,
  //         }),
  //       });

  //       const mpesaData = await mpesaRes.json();

  //       console.log("mpdata", mpesaData);

  //       if (mpesaData.success) {
  //         clearCart();
  //         // 3. Redirect to success page with the Checkout ID for polling
  //         router.push(
  //           `/cart/success?checkoutId=${mpesaData.checkoutRequestID}&orderId=${result.orderId}`,
  //         );
  //       } else {
  //         alert(mpesaData.error || "STK Push failed. Please try again.");
  //       }
  //     } else {
  //       alert(result.error);
  //       setIsModalOpen(false);
  //     }
  //   } catch (error) {
  //     alert("An unexpected error occurred. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    try {
      // 1. Create the Pending Order
      const result = await createOrder({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        transCode: `PENDING_${crypto.randomUUID().substring(0, 8)}`,
        items: cart,
        total: total,
      });

      if (result.success) {
        // 2. Trigger M-Pesa STK Push
        const mpesaRes = await fetch("/api/checkout/mpesa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.phone,
            amount: total,
            orderId: result.orderId,
          }),
        });

        const mpesaData = await mpesaRes.json();

        if (mpesaData.success) {
          // ✅ REMOVED clearCart() from here
          // We only clear it once we ARE CERTAIN they paid on the next page
          router.push(
            `/cart/success?checkoutId=${mpesaData.checkoutRequestID}&orderId=${result.orderId}`,
          );
        } else {
          alert(mpesaData.error || "STK Push failed. Please try again.");
        }
      } else {
        alert(result.error);
        setIsModalOpen(false);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-600" />
          </Link>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-maroon-primary">
            Your Bag ({cart.length})
          </h1>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {hasSoldOutItems && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 mb-6">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-tight">
                    Items in your cart were just sold. Remove them to proceed.
                  </p>
                </div>
              )}

              {cart.map((item) => {
                const isSold = soldOutIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-white p-4 rounded-4xl border flex items-center gap-6 shadow-sm relative overflow-hidden ${isSold ? "border-red-200 opacity-60" : "border-zinc-200"}`}
                  >
                    {isSold && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest animate-pulse">
                        Sold Out
                      </div>
                    )}
                    <img
                      src={item.image}
                      className={`h-28 w-24 rounded-2xl object-cover shrink-0 ${isSold ? "grayscale" : ""}`}
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold uppercase tracking-tighter text-lg leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        Size {item.size}
                      </p>
                      <p className="text-maroon-primary font-black mt-2 italic">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-4 text-zinc-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-xl sticky top-24">
                <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 text-zinc-400">
                  Summary
                </h2>
                <div className="flex justify-between text-2xl font-black italic uppercase mb-8">
                  <span>Total</span>
                  <span className="text-maroon-primary">
                    KES {total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={hasSoldOutItems}
                  className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-tighter transition-all shadow-lg active:scale-95 ${hasSoldOutItems ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-maroon-primary text-white hover:bg-thrift-gold hover:text-maroon-primary"}`}
                >
                  {hasSoldOutItems ? "Remove Sold Items" : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[3rem] py-32 text-center">
            <ShoppingBag className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold uppercase tracking-tighter text-zinc-400">
              Empty Bag
            </h2>
            <Link
              href="/"
              className="text-maroon-primary font-bold underline mt-4 block uppercase tracking-widest text-sm"
            >
              Back to Shop
            </Link>
          </div>
        )}
      </div>

      <Footer />

      {/* --- M-PESA STK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-maroon-primary p-8 text-white text-center">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                {step === 1 ? "Delivery Details" : "Confirm Payment"}
              </h2>
              <div className="flex justify-center gap-2 mt-2">
                <div
                  className={`h-1 w-8 rounded-full ${step === 1 ? "bg-thrift-gold" : "bg-white/30"}`}
                />
                <div
                  className={`h-1 w-8 rounded-full ${step === 2 ? "bg-thrift-gold" : "bg-white/30"}`}
                />
              </div>
            </div>

            <div className="p-8 space-y-4">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-5 w-5 text-zinc-300" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-maroon-primary outline-none rounded-2xl p-4 pl-12 font-medium transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 h-5 w-5 text-zinc-300" />
                    <input
                      type="tel"
                      placeholder="0712345678"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-maroon-primary outline-none rounded-2xl p-4 pl-12 font-medium transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-zinc-300" />
                    <input
                      type="text"
                      placeholder="Delivery Location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-maroon-primary outline-none rounded-2xl p-4 pl-12 font-medium transition-all"
                    />
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="w-full bg-maroon-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-tighter text-lg shadow-lg mt-4 hover:bg-thrift-gold hover:text-maroon-primary transition-all"
                  >
                    Next: Payment
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
                      <Smartphone className="h-10 w-10 text-green-600" />
                    </div>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      We will send an M-Pesa prompt to:
                    </p>
                    <p className="text-xl font-black text-zinc-900">
                      {formData.phone}
                    </p>
                  </div>

                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Amount to Pay
                    </p>
                    <p className="text-2xl font-black text-maroon-primary">
                      KES {total.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="w-full bg-maroon-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-tighter text-lg shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending Prompt...
                        </>
                      ) : (
                        "Request M-Pesa PIN"
                      )}
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      className="w-full py-2 font-bold text-zinc-400 uppercase text-[10px] tracking-widest"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="w-full text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-600 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

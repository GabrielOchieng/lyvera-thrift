"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

import { createOrder } from "@/actions/order";
import { useCart } from "../../../../store/useCart";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    transCode: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleNextStep = () => {
    if (!formData.name || !formData.phone || !formData.location) {
      alert("Please fill in all delivery details");
      return;
    }
    setStep(2);
  };

  const handleSubmitOrder = async () => {
    if (formData.transCode.length < 8) {
      alert("Please enter a valid M-Pesa code");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOrder({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        transCode: formData.transCode,
        items: cart,
        total: total,
      });

      if (result.success) {
        alert(
          `Success! Order Received. We will verify code ${formData.transCode} and call you.`,
        );
        setIsModalOpen(false);
        clearCart();
        setStep(1);
        setFormData({ name: "", phone: "", location: "", transCode: "" });
      } else {
        alert(result.error);
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
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-4xl border border-zinc-200 flex items-center gap-6 shadow-sm"
                >
                  <img
                    src={item.image}
                    className="h-28 w-24 rounded-2xl object-cover shrink-0"
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
              ))}
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
                  className="w-full bg-maroon-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-thrift-gold hover:text-maroon-primary transition-all shadow-lg active:scale-95"
                >
                  Checkout
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

      {/* MULTI-STEP CHECKOUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-maroon-primary p-8 text-white text-center">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                {step === 1 ? "Delivery Details" : "Payment"}
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
                      type="text"
                      placeholder="Phone Number (for M-Pesa)"
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
                      placeholder="Delivery Location (e.g. CBD, Rongai)"
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
                <div className="space-y-6">
                  <div className="bg-zinc-900 text-white p-6 rounded-3xl text-center border-b-4 border-thrift-gold">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                      Pay KES {total.toLocaleString()} To Pochi:
                    </p>
                    <p className="text-2xl font-mono font-black tracking-widest text-thrift-gold">
                      0745046468
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
                      M-Pesa Transaction Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SDR3Y..."
                      value={formData.transCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transCode: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full border-2 border-zinc-100 rounded-2xl p-4 text-center font-mono font-bold tracking-[0.3em] text-lg focus:border-maroon-primary outline-none transition-all placeholder:tracking-normal placeholder:font-sans"
                    />
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
                          Processing...
                        </>
                      ) : (
                        "Confirm & Place Order"
                      )}
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      className="w-full py-2 font-bold text-zinc-400 uppercase text-[10px] tracking-widest"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="w-full text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-600 transition-colors mt-2"
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

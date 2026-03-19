"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrders } from "@/actions/order";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  PackageCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We reuse getOrders but filter for this specific ID
    getOrders().then((all) => {
      const found = all.find((o: any) => o.id === id);
      setOrder(found);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-maroon-primary" />
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-500 font-serif">Order not found.</p>
        <Link
          href="/orders"
          className="text-maroon-primary font-bold hover:underline"
        >
          ← Back to Orders
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/orders"
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition mb-8 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </Link>

        <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-900 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">
                  Confirmed Purchase
                </p>
                <h1 className="text-3xl font-serif font-bold">
                  Order #{order.id.slice(-6).toUpperCase()}
                </h1>
              </div>
              <div className="text-right">
                <span className="bg-thrift-gold text-maroon-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {order.status}
                </span>
                <p className="text-xs mt-2 text-zinc-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Customer & Shipping Grid */}
            <div className="grid md:grid-cols-2 gap-8 border-b border-zinc-100 pb-10">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <User className="h-3 w-3" /> Customer Details
                </h3>
                <div className="text-sm space-y-1 text-zinc-700">
                  <p className="font-bold text-zinc-900">
                    {order.customerName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-zinc-400" />{" "}
                    {order.customerPhone}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Delivery Address
                </h3>
                <p className="text-sm text-zinc-700 leading-relaxed italic">
                  "{order.deliveryAddress}"
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <PackageCheck className="h-3 w-3" /> Items Purchased
              </h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-12 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                          Size: {item.size || "N/A"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 font-mono">
                      KES {item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-zinc-50 rounded-sm p-6 space-y-3">
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3" /> M-Pesa Transaction Code
                </span>
                <span className="font-mono text-zinc-900 font-bold">
                  {order.mpesaCode}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                  Grand Total
                </span>
                <span className="text-xl font-bold text-maroon-primary">
                  KES {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

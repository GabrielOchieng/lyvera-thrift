"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/lib/auth-client";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/actions/order";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-24 w-24 animate-spin text-maroon-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50   ">
      <div className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-zinc-900">
              {session?.user.role === "admin"
                ? "Global Order Management"
                : "My Orders"}
            </h1>
            <p className="text-sm text-zinc-500">
              {orders.length} total orders found
            </p>
          </div>
          <ShoppingBag className="h-8 w-8 text-maroon-primary/20" />
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-300 rounded-sm p-12 text-center">
            <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No orders placed yet.</p>
            <Link
              href="/shop"
              className="text-maroon-primary text-sm font-bold mt-4 inline-block hover:underline"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 rounded-sm overflow-hidden hover:shadow-md transition shadow-sm"
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Order ID
                      </p>
                      <p className="text-sm font-mono font-medium text-zinc-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          Date
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          Total
                        </p>
                        <p className="text-sm font-bold text-maroon-primary">
                          KES {order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Dynamic Status Badge */}
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                        ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-thrift-gold/20 text-maroon-primary"
                        }`}
                      >
                        {order.status === "DELIVERED" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : order.status === "SHIPPED" ? (
                          <Truck className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {order.status}
                      </span>

                      {session?.user.role === "admin" && (
                        <span className="text-[10px] font-medium text-zinc-400 italic">
                          Customer: {order.user?.email}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-1 text-xs font-bold text-maroon-primary hover:gap-2 transition-all uppercase tracking-widest"
                    >
                      View Details <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

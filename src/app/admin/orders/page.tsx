import {
  ShoppingBag,
  ExternalLink,
  User,
  Phone,
  MapPin,
  Tag,
} from "lucide-react";
import prisma from "../../../../lib/prisma";
import { Order } from "@prisma/client";

export default async function OrdersPage() {
  let orders: Order[] = [];

  try {
    // Check if prisma and prisma.order are defined before fetching
    if (prisma && prisma.order) {
      orders = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: true,
        },
      });
    }
  } catch (error) {
    console.error("Prisma Fetch Error:", error);
    // Fallback to empty array so the UI doesn't crash
    orders = [];
  }

  return (
    <div className="space-y-8 p-6">
      <header className="flex justify-between items-end border-b border-maroon-primary/10 pb-6">
        <div>
          <h1 className="text-3xl mb-2 font-serif font-bold text-maroon-primary">
            Live Orders
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">
            {orders?.length || 0} Purchases Total
          </p>
        </div>
      </header>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-zinc-100">
            <ShoppingBag className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium italic">
              No orders found yet.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-maroon-primary/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:bg-maroon-primary group-hover:text-white transition-colors shrink-0">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-zinc-900 uppercase tracking-tighter">
                      #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <span className="text-[10px] text-zinc-400 font-mono italic">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <User className="h-3 w-3 text-maroon-primary" />{" "}
                      {order.customerName}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-2">
                      <Phone className="h-3 w-3" /> {order.customerPhone}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> {order.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 lg:gap-12">
                <div className="bg-zinc-50 px-4 py-3 rounded-2xl border border-zinc-100">
                  <p className="text-[10px] font-black text-maroon-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> M-Pesa Code
                  </p>
                  <p className="font-mono font-black text-zinc-900 tracking-widest">
                    {order.mpesaCode}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                    Amount Paid
                  </p>
                  <p className="text-xl font-black text-maroon-primary italic">
                    KES {order.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div className="min-w-28">
                  <span
                    className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest block text-center ${
                      order.status === "VERIFIED"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <button className="p-3 bg-zinc-50 hover:bg-maroon-primary hover:text-white rounded-2xl text-zinc-400 transition-all">
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

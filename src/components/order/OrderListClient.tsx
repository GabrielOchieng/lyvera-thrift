"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBag,
  ExternalLink,
  User,
  Tag,
  X,
  Printer,
  Trash2,
  RotateCcw,
  AlertCircle,
  Search,
  FilterX,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import {
  updateOrderStatus,
  deleteOrder,
  restockOrderItems,
} from "@/actions/order";

export default function OrderListClient({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "danger" | "primary";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "primary",
  });

  // Filter logic: Search by Name, Phone, M-Pesa Code, or ID
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerPhone.includes(searchLower) ||
        (order.mpesaCode &&
          order.mpesaCode.toLowerCase().includes(searchLower)) ||
        order.id.toLowerCase().includes(searchLower)
      );
    });
  }, [initialOrders, searchQuery]);

  const handlePrint = () => window.print();

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "danger" | "primary" = "primary",
  ) => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm, variant });
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* --- HEADER & SEARCH SECTION --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-maroon-primary/10 pb-6 gap-6 no-print">
        <div>
          <h1 className="text-3xl mb-1 font-serif font-bold text-maroon-primary">
            Live Orders
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
            {filteredOrders.length} Purchases Found
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search name, phone, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-maroon-primary/5 focus:border-maroon-primary outline-none transition-all text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-maroon-primary transition-colors"
            >
              <FilterX className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* --- ORDER LIST GRID --- */}
      <div className="grid gap-4 mt-8">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-maroon-primary/30 transition-all group cursor-pointer animate-in fade-in slide-in-from-top-2 duration-300"
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
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                    <User className="h-3 w-3 text-maroon-primary" />{" "}
                    {order.customerName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 lg:gap-12">
                <div className="text-left md:text-right">
                  <p className="text-xl font-black text-maroon-primary italic">
                    KES {order.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                    order.status === "VERIFIED"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.status}
                </div>
                <button className="p-3 bg-zinc-50 group-hover:bg-maroon-primary group-hover:text-white rounded-2xl text-zinc-400 transition-all">
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
            <ShoppingBag className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium italic">
              No orders found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* --- MAIN ORDER MODAL --- */}

      {/* --- MAIN ORDER MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
          <div
            id="printable-receipt"
            // Added 'max-h-[90vh]' and 'flex flex-col' to handle long content
            className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]"
          >
            {/* HEADER: Pinned at the top */}
            <div className="bg-maroon-primary p-6 md:p-8 text-white flex justify-between items-start shrink-0">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1 font-bold">
                  Lyvera Store Receipt
                </p>
                <h2 className="text-3xl font-serif font-bold">
                  #{selectedOrder.id.slice(-6).toUpperCase()}
                </h2>
              </div>
              <div className="flex gap-2 no-print">
                <button
                  onClick={() =>
                    triggerConfirm(
                      "Delete Order",
                      "Permanently remove this order? This cannot be undone.",
                      async () => {
                        const res = await deleteOrder(selectedOrder.id);
                        if (res.success) setSelectedOrder(null);
                      },
                      "danger",
                    )
                  }
                  className="p-2 bg-white/10 hover:bg-red-500 rounded-full transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center gap-2 px-4"
                >
                  <Printer className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase hidden md:inline">
                    Print
                  </span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE BODY: Added 'overflow-y-auto' */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Delivery & Payment Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Delivery To
                    </h4>
                    <p className="font-bold text-zinc-900 leading-none">
                      {selectedOrder.customerName}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      {selectedOrder.customerPhone}
                    </p>
                    <p className="text-sm text-zinc-500 italic mt-1">
                      {selectedOrder.deliveryAddress}
                    </p>
                  </div>

                  {selectedOrder.mpesaCode && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                      <h4 className="text-[9px] font-black uppercase text-green-600 tracking-widest mb-1 flex items-center gap-2">
                        <CreditCard className="h-3 w-3" /> M-Pesa Transaction
                      </h4>
                      <p className="text-sm font-mono font-black text-green-800">
                        {selectedOrder.mpesaCode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Update Section */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">
                    Order Status
                  </h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      triggerConfirm(
                        "Change Status",
                        `Update order status to ${newStatus}?`,
                        async () => {
                          const res = await updateOrderStatus(
                            selectedOrder.id,
                            newStatus,
                          );
                          if (res.success)
                            setSelectedOrder({
                              ...selectedOrder,
                              status: newStatus,
                            });
                        },
                      );
                    }}
                    className="w-full text-[11px] font-black p-3 rounded-xl uppercase tracking-widest border border-zinc-100 bg-zinc-50 cursor-pointer focus:ring-2 focus:ring-maroon-primary outline-none"
                  >
                    <option value="PENDING">Pending Approval</option>
                    <option value="VERIFIED">Verified & Paid</option>
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="CANCELLED">Cancelled (Restock)</option>
                  </select>

                  {selectedOrder.status === "CANCELLED" && (
                    <button
                      onClick={() =>
                        triggerConfirm(
                          "Restock Items",
                          "Return these items to the shop inventory?",
                          async () => await restockOrderItems(selectedOrder.id),
                        )
                      }
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-maroon-primary transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" /> Restock Items
                    </button>
                  )}
                </div>
              </div>

              {/* Purchased Items */}
              <div className="pt-6 border-t border-zinc-100">
                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">
                  Purchased Items
                </h4>
                <div className="grid gap-4">
                  {selectedOrder.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center group/item"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 shrink-0 shadow-sm relative">
                          {item.image ? (
                            /* 1. Main Image Render with hover scale */
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform group-hover/item:scale-110 duration-500"
                            />
                          ) : item.videoUrl ? (
                            /* 2. Video Thumbnail Fallback with matching hover scale */
                            <video
                              src={`${item.videoUrl}#t=0.01`}
                              preload="metadata"
                              muted
                              playsInline
                              crossOrigin="anonymous"
                              className="h-full w-full object-cover transition-transform group-hover/item:scale-110 duration-500"
                            />
                          ) : (
                            /* 3. Icon Placeholder Fallback if both media values are missing */
                            <div className="h-full w-full flex items-center justify-center">
                              <Tag className="h-4 w-4 text-zinc-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-800 uppercase leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-tighter">
                            Size:{" "}
                            <span className="text-zinc-600">{item.size}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-black text-maroon-primary">
                          KES {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER: Pinned at the bottom */}
            <div className="p-6 md:p-8 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center shrink-0">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Total Amount
              </span>
              <span className="text-2xl font-serif font-bold text-maroon-primary italic">
                KES {selectedOrder.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION DIALOG --- */}
      {confirmConfig.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-zinc-900/20 backdrop-blur-md no-print">
          <div className="bg-white p-8 rounded-4xl shadow-2xl max-w-sm w-full border border-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div
              className={`h-12 w-12 rounded-2xl mb-4 flex items-center justify-center ${
                confirmConfig.variant === "danger"
                  ? "bg-red-50 text-red-500"
                  : "bg-maroon-primary/10 text-maroon-primary"
              }`}
            >
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              {confirmConfig.title}
            </h3>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
              {confirmConfig.message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmConfig({ ...confirmConfig, isOpen: false })
                }
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmConfig.onConfirm();
                  setConfirmConfig({ ...confirmConfig, isOpen: false });
                }}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                  confirmConfig.variant === "danger"
                    ? "bg-red-500 shadow-red-200 hover:bg-red-600"
                    : "bg-maroon-primary shadow-maroon-primary/20 hover:opacity-90"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

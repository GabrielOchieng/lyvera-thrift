"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getPendingOrdersCount } from "@/actions/order";
import { searchAdminItems } from "@/actions/product"; // The multi-model action
import { useDebounce } from "@/hooks/useDebounce";
import {
  LayoutDashboard,
  Box,
  PlusCircle,
  ShoppingCart,
  ArrowLeft,
  Search,
  Bell,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // States for Notifications
  const [pendingCount, setPendingCount] = useState(0);

  // States for Universal Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{
    products: any[];
    orders: any[];
  }>({ products: [], orders: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // 1. Handle Order Notifications Polling
  useEffect(() => {
    const fetchCount = async () => {
      const count = await getPendingOrdersCount();
      setPendingCount(count);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Handle Universal Search Logic
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.length > 2) {
        setIsSearching(true);
        const results = await searchAdminItems(debouncedSearch);
        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setSearchResults({ products: [], orders: [] });
        setShowResults(false);
      }
    };
    performSearch();
  }, [debouncedSearch]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-[#fdfcfb]">
      {/* Sidebar */}
      <aside className="w-64 bg-maroon-primary text-white p-6 flex flex-col gap-8 shadow-xl sticky top-0 h-screen z-20">
        {/* <div className="flex flex-col gap-1">
          <div className="text-xl font-serif font-bold tracking-tight text-thrift-gold italic">
            Lyvera Admin
          </div>
          <div className="h-1 w-12 bg-thrift-pink rounded-full"></div>
        </div> */}

        <div className="flex items-center gap-3">
          {/* Logo Container */}
          <div className="relative w-10 h-10 shrink-0 bg-thrift-gold rounded-full overflow-hidden border-2 border-thrift-gold shadow-md">
            <Image
              src="/logo.png"
              alt="Lyvera Logo"
              fill
              className="object-cover"
            />
          </div>

          {/* Text & Accent Section */}
          <div className="flex flex-col gap-1">
            <div className="text-xl font-serif font-bold tracking-tight text-thrift-gold italic leading-none">
              Lyvera Admin
            </div>
            <div className="h-1 w-12 bg-thrift-pink rounded-full"></div>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium border ${isActive("/admin") ? "bg-white/20 border-white/20 text-thrift-gold" : "hover:bg-white/10 border-transparent text-zinc-300"}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>

          <Link
            href="/admin/inventory"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium border ${isActive("/admin/inventory") ? "bg-white/20 border-white/20 text-thrift-gold" : "hover:bg-white/10 border-transparent text-zinc-300"}`}
          >
            <Box className="h-4 w-4" /> Inventory
          </Link>

          <Link
            href="/admin/add"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium border ${isActive("/admin/add") ? "bg-white/20 border-white/20 text-thrift-gold" : "hover:bg-white/10 border-transparent text-zinc-300"}`}
          >
            <PlusCircle className="h-4 w-4" /> Add New Item
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition text-sm font-medium border ${isActive("/admin/orders") ? "bg-white/20 border-white/20 text-thrift-gold" : "hover:bg-white/10 border-transparent text-zinc-300"}`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-4 w-4" /> Orders
            </div>
            {pendingCount > 0 && (
              <span className="bg-thrift-pink text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                {pendingCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium border ${isActive("/admin/users") ? "bg-white/20 border-white/20 text-thrift-gold" : "hover:bg-white/10 border-transparent text-zinc-300"}`}
          >
            <PlusCircle className="h-4 w-4" /> User Management
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-thrift-gold transition uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Shop
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-30">
          {/* UNIVERSAL SEARCH BAR */}
          <div className="relative w-full max-w-xl" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 2 && setShowResults(true)}
              placeholder="Search products, M-Pesa codes, or customers..."
              className="w-full pl-10 pr-10 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-thrift-gold/50 transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 animate-spin" />
            )}

            {/* SEARCH RESULTS DROPDOWN */}
            {showResults && (
              <div className="absolute top-full mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden max-h-112.5 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {/* Product Section */}
                {searchResults.products.length > 0 && (
                  <div className="bg-zinc-50/50 border-b border-zinc-100">
                    <div className="px-4 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                      Inventory Items
                    </div>
                    {searchResults.products.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/inventory?id=${item.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white transition border-b border-zinc-100 last:border-0"
                      >
                        <div className="w-8 h-8 bg-zinc-200 rounded overflow-hidden">
                          <img
                            src={item.images[0]}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col flex-1 truncate">
                          <span className="text-sm font-bold text-zinc-800 truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase">
                            {item.category.name} • {item.size}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-maroon-primary italic">
                          KES {item.price}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Orders Section */}
                {searchResults.orders.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                      Customer Orders
                    </div>
                    {searchResults.orders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/admin/orders?id=${order.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex flex-col px-4 py-3 hover:bg-zinc-50 transition border-b border-zinc-100 last:border-0"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-zinc-800">
                            {order.customerName}
                          </span>
                          <span className="text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">
                            {order.mpesaCode}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-500">
                            {order.customerPhone}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${order.status === "VERIFIED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.products.length === 0 &&
                  searchResults.orders.length === 0 && (
                    <div className="p-8 text-center text-zinc-400 text-sm italic font-serif">
                      No matches found for "{debouncedSearch}"
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-2 text-zinc-400 hover:text-maroon-primary transition relative group"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-thrift-pink text-white text-[9px] font-bold rounded-full border-2 border-white animate-in zoom-in">
                  {pendingCount}
                </span>
              )}
            </Link>

            <div className="h-9 w-9 bg-maroon-primary rounded-full flex items-center justify-center text-xs font-bold text-thrift-gold border border-thrift-gold/30">
              LT
            </div>
          </div>
        </header>

        <main className="px-10 py-5 flex-1">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}

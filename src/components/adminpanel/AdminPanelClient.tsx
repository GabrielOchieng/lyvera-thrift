"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  PlusCircle,
  ShoppingCart,
  ArrowLeft,
  Search,
  Bell,
  Loader2,
  Menu,
  X,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import { getPendingOrdersCount } from "@/actions/order";
import { searchAdminItems } from "@/actions/product";

export default function AdminPanelClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{
    products: any[];
    orders: any[];
  }>({ products: [], orders: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getPendingOrdersCount();
      setPendingCount(count);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

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

  const isActive = (path: string) => pathname === path;

  const NavLinks = () => (
    <>
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
        <Users className="h-4 w-4" /> User Management
      </Link>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#fdfcfb]">
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex w-64 bg-maroon-primary text-white p-6 flex-col gap-8 shadow-xl sticky top-0 h-screen z-40">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 bg-thrift-gold rounded-full overflow-hidden border-2 border-thrift-gold">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <div className="text-xl font-serif font-bold text-thrift-gold italic">
            Lyvera
          </div>
        </div>
        <nav className="flex flex-col gap-3">
          <NavLinks />
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-thrift-gold uppercase font-bold tracking-widest"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Shop
          </Link>
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-maroon-primary h-full p-6 flex flex-col gap-8 animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-xl font-serif font-bold text-thrift-gold italic">
                Lyvera Admin
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white"
              >
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <NavLinks />
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="h-16 bg-white border-b border-zinc-200 px-4 lg:px-8 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-maroon-primary hover:bg-zinc-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div
            className="relative flex-1 max-w-xl mx-auto lg:mx-0"
            ref={searchRef}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onFocus={() => searchTerm.length > 2 && setShowResults(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products or orders..."
              className="w-full pl-10 pr-10 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-thrift-gold/50 transition-all outline-none"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 animate-spin" />
            )}
            {showResults && (
              <div className="absolute top-full mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto z-50">
                <div className="p-2 border-b border-zinc-100 bg-zinc-50/50">
                  <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Products
                  </p>
                </div>
                <div className="divide-y divide-zinc-50">
                  {searchResults.products.length > 0 ? (
                    searchResults.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/admin/inventory?id=${product.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center gap-3 p-3 hover:bg-maroon-primary/5 transition-colors group"
                      >
                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-zinc-100 shrink-0">
                          <Image
                            src={product.images?.[0] || "/placeholder.png"}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-maroon-primary">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            KES {product.price?.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-xs text-zinc-400 italic">
                      No products found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 lg:gap-4 ml-auto">
            <Link
              href="/admin/orders"
              className="p-2 text-zinc-400 hover:text-maroon-primary relative"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-thrift-pink rounded-full border-2 border-white" />
              )}
            </Link>
            <Link href="/" className="transition-opacity hover:opacity-80">
              <div className="h-8 w-8 lg:h-9 lg:w-9 bg-maroon-primary rounded-full flex items-center justify-center text-[10px] lg:text-xs font-bold text-thrift-gold border border-thrift-gold/30">
                LT
              </div>
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-10 flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

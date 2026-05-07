"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getPendingOrdersCount } from "@/actions/order";
import { searchAdminItems } from "@/actions/product";
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
  Menu,
  X,
  Users,
} from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
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

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

      {/* MOBILE SIDEBAR OVERLAY */}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="h-16 bg-white border-b border-zinc-200 px-4 lg:px-8 flex items-center gap-4 sticky top-0 z-30">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-maroon-primary hover:bg-zinc-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* SEARCH BAR */}
          <div
            className="relative flex-1 max-w-xl mx-auto lg:mx-0"
            ref={searchRef}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-thrift-gold/50 transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 animate-spin" />
            )}

            {/* SEARCH RESULTS DROPDOWN (truncated for space, keep your original logic here) */}
            {showResults && (
              <div className="absolute top-full mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
                {/* ... your existing search result mapping ... */}
              </div>
            )}
          </div>

          {/* Desktop/Mobile Right Header */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link
              href="/admin/orders"
              className="p-2 text-zinc-400 hover:text-maroon-primary relative"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-thrift-pink rounded-full border-2 border-white" />
              )}
            </Link>
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              {/* Your "LT" Circle Link */}
              <div className="h-8 w-8 lg:h-9 lg:w-9 bg-maroon-primary rounded-full flex items-center justify-center text-[10px] lg:text-xs font-bold text-thrift-gold border border-thrift-gold/30 group-hover:scale-105 transition-transform duration-300">
                LT
              </div>

              <span className="hidden sm:block text-xl font-serif font-bold tracking-tight text-white group-hover:text-thrift-gold transition-colors">
                Lyvera Thrifts
              </span>
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

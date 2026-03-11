"use client";
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
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Helper to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-[#fdfcfb]">
      {/* Sidebar - Fixed/Sticky */}
      <aside className="w-64 bg-maroon-primary text-white p-6 flex flex-col gap-8 shadow-xl sticky top-0 h-screen">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-serif font-bold tracking-tight text-thrift-gold italic">
            Lyvera Admin
          </div>
          <div className="h-1 w-12 bg-thrift-pink rounded-full"></div>
        </div>

        <nav className="flex flex-col gap-3">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium border ${
              isActive("/admin")
                ? "bg-white/20 border-white/20 text-thrift-gold"
                : "hover:bg-white/10 border-transparent text-zinc-300"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/inventory"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium border ${
              isActive("/admin/inventory")
                ? "bg-white/20 border-white/20 text-thrift-gold"
                : "hover:bg-white/10 border-transparent text-zinc-300"
            }`}
          >
            <Box className="h-4 w-4" />
            Inventory
          </Link>

          <Link
            href="/admin/add"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-bold shadow-lg ${
              isActive("/admin/add")
                ? "bg-thrift-gold text-maroon-primary"
                : "bg-thrift-pink/90 hover:bg-thrift-pink text-white shadow-thrift-pink/20"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Add New Item
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium border ${
              isActive("/admin/orders")
                ? "bg-white/20 border-white/20 text-thrift-gold"
                : "hover:bg-white/10 border-transparent text-zinc-300"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-thrift-gold transition uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Shop
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search items by name, category, or status..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-thrift-gold/50 focus:border-thrift-gold transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-maroon-primary transition relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-thrift-pink rounded-full border-2 border-white"></span>
            </button>
            <div className="h-9 w-9 bg-maroon-primary rounded-full flex items-center justify-center text-xs font-bold text-thrift-gold border border-thrift-gold/30">
              LT
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-10 flex-1">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

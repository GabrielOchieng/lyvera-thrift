"use client";

import Link from "next/link";
import { ShoppingBag, Heart, User, Search, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useCart } from "../../store/useCart";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAdminItems } from "@/actions/product"; // We can reuse the action or make a public one

export default function Navbar() {
  const cart = useCart((state) => state.cart);
  const [mounted, setMounted] = useState(false);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setMounted(true);

    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedSearch.length > 2) {
        setIsSearching(true);
        // Using the product search part of our previous action
        const data = await searchAdminItems(debouncedSearch);
        setResults(data.products || []);
        setIsSearching(false);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };
    handleSearch();
  }, [debouncedSearch]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-maroon-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-thrift-gold rounded-full flex items-center justify-center text-maroon-primary font-bold">
            LT
          </div>
          <span className="hidden md:block text-xl font-serif font-bold tracking-tight">
            Lyvera Thrifts
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium uppercase tracking-wide">
          <Link href="/" className="hover:text-thrift-gold transition">
            Home
          </Link>
          <Link href="/shop" className="hover:text-thrift-gold transition">
            Shop
          </Link>
          <Link href="/blog" className="hover:text-thrift-gold transition">
            Blog
          </Link>
          <Link
            href="/cart"
            className="hover:text-thrift-gold transition font-bold text-thrift-gold"
          >
            Cart
          </Link>
          <Link href="/orders" className="hover:text-thrift-gold transition">
            Orders
          </Link>
          <Link href="/admin" className="hover:text-thrift-gold transition">
            Admin
          </Link>
        </div>

        {/* Search Bar */}
        <div
          className="flex-1 max-w-md relative hidden sm:block"
          ref={searchRef}
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for unique pieces..."
              className="w-full bg-white text-zinc-800 px-4 py-2 pr-10 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-thrift-gold"
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-2">
              {isSearching ? (
                <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-zinc-400" />
              )}
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl rounded-sm border border-zinc-100 overflow-hidden z-50">
              {results.length > 0 ? (
                <div className="flex flex-col">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.id}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 p-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-0 transition"
                    >
                      <div className="w-12 h-12 bg-zinc-100 rounded overflow-hidden shrink-0">
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-bold text-zinc-900 truncate">
                          {product.name}
                        </span>
                        <span className="text-xs text-zinc-500 uppercase">
                          {product.category.name} • {product.size}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-maroon-primary">
                        KES {product.price}
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/shop?search=${searchTerm}`}
                    className="p-3 text-center text-xs font-bold text-maroon-primary bg-zinc-50 hover:bg-thrift-gold hover:text-maroon-primary transition"
                  >
                    View all results
                  </Link>
                </div>
              ) : (
                <div className="p-4 text-center text-zinc-500 text-sm">
                  No items found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Icons Area */}
        <div className="flex items-center gap-5">
          <button className="relative group">
            <Heart className="h-6 w-6 group-hover:text-thrift-gold transition" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-maroon-primary">
              0
            </span>
          </button>

          <Link href="/cart" className="relative group">
            <ShoppingBag className="h-6 w-6 group-hover:text-thrift-gold transition" />
            {mounted && cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-thrift-gold text-maroon-primary text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-maroon-primary">
                {cart.length}
              </span>
            )}
          </Link>

          <button>
            <User className="h-6 w-6 hover:text-thrift-gold transition" />
          </button>
        </div>
      </div>
    </nav>
  );
}

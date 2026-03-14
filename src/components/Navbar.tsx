"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Loader2,
  Menu,
  X,
} from "lucide-react"; // Added Menu and X
import { useEffect, useState, useRef } from "react";
import { useCart } from "../../store/useCart";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAdminItems } from "@/actions/product";

export default function Navbar() {
  const pathname = usePathname();
  const cart = useCart((state) => state.cart);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile state

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const isActive = (path: string) => pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog" },
    { name: "Cart", href: "/cart" },
    { name: "Orders", href: "/orders" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-maroon-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-thrift-gold rounded-full flex items-center justify-center text-maroon-primary font-bold">
              LT
            </div>
            <span className="hidden sm:block text-xl font-serif font-bold tracking-tight">
              Lyvera Thrifts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-thrift-gold ${
                  isActive(link.href)
                    ? "text-thrift-gold font-bold"
                    : "text-white/90"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar (Desktop) */}
          <div
            className="flex-1 max-w-md relative hidden md:block"
            ref={searchRef}
          >
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search unique pieces..."
                className="w-full bg-white text-zinc-800 px-4 py-2 pr-10 rounded-sm text-sm focus:outline-none"
              />
              <div className="absolute right-3 top-2.5">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                ) : (
                  <Search className="h-4 w-4 text-zinc-400" />
                )}
              </div>
            </div>
            {/* ... dropdown results code same as before ... */}
          </div>

          {/* Icons Area */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Link href="/cart" className="relative group">
              <ShoppingBag
                className={`h-6 w-6 transition ${isActive("/cart") ? "text-thrift-gold" : "group-hover:text-thrift-gold"}`}
              />
              {mounted && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-thrift-gold text-maroon-primary text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-maroon-primary">
                  {cart.length}
                </span>
              )}
            </Link>
            <User className="h-6 w-6 hidden sm:block hover:text-thrift-gold transition cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-maroon-primary transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "64px" }} // Height of navbar
      >
        <div className="flex flex-col p-8 gap-6 text-2xl font-black italic uppercase tracking-tighter">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${isActive(link.href) ? "text-thrift-gold" : "text-white"}`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/10 my-4" />
          <div className="flex gap-6">
            <Heart className="h-8 w-8 text-white" />
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Loader2,
  Menu,
  X,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useCart } from "../../store/useCart";
import { useDebounce } from "@/hooks/useDebounce";
import { useSession, signOut } from "@/lib/auth-client";
import { searchProducts } from "@/actions/product";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const cart = useCart((state) => state.cart);

  console.log("user", session);

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const isActive = (path: string) => pathname === path;

  // Sync hydration and close menus on route change
  useEffect(() => {
    setMounted(true);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Search Click Outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Logic
  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedSearch.length > 2) {
        setIsSearching(true);
        // Use the new public-facing action
        const data = await searchProducts(debouncedSearch);
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
    { name: "Orders", href: "/orders" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-60 bg-maroon-primary text-white shadow-lg">
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
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 relative bg-thrift-gold rounded-full flex items-center justify-center overflow-hidden border-2 border-thrift-gold group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Lyvera Thrifts"
                fill
                className="object-cover"
              />
            </div>
            <span className="hidden sm:block text-xl font-serif font-bold tracking-tight text-white group-hover:text-thrift-gold transition-colors">
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

          {/* Search Bar */}
          {/* Search Bar */}
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

            {/* RESULTS DROPDOWN */}
            {showDropdown && (results.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sm shadow-2xl border border-zinc-100 overflow-hidden z-110">
                {isSearching ? (
                  <div className="p-4 text-center text-zinc-500 text-sm">
                    Searching...
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-zinc-50 transition border-b border-zinc-50 last:border-0"
                      >
                        <div className="h-12 w-12 bg-zinc-100 rounded-sm overflow-hidden shrink-0">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-maroon-primary font-bold">
                            KES {product.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {!isSearching &&
                  results.length === 0 &&
                  searchTerm.length > 2 && (
                    <div className="p-4 text-center text-zinc-500 text-sm">
                      No items found.
                    </div>
                  )}
              </div>
            )}
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

            {/* Auth Section */}
            {mounted && (
              <div className="relative">
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white/50" />
                ) : session ? (
                  /* Logged In Dropdown */
                  <div className="relative group">
                    <button className="flex items-center gap-2 focus:outline-none">
                      <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-thrift-gold group-hover:text-maroon-primary transition">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div className="hidden xl:flex flex-col items-start leading-none">
                        <span className="text-[10px] font-bold uppercase text-thrift-gold mb-1">
                          {session.user.role}
                        </span>
                        <span className="text-xs font-medium max-w-20 truncate">
                          {session.user.name}
                        </span>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-sm shadow-2xl py-2 text-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-100">
                      <div className="px-4 py-3 border-b border-zinc-100">
                        <p className="text-sm font-bold truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-50 transition"
                      >
                        <UserCircle className="h-4 w-4" /> My Profile
                      </Link>

                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-50 text-maroon-primary font-bold transition"
                        >
                          <Settings className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-zinc-100 mt-1"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Logged Out State */
                  <Link
                    href="/login"
                    className="text-xs font-bold uppercase tracking-tighter border-2 border-white px-4 py-1.5 hover:bg-white hover:text-maroon-primary transition"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-55 bg-maroon-primary transition-transform duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "64px" }}
      >
        <div className="flex flex-col p-8 gap-4 text-xl font-black  tracking-tighter h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${isActive(link.href) ? "text-thrift-gold" : "text-white"}`}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-auto pb-12">
            <hr className="border-white/10 my-6" />
            {session ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-thrift-gold rounded-full flex items-center justify-center text-maroon-primary text-xl font-bold">
                    {session.user.name[0]}
                  </div>
                  <div>
                    <p className="text-white normal-case font-bold">
                      {session.user.name}
                    </p>
                    <p className="text-thrift-gold text-xs tracking-widest">
                      {session.user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-red-400 text-xl font-black "
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-thrift-gold text-xl font-black "
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { ShoppingBag, Heart, User, Search } from "lucide-react"; // Install lucide-react first

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-maroon-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
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
          <Link href="/cart" className="hover:text-thrift-gold transition">
            Cart
          </Link>
          <Link href="/orders" className="hover:text-thrift-gold transition">
            Orders
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <input
            type="text"
            placeholder="Search for Products..."
            className="w-full bg-white text-zinc-800 px-4 py-2 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-thrift-gold"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>

        {/* Icons Area */}
        <div className="flex items-center gap-5">
          <button className="relative group">
            <Heart className="h-6 w-6 group-hover:text-thrift-gold transition" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-maroon-primary">
              0
            </span>
          </button>

          <button className="relative group">
            <ShoppingBag className="h-6 w-6 group-hover:text-thrift-gold transition" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-maroon-primary">
              0
            </span>
          </button>

          <button>
            <User className="h-6 w-6 hover:text-thrift-gold transition" />
          </button>
        </div>
      </div>
    </nav>
  );
}

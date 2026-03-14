import Link from "next/link";
import { MoveLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] flex items-center justify-center">
        <h1 className="text-[30rem] font-black italic select-none">404</h1>
      </div>

      <div className="relative z-10 max-w-2xl">
        <span className="text-maroon-primary font-black uppercase tracking-[0.3em] text-xs mb-6 block">
          Oops! Error Code: 404
        </span>

        <h2 className="text-6xl md:text-6xl font-black italic uppercase tracking-tighter text-zinc-900 mb-6">
          LOST IN THE <br /> ARCHIVE?
        </h2>

        <p className="text-zinc-500 text-lg md:text-xl font-medium mb-12 max-w-md mx-auto leading-relaxed">
          The piece you are looking for has been moved, sold, or never existed.
          Our collection is constantly evolving.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-maroon-primary transition-all active:scale-95"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <Link
            href="/shop"
            className="flex items-center gap-3 border-2 border-zinc-200 text-zinc-900 px-8 py-4 rounded-full font-black uppercase tracking-widest hover:border-zinc-900 transition-all active:scale-95"
          >
            <Search className="h-4 w-4" />
            Browse Shop
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 flex items-center gap-2">
        <div className="w-8 h-8 bg-thrift-gold rounded-full flex items-center justify-center text-maroon-primary font-bold text-xs">
          LT
        </div>
        <span className="text-zinc-400 font-serif italic text-sm">
          Lyvera Thrifts
        </span>
      </div>
    </main>
  );
}

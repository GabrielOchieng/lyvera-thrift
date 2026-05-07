import {
  Smartphone,
  Truck,
  ShieldCheck,
  ArrowRight,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function TrustSignals() {
  const signals = [
    {
      icon: <Smartphone className="text-thrift-gold" size={16} />,
      title: "M-Pesa",
      label: "Secure Pay",
    },
    {
      icon: <Truck className="text-thrift-gold" size={16} />,
      title: "Delivery",
      label: "Next Day NBO",
    },
    {
      icon: <ShieldCheck className="text-thrift-gold" size={16} />,
      title: "Quality",
      label: "Hand-picked",
    },
  ];

  return (
    <div className="relative z-30 -mt-10 md:-mt-8 px-6 max-w-7xl mx-auto w-full">
      <div className="bg-maroon-primary shadow-2xl rounded-2xl md:rounded-full p-2 md:pl-8 md:pr-2 flex flex-col md:flex-row items-center gap-4 border border-white/10">
        {/* 1. COMPACT SIGNALS SECTION */}
        <div className="flex flex-1 items-center justify-around md:justify-start gap-4 md:gap-12 w-full">
          {signals.map((signal, index) => (
            <div key={index} className="flex items-center gap-3 group py-2">
              <div className="hidden sm:flex bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                {signal.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[10px] uppercase tracking-wider leading-none mb-1">
                  {signal.title}
                </span>
                <span className="text-maroon-100 text-[8px] font-bold uppercase tracking-tight opacity-60">
                  {signal.label}
                </span>
              </div>
              {/* Divider */}
              {index !== signals.length - 1 && (
                <div className="hidden lg:block h-6 w-px bg-white/10 ml-6" />
              )}
            </div>
          ))}
        </div>

        {/* 2. THE SEARCH/CTA ACTION (Intuitive "Search" vibe) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Hidden on small mobile to keep it slim */}
          <div className="hidden xl:flex items-center gap-2 text-maroon-200 text-[9px] font-black uppercase tracking-widest mr-4">
            <Search size={12} />
            <span>Find Your Vibe</span>
          </div>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-3 bg-thrift-gold hover:bg-white text-maroon-primary px-6 py-3 md:py-3.5 rounded-xl md:rounded-full transition-all duration-300 w-full md:w-auto shadow-lg group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              Shop All Pieces
            </span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* 3. SLIM TRENDING CHIPS (Outside the bar to keep bar height small) */}
      <div className="mt-3 flex items-center gap-3 overflow-x-auto no-scrollbar px-4">
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">
          Trending Now:
        </span>
        {["Vintage Denim", "Silk Scarves", "Oversized Blazers"].map((tag) => (
          <Link
            href={`/shop?q=${tag}`}
            key={tag}
            className="text-[8px] bg-zinc-100 border border-zinc-200 text-zinc-600 px-3 py-1 rounded-full whitespace-nowrap hover:border-maroon-primary hover:text-maroon-primary transition-all"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

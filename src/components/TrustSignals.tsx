// import {
//   Smartphone,
//   Truck,
//   ShieldCheck,
//   ArrowRight,
//   Search,
// } from "lucide-react";
// import Link from "next/link";

// export default function TrustSignals() {
//   const signals = [
//     {
//       /* Using M-Pesa Brand Green */
//       icon: <Smartphone className="text-[#39B54A]" size={16} />,
//       title: "M-PESA",
//       label: "Instant & Secure",
//     },
//     {
//       icon: <Truck className="text-zinc-600" size={16} />,
//       title: "Delivery",
//       label: "Countrywide",
//     },
//     {
//       icon: <ShieldCheck className="text-thrift-gold" size={16} />,
//       title: "Quality",
//       label: "Hand-picked",
//     },
//   ];

//   return (
//     <div className="relative z-30 -mt-10 md:-mt-8 px-6 max-w-7xl mx-auto w-full">
//       {/* BACKGROUND: True Cool Gray */}
//       <div className="bg-[#F3F4F6] shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-2xl md:rounded-full p-2 md:pl-8 md:pr-2 flex flex-col md:flex-row items-center gap-4 border border-slate-300/50">
//         {/* 1. COMPACT SIGNALS SECTION */}
//         <div className="flex flex-1 items-center justify-around md:justify-start gap-4 md:gap-12 w-full">
//           {signals.map((signal, index) => (
//             <div key={index} className="flex items-center gap-3 group py-2">
//               <div className="hidden sm:flex bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
//                 {signal.icon}
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-slate-900 font-black text-[10px] uppercase tracking-wider leading-none mb-1">
//                   {signal.title}
//                 </span>
//                 <span className="text-slate-500 text-[8px] font-bold uppercase tracking-tight">
//                   {signal.label}
//                 </span>
//               </div>
//               {/* Vertical Divider */}
//               {index !== signals.length - 1 && (
//                 <div className="hidden lg:block h-6 w-px bg-slate-300 ml-6" />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* 2. THE SEARCH/CTA ACTION */}
//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <div className="hidden xl:flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest mr-4">
//             <Search size={12} />
//             <span>Find Your Fit</span>
//           </div>

//           <Link
//             href="/shop"
//             className="flex items-center justify-center gap-3 bg-maroon-primary hover:bg-slate-900 text-white px-6 py-3 md:py-3.5 rounded-xl md:rounded-full transition-all duration-300 w-full md:w-auto shadow-lg group"
//           >
//             <span className="text-[10px] font-black uppercase tracking-widest">
//               Shop All
//             </span>
//             <ArrowRight
//               size={14}
//               className="group-hover:translate-x-1 transition-transform text-thrift-gold"
//             />
//           </Link>
//         </div>
//       </div>

//       {/* 3. GRAY TRENDING CHIPS */}
//       <div className="mt-3 flex items-center gap-3 overflow-x-auto no-scrollbar px-4">
//         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
//           Trending Now:
//         </span>
//         {["Vintage Denim", "Silk Scarves", "Oversized Blazers"].map((tag) => (
//           <Link
//             href={`/shop?q=${tag}`}
//             key={tag}
//             className="text-[8px] bg-[#E5E7EB] border border-slate-300 text-slate-600 px-3 py-1 rounded-full whitespace-nowrap hover:border-maroon-primary hover:text-maroon-primary transition-all"
//           >
//             {tag}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

import {
  Smartphone,
  Truck,
  ShieldCheck,
  ArrowRight,
  Search,
} from "lucide-react";
import Link from "next/link";

interface TrustSignalsProps {
  trendingTags?: string[];
}

export default function TrustSignals({ trendingTags = [] }: TrustSignalsProps) {
  const signals = [
    {
      /* Recognition: M-Pesa Brand Green */
      icon: <Smartphone className="text-[#39B54A]" size={16} />,
      title: "M-PESA",
      label: "Instant & Secure",
    },
    {
      /* Trust: Emphasizing scale beyond Nairobi */
      icon: <Truck className="text-zinc-600" size={16} />,
      title: "Delivery",
      label: "Countrywide",
    },
    {
      icon: <ShieldCheck className="text-thrift-gold" size={16} />,
      title: "Quality",
      label: "Hand-picked",
    },
  ];

  return (
    <div className="relative z-30 -mt-10 md:-mt-8 px-6 max-w-7xl mx-auto w-full">
      {/* MAIN BAR: Cool Gray Aesthetic */}
      <div className="bg-[#F3F4F6] shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-2xl md:rounded-full p-2 md:pl-8 md:pr-2 flex flex-col md:flex-row items-center gap-4 border border-slate-300/50">
        {/* 1. Signals Section */}
        <div className="flex flex-1 items-center justify-around md:justify-start gap-4 md:gap-12 w-full">
          {signals.map((signal, index) => (
            <div key={index} className="flex items-center gap-3 group py-2">
              <div className="hidden sm:flex bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
                {signal.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-black text-[10px] uppercase tracking-wider leading-none mb-1">
                  {signal.title}
                </span>
                <span className="text-slate-500 text-[8px] font-bold uppercase tracking-tight">
                  {signal.label}
                </span>
              </div>
              {/* Vertical Divider */}
              {index !== signals.length - 1 && (
                <div className="hidden lg:block h-6 w-px bg-slate-300 ml-6" />
              )}
            </div>
          ))}
        </div>

        {/* 2. CTA Section: The "Search/Action" vibe */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="hidden xl:flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest mr-4">
            <Search size={12} />
            <span>Find Your Fit</span>
          </div>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-3 bg-maroon-primary hover:bg-slate-900 text-white px-6 py-3 md:py-3.5 rounded-xl md:rounded-full transition-all duration-300 w-full md:w-auto shadow-lg group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              Shop All
            </span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform text-thrift-gold"
            />
          </Link>
        </div>
      </div>

      {/* 3. DYNAMIC TRENDING CHIPS */}
      {trendingTags.length > 0 && (
        <div className="mt-3 flex items-center gap-3 overflow-x-auto no-scrollbar px-4">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Trending Now:
          </span>
          {trendingTags.map((tag) => (
            <Link
              href={`/shop?category=${tag.toLowerCase()}`}
              key={tag}
              className="text-[8px] bg-[#E5E7EB] border border-slate-300 text-slate-600 px-3 py-1 rounded-full whitespace-nowrap hover:border-maroon-primary hover:text-maroon-primary transition-all shadow-sm"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

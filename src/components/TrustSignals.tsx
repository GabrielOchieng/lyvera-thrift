import { Smartphone, Truck, ShieldCheck } from "lucide-react";

export default function TrustSignals() {
  const signals = [
    {
      icon: <Smartphone className="text-thrift-gold" size={20} />,
      title: "Pay via M-PESA",
      description: "Secure & Instant",
    },
    {
      icon: <Truck className="text-thrift-gold" size={20} />,
      title: "Fast Delivery",
      description: "Next Day in Nairobi",
    },
    {
      icon: <ShieldCheck className="text-thrift-gold" size={20} />,
      title: "Quality Assured",
      description: "100% Hand-picked",
    },
  ];

  return (
    <div className="w-full bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {signals.map((signal, index) => (
            <div
              key={index}
              className="flex items-center justify-center md:justify-start gap-4 group"
            >
              <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                {signal.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-maroon-primary leading-none mb-1">
                  {signal.title}
                </span>
                <span className="text-[10px] font-medium text-zinc-500">
                  {signal.description}
                </span>
              </div>
              {/* Vertical divider for desktop */}
              {index !== signals.length - 1 && (
                <div className="hidden md:block h-8 w-px bg-zinc-200 ml-auto mr-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

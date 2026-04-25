// components/auth/auth-layout.tsx
import { CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dynamic year to avoid hardcoding
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen">
      {/* --- LEFT SIDEBAR: Brand & Value Propositions --- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-maroon-primary via-maroon-dark to-thrift-gold p-12 text-white flex-col justify-between">
        {/* Subtle Luxury Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10">
          {/* Branded Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group w-fit"
          >
            <div className="w-12 h-12 bg-thrift-gold rounded-full flex items-center justify-center text-maroon-primary font-bold shadow-lg group-hover:scale-105 transition-transform duration-300">
              LT
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-white">
              Lyvera Thrifts
            </span>
          </Link>

          {/* Value Proposition Title */}
          <h1 className="mt-20 text-5xl font-serif leading-tight text-white drop-shadow-xl max-w-lg">
            Curating iconic looks <br /> for the modern visionary.
          </h1>

          {/* Feature List */}
          <div className="mt-12 space-y-10">
            {[
              {
                icon: CheckCircle2,
                title: "Premium Quality",
                desc: "Every piece in our collection is vetted for fabric and fit.",
              },
              {
                icon: Zap,
                title: "Fast Logistics",
                desc: "Swift delivery to ensure your wardrobe is never behind.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Vault",
                desc: "Your data and transactions are protected by bank-grade security.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="p-3 rounded-xl bg-white/10 group-hover:bg-thrift-gold/20 transition-all duration-300 border border-white/10">
                  <feature.icon className="h-6 w-6 text-thrift-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer Accent */}
        <div className="relative z-10">
          <div className="h-px w-12 bg-thrift-gold mb-4 opacity-50" />
          <p className="text-[10px] text-white uppercase tracking-[0.3em] font-bold opacity-80">
            Trusted by 10,000+ visionaries across Africa
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Form & Secondary Navigation --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 bg-background relative">
        {/* The Core Content (LoginForm or SignUpForm) */}
        <div className="w-full max-w-md">{children}</div>

        {/* Form Area Footer */}
        <div className="w-full max-w-md absolute bottom-12 px-8 lg:px-0">
          <div className="flex flex-col items-center gap-6  ">
            <div className="flex items-center gap-4">
              {/* Slanted architectural lines instead of dots */}
              <div className="h-3 w-px bg-thrift-gold rotate-25d" />
              <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest">
                © {currentYear} Lyvera Thrift • Curated with intent
              </p>
              <div className="h-3 w-px bg-thrift-gold rotate-25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

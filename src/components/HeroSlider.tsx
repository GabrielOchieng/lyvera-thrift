"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
    title: "THE SUSTAINABLE ARCHIVE",
    subtitle:
      "Consciously sourced. Timelessly styled. Discover one-of-one pieces salvaged for the modern wardrobe.",
    cta: "VIEW NEW ARRIVALS",
    link: "/shop",
    label: "NEW CURATION",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974",
    title: "CURATED SILHOUETTES",
    subtitle:
      "Defining your individual style through rare vintage finds and premium pre-loved essentials.",
    cta: "VIEW NEW ARRIVALS",
    link: "/shop",
    label: "EST. 2024",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
    title: "BEYOND THE TRENDS",
    subtitle:
      "Because style shouldn't cost the Earth. Hand-picked treasures waiting for their second life.",
    cta: "VIEW NEW ARRIVALS",
    link: "/shop",
    label: "LYVERA EDIT",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 8000); // Slightly longer for easier reading
    return () => clearInterval(timer);
  }, []);

  const next = () =>
    setCurrent(current === SLIDES.length - 1 ? 0 : current + 1);
  const prev = () =>
    setCurrent(current === 0 ? SLIDES.length - 1 : current - 1);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-zinc-900">
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with optimized overlay for readability */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s]"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%), url(${slide.image})`,
              transform: index === current ? "scale(1)" : "scale(1.1)",
            }}
          />

          {/* Content Wrapper */}
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
            <span className="text-thrift-gold font-black tracking-[0.4em] text-[10px] md:text-xs mb-4 uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
              {slide.label}
            </span>

            <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 max-w-5xl leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {slide.title}
            </h2>

            <p className="max-w-xl text-zinc-300 text-sm md:text-lg mb-10 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {slide.subtitle}
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <Link
                href={slide.link}
                className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-white/20"
              >
                {/* The Primary Background - Gold/Yellow for high visibility */}
                <div className="absolute inset-0 bg-thrift-gold transition-transform duration-300 ease-out group-hover:scale-105"></div>

                {/* The Hover Overlay - Now Wipes WHITE over the gold */}
                <div className="absolute inset-0 w-0 bg-white transition-all duration-400 ease-out group-hover:w-full"></div>

                <span className="relative text-zinc-900 font-black uppercase tracking-widest text-xs transition-colors duration-300">
                  {slide.cta}
                </span>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on mobile, visible on hover on desktop */}
      <div className="hidden md:block">
        <button
          onClick={prev}
          className="absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white transition-all z-20 backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white transition-all z-20 backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Indicators (Dots) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="group py-2">
            <div
              className={`h-0.5 transition-all duration-500 rounded-full ${
                i === current
                  ? "w-12 bg-thrift-gold"
                  : "w-6 bg-white/20 group-hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

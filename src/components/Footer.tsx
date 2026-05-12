import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook } from "react-icons/si";
import NewsletterForm from "./NewsLetterForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "254745046468";
  const whatsappMsg = encodeURIComponent(
    "Sasa Lyvera! I'm interested in your latest collection.",
  );
  return (
    <footer className="bg-maroon-primary text-white pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-thrift-gold">
            Lyvera Thrifts
          </h2>
          <p className="text-sm text-zinc-200 leading-relaxed">
            Your destination for hand-picked, curated vintage and thrifted
            fashion. Every piece is unique, just like you.
          </p>
          <div className="flex gap-4 mt-2">
            <Link
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className=" text-thrift-gold hover:text-white transition"
            >
              <SiWhatsapp className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.facebook.com/veronicah.awih.1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-thrift-gold hover:text-white transition"
            >
              <SiFacebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://tiktok.com/@lyvera_thrifts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-thrift-gold hover:text-white transition"
            >
              <SiTiktok className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.instagram.com/lyverathrifts?igsh=MW9mcWQ4eGlocjNnOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-thrift-gold hover:text-white transition"
            >
              <SiInstagram className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-4">
            Shop
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-zinc-300">
            <li>
              <Link href="/shop" className="hover:text-white transition">
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/shop?cat=jackets"
                className="hover:text-white transition"
              >
                Jackets
              </Link>
            </li>
            <li>
              <Link
                href="/shop?cat=tops"
                className="hover:text-white transition"
              >
                Tops & Tees
              </Link>
            </li>
            <li>
              <Link href="/drops" className="hover:text-white transition">
                New Drops
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-4">
            Support
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-thrift-gold" />
              <span>+254 745 046 468</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-thrift-gold" />
              <span>lyverathrifts@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-thrift-gold" />
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-4">
            Join the Club
          </h3>
          <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
            Be the first to know about our next weekly drop.
          </p>

          <NewsletterForm />
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-400 uppercase tracking-widest">
        <p>© {currentYear} Lyvera Thrifts. All Rights Reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

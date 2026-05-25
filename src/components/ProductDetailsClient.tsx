"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ShareButton from "@/components/cart/ShareButton";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WhatsAppShare from "@/components/WhatsAppShare";
import DynamicMedia from "@/components/ai/DynamicMedia";
import Link from "next/link";

export default function ProductDetailClient({ product, relatedProducts }: any) {
  const whatsappNumber = "254745046468";
  const whatsappOrderLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Lyvera! I want to order this piece:\n\nItem: ${product.name}\nPrice: KES ${product.price}\nLink: ${window.location.href}`,
  )}`;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="w-full rounded-3xl overflow-hidden shadow-lg">
          <DynamicMedia product={product} />
        </div>

        <div className="flex flex-col gap-6 md:sticky md:top-24">
          <div className="flex justify-between items-start">
            <span className="bg-thrift-gold/20 text-maroon-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {product.category.name}
            </span>
            <div className="flex gap-4">
              <WhatsAppShare
                productName={product.name}
                productId={product.id}
              />
              <ShareButton />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 uppercase tracking-tight">
              {product.name}
            </h1>
            <p className="text-2xl md:text-3xl font-black text-maroon-primary italic">
              KES {product.price.toLocaleString()}
            </p>
          </div>

          <div className="prose prose-zinc italic text-zinc-600 border-l-4 border-thrift-gold pl-6 py-2">
            {product.description || "No description provided."}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
              <AddToCartButton product={product} />
            </motion.div>
            {!product.isSold && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                href={whatsappOrderLink}
                target="_blank"
                className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-5 h-5" /> BUY VIA WHATSAPP
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Grid stays here to keep the motion animations */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 border-t border-zinc-100 pt-16">
          <h2 className="text-3xl font-serif font-bold mb-10">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item: any) => (
              <motion.div key={item.id} whileHover={{ y: -5 }}>
                <ProductCard
                  {...item}
                  categoryName={item.category.name}
                  image={item.images[0]}
                  videoUrl={item.videoUrl}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../store/useCart";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  categoryName: string;
  isSold: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  size,
  image,
  categoryName,
  isSold,
}: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);
  const cart = useCart((state) => state.cart);
  const isInCart = cart.some((item) => item.id === id);

  const handleAdd = (e: React.MouseEvent) => {
    // This stops the click from "bubbling up" to the Link
    e.preventDefault();
    e.stopPropagation();
    if (isSold) return;
    addToCart({ id, name, price, image, size });
  };

  return (
    <div className="group relative flex flex-col">
      {/* The Main Link Wrapper for the Product Details */}
      <Link href={`/shop/${id}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200">
          <img
            src={image || "https://placehold.co/400x533"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Sold Out Overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-zinc-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Sold Out
              </span>
            </div>
          )}

          {/* Size Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-900 shadow-sm uppercase">
              {size}
            </span>
          </div>

          {/* Hover Add to Cart Button */}
          {!isSold && (
            <button
              onClick={handleAdd}
              className={`absolute cursor-pointer bottom-4 left-4 right-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform translate-y-16 group-hover:translate-y-0 shadow-2xl z-20 ${
                isInCart
                  ? "bg-green-600 text-white"
                  : "bg-maroon-primary text-white hover:bg-thrift-gold hover:text-black"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart ? "IN BAG" : "ADD TO BAG"}
            </button>
          )}
        </div>

        <div className="mt-4 space-y-1 px-1">
          <p className="text-[10px] font-black text-maroon-primary uppercase tracking-widest opacity-70">
            {categoryName}
          </p>
          <h3 className="text-sm font-bold text-zinc-900 line-clamp-1 uppercase">
            {name}
          </h3>
          <p className="text-lg font-black text-zinc-900 italic">
            KES {price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}

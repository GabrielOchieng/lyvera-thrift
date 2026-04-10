"use client";

import { ShoppingBag, Check } from "lucide-react";

import { useState } from "react";
import { useCart } from "../../../store/useCart";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string;
    isSold: boolean;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useCart((state) => state.addToCart);
  const cart = useCart((state) => state.cart);
  const [added, setAdded] = useState(false);

  const isInCart = cart.some((item) => item.id === product.id);

  const handleAdd = () => {
    if (product.isSold) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.isSold}
      className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
        product.isSold
          ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          : isInCart || added
            ? "bg-green-600 text-white"
            : "bg-maroon-primary text-white hover:bg-zinc-900"
      }`}
    >
      {added || isInCart ? (
        <Check className="h-5 w-5" />
      ) : (
        <ShoppingBag className="h-5 w-5" />
      )}
      {product.isSold
        ? "SOLD OUT"
        : isInCart
          ? "IN YOUR CART"
          : added
            ? "ADDED!"
            : "ADD TO SHOPPING CART"}
    </button>
  );
}

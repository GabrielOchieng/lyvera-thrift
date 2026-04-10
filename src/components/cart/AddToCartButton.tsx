// "use client";

// import { ShoppingBag, Check } from "lucide-react";

// import { useState } from "react";
// import { useCart } from "../../../store/useCart";

// interface AddToCartButtonProps {
//   product: {
//     id: string;
//     name: string;
//     price: number;
//     image: string;
//     size: string;
//     isSold: boolean;
//   };
// }

// export default function AddToCartButton({ product }: AddToCartButtonProps) {
//   const addToCart = useCart((state) => state.addToCart);
//   const cart = useCart((state) => state.cart);
//   const [added, setAdded] = useState(false);

//   const isInCart = cart.some((item) => item.id === product.id);

//   const handleAdd = () => {
//     if (product.isSold) return;

//     addToCart({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       size: product.size,
//     });

//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   };

//   return (
//     <button
//       onClick={handleAdd}
//       disabled={product.isSold}
//       className={`w-full py-3 cursor-pointer rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
//         product.isSold
//           ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
//           : isInCart || added
//             ? "bg-thrift-gold text-zinc-900"
//             : "bg-maroon-primary text-white hover:bg-zinc-900"
//       }`}
//     >
//       {added || isInCart ? (
//         <Check className="h-5 w-5" />
//       ) : (
//         <ShoppingBag className="h-5 w-5" />
//       )}
//       {product.isSold
//         ? "SOLD OUT"
//         : isInCart
//           ? "IN YOUR CART"
//           : added
//             ? "ADDED!"
//             : "ADD TO SHOPPING CART"}
//     </button>
//   );
// }

"use client";

import { ShoppingBag, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../../store/useCart";
import { useRouter } from "next/navigation"; // Added for navigation

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
  const router = useRouter(); // Initialize router
  const [added, setAdded] = useState(false);

  const isInCart = cart.some((item) => item.id === product.id);

  const handleAction = () => {
    if (product.isSold) return;

    if (isInCart) {
      // If already in cart, second click takes them to checkout
      router.push("/cart");
      return;
    }

    // Otherwise, perform the add logic
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
    });

    setAdded(true);
    // Brief success state before showing "IN YOUR BAG / GO TO CART"
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAction}
      disabled={product.isSold}
      className={`w-full py-4 cursor-pointer rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group ${
        product.isSold
          ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
          : isInCart
            ? "bg-thrift-gold text-zinc-900 hover:bg-white border-2 border-thrift-gold"
            : "bg-maroon-primary text-white hover:bg-zinc-900"
      }`}
    >
      {product.isSold ? (
        "SOLD OUT"
      ) : added ? (
        <>
          <Check className="h-5 w-5 animate-bounce" />
          ADDED TO CART!
        </>
      ) : isInCart ? (
        <div className="flex items-center justify-between w-full px-4">
          <span className="flex items-center gap-1 text-xs opacity-70">
            <Check className="h-4 w-4" />
            IN YOUR CART
          </span>
          <span className="flex items-center gap-2">
            GO TO CART
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          ADD TO SHOPPING CART
        </>
      )}
    </button>
  );
}

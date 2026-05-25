// "use client";

// import Link from "next/link";
// import { ShoppingCart, ArrowRight } from "lucide-react";
// import { useCart } from "../../store/useCart";
// import { useRouter } from "next/navigation"; // Import the router

// interface ProductCardProps {
//   id: string;
//   name: string;
//   price: number;
//   size: string;
//   image: string;
//   categoryName: string;
//   isSold: boolean;
// }

// export default function ProductCard({
//   id,
//   name,
//   price,
//   size,
//   image,
//   categoryName,
//   isSold,
// }: ProductCardProps) {
//   const addToCart = useCart((state) => state.addToCart);
//   const cart = useCart((state) => state.cart);
//   const isInCart = cart.some((item) => item.id === id);
//   const router = useRouter(); // Initialize router

//   const handleButtonClick = (e: React.MouseEvent) => {
//     // Stop the click from triggering the parent <Link> (product detail page)
//     e.preventDefault();
//     e.stopPropagation();

//     if (isSold) return;

//     if (isInCart) {
//       // If already in cart, take them to the cart page
//       router.push("/cart");
//     } else {
//       // Otherwise, add to cart
//       addToCart({ id, name, price, image, size });
//     }
//   };

//   return (
//     <div className="group relative flex flex-col">
//       <Link href={`/shop/${id}`} className="block">
//         <div className="relative aspect-3/2 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200">
//           <img
//             src={image}
//             alt={name}
//             referrerPolicy="no-referrer"
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://placehold.co/400x533?text=Lyvera+Piece";
//             }}
//           />

//           {isSold && (
//             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
//               <span className="bg-zinc-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
//                 Sold Out
//               </span>
//             </div>
//           )}

//           <div className="absolute top-3 left-3 z-10">
//             <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-900 shadow-sm uppercase">
//               {size}
//             </span>
//           </div>

//           {!isSold && (
//             <button
//               onClick={handleButtonClick}
//               className={`absolute cursor-pointer bottom-4 left-4 right-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform translate-y-16 group-hover:translate-y-0 shadow-2xl z-20 ${
//                 isInCart
//                   ? "bg-zinc-900 text-white ring-2 ring-white/20" // Darker, "Premium" look for added items
//                   : "bg-maroon-primary text-white hover:bg-thrift-gold hover:text-black"
//               }`}
//             >
//               {isInCart ? (
//                 <div className="flex items-center justify-between w-full px-4">
//                   <span className="flex items-center gap-2 text-[10px] opacity-70">
//                     <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
//                     IN CART
//                   </span>
//                   <span className="flex items-center gap-1 text-thrift-gold">
//                     GO TO CART
//                     <ArrowRight className="h-3 w-3" />
//                   </span>
//                 </div>
//               ) : (
//                 <>
//                   <ShoppingCart className="h-4 w-4" />
//                   ADD TO CART
//                 </>
//               )}
//             </button>
//           )}
//         </div>

//         <div className="mt-4 space-y-1 px-1">
//           <p className="text-[10px] font-black text-maroon-primary uppercase tracking-widest opacity-70">
//             {categoryName}
//           </p>
//           <h3 className="text-sm font-bold text-zinc-900 line-clamp-1 uppercase">
//             {name}
//           </h3>
//           <p className="text-sm font-black text-zinc-900">
//             KES {price.toLocaleString()}
//           </p>
//         </div>
//       </Link>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "../../store/useCart";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  videoUrl?: string | null; // Added to match your Postgres schema column
  categoryName: string;
  isSold: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  size,
  image,
  videoUrl,
  categoryName,
  isSold,
}: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);
  const cart = useCart((state) => state.cart);
  const isInCart = cart.some((item) => item.id === id);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSold) return;

    if (isInCart) {
      router.push("/cart");
    } else {
      addToCart({ id, name, price, image, size });
    }
  };

  // Hover handlers to play/pause video if it exists
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Rewind to beginning
    }
  };

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/shop/${id}`} className="block">
        <div className="relative aspect-3/2 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200">
          {/* Default Image fallback */}
          <img
            src={image || "https://placehold.co/400x533?text=Lyvera+Piece"}
            alt={name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              videoUrl ? "group-hover:opacity-0" : ""
            }`}
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/400x533?text=Lyvera+Piece";
            }}
          />

          {/* Video Preview Layer (Plays on hover) */}
          {videoUrl && !isSold && (
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          )}

          {isSold && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-zinc-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Sold Out
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-900 shadow-sm uppercase">
              {size}
            </span>
          </div>

          {!isSold && (
            <button
              onClick={handleButtonClick}
              className={`absolute cursor-pointer bottom-4 left-4 right-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform translate-y-16 group-hover:translate-y-0 shadow-2xl z-20 ${
                isInCart
                  ? "bg-zinc-900 text-white ring-2 ring-white/20"
                  : "bg-maroon-primary text-white hover:bg-thrift-gold hover:text-black"
              }`}
            >
              {isInCart ? (
                <div className="flex items-center justify-between w-full px-4">
                  <span className="flex items-center gap-2 text-[10px] opacity-70">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    IN CART
                  </span>
                  <span className="flex items-center gap-1 text-thrift-gold">
                    GO TO CART
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  ADD TO CART
                </>
              )}
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
          <p className="text-sm font-black text-zinc-900">
            KES {price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}

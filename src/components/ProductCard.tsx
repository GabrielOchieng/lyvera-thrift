// "use client";

// import Link from "next/link";
// import { ShoppingCart, ArrowRight } from "lucide-react";
// import { useCart } from "../../store/useCart";
// import { useRouter } from "next/navigation";
// import { useRef } from "react";

// interface ProductCardProps {
//   id: string;
//   name: string;
//   price: number;
//   size: string;
//   image: string;
//   videoUrl?: string | null;
//   categoryName: string;
//   isSold: boolean;
// }

// export default function ProductCard({
//   id,
//   name,
//   price,
//   size,
//   image,
//   videoUrl,
//   categoryName,
//   isSold,
// }: ProductCardProps) {
//   const addToCart = useCart((state) => state.addToCart);
//   const cart = useCart((state) => state.cart);
//   const isInCart = cart.some((item) => item.id === id);
//   const router = useRouter();
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const handleButtonClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (isSold) return;

//     if (isInCart) {
//       router.push("/cart");
//     } else {
//       addToCart({ id, name, price, image, size });
//     }
//   };

//   const handleMouseEnter = () => {
//     if (videoRef.current) {
//       videoRef.current.play().catch((err) => {
//         console.warn("Autoplay managed by browser policy:", err);
//       });
//     }
//   };

//   const handleMouseLeave = () => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       // Keep it on the first frame when mouse leaves instead of resetting completely
//       videoRef.current.currentTime = 0;
//     }
//   };

//   return (
//     <div
//       className="group relative flex flex-col w-full h-full"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <Link href={`/shop/${id}`} className="block w-full h-full">
//         <div className="relative aspect-3/2 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 isolation-isolate">
//           {/* Default Image: Only rendered if a valid image path exists */}
//           {image ? (
//             <img
//               src={image}
//               alt={name}
//               referrerPolicy="no-referrer"
//               className={`w-full h-full object-cover transition-opacity duration-300 z-0 ${
//                 videoUrl ? "group-hover:opacity-0" : ""
//               }`}
//               onError={(e) => {
//                 e.currentTarget.src =
//                   "https://placehold.co/400x533?text=Lyvera+Piece";
//               }}
//             />
//           ) : (
//             /* Fallback Placeholder: Only shows if there's genuinely NO image AND NO video */
//             !videoUrl && (
//               <img
//                 src="https://placehold.co/400x533?text=Lyvera+Piece"
//                 alt={name}
//                 className="w-full h-full object-cover z-0"
//               />
//             )
//           )}

//           {/* Video Preview Layer */}
//           {videoUrl && !isSold && (
//             <video
//               ref={videoRef}
//               loop
//               muted
//               playsInline
//               preload="metadata" // Changed to metadata so the browser fetches the 1st frame as a thumbnail!
//               crossOrigin="anonymous"
//               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
//                 image
//                   ? "opacity-0 group-hover:opacity-100 z-10" // If image exists, hide video until hover
//                   : "opacity-100 z-0" // If NO image exists, video frame is ALWAYS visible as the thumbnail!
//               }`}
//             >
//               {/* Cloudinary trick: adding #t=0.01 forces the video container to preload the first frame as an image */}
//               <source src={`${videoUrl}#t=0.01`} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           )}

//           {isSold && (
//             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
//               <span className="bg-zinc-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
//                 Sold Out
//               </span>
//             </div>
//           )}

//           <div className="absolute top-3 left-3 z-20">
//             <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-900 shadow-sm uppercase">
//               {size}
//             </span>
//           </div>

//           {!isSold && (
//             <button
//               onClick={handleButtonClick}
//               className={`absolute cursor-pointer bottom-4 left-4 right-4 py-3 rounded-xl font-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform translate-y-16 group-hover:translate-y-0 shadow-2xl z-30 ${
//                 isInCart
//                   ? "bg-zinc-900 text-white ring-2 ring-white/20"
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
  videoUrl?: string | null;
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

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay managed by browser policy:", err);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="group relative flex flex-col w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/shop/${id}`} className="block w-full h-full">
        <div className="relative aspect-3/2 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 isolation-isolate">
          {/* Default Image Container */}
          {image ? (
            <img
              src={image}
              alt={name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-opacity duration-300 z-0 ${
                videoUrl ? "group-hover:opacity-0" : ""
              }`}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/400x533?text=Lyvera+Piece";
              }}
            />
          ) : (
            !videoUrl && (
              <img
                src="https://placehold.co/400x533?text=Lyvera+Piece"
                alt={name}
                className="w-full h-full object-cover z-0"
              />
            )
          )}

          {/* Video Preview Layer (Now plays for Sold out items too!) */}
          {videoUrl && (
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                image
                  ? "opacity-0 group-hover:opacity-100 z-10"
                  : "opacity-100 z-0"
              }`}
            >
              <source src={`${videoUrl}#t=0.01`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Premium Dark Glass Sold Out Overlay Layer */}
          {isSold && (
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center z-20 transition-all group-hover:bg-black/20">
              <div className="border border-white/40 bg-black/60 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl backdrop-blur-md">
                Sold Out
              </div>
            </div>
          )}

          {/* Size Tag */}
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-900 shadow-sm uppercase">
              {size}
            </span>
          </div>

          {/* Add to Cart Action Button - Hidden conditionally if sold */}
          {!isSold && (
            <button
              onClick={handleButtonClick}
              className={`absolute cursor-pointer bottom-4 left-4 right-4 py-3 rounded-xl font-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform translate-y-16 group-hover:translate-y-0 shadow-2xl z-30 ${
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

        {/* Info Footer Block */}
        <div className="mt-4 space-y-1 px-1">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black text-maroon-primary uppercase tracking-widest opacity-70">
              {categoryName}
            </p>
            {isSold && (
              <span className="text-[9px] font-black tracking-wider text-zinc-400 uppercase">
                Archived Piece
              </span>
            )}
          </div>
          <h3
            className={`text-sm font-bold line-clamp-1 uppercase ${isSold ? "text-zinc-400" : "text-zinc-900"}`}
          >
            {name}
          </h3>
          <p
            className={`text-sm font-black ${isSold ? "text-zinc-400 line-through decoration-zinc-300" : "text-zinc-900"}`}
          >
            KES {price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}

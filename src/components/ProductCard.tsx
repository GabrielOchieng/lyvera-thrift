// interface ProductProps {
//   name: string;
//   price: number;
//   size: string;
//   image: string;
//   isSold?: boolean;
//   categoryName?: string;
// }

// export default function ProductCard({
//   name,
//   price,
//   size,
//   image,
//   isSold,
// }: ProductProps) {
//   return (
//     <div className="group relative flex flex-col gap-3">
//       <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-zinc-900">
//         <img
//           src={image}
//           alt={name}
//           className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSold ? "grayscale opacity-50" : ""}`}
//         />
//         {isSold && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="bg-white text-black px-4 py-1 font-bold uppercase -rotate-12 border-2 border-black">
//               Sold
//             </span>
//           </div>
//         )}
//         <div className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 text-xs rounded-md">
//           Size: {size}
//         </div>
//       </div>
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="font-bold text-lg leading-tight uppercase">{name}</h3>
//           <p className="text-thrift-pink font-mono">KSh {price}</p>
//         </div>
//         <button
//           disabled={isSold}
//           className="bg-white text-black text-xs font-bold px-3 py-2 rounded-full hover:bg-thrift-pink hover:text-white transition disabled:opacity-30"
//         >
//           {isSold ? "N/A" : "ADD"}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "../../store/useCart";

// Update this interface to match your props!
interface ProductCardProps {
  id: string; // Added this
  name: string;
  price: number;
  size: string;
  categoryName: string; // Added this
  image: string;
  isSold: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  size,
  categoryName,
  image,
  isSold,
}: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);
  const cart = useCart((state) => state.cart);
  const isInCart = cart.some((item) => item.id === id);

  const handleAdd = () => {
    if (isSold) return;
    addToCart({ id, name, price, image, size });
  };

  return (
    <div className="group relative flex flex-col gap-3">
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 relative border border-zinc-200">
        <img
          src={image || "https://placehold.co/600x800/png?text=No+Image"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-maroon-primary">
            {categoryName}
          </p>
        </div>

        {/* Hover Add to Cart Button */}
        {!isSold && (
          <button
            onClick={handleAdd}
            className={`absolute bottom-4 left-4 right-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform translate-y-12 group-hover:translate-y-0 shadow-2xl ${
              isInCart
                ? "bg-green-600 text-white"
                : "bg-maroon-primary text-white hover:bg-thrift-gold hover:text-maroon-primary"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {isInCart ? "IN BAG" : "ADD TO BAG"}
          </button>
        )}

        {isSold && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-black italic border-2 border-white px-4 py-1 -rotate-12 tracking-tighter text-xl">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="font-bold text-zinc-900 uppercase tracking-tighter truncate leading-tight">
          {name}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Size {size}
          </p>
          <p className="text-maroon-primary font-black italic tracking-tighter">
            KES {price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

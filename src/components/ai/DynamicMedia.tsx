// "use client";

// import { motion } from "framer-motion";

// interface DynamicMediaProps {
//   product: {
//     images: string[];
//     name: string;
//     videoUrl?: string | null;
//   };
// }

// export default function DynamicMedia({ product }: DynamicMediaProps) {
//   const image = product.images?.[0];

//   // Common wrapper classes to ensure consistency between video and image
//   // aspect-square (1:1) or aspect-video (16:9) are good choices
//   const containerClasses =
//     "relative w-full aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100";

//   if (product.videoUrl) {
//     return (
//       <div className={containerClasses}>
//         <video
//           src={product.videoUrl}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="w-full h-full object-cover"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className={containerClasses}>
//       <motion.img
//         src={image}
//         alt={product.name}
//         className="w-full h-full object-cover"
//         initial={{ scale: 1 }}
//         animate={{ scale: 1.1 }}
//         transition={{
//           duration: 8,
//           ease: "linear",
//           repeat: Infinity,
//           repeatType: "mirror",
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DynamicMediaProps {
  product: {
    images: string[];
    name: string;
    videoUrl?: string | null;
  };
}

export default function DynamicMedia({ product }: DynamicMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasVideo = !!product.videoUrl;

  const containerClasses =
    "relative w-full aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-100 shadow-inner";

  return (
    <div className="flex flex-col gap-4">
      {/* Main Display */}
      <div className={containerClasses}>
        <AnimatePresence mode="wait">
          {hasVideo ? (
            <video
              key="video"
              src={product.videoUrl!}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.img
              key={product.images[activeIndex]}
              src={product.images[activeIndex]}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails - Only show if there's more than one image and no video */}
      {!hasVideo && product.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? "border-maroon-primary scale-95"
                  : "border-transparent opacity-60"
              }`}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt="thumbnail"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

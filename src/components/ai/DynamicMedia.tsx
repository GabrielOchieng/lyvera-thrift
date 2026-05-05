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

//   // If video exists show video
//   if (product.videoUrl) {
//     return (
//       <video
//         src={product.videoUrl}
//         autoPlay
//         muted
//         loop
//         playsInline
//         className="w-full h-full object-cover rounded-2xl"
//       />
//     );
//   }

//   // Otherwise animate the image
//   return (
//     <div className="relative overflow-hidden rounded-2xl">
//       <img
//         src={image}
//         alt={product.name}
//         className="w-full h-full object-cover rounded-2xl"
//       />

//       {/* <motion.img
//         src={image}
//         alt={product.name}
//         className="w-full h-full object-cover"
//         initial={{ scale: 1 }}
//         animate={{ scale: 1.12 }}
//         transition={{
//           duration: 10,
//           ease: "easeInOut",
//           repeat: Infinity,
//           repeatType: "mirror",
//         }}
//       /> */}
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";

interface DynamicMediaProps {
  product: {
    images: string[];
    name: string;
    videoUrl?: string | null;
  };
}

export default function DynamicMedia({ product }: DynamicMediaProps) {
  const image = product.images?.[0];

  // Common wrapper classes to ensure consistency between video and image
  // aspect-square (1:1) or aspect-video (16:9) are good choices
  const containerClasses =
    "relative w-full aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100";

  if (product.videoUrl) {
    return (
      <div className={containerClasses}>
        <video
          src={product.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <motion.img
        src={image}
        alt={product.name}
        className="w-full h-full object-cover"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    </div>
  );
}

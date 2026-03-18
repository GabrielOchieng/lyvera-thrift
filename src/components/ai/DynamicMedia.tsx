// // "use client";
// // import { useState, useEffect } from "react";
// // import { PlayCircle, Loader2 } from "lucide-react";

// // export default function DynamicMedia({ product }: { product: any }) {
// //   const [videoUrl, setVideoUrl] = useState(product.videoUrl);
// //   const [isGenerating, setIsGenerating] = useState(false);

// //   useEffect(() => {
// //     if (!product.videoUrl && !isGenerating) {
// //       handleGenerate();
// //     }
// //   }, []);

// //   const handleGenerate = async () => {
// //     setIsGenerating(true);
// //     const res = await fetch("/api/generate-video", {
// //       method: "POST",
// //       body: JSON.stringify({
// //         productId: product.id,
// //         imageUrl: product.images[0],
// //         productName: product.name,
// //       }),
// //     });
// //     const data = await res.json();
// //     if (data.videoUrl) setVideoUrl(data.videoUrl);
// //     setIsGenerating(false);
// //   };

// //   return (
// //     <div className="flex flex-col gap-6">
// //       <div className="relative aspect-3/4 bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
// //         <img
// //           src={product.images[0]}
// //           className="w-full h-full object-cover"
// //           alt={product.name}
// //         />
// //       </div>

// //       <div className="relative aspect-3/4 bg-black rounded-3xl overflow-hidden border border-zinc-200 shadow-xl flex items-center justify-center">
// //         {videoUrl ? (
// //           <video
// //             src={videoUrl}
// //             autoPlay
// //             loop
// //             muted
// //             playsInline
// //             className="w-full h-full object-cover"
// //           />
// //         ) : (
// //           <div className="flex flex-col items-center gap-3 text-white/50">
// //             <Loader2 className="w-8 h-8 animate-spin text-thrift-gold" />
// //             <p className="text-[10px] font-bold uppercase tracking-widest">
// //               Generating AI Live View...
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { useState, useEffect } from "react";
// import { Loader2, PlayCircle, RefreshCcw } from "lucide-react";

// export default function DynamicMedia({ product }: { product: any }) {
//   const [videoUrl, setVideoUrl] = useState(product.videoUrl);
//   const [status, setStatus] = useState(product.videoUrl ? "ready" : "idle");

//   useEffect(() => {
//     if (!videoUrl && status === "idle") {
//       startGeneration();
//     }
//   }, []);

//   const startGeneration = async () => {
//     setStatus("generating");
//     try {
//       const res = await fetch("/api/generate-video", {
//         method: "POST",
//         body: JSON.stringify({
//           productId: product.id,
//           imageUrl: product.images[0],
//           productName: product.name,
//         }),
//       });

//       const data = await res.json();
//       if (data.videoUrl) {
//         setVideoUrl(data.videoUrl);
//         setStatus("ready");
//       }
//     } catch (err) {
//       console.log(
//         "Request timed out, but generation might still be happening on the server...",
//       );
//       // If it times out, wait 5 seconds and check again
//       setTimeout(pollForVideo, 5000);
//     }
//   };

//   const pollForVideo = async () => {
//     const res = await fetch(`/api/products/${product.id}`); // You'll need a simple GET route for this
//     const data = await res.json();
//     if (data.videoUrl) {
//       setVideoUrl(data.videoUrl);
//       setStatus("ready");
//     } else {
//       setTimeout(pollForVideo, 5000); // Check again in 5 seconds
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="relative aspect-3/4 bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200">
//         <img
//           src={product.images[0]}
//           className="w-full h-full object-cover"
//           alt={product.name}
//         />
//       </div>

//       <div className="relative aspect-3/4 bg-black rounded-3xl overflow-hidden flex items-center justify-center">
//         {status === "ready" ? (
//           <video
//             src={videoUrl}
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900 h-full">
//             <Loader2 className="w-8 h-8 animate-spin text-thrift-gold mb-4" />
//             <p className="text-xs font-bold text-white uppercase tracking-widest">
//               {status === "generating"
//                 ? "AI Tailoring in progress..."
//                 : "Preparing Live View..."}
//             </p>
//           </div>
//         )}
//       </div>
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

  // If video exists show video
  if (product.videoUrl) {
    return (
      <video
        src={product.videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover rounded-2xl"
      />
    );
  }

  // Otherwise animate the image
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <img
        src={image}
        alt={product.name}
        className="w-full h-full object-cover rounded-2xl"
      />

      {/* <motion.img
        src={image}
        alt={product.name}
        className="w-full h-full object-cover"
        initial={{ scale: 1 }}
        animate={{ scale: 1.12 }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      /> */}
    </div>
  );
}

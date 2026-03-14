// "use client";

// import { Share2 } from "lucide-react";

// interface ShareProps {
//   productName: string;
//   productId: string;
// }

// export default function WhatsAppShare({ productName, productId }: ShareProps) {
//   const shareUrl = `${window.location.origin}/shop/${productId}`;

//   const handleShare = () => {
//     const message = `Check out this dope piece I found on Lyvera: ${productName} 🔥\n\nView it here: ${shareUrl}`;
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

//     // Check if the device supports native sharing (better for mobile)
//     if (navigator.share) {
//       navigator
//         .share({
//           title: productName,
//           text: message,
//           url: shareUrl,
//         })
//         .catch(() => window.open(whatsappUrl, "_blank"));
//     } else {
//       window.open(whatsappUrl, "_blank");
//     }
//   };

//   return (
//     <button
//       onClick={handleShare}
//       className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
//     >
//       <Share2 className="w-4 h-4" />
//       Share with a friend
//     </button>
//   );
// }

"use client";

import { Share2 } from "lucide-react";

interface ShareProps {
  productName: string;
  productId: string;
}

export default function WhatsAppShare({ productName, productId }: ShareProps) {
  const handleShare = () => {
    // 1. Setup the link - using window.location.origin to handle localhost or production automatically
    const shareUrl = `${window.location.origin}/shop/${productId}`;

    // 2. The exact message you want
    const message = `Check out this dope piece I found on Lyvera: ${productName} 🔥\n\nView it here: ${shareUrl}`;

    // 3. Encode it and force open WhatsApp directly
    // This bypasses the 'navigator.share' menu which was stripping your text.
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
    >
      <Share2 className="w-4 h-4" />
      Share with a friend
    </button>
  );
}

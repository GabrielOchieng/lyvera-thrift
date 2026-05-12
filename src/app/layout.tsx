// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Analytics } from "@vercel/analytics/next";
// import { Toaster } from "sonner";
// import RecentSoldToast from "@/components/cart/RecentSoldToast";
// import WhatsAppFloat from "@/components/WhatsAppFloat";
// import AIStylist from "@/components/ai/AiStylist";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_APP_URL || "https://www.lyverathrift.boutique",
//   ),
//   title: {
//     default: "Lyvera Thrift | Best Curated Thrift & Vintage in Nairobi",
//     template: "%s | Lyvera Thrift",
//   },
//   description:
//     "Hand-picked 'camera' pieces and one-of-one vintage treasures. Shop curated drops of the finest salvaged silhouettes in Nairobi.",
//   keywords: [
//     "thrift stores in Nairobi",
//     "Kenya vintage clothing",
//     "Nairobi thrift shop",
//     "curated second hand Kenya",
//     "thrifting in Nairobi",
//     "Lyvera Thrift",
//     "authentic vintage Nairobi",
//     "sustainable fashion Kenya",
//   ],
//   authors: [{ name: "Lyvera Thrift" }],
//   creator: "Lyvera Thrift",
//   publisher: "Lyvera Thrift",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_KE", // Keeps the Kenyan locale
//     url: "https://www.lyverathrift.boutique",
//     siteName: "Lyvera Thrift",
//     title: "Lyvera Thrift | Hand-Selected Vintage & Camera Items",
//     description:
//       "Nairobi's home for one-of-one treasures. Shop the latest drop and elevate your style with authenticated vintage.",
//     images: [
//       {
//         url: "/og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Lyvera Thrift - Curated Nairobi Vintage",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Lyvera Thrift | Nairobi's Finest Curation",
//     description:
//       "Hand-picked vintage treasures salvaged for the modern stylist.",
//     images: ["/og-image.jpg"],
//     creator: "@LyveraThrift", // Add your actual X handle if you have one
//   },
//   // Adding icons and theme color for a more polished mobile experience
//   icons: {
//     icon: "/favicon.ico",
//     apple: "/apple-touch-icon.png",
//   },
//   themeColor: "#8b1a4f", // Maroon primary color to match your brand
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//         <RecentSoldToast />
//         {/* <WhatsAppFloat /> */}
//         <AIStylist />
//         <Toaster position="top-center" richColors />
//         <Analytics />
//       </body>
//     </html>
//   );
// }

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import RecentSoldToast from "@/components/cart/RecentSoldToast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AIStylist from "@/components/ai/AiStylist";
import PWAUpdater from "@/components/pwa/Pwa-updater";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#8b1a4f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.lyverathrift.boutique",
  ),
  title: {
    default: "Lyvera Thrift | Best Curated Thrift & Vintage in Nairobi",
    template: "%s | Lyvera Thrift",
  },
  description:
    "Hand-picked 'camera' pieces and one-of-one vintage treasures. Shop curated drops of the finest salvaged silhouettes in Nairobi.",
  keywords: [
    "thrift stores in Nairobi",
    "Kenya vintage clothing",
    "Nairobi thrift shop",
    "curated second hand Kenya",
    "thrifting in Nairobi",
    "Lyvera Thrift",
    "authentic vintage Nairobi",
    "sustainable fashion Kenya",
  ],
  authors: [{ name: "Lyvera Thrift" }],
  creator: "Lyvera Thrift",
  publisher: "Lyvera Thrift",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lyvera Thrift",
    // Link one of the generated splash screens for a professional load
    startupImage: [
      {
        url: "/icons/apple-splash-1179-2556.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://www.lyverathrift.boutique",
    siteName: "Lyvera Thrift",
    title: "Lyvera Thrift | Hand-Selected Vintage & Camera Items",
    description:
      "Nairobi's home for one-of-one treasures. Shop the latest drop and elevate your style with authenticated vintage.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lyvera Thrift - Curated Nairobi Vintage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyvera Thrift | Nairobi's Finest Curation",
    description:
      "Hand-picked vintage treasures salvaged for the modern stylist.",
    images: ["/og-image.png"],
    creator: "@LyveraThrift",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-icon-180.png", // Fixed path to match your sidebar
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <RecentSoldToast />
        {/* <WhatsAppFloat /> */}
        <AIStylist />
        <Toaster position="top-center" richColors />
        <PWAUpdater />
        <Analytics />
      </body>
    </html>
  );
}

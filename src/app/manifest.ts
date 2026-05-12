import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lyvera Thrift",
    short_name: "Lyvera",
    description: "Premium curated thrift store in Nairobi",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F4F6",
    theme_color: "#8b1a4f",
    icons: [
      {
        src: "/icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", // Good for Android shapes
      },
      {
        src: "/icons/manifest-icon-192.maskable.png", // Reuse the same file
        sizes: "192x192",
        type: "image/png",
        purpose: "any", // CRUCIAL: Browser needs this for "Installability"
      },
      {
        src: "/icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any", // CRUCIAL
      },
    ],
    screenshots: [
      {
        src: "/og-image.png", // You can use your OG image for now
        sizes: "1200x630",
        type: "image/jpeg",
        form_factor: "wide", // Fixes the "desktop" warning
        label: "Lyvera Thrift Home Screen",
      },
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/jpeg",
        form_factor: "narrow", // Fixes the "mobile" warning
        label: "Lyvera Thrift Mobile View",
      },
    ],
  };
}

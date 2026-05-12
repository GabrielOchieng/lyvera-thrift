import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lyvera Thrift",
    short_name: "Lyvera",
    description: "Premium curated thrift store in Nairobi",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F4F6", // Your Cool Gray
    theme_color: "#8B0000", // Your Maroon Primary
    icons: [
      {
        // Updated to match your sidebar: manifest-icon-192.maskable.png
        src: "/icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        // Updated to match your sidebar: manifest-icon-512.maskable.png
        src: "/icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

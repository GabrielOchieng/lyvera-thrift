// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**", // This allows all images from your Cloudinary account
//       },
//     ],
//   },
// };

// export default nextConfig;

import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

// 1. Initialize Serwist
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts", // This is the source file we created earlier
  swDest: "public/sw.js", // The destination for the generated worker
  disable: process.env.NODE_ENV === "development",
  // This ensures your Cloudinary images aren't aggressively
  // cached by the service worker unless you explicitly want them to be.
});

// 2. Wrap and export your config
export default withSerwist(nextConfig);

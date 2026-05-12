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
  // Option 1: Force bypass the type check for the build engine
  experimental: {
    ...({ turbo: {} } as any),
  },

  // Option 2: Some Next 16 builds look for this at the top level
  // turbopack: {},

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

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Ensure this is set so dev mode doesn't crash your local Turbopack
  disable: process.env.NODE_ENV !== "production",
});

export default withSerwist(nextConfig);

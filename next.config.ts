// import withSerwistInit from "@serwist/next";
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**",
//       },
//     ],
//   },
//   // 1. Add this webpack function to force Next.js to use Webpack instead of Turbo
//   webpack: (config) => {
//     return config;
//   },
// };

// const withSerwist = withSerwistInit({
//   swSrc: "src/app/sw.ts",
//   swDest: "public/sw.js",
//   // 2. Ensure this is false or check your Vercel logs to confirm production mode
//   disable: process.env.NODE_ENV !== "production",
//   additionalPrecacheEntries: ["/~offline"],
// });

// export default withSerwist(nextConfig);

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
  // 1. Add this webpack function to force Next.js to use Webpack instead of Turbo
  webpack: (config) => {
    return config;
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // 2. Ensure this is false or check your Vercel logs to confirm production mode
  disable: process.env.NODE_ENV !== "production",

  // FIX: Provide the revision info object here instead of a plain string
  additionalPrecacheEntries: [
    {
      url: "/~offline",
      // Vercel automatically exposes the git commit SHA during builds.
      // If it's not available (like in a local production build), it falls back to a timestamp.
      revision: process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(),
    },
  ],
});

export default withSerwist(nextConfig);

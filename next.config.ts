// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// //   images: {
// //     remotePatterns: [
// //       {
// //         protocol: "https",
// //         hostname: "res.cloudinary.com",
// //         pathname: "/**", // This allows all images from your Cloudinary account
// //       },
// //     ],
// //   },
// // };

// // export default nextConfig;
// import withSerwistInit from "@serwist/next";
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // Move it out of experimental and place it at the top level
//   // Use 'as any' to bypass the TypeScript interface check
//   ...({ turbopack: {} } as any),

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// const withSerwist = withSerwistInit({
//   swSrc: "src/app/sw.ts",
//   swDest: "public/sw.js",
//   disable: process.env.NODE_ENV !== "production",
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
});

export default withSerwist(nextConfig);

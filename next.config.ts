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
  additionalPrecacheEntries: ["/~offline"],
});

export default withSerwist(nextConfig);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    // Only use unoptimized for development
    unoptimized: process.env.NODE_ENV === "development",
  },
  // Optimizations for Vercel deployment
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Remove output: 'standalone' for Vercel deployment
  swcMinify: true,
};

export default nextConfig;

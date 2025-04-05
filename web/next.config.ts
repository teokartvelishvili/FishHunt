import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    // Removed the deprecated option 'serverComponentsExternalPackages'
  },
  // Added the new location for server external packages
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    // Add unoptimized option for local development
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Add these settings to fix the prerendering issues
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  distDir: '.next',
};

export default nextConfig;

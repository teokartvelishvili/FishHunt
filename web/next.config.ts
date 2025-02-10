import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@apps/shared"],
  experimental: {
    externalDir: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'lh3.googleusercontent.com', // Google-ის ავატარებისთვის
      'avatars.githubusercontent.com', // GitHub-ის ავატარებისთვის
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

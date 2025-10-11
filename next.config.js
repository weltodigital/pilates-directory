/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force CSS optimization for Vercel
  experimental: {
    forceSwcTransforms: true,
    turbotrace: {},
  },
  // Force fresh deployment - cache buster
  generateBuildId: () => {
    return 'pilates-' + Date.now()
  },
  // Ensure CSS is processed correctly
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'koqqkpitepqwlfjymcje.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig

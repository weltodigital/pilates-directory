/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force CSS compilation and optimization
  experimental: {
    forceSwcTransforms: true,
  },
  // Force fresh deployment
  generateBuildId: () => {
    return 'pilates-css-' + Date.now()
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
        hostname: 'zytpgaraxyhlsvvkrrir.supabase.co',
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
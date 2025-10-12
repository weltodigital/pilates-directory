/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: false,
  },
  // Force fresh deployment for CSS
  generateBuildId: () => {
    return 'pilates-ultra-force-' + Date.now()
  },
  experimental: {
    optimizeCss: false,
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
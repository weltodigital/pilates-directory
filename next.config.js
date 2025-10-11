/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force fresh deployment for CSS
  generateBuildId: () => {
    return 'pilates-force-css-' + Date.now()
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
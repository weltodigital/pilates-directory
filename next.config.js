/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force CSS compilation and optimization
  experimental: {
    forceSwcTransforms: true,
    optimizeCss: true,
  },
  // Force fresh deployment
  generateBuildId: () => {
    return 'pilates-css-' + Date.now()
  },
  // Ensure CSS is processed correctly
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, path: false };

    // Force CSS processing
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        type: 'css/mini-extract',
        chunks: 'all',
        enforce: true,
      };
    }

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
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  output: 'standalone',
  
  // Enable Turbopack (stable in Next.js 15)
  turbopack: {
    // No custom rules needed for basic TypeScript support
  },
  
  // ESLint configuration
  eslint: {
    // Disable ESLint during builds to avoid warnings from unused parameters in utility functions
    ignoreDuringBuilds: true,
  },
  
  // Image optimization
  images: {
    domains: ['i.scdn.co', 'mosaic.scdn.co'], // Spotify image domains
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // Power optimization
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Webpack optimization (only for production builds without Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Only optimize in production builds
    if (!dev && !isServer && !process.env.TURBOPACK) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|framer-motion)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;

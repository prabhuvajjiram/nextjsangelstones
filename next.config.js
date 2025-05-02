/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false  // Add this line to prevent auto-opening
});

const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable production optimizations
  compiler: {
    // Remove console.* in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    // Enable React optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Enable image optimization
  images: {
    // Replace domains with remotePatterns
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'angelgranites.com',
      }
    ],
    // Larger image sizes for product showcase
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Smaller image sizes for thumbnails and icons
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Optimize formats
    formats: ['image/webp'],
  },
  
  // Enable performance optimizations
  experimental: {
    // Enable newer React optimizations
    optimizeCss: true,
    // Improve bundle sizes
    optimizePackageImports: ['@headlessui/react'],
  },
  
  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets for better performance
        source: '/(.*).(jpg|jpeg|png|webp|svg|ico|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Configure redirects for legacy URLs if needed
  async redirects() {
    return [];
  },

  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Only run in production builds
    if (!dev) {
      // Split large chunks for better loading
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }

    return config;
  },
  
  // Enable HTTP/2
  poweredByHeader: false,
  
  // Output optimizations
  output: 'standalone',
};

module.exports = withBundleAnalyzer(nextConfig);

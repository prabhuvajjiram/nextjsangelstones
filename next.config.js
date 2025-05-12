/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false
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
  
  // Enable image optimization with proper configuration
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/_next/**',
      },
      {
        protocol: 'https',
        hostname: 'angelgranites.com',
        pathname: '/**',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  },
  
  // Enable performance optimizations
  experimental: {
    // Enable newer React optimizations
    optimizePackageImports: ['@headlessui/react']
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

  webpack(config, { dev, isServer }) {
    // Add optimization for third-party modules
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    // Add proper module resolution
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    };

    // Using Next.js built-in image optimization instead of image-webpack-loader

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
  
  // Remove standalone output to allow using next start
  // output: 'standalone',
};

module.exports = withBundleAnalyzer(nextConfig);

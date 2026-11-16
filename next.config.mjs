/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features
  experimental: {
    // Enable server actions for future versions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "prnt.sc",
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_OMS_URL: process.env.NEXT_PUBLIC_OMS_URL,
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // OMS ব্যাকএন্ডে same-origin proxy (CORS লাগে না; customer httpOnly cookie ShopBD ডোমেইনেই সেট হয়)।
  //   OMS_API_ORIGIN = OMS সার্ভারের অরিজিন (সার্ভার-সাইড env, ব্রাউজারে যায় না), যেমন https://oms.example.com
  // শুধু ecommerce API ও অ্যাডমিন লগইন proxy হয় — OMS-এর বাকি API এই ডোমেইনে উন্মুক্ত নয়।
  async rewrites() {
    const origin = (process.env.OMS_API_ORIGIN || 'http://localhost:5000').replace(/\/$/, '');
    return [
      { source: '/api/ecommerce/:path*', destination: `${origin}/api/ecommerce/:path*` },
      { source: '/api/admin-auth/login', destination: `${origin}/api/auth/login` },
    ];
  },

  // Redirects
  async redirects() {
    return [];
  },
};

export default nextConfig;

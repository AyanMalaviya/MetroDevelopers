import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from external domains used in the app
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
  // Turbopack is now stable in Next.js 15/16 — enabled via CLI flag (next dev --turbopack)
  // No config needed here; turbopack is opt-in via CLI only.

  // Strip x-powered-by header for security
  poweredByHeader: false,

  // Trailing slash consistent with SEO canonical strategy
  trailingSlash: false,
};

export default nextConfig;

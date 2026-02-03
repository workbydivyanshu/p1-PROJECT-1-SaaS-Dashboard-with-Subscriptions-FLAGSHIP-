import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles output automatically, no need for standalone
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

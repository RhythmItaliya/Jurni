import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  images: {
    // Allow optimized loading of remote images used in website pages/components
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adventor.wpengine.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'html-templates.evonicmedia.com',
        pathname: '/adventurist/assets/images/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

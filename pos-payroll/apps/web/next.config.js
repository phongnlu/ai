const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', 'tamagui', '@tamagui/core', '@tamagui/config'],
  experimental: {
    optimizePackageImports: ['@tamagui/core'],
  },
  // Standalone output for Docker — only active during `next build` in CI
  ...(process.env.NEXT_BUILD_STANDALONE === 'true' && {
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }),
};

module.exports = nextConfig;

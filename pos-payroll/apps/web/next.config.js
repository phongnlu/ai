/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', 'tamagui', '@tamagui/core', '@tamagui/config'],
  experimental: {
    optimizePackageImports: ['@tamagui/core'],
  },
};

module.exports = nextConfig;

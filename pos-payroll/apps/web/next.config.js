const { withTamagui } = require('@tamagui/next-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', 'tamagui', '@tamagui/core', '@tamagui/config'],
  experimental: {
    optimizePackageImports: ['@tamagui/core'],
  },
};

module.exports = withTamagui({
  config: './src/tamagui.config.ts',
  components: ['@repo/ui', 'tamagui'],
})(nextConfig);

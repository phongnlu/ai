/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  webpack(config, { nextRuntime }) {
    // instrumentation.ts is compiled for both nodejs and edge runtimes.
    // Stub out Node.js built-ins so the edge/browser bundles don't fail at
    // build time. The runtime guard (NEXT_RUNTIME !== 'nodejs') ensures these
    // code paths never actually execute outside Node.
    if (nextRuntime !== 'nodejs') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        http: false,
        https: false,
        timers: false,
        child_process: false,
        os: false,
        net: false,
        tls: false,
        stream: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

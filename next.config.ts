import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_DISCORD_INVITE_URL:
      process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ||
      process.env.DISCORD_INVITE_URL ||
      process.env.DISCORD_INVITE_LINK ||
      '',
    NEXT_PUBLIC_TELEGRAM_INVITE_URL:
      process.env.NEXT_PUBLIC_TELEGRAM_INVITE_URL ||
      process.env.TELEGRAM_INVITE_URL ||
      process.env.TELEGRAM_INVITE_LINK ||
      '',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder and TMDB images.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.tmdb.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'themoviedb.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;

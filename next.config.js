/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // App Routerを無効化し、Pages Routerのみを使用
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig
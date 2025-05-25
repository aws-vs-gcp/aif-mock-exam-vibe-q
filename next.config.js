/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // App Routerを無効化し、Pages Routerのみを使用
  experimental: {
    appDir: false,
  },
  // GitHub Pagesの設定
  basePath: process.env.NODE_ENV === 'production' ? '/aif-mock-exam-vibe-q' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aif-mock-exam-vibe-q/' : '',
  images: {
    unoptimized: true,
  },
  output: 'export',
}

module.exports = nextConfig
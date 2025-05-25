/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // GitHub Pagesの設定
  basePath: process.env.NODE_ENV === 'production' ? '/aif-mock-exam-vibe-q' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aif-mock-exam-vibe-q/' : '',
  images: {
    unoptimized: true,
  },
  // srcディレクトリを使用
  distDir: '.next',
}

module.exports = nextConfig
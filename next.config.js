/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // srcディレクトリを使用
  distDir: '.next',
}

module.exports = nextConfig
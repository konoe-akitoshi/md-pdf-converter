import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel環境変数の設定
  env: {
    // Vercel環境でPuppeteerを使用するための設定
    PUPPETEER_CACHE_DIR: '/tmp/.cache/puppeteer',
    PUPPETEER_EXECUTABLE_PATH: '/tmp/.cache/puppeteer/chrome/linux-136.0.7103.92/chrome-linux64/chrome',
  },
  // Webpackの設定を簡素化
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;

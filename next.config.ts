import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel環境変数の設定
  env: {
    // Vercel環境でPuppeteerを使用するための設定
    PUPPETEER_CACHE_DIR: '/tmp/puppeteer-cache',
  },
};

export default nextConfig;

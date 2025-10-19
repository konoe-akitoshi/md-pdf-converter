import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発環境でのクロスオリジンリクエストを許可
  allowedDevOrigins: [
    'http://192.168.100.18:3000',
    'http://localhost:3000',
  ],
  // Vercel環境変数の設定
  env: {
    // Vercel環境でPuppeteerを使用するための設定
    PUPPETEER_CACHE_DIR: '/tmp/.cache/puppeteer',
    // 複数の可能性のあるパスを試すため、executablePathは指定しない
    PUPPETEER_SKIP_DOWNLOAD: 'false',
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'false',
  },
  // Webpackの設定を簡素化
  webpack: (config) => {
    return config;
  },
  // ESLintの設定
  eslint: {
    // ビルド時のESLintチェックを無効化
    ignoreDuringBuilds: true,
  },
  // TypeScriptの設定
  typescript: {
    // ビルド時のTypeScriptチェックを無効化
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

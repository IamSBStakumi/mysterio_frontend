import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // クリックジャッキング対策
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()", // 不要な権限の制限 カメラ、マイク、位置情報を無効化
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // リファラ(参照元URL)の送信ポリシーを制御
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload", // HTTPS強制
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block", // XSS対策
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // MIMEタイプのスニッフィング対策 例: スクリプトファイルが画像ファイルとして解釈されるのを防ぐ
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              connect-src 'self' ;
              script-src 'self' 'unsafe-inline';
              frame-src 'self';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data:;
              font-src 'self';
              object-src 'none';
              frame-ancestors 'none';
            `
              .replace(/\s{2,}/g, " ")
              .trim(), // コンテンツセキュリティポリシーの設定
          },
        ],
      },
    ];
  },
};

export default nextConfig;

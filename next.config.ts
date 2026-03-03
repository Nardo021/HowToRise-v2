import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    formats: ["image/webp"]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb"
    }
  },
  async redirects() {
    return [
      {
        source: "/tutorials/zh/:slug.md",
        destination: "/zh/tutorials/:slug",
        permanent: true
      },
      {
        source: "/tutorials/:slug.md",
        destination: "/en/tutorials/:slug",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(zh|en)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=86400"
          }
        ]
      }
    ];
  }
};

export default nextConfig;

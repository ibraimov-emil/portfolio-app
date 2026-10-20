import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "strapi-back-emilibramovich.waw0.amvera.tech",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "portfolio-app-one-rouge.vercel.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
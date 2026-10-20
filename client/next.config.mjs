/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "strapi-back-emilibramovich.waw0.amvera.tech",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cv-emil.vercel.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

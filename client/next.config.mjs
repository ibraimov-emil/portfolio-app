/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        dangerouslyAllowLocalIP: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/uploads/**',
            },
        ],
    },
    turbopack: {
        resolveAlias: {
            fs: {
                browser: "./empty.ts", // We recommend to fix code imports before using this method
            },
        },
    },
};

export default nextConfig;

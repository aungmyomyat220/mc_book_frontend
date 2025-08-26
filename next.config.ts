import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'myanmar-comic-1.s3.ap-southeast-1.amazonaws.com',
            port: '',
            pathname: '/**',
        },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};
export default nextConfig;

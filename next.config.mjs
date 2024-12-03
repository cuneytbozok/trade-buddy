/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for additional warnings
    reactStrictMode: true,

    // Optimize images for faster load times
    images: {
        domains: process.env.NEXT_APP_IMAGES_DOMAIN
            ? process.env.NEXT_APP_IMAGES_DOMAIN.split(',')
            : [], // Read domains from environment variable
    },

    // Configure environment variables
    env: {
        JWT_SECRET: process.env.JWT_SECRET,
        MONGO_URI: process.env.MONGO_URI,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_APP_DOMAIN: process.env.NEXT_APP_DOMAIN,
        NEXT_APP_IMAGES_DOMAIN: process.env.NEXT_APP_IMAGES_DOMAIN
    },

    // Add server-side headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
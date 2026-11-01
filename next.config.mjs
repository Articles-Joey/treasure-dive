import path from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    reactCompiler: true,
    // Only needed when using Turbopack when using linked packages like '@articles-media/articles-dev-box' as opposed to installed from npm
    turbopack: {
        // Common parent containing both school-run and articles-dev-box
        // root: path.resolve(configDirectory, "..", ".."),
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.articles.media",
                port: "",
            },
            {
                protocol: "https",
                hostname: "articles-website.s3.amazonaws.com",
                port: "",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

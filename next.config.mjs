import "dotenv/config";

import "@shopify/shopify-api/adapters/node";
import setupCheck from "./dist/utils/setup/setupValidator.js";

setupCheck();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CONFIG_SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    CONFIG_SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
    ENCRYPTION_STRING: process.env.ENCRYPTION_STRING,
    BOT_TOKEN: process.env.BOT_TOKEN,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    TOKEN: process.env.TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.referrd.com.au",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "2fe5-79-117-226-83.ngrok-free.app",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Adjust the source path as needed
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL", // Allow the page to be framed from any origin
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;", // Allow framing from any origin
          },
        ],
      },
    ];
  },
};

export default nextConfig;

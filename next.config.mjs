import "dotenv/config";

import "@shopify/shopify-api/adapters/node";
import setupCheck from "./dist/utils/setup/setupValidator.js";

setupCheck();

console.log(`--> Running in ${process.env.NODE_ENV} mode`);
console.log(`ENCRYPTION_STRING: ${process.env.ENCRYPTION_STRING}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CONFIG_SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    CONFIG_SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
    ENCRYPTION_STRING: process.env.ENCRYPTION_STRING,
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
};

export default nextConfig;

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
};

export default nextConfig;

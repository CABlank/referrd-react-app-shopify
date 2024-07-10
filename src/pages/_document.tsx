/**
 * This file defines a custom Document for a Next.js application.
 * It includes necessary scripts and meta tags for the application.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required components from Next.js.
 * 2. Defines the Custom Document Component: It defines the `Document` component to structure the HTML document.
 * 3. Includes Shopify App Bridge Script: It includes a script for Shopify App Bridge using the API key from environment variables.
 * 4. Exports the Custom Document Component: Finally, it exports the `Document` component for use in the application.
 */

import React from "react"; // Import React
import { Head, Html, Main, NextScript } from "next/document"; // Import components from Next.js

/**
 * Custom Document component for the Next.js application.
 *
 * @function Document
 * @returns {JSX.Element} The rendered component.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          src={`https://cdn.shopify.com/shopifycloud/app-bridge.js?apiKey=${process.env.CONFIG_SHOPIFY_API_KEY}`}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

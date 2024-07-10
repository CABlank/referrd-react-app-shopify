/**
 * This file defines the custom App component for a Next.js application.
 * It integrates the Shopify Polaris design system and AppBridge provider to manage app-wide state and functionality.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as global styles, types from Next.js, Polaris components, and AppBridge provider.
 * 2. Defines the Custom App Component: It defines the `MyApp` component which wraps the application with necessary providers.
 * 3. Integrates Polaris and AppBridge Providers: It uses PolarisProvider to provide Polaris components with translations, and AppBridgeProviderComponent to manage Shopify AppBridge.
 * 4. Renders the Component: It renders the Next.js component with pageProps within the providers.
 * 5. Exports the Custom App Component: Finally, it exports the `MyApp` component for use in the application.
 */

import "../styles/globals.css"; // Import global styles
import type { AppProps } from "next/app"; // Import types from Next.js
import { AppProvider as PolarisProvider } from "@shopify/polaris"; // Import Polaris AppProvider
import AppBridgeProviderComponent from "./components/providers/AppBridgeProvider"; // Import custom AppBridgeProvider component
import enTranslations from "@shopify/polaris/locales/en.json"; // Import English translations for Polaris

/**
 * Custom App component for the Next.js application.
 *
 * @function MyApp
 * @param {AppProps} props - The properties passed to the App component.
 * @returns {JSX.Element} The rendered component.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PolarisProvider i18n={enTranslations}>
      <AppBridgeProviderComponent>
        <Component {...pageProps} />
      </AppBridgeProviderComponent>
    </PolarisProvider>
  );
}

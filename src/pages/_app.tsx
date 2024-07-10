/**
 * This file defines the custom App component for a Next.js application.
 * It integrates the Shopify Polaris design system, AppBridge provider, and additional global styles.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required components from Polaris, hooks from React and Next.js, and global styles.
 * 2. Extends JSX Intrinsic Elements: It extends JSX intrinsic elements for custom HTML elements.
 * 3. Defines the Custom App Component: It defines the `MyApp` component which wraps the application with necessary providers.
 * 4. Fetches Initial Props: It defines a static method to fetch initial props for the app.
 * 5. Renders the Component: It renders the Next.js component with pageProps within the providers.
 * 6. Exports the Custom App Component: Finally, it exports the `MyApp` component for use in the application.
 */

import AppBridgeProvider from "../components/providers/AppBridgeProvider"; // Import custom AppBridgeProvider component
import { AppProvider as PolarisProvider } from "@shopify/polaris"; // Import Polaris AppProvider
import "@shopify/polaris/build/esm/styles.css"; // Import Polaris styles
import translations from "@shopify/polaris/locales/en.json"; // Import English translations for Polaris
import Link from "next/link"; // Import Link component from Next.js
import App, { AppProps, AppContext } from "next/app"; // Import App component and types from Next.js
import Head from "next/head"; // Import Head component from Next.js
import React from "react"; // Import React

// Extend JSX IntrinsicElements for the ui-nav-menu element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ui-nav-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

/**
 * Custom App component for the Next.js application.
 *
 * @class MyApp
 * @extends {App<AppProps>}
 */
class MyApp extends App<AppProps> {
  /**
   * Fetches initial props for the App component.
   *
   * @static
   * @async
   * @function getInitialProps
   * @param {AppContext} appContext - The application context.
   * @returns {Promise<any>} The initial props for the app.
   */
  static async getInitialProps(appContext: AppContext) {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
  }

  /**
   * Renders the App component.
   *
   * @function render
   * @returns {JSX.Element} The rendered component.
   */
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
            rel="stylesheet"
          />
        </Head>
        <PolarisProvider i18n={translations}>
          <AppBridgeProvider>
            <ui-nav-menu>
              <Link href="/" rel="home">
                Home
              </Link>
              <Link href="/admin">Debug Cards</Link>
              <Link href="/templates">Templates</Link>
              <Link href="/settings">Settings</Link>
            </ui-nav-menu>
            <Component {...pageProps} />
          </AppBridgeProvider>
        </PolarisProvider>
      </>
    );
  }
}

export default MyApp; // Export the MyApp component

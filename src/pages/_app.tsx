import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider, AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import App, { AppProps, AppContext } from "next/app";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "../contexts/SessionContext";
import "../styles/globals.css";
import BrandLayout from "./layouts/BrandLayout";
import LoadingOverlay from "../components/common/LoadingOverlay";

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
    try {
      const appProps = await App.getInitialProps(appContext);

      // Retrieve shop and host from the query parameters if available
      const { ctx } = appContext;
      const { shop, host } = ctx.query;

      return { ...appProps, pageProps: { ...appProps.pageProps, shop, host } };
    } catch (error) {
      console.error("Error in getInitialProps:", error);
      return { pageProps: {} }; // Return an empty pageProps object to avoid breaking the app
    }
  }

  /**
   * Checks if the app is running inside Shopify.
   *
   * @function isShopify
   * @returns {boolean} True if running inside Shopify, false otherwise.
   */
  isShopify() {
    const { pageProps } = this.props;
    // Ensure both 'shop' and 'host' are string types to avoid falsy values such as empty strings
    return (
      (typeof pageProps.shop === "string" && pageProps.shop.length > 0) ||
      (typeof pageProps.host === "string" && pageProps.host.length > 0)
    );
  }

  /**
   * Renders the App component.
   *
   * @function render
   * @returns {JSX.Element} The rendered component.
   */
  render() {
    const { Component, pageProps } = this.props;
    const isShopify = this.isShopify();

    return (
      <SessionProvider>
        <ContentWrapper
          isShopify={isShopify}
          Component={Component}
          pageProps={pageProps}
        />
      </SessionProvider>
    );
  }
}

const ContentWrapper: React.FC<{
  isShopify: boolean;
  Component: React.ComponentType<any> & { noLayout?: boolean };
  pageProps: any;
}> = ({ isShopify, Component, pageProps }) => {
  const { session, loading } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setPageLoading(true);
    const handleComplete = () => setPageLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  useEffect(() => {
    if (!loading && session && session.user.role === "Brand") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [loading, session]);

  if (loading || pageLoading) {
    return <LoadingOverlay />;
  }

  if (isShopify) {
    return (
      <AppProvider i18n={translations}>
        <PolarisProvider i18n={translations}>
          <AppBridgeProvider>
            <ui-nav-menu>
              <Link href="/" rel="home">
                Home
              </Link>
              <Link href="/brand/dashboard">Dashboard</Link>
              <Link href="/brand/campaigns">Campaigns</Link>
              <Link href="/brand/support">Support</Link>
              <Link href="/brand/referrals">Referrals</Link>
              <Link href="/brand/settings">Settings</Link>
              <Link href="/brand/payments">Payments</Link>
              <Link href="/brand/faqs">FAQS</Link>
            </ui-nav-menu>
            <div className="flex-1 overflow-y-auto">
              <main className="p-12">
                <Component {...pageProps} />
              </main>
            </div>
          </AppBridgeProvider>
        </PolarisProvider>
      </AppProvider>
    );
  } else if (Component.noLayout) {
    // If the page has noLayout property, render the component directly
    return <Component {...pageProps} />;
  } else {
    return isAuthenticated ? (
      <BrandLayout>
        <Component {...pageProps} />
      </BrandLayout>
    ) : (
      <Component {...pageProps} />
    );
  }
};

export default MyApp;

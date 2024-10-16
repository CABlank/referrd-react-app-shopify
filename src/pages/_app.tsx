import { AppProvider as PolarisProvider, Button, Box, Page, LegacyCard } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import App, { AppProps, AppContext } from "next/app";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "../context/SessionContext";
import "../styles/globals.css";
import BrandLayout from "./layouts/BrandLayout/BrandLayout";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Link from "next/link";
import createApp from "@shopify/app-bridge";
import cookies from "js-cookie";

declare global {
  interface Window {
    shopify: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ui-nav-menu": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const SHOPIFY_APP_URL = process.env.CONFIG_SHOPIFY_APP_URL as string;

class MyApp extends App<AppProps> {
  static async getInitialProps(appContext: AppContext) {
    try {
      const appProps = await App.getInitialProps(appContext);
      const { ctx } = appContext;
      const { shop, host, id_token: idToken } = ctx.query;

      return {
        ...appProps,
        pageProps: { ...appProps.pageProps, shop, host, idToken },
      };
    } catch (error) {
      console.error("Error in getInitialProps:", error);
      return { pageProps: {} };
    }
  }

  isShopify() {
    const { pageProps } = this.props;
    return (
      (typeof pageProps.shop === "string" && pageProps.shop.length > 0) ||
      (typeof pageProps.host === "string" && pageProps.host.length > 0)
    );
  }

  render() {
    const { Component, pageProps } = this.props;
    const isShopify = this.isShopify();

    return (
      <PolarisProvider i18n={translations}>
        <SessionProvider>
          <ContentWrapper isShopify={isShopify} Component={Component} pageProps={pageProps} />
        </SessionProvider>
      </PolarisProvider>
    );
  }
}

const ContentWrapper: React.FC<{
  isShopify: boolean;
  Component: React.ComponentType<any> & { noLayout?: boolean };
  pageProps: any;
}> = ({ isShopify, Component, pageProps }) => {
  const { session, loading } = useSession();
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();
  const [redirected, setRedirected] = useState(false); // Prevent multiple redirects

  // Log whenever the session is updated
  useEffect(() => {
    if (session) {
      // Redirect to the Referrd app if the session is defined
      // setting the cookies
      // Set cookies with SameSite=None and Secure=true for cross-site requests
      cookies.set("accessToken", session.accessToken, {
        sameSite: "None",
        secure: true,
      });

      cookies.set("refreshToken", session.refreshToken, {
        sameSite: "None",
        secure: true,
      });

      cookies.set("sessionAccessTokenExpiresAt", session.sessionAccessTokenExpiresAt, {
        sameSite: "None",
        secure: true,
      });
    }
  }, [session]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!loading) {
          setSessionChecked(true);
        }
      } catch (error) {
        console.error("Error during session check:", error);
      }
    };

    checkSession();
  }, [loading]);

  const isBrandRoute = router.pathname.startsWith("/brand");

  // Initialize Shopify App Bridge
  useEffect(() => {
    if (isShopify && pageProps.shop && pageProps.host) {
      const app = createApp({
        apiKey: process.env.CONFIG_SHOPIFY_API_KEY as string,
        host: pageProps.host,
      });
      window.shopify = app;
    }
  }, [isShopify, pageProps.shop, pageProps.host]);

  if (loading || !sessionChecked) {
    return <LoadingOverlay />;
  }

  // Function to append session data to URLs
  const createLinkWithSession = (path: string) => {
    const url = new URL(path, window.location.href);
    if (pageProps.shop) url.searchParams.set("shop", pageProps.shop);
    if (pageProps.idToken) url.searchParams.set("id_token", pageProps.idToken);

    if (session) {
      url.searchParams.set("accessToken", session.accessToken);
      url.searchParams.set("refreshToken", session.refreshToken);
      url.searchParams.set("sessionAccessTokenExpiresAt", session.sessionAccessTokenExpiresAt);
      url.searchParams.set("userId", session.user?.id?.toString() || "");
      url.searchParams.set("expires", session.expires.toString());
    }

    return url.toString();
  };

  // Function to handle redirection based on the platform (Shopify or external)
  const handleRedirect = () => {
    const targetUrl = createLinkWithSession(`${SHOPIFY_APP_URL}`);

    window.open(targetUrl, "_blank");
  };

  if (isShopify) {
    return (
      <>
        <ui-nav-menu style={{ display: "none" }}>
          <Link href={createLinkWithSession("/brand/campaigns")}>Campaigns</Link>
          <Link href={createLinkWithSession("/brand/referrals")}>Referrals</Link>
          <Link href={createLinkWithSession("/brand/settings")}>Settings</Link>
          <Link href={createLinkWithSession("/brand/payments")}>Payments</Link>
          <Link href={createLinkWithSession("/brand/support")}>Support</Link>
        </ui-nav-menu>
        <div className="flex-1 overflow-y-auto" style={{ position: "relative" }}>
          <main className="">
            {/* Removed HOLA and replaced it with a button */}
            <Box position="absolute" insetInlineEnd="0" padding="400">
              <Button onClick={handleRedirect}>Go to Referrd App</Button>
            </Box>
            {/* Add margin to separate the button from the component */}
            <Box padding="1600">
              <Component {...pageProps} />
            </Box>
          </main>
        </div>
      </>
    );
  } else if (Component.noLayout) {
    return <Component {...pageProps} />;
  } else {
    return isBrandRoute ? (
      <BrandLayout title={pageProps.title}>
        <Component {...pageProps} />
      </BrandLayout>
    ) : (
      <Component {...pageProps} />
    );
  }
};

export default MyApp;

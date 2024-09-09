import { AppProvider as PolarisProvider } from "@shopify/polaris";
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

declare global {
  interface Window {
    shopify: any;
  }
}

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
          <ContentWrapper
            isShopify={isShopify}
            Component={Component}
            pageProps={pageProps}
          />
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
  const [redirected, setRedirected] = useState(false); // Prevent multiple redirects
  const router = useRouter();

  // Log whenever the session is updated
  useEffect(() => {
    if (session) {
      console.log("Session has been defined with new information:", session);
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

  useEffect(() => {
    if (!sessionChecked) return; // Only proceed if the session has been checked

    if (session && router.pathname === "/login") {
      const userRole = session?.user?.role;

      console.log("User role detected:", userRole);

      // Redirect based on user role
      if (userRole === "Brand") {
        router.replace("/brand/dashboard");
      } else if (userRole === "Customer") {
        console.log("Redirecting to /customer/dashboard");
        router.replace("/customer/dashboard");
      } else {
        router.replace("/"); // Fallback for unknown roles
      }
    } else if (!session && router.pathname.startsWith("/brand")) {
    }
  }, [sessionChecked, session, router]);

  // Initialize App Bridge and trigger actions
  useEffect(() => {
    if (isShopify && pageProps.shop && pageProps.host) {
      const app = createApp({
        apiKey: process.env.CONFIG_SHOPIFY_API_KEY as string,
        host: pageProps.host, // Use `host` instead of `shopOrigin`
      });

      // Attach app instance to window for debugging if needed
      window.shopify = app;
    }
  }, [isShopify, pageProps.shop, pageProps.host]);

  if (loading || !sessionChecked) {
    return <LoadingOverlay />;
  }

  const isBrandRoute = router.pathname.startsWith("/brand");

  // Function to append session data to URLs
  const createLinkWithSession = (path: string) => {
    const url = new URL(path, window.location.href);
    if (pageProps.shop) url.searchParams.set("shop", pageProps.shop);
    if (pageProps.idToken) url.searchParams.set("id_token", pageProps.idToken);

    // Add session parameters
    if (session) {
      url.searchParams.set("token", session.token);
      url.searchParams.set("refreshToken", session.refreshToken);
      url.searchParams.set(
        "sessionAccessTokenExpiresAt",
        session.sessionAccessTokenExpiresAt
      );
      url.searchParams.set("userId", session.user?.id?.toString() || "");
      url.searchParams.set("expires", session.expires.toString());
    }

    // Log the final URL
    console.log("Final URL with session data:", url.toString());

    return url.toString();
  };

  if (isShopify) {
    return (
      <>
        <ui-nav-menu style={{ display: "none" }}>
          <Link href={createLinkWithSession("/brand/campaigns")}>
            Campaigns
          </Link>
          <Link href={createLinkWithSession("/brand/referrals")}>
            Referrals
          </Link>
          <Link href={createLinkWithSession("/brand/settings")}>Settings</Link>
          <Link href={createLinkWithSession("/brand/payments")}>Payments</Link>
          <Link href={createLinkWithSession("/brand/support")}>Support</Link>
        </ui-nav-menu>
        <div className="flex-1 overflow-y-auto">
          <main className="p-6">
            <Component {...pageProps} />
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

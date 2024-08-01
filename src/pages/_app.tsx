// pages/_app.tsx
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider, AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import App, { AppProps, AppContext } from "next/app";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "../contexts/SessionContext";
import "../styles/globals.css";
import BrandLayout from "./layouts/BrandLayout";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Link from "next/link";

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
      <AppProvider i18n={translations}>
        <PolarisProvider i18n={translations}>
          <SessionProvider>
            <ContentWrapper
              isShopify={isShopify}
              Component={Component}
              pageProps={pageProps}
            />
          </SessionProvider>
        </PolarisProvider>
      </AppProvider>
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
    if (sessionChecked) {
      if (session && router.pathname === "/login") {
        router.replace("/brand/dashboard");
      } else if (!session && router.pathname.startsWith("/brand")) {
      }
    }
  }, [sessionChecked, session, router]);

  if (loading || !sessionChecked) {
    return <LoadingOverlay />;
  }

  const isBrandRoute = router.pathname.startsWith("/brand");

  const createLink = (path: string) => {
    const url = new URL(path, window.location.href);
    if (pageProps.shop) url.searchParams.set("shop", pageProps.shop);
    if (pageProps.idToken) url.searchParams.set("id_token", pageProps.idToken);
    return url.toString();
  };

  if (isShopify) {
    return (
      <AppBridgeProvider>
        <PolarisProvider i18n={translations}>
          <ui-nav-menu style={{ display: "none" }}>
            <Link href={createLink("/")} rel="home">
              Home
            </Link>
            <Link href={createLink("/brand/dashboard")}>Dashboard</Link>
            <Link href={createLink("/brand/campaigns")}>Campaigns</Link>
            <Link href={createLink("/brand/support")}>Support</Link>
            <Link href={createLink("/brand/referrals")}>Referrals</Link>
            <Link href={createLink("/brand/settings")}>Settings</Link>
            <Link href={createLink("/brand/payments")}>Payments</Link>
            <Link href={createLink("/brand/faqs")}>FAQS</Link>
          </ui-nav-menu>
          <div className="flex-1 overflow-y-auto">
            <main className="p-12">
              <Component {...pageProps} />
            </main>
          </div>
        </PolarisProvider>
      </AppBridgeProvider>
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

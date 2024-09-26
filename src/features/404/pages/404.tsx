// pages/404.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { NextPageContext } from "next";
import { AppProvider as PolarisProvider, AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import React from "react";

interface Custom404Props {
  shop?: string;
  host?: string;
}

const Custom404 = ({ shop, host }: Custom404Props) => {
  const router = useRouter();

  const isUserLoggedIn = () => {
    const accessToken = Cookies.get("accessToken");
    return !!accessToken;
  };

  const isShopifyApp = () => {
    return (
      (typeof shop === "string" && shop.length > 0) ||
      (typeof host === "string" && host.length > 0)
    );
  };

  useEffect(() => {
    const loggedIn = isUserLoggedIn();
    const shopifyApp = isShopifyApp();

    if (shopifyApp) {
      if (router.pathname !== "/brand/dashboard") {
        router.replace("/brand/dashboard");
      }
    } else if (loggedIn) {
      if (router.pathname !== "/dashboard") {
        router.replace("/brand/dashboard");
      }
    } else {
      if (router.pathname !== "/login") {
        router.replace("/login");
      }
    }
  }, [router, shop, host]);

  return null;
};

Custom404.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;
  const shop = query.shop || null;
  const host = query.host || null;

  return { shop, host };
};

const Custom404Wrapper = (props: Custom404Props) => {
  return (
    <AppProvider i18n={translations}>
      <PolarisProvider i18n={translations}>
        <Custom404 {...props} />
      </PolarisProvider>
    </AppProvider>
  );
};

export default Custom404Wrapper;

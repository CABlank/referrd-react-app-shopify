const setupCheck = (): void => {
  try {
    const {
      SHOPIFY_API_KEY: apiKey,
      SHOPIFY_API_SECRET: apiSecret,
      SHOPIFY_API_SCOPES: apiScopes,
      SHOPIFY_APP_URL: appUrl,
      SHOPIFY_API_VERSION: apiVersion,
      ENCRYPTION_STRING: encString,
      DATABASE_URL: databaseURL,
      APP_NAME: appName,
      APP_HANDLE: appHandle,
      APP_PROXY_PREFIX: proxyPrefix,
      APP_PROXY_SUBPATH: proxySubpath,
    } = process.env;

    if (typeof apiKey === "undefined") {
      throw new Error("---> API Key is undefined.");
    }
    if (typeof apiSecret === "undefined") {
      throw new Error("---> API Secret is undefined.");
    }
    if (typeof apiScopes === "undefined") {
      throw new Error("---> API Scopes are undefined.");
    }
    if (typeof appUrl === "undefined") {
      throw new Error("---> App URL is undefined.");
    } else if (!appUrl.includes("https://")) {
      console.error("---> Please use HTTPS for SHOPIFY_APP_URL.");
    }
    if (typeof apiVersion === "undefined") {
      throw new Error("---> API Version is undefined.");
    }
    if (typeof encString === "undefined") {
      throw new Error("---> Encryption String is undefined.");
    }

    if (typeof databaseURL === "undefined") {
      throw new Error("---> Database string is undefined.");
    }

    if (typeof appName === "undefined" || appName.length < 1) {
      throw new Error(
        `---> App Name is ${appName && appName.length < 1 ? "not entered properly" : "undefined"}.`
      );
    }
    if (typeof appHandle === "undefined") {
      throw new Error("---> App Handle is undefined.");
    }
    if (appHandle.includes(" ")) {
      throw new Error(
        "---> Handle must be URL encoded and cannot contain spaces."
      );
    }

    if (typeof proxySubpath === "undefined") {
      console.warn(
        "---> App Proxy subpath is undefined and will not be used. Make sure your app doesn't use App proxy"
      );
    } else {
      if (typeof proxyPrefix === "undefined") {
        throw new Error("---> App proxy prefix is undefined");
      }
      switch (proxyPrefix) {
        case "apps":
        case "a":
        case "community":
        case "tools":
          break;
        default:
          throw new Error(
            "Invalid App proxy prefix, please make sure the value is either of these:\napps\na\ncommunity\ntools"
          );
      }
    }

    console.log("--> Setup checks passed successfully.");
  } catch (e: any) {
    console.error(e.message);
  }
};

export default setupCheck;

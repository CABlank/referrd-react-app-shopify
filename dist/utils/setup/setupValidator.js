var setupCheck = function () {
    try {
        var _a = process.env, apiKey = _a.SHOPIFY_API_KEY, apiSecret = _a.SHOPIFY_API_SECRET, apiScopes = _a.SHOPIFY_API_SCOPES, appUrl = _a.SHOPIFY_APP_URL, apiVersion = _a.SHOPIFY_API_VERSION, encString = _a.ENCRYPTION_STRING, databaseURL = _a.DATABASE_URL, appName = _a.APP_NAME, appHandle = _a.APP_HANDLE, proxyPrefix = _a.APP_PROXY_PREFIX, proxySubpath = _a.APP_PROXY_SUBPATH;
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
        }
        else if (!appUrl.includes("https://")) {
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
            throw new Error("---> App Name is ".concat(appName && appName.length < 1 ? "not entered properly" : "undefined", "."));
        }
        if (typeof appHandle === "undefined") {
            throw new Error("---> App Handle is undefined.");
        }
        if (appHandle.includes(" ")) {
            throw new Error("---> Handle must be URL encoded and cannot contain spaces.");
        }
        if (typeof proxySubpath === "undefined") {
            console.warn("---> App Proxy subpath is undefined and will not be used. Make sure your app doesn't use App proxy");
        }
        else {
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
                    throw new Error("Invalid App proxy prefix, please make sure the value is either of these:\napps\na\ncommunity\ntools");
            }
        }
        console.log("--> Setup checks passed successfully.");
    }
    catch (e) {
        console.error(e.message);
    }
};
export default setupCheck;

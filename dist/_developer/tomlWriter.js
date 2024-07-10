import setupCheck from "../utils/setup/setupValidator.js";
import toml from "@iarna/toml";
import "dotenv/config";
import fs from "fs";
import path from "path";
var config = {};
try {
    setupCheck(); // Run setup check to ensure all env variables are accessible
    var appUrl = process.env.SHOPIFY_APP_URL;
    if (appUrl && appUrl.endsWith("/")) {
        appUrl = appUrl.slice(0, -1);
    }
    // Globals
    config.name = process.env.APP_NAME;
    config.handle = process.env.APP_HANDLE;
    config.client_id = process.env.SHOPIFY_API_KEY;
    config.application_url = appUrl || "";
    config.embedded = true;
    config.extension_directories = ["../extension/extensions/*"];
    // Auth
    config.auth = {
        redirect_urls: ["".concat(appUrl, "/api/auth/tokens"), "".concat(appUrl, "/api/auth/callback")],
    };
    // Scopes
    config.access_scopes = {
        scopes: process.env.SHOPIFY_API_SCOPES || "",
        use_legacy_install_flow: false,
    };
    // Webhook event version to always match the app API version
    config.webhooks = {
        api_version: process.env.SHOPIFY_API_VERSION || "2023-10",
        privacy_compliance: {
            customer_data_request_url: "".concat(appUrl, "/api/shopify/compliance/customerDataRequest"),
            customer_deletion_url: "".concat(appUrl, "/api/shopify/compliance/customerRedact"),
            shop_deletion_url: "".concat(appUrl, "/api/shopify/compliance/shopRedact"),
        },
    };
    // App Proxy
    var proxyPrefix = process.env.APP_PROXY_PREFIX || "";
    var proxySubpath = process.env.APP_PROXY_SUBPATH || "";
    if (proxyPrefix.length > 0 && proxySubpath.length > 0) {
        config.app_proxy = {
            url: "".concat(appUrl, "/api/proxy/handleProxy"),
            prefix: proxyPrefix,
            subpath: proxySubpath,
        };
    }
    // PoS
    var posEmbedded = process.env.POS_EMBEDDED || "";
    if (posEmbedded.length > 1) {
        config.pos = {
            embedded: posEmbedded === "true",
        };
    }
    // Build
    config.build = {
        include_config_on_deploy: true,
    };
    // Write to toml
    var str = toml.stringify(config);
    str =
        "# Avoid writing to toml directly. Use your .env file instead\n\n" + str;
    fs.writeFileSync(path.join(process.cwd(), "shopify.app.toml"), str);
    var extensionsDir = path.join("..", "extension");
    config.extension_directories = ["./extensions/*"];
    var extensionStr = toml.stringify(config);
    extensionStr =
        "# Avoid writing to toml directly. Use your .env file instead\n\n" +
            extensionStr;
    config.extension_directories = ["extension/extensions/*"];
    var globalStr = toml.stringify(config);
    globalStr =
        "# Avoid writing to toml directly. Use your .env file instead\n\n" +
            globalStr;
    if (fs.existsSync(extensionsDir)) {
        fs.writeFileSync(path.join(process.cwd(), "..", "shopify.app.toml"), globalStr);
        fs.writeFileSync(path.join(extensionsDir, "shopify.app.toml"), extensionStr);
    }
}
catch (e) {
    console.error("---> An error occured while writing toml files");
    console.log(e.message);
}

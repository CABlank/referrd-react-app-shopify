import setupCheck from "../utils/setup/setupValidator";
import toml from "@iarna/toml";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { AppConfig } from "./types/toml.js";

let config: Partial<AppConfig> = {};

try {
  setupCheck(); // Run setup check to ensure all env variables are accessible

  let appUrl: string | undefined = process.env.SHOPIFY_APP_URL;
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
    redirect_urls: [`${appUrl}/api/auth/tokens`, `${appUrl}/api/auth/callback`],
  };

  // Scopes
  config.access_scopes = {
    scopes: process.env.SHOPIFY_API_SCOPES || "",
    use_legacy_install_flow: false,
  };

  // Webhook event version to always match the app API version
  config.webhooks = {
    api_version:
      (process.env.SHOPIFY_API_VERSION as
        | "2024-01"
        | "2023-10"
        | "2023-07"
        | "2023-04"
        | "2024-04") || "2023-10",
    privacy_compliance: {
      customer_data_request_url: `${appUrl}/api/shopify/compliance/customerDataRequest`,
      customer_deletion_url: `${appUrl}/api/shopify/compliance/customerRedact`,
      shop_deletion_url: `${appUrl}/api/shopify/compliance/shopRedact`,
    },
  };

  // App Proxy
  const proxyPrefix = process.env.APP_PROXY_PREFIX || "";
  const proxySubpath = process.env.APP_PROXY_SUBPATH || "";
  if (proxyPrefix.length > 0 && proxySubpath.length > 0) {
    config.app_proxy = {
      url: `${appUrl}/api/proxy/handleProxy`,
      prefix: proxyPrefix as "apps" | "a" | "community" | "tools",
      subpath: proxySubpath,
    };
  }

  // PoS
  const posEmbedded = process.env.POS_EMBEDDED || "";
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
  let str: string = toml.stringify(config as unknown as toml.JsonMap);
  str =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" + str;

  fs.writeFileSync(path.join(process.cwd(), "shopify.app.toml"), str);

  const extensionsDir: string = path.join("..", "extension");

  config.extension_directories = ["./extensions/*"];
  let extensionStr: string = toml.stringify(config as unknown as toml.JsonMap);
  extensionStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    extensionStr;

  config.extension_directories = ["extension/extensions/*"];
  let globalStr: string = toml.stringify(config as unknown as toml.JsonMap);
  globalStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    globalStr;

  if (fs.existsSync(extensionsDir)) {
    fs.writeFileSync(
      path.join(process.cwd(), "..", "shopify.app.toml"),
      globalStr
    );

    fs.writeFileSync(
      path.join(extensionsDir, "shopify.app.toml"),
      extensionStr
    );
  }
} catch (e) {
  console.error("---> An error occured while writing toml files");
  console.log((e as Error).message);
}

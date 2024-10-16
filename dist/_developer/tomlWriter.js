import setupCheck from "../utils/setup/setupValidator.js";
import toml from "@iarna/toml";
import "dotenv/config";
import fs from "fs";
import path from "path";

let config = {};

try {
  // Step 1: Run setup check to ensure all environment variables are accessible
  setupCheck();

  // Step 2: Define the app URL, trimming any trailing slash
  let appUrl = process.env.SHOPIFY_APP_URL;
  if (appUrl && appUrl.endsWith("/")) {
    appUrl = appUrl.slice(0, -1);
  }

  // Step 3: Global configurations
  config.name = process.env.APP_NAME;
  config.handle = process.env.APP_HANDLE;
  config.client_id = process.env.SHOPIFY_API_KEY;
  config.application_url = appUrl || "";
  config.embedded = true;

  // Step 4: Define OAuth redirect URLs
  config.auth = {
    redirect_urls: [`${appUrl}/api/auth/tokens`, `${appUrl}/api/auth/callback`],
  };

  // Step 5: Define API scopes necessary for theme modification and page creation
  config.access_scopes = {
    scopes: process.env.SHOPIFY_API_SCOPES || "write_pages,read_themes,write_themes",
    use_legacy_install_flow: false,
  };

  // Step 6: Webhook configurations (optional, keep if needed)
  config.webhooks = {
    api_version: process.env.SHOPIFY_API_VERSION || "2023-10",
    privacy_compliance: {
      customer_data_request_url: `${appUrl}/api/shopify/compliance/customerDataRequest`,
      customer_deletion_url: `${appUrl}/api/shopify/compliance/customerRedact`,
      shop_deletion_url: `${appUrl}/api/shopify/compliance/shopRedact`,
    },
    subscriptions: [
      {
        topics: ["orders/create"],
        uri: `${appUrl}/api/shopify/webhooks/orders-create`,
      },
    ],
  };

  // Step 7: Write the configuration to the TOML file
  let str = toml.stringify(config);
  str = "# Avoid writing to toml directly. Use your .env file instead\n\n" + str;
  fs.writeFileSync(path.join(process.cwd(), "shopify.app.toml"), str);

  // Optional: Manage extension directories if needed
  const extensionsDir = path.join("..", "extension");
  if (fs.existsSync(extensionsDir)) {
    const extensionStr = toml.stringify(config);
    const globalStr =
      "# Avoid writing to toml directly. Use your .env file instead\n\n" + extensionStr;

    fs.writeFileSync(path.join(process.cwd(), "..", "shopify.app.toml"), globalStr);
    fs.writeFileSync(path.join(extensionsDir, "shopify.app.toml"), extensionStr);
  }
} catch (e) {
  console.error("---> An error occurred while writing TOML files");
  console.log(e.message);
}

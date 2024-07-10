import { shopifyApi, ApiVersion, DeliveryMethod } from "@shopify/shopify-api";
import appUninstalledHandler from "../webhooks/appUninstallHandler";
import shopify from "./shopifyClient"; // Adjust the import to the actual path of your shopify client file

describe("Shopify API Client Configuration", () => {
  beforeAll(() => {
    // Mock the necessary environment variables
    process.env.SHOPIFY_API_KEY = "test_api_key";
    process.env.SHOPIFY_API_SECRET = "test_api_secret";
    process.env.SHOPIFY_API_SCOPES = "write_products,read_orders";
    process.env.SHOPIFY_APP_URL = "https://testapp.com";
    process.env.SHOPIFY_API_VERSION = ApiVersion.July23;
    const NODE_ENV = "test";
  });

  it("should configure the Shopify API client with the correct settings", () => {
    // Check if the Shopify API client is configured correctly
    expect(shopify.config.apiKey).toBe(process.env.SHOPIFY_API_KEY);
    expect(shopify.config.apiSecretKey).toBe(process.env.SHOPIFY_API_SECRET);
    expect(shopify.config.scopes).toEqual(
      (process.env.SHOPIFY_API_SCOPES || "").split(",")
    );
    expect(shopify.config.hostName).toBe("testapp.com");
    expect(shopify.config.apiVersion).toBe(process.env.SHOPIFY_API_VERSION);
    expect(shopify.config.logger.level).toBe("error"); // Since NODE_ENV is set to 'test'
  });

  it("should register webhook handlers correctly", () => {
    // Check if the webhook handler for APP_UNINSTALLED is registered correctly
    const handlers = shopify.webhooks.getHandlers("APP_UNINSTALLED");
    expect(handlers).toHaveLength(1);
    const handler = handlers[0];

    if ("callbackUrl" in handler) {
      expect(handler.callbackUrl).toBe("/api/webhooks/app_uninstalled");
    }

    if ("callback" in handler) {
      expect(handler.callback).toBe(appUninstalledHandler);
    }

    expect(handler.deliveryMethod).toBe(DeliveryMethod.Http);
  });
});

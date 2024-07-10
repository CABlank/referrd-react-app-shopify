/**
 * This file sets up and configures the Shopify API client for your application.
 * It ensures that your application can interact with Shopify, handle webhooks,
 * and use the necessary credentials and configurations required for Shopify operations.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports the required modules from the `@shopify/shopify-api` package and your custom webhook handler.
 * 2. Determines Development Mode: It checks if the app is running in development mode.
 * 3. Extracts and Validates Environment Variables: It retrieves essential environment variables needed for Shopify API configuration and validates their presence.
 * 4. Configures the Shopify API Client: It sets up the Shopify API client with the provided credentials and settings, including API keys, scopes, hostname, and logging configuration.
 * 5. Registers Webhook Handlers: It defines and registers webhook handlers, specifying how to handle specific Shopify webhook events.
 * 6. Exports the Configured Shopify Client: Finally, it exports the configured Shopify client so that it can be used throughout your application.
 */
import { DeliveryMethod, LogSeverity, shopifyApi, } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import appUninstalledHandler from "../webhooks/appUninstallHandler";
// Determine if the app is running in development mode
var isDev = process.env.NODE_ENV === "development";
// Extract necessary environment variables and validate them
var _a = process.env, SHOPIFY_API_KEY = _a.SHOPIFY_API_KEY, SHOPIFY_API_SECRET = _a.SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES = _a.SHOPIFY_API_SCOPES, SHOPIFY_APP_URL = _a.SHOPIFY_APP_URL, SHOPIFY_API_VERSION = _a.SHOPIFY_API_VERSION;
// Validate the extracted environment variables
if (!SHOPIFY_API_KEY ||
    !SHOPIFY_API_SECRET ||
    !SHOPIFY_API_SCOPES ||
    !SHOPIFY_APP_URL ||
    !SHOPIFY_API_VERSION) {
    // Throw an error if any required environment variables are missing
    throw new Error("One or more required environment variables are missing");
}
// Configure the Shopify API client with necessary credentials and settings
var shopify = shopifyApi({
    apiKey: SHOPIFY_API_KEY, // The API key for the Shopify app
    apiSecretKey: SHOPIFY_API_SECRET, // The API secret key for the Shopify app
    scopes: SHOPIFY_API_SCOPES.split(","), // The scopes required for the app, split into an array
    hostName: SHOPIFY_APP_URL.replace(/https:\/\//, ""), // The hostname of the app, without the protocol
    hostScheme: "https", // The protocol to use (https)
    apiVersion: SHOPIFY_API_VERSION, // The version of the Shopify API to use
    isEmbeddedApp: true, // Indicates if the app is an embedded app
    logger: { level: isDev ? LogSeverity.Warning : LogSeverity.Error }, // Set logging level based on the environment
    // Uncomment the line below for detailed HTTP request logs, useful for debugging
    // logger: { level: LogSeverity.Debug, httpRequests: true },
});
/**
 * Register webhook handlers
 *
 * Template for adding new topics:
 *
 * TOPIC: {
 *   deliveryMethod: DeliveryMethod.Http,
 *   callbackUrl: "/api/webhooks/topic",
 *   callback: topicHandler,
 * },
 *
 * - Webhook topic and callbackUrl should be exactly the same because it's using a catch-all route
 * - Do not change the delivery method unless necessary
 *   - The method is `DeliveryMethod.Http` and not `DeliveryMethod.http`, mind the capital `H` in `Http`
 */
shopify.webhooks.addHandlers({
    APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http, // Specify the delivery method for the webhook
        callbackUrl: "/api/webhooks/app_uninstalled", // The URL to handle the webhook
        callback: appUninstalledHandler, // The function to handle the webhook
    },
});
// Export the configured Shopify API client
export default shopify;

import {
  ApiVersion,
  DeliveryMethod,
  LogSeverity,
  shopifyApi,
} from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";

// Determine if the app is running in development mode
const isDev = process.env.NODE_ENV === "development";

// Extract necessary environment variables and validate them
const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SHOPIFY_API_SCOPES,
  SHOPIFY_APP_URL,
  SHOPIFY_API_VERSION,
} = process.env;

// Validate the extracted environment variables
if (
  !SHOPIFY_API_KEY ||
  !SHOPIFY_API_SECRET ||
  !SHOPIFY_API_SCOPES ||
  !SHOPIFY_APP_URL ||
  !SHOPIFY_API_VERSION
) {
  // Throw an error if any required environment variables are missing
  throw new Error("One or more required environment variables are missing");
}

// Configure the Shopify API client with necessary credentials and settings
const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY, // The API key for the Shopify app
  apiSecretKey: SHOPIFY_API_SECRET, // The API secret key for the Shopify app
  scopes: SHOPIFY_API_SCOPES.split(","), // The scopes required for the app, split into an array
  hostName: SHOPIFY_APP_URL.replace(/https:\/\//, ""), // The hostname of the app, without the protocol
  hostScheme: "https", // The protocol to use (https)
  apiVersion: SHOPIFY_API_VERSION as ApiVersion, // The version of the Shopify API to use
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
  },
});

/**
 * Get tokens from Shopify after OAuth callback.
 * @param shopDomain - The shop domain to get tokens for.
 * @param code - The authorization code provided by Shopify.
 * @returns {Promise<{ accessToken: string, refreshToken: string, expiresAt: Date }>} The access token, refresh token along with the expiration date.
 */
export interface Session {
  accessToken?: string;
  refreshToken?: string; // Add the refreshToken property
  expires?: string;
}

export const getTokensFromShopify = async (
  shopDomain: string,
  code: string
): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date }> => {
  // Simulate raw request and response objects
  const rawRequest = {
    url: `https://${shopDomain}/admin/oauth/access_token`,
    headers: { "Content-Type": "application/json" },
  };
  const rawResponse = {
    statusCode: 200,
  };

  const response = await shopify.auth.callback({
    rawRequest: rawRequest as any, // Cast to any to bypass type errors
    rawResponse: rawResponse as any, // Cast to any to bypass type errors
  });

  const session = response.session as Session;

  return {
    accessToken: session.accessToken!,
    refreshToken: session.refreshToken!,
    expiresAt: session.expires ? new Date(session.expires) : new Date(),
  };
};

// Export the configured Shopify API client
export default shopify;

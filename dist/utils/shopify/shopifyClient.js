var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { DeliveryMethod, LogSeverity, shopifyApi, } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
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
    },
    ORDERS_CREATE: {
        deliveryMethod: DeliveryMethod.Http, // Specify the delivery method for the webhook
        callbackUrl: "/api/webhooks/order-created", // The URL to handle the 'orders/create' webhook
        callback: function (topic, shop, body) { return __awaiter(void 0, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                order = JSON.parse(body);
                console.log("New Order Created via Handler:");
                console.log("Order ID: ".concat(order.id));
                console.log("Name: ".concat(order.name));
                console.log("Email: ".concat(order.email));
                console.log("Total: ".concat(order.total_price, " ").concat(order.currency));
                return [2 /*return*/];
            });
        }); },
    },
});
export var getTokensFromShopify = function (shopDomain, code) { return __awaiter(void 0, void 0, void 0, function () {
    var rawRequest, rawResponse, response, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rawRequest = {
                    url: "https://".concat(shopDomain, "/admin/oauth/access_token"),
                    headers: { "Content-Type": "application/json" },
                };
                rawResponse = {
                    statusCode: 200,
                };
                return [4 /*yield*/, shopify.auth.callback({
                        rawRequest: rawRequest, // Cast to any to bypass type errors
                        rawResponse: rawResponse, // Cast to any to bypass type errors
                    })];
            case 1:
                response = _a.sent();
                session = response.session;
                return [2 /*return*/, {
                        accessToken: session.accessToken,
                        refreshToken: session.refreshToken,
                        expiresAt: session.expires ? new Date(session.expires) : new Date(),
                    }];
        }
    });
}); };
// Export the configured Shopify API client
export default shopify;

/**
 * This file provides functions to create Shopify clients for both online and offline access.
 * It includes methods to fetch sessions, and create GraphQL and REST clients for interacting with the Shopify API.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as session handlers, Shopify client, and Next.js types.
 * 2. Defines Interfaces for Function Parameters: It defines interfaces to ensure type safety for function parameters.
 * 3. Fetches Offline Sessions: It defines a function to fetch offline sessions associated with a shop.
 * 4. Provides Offline Clients: It provides methods to create Shopify GraphQL and REST clients for offline access.
 * 5. Fetches Online Sessions: It defines a function to fetch online sessions associated with a request.
 * 6. Provides Online Clients: It provides methods to create Shopify GraphQL and REST clients for online access.
 * 7. Exports the Client Provider: Finally, it exports the client provider containing methods for both online and offline clients.
 */
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
import sessionHandler from "../session/sessionHandler"; // Import session handler functions
import shopify from "../shopify/shopifyClient"; // Import configured Shopify client
/**
 * Fetches the offline session associated with a shop.
 *
 * @async
 * @function fetchOfflineSession
 * @param {string} shop - The shop's domain.
 * @returns {Promise<Session>} The offline session associated with the shop.
 * @throws Will throw an error if no session is found for the shop.
 */
var fetchOfflineSession = function (shop) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionID, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Fetching offline session for shop: ".concat(shop));
                sessionID = shopify.session.getOfflineId(shop);
                console.log("Offline session ID for shop ".concat(shop, ": ").concat(sessionID));
                return [4 /*yield*/, sessionHandler.loadSession(Number(sessionID))];
            case 1:
                session = _a.sent();
                if (!session) {
                    console.error("No session found for shop ".concat(shop));
                    throw new Error("No session found for shop ".concat(shop)); // Throw an error if no session is found
                }
                console.log("Offline session fetched for shop ".concat(shop, ":"), session);
                return [2 /*return*/, session]; // Return the session
        }
    });
}); };
/**
 * Provides methods to create Shopify clients for offline access.
 * @namespace offline
 */
var offline = {
    /**
     * Creates a Shopify GraphQL client for offline access.
     *
     * @async
     * @function graphqlClient
     * @param {GraphqlClientParams} params - The parameters.
     * @returns {Promise<{ client: any; shop: string; session: Session }>} The GraphQL client, shop, and session.
     */
    graphqlClient: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var session, client;
        var shop = _b.shop;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("Creating offline GraphQL client for shop: ".concat(shop));
                    return [4 /*yield*/, fetchOfflineSession(shop)];
                case 1:
                    session = _c.sent();
                    client = new shopify.clients.Graphql({ session: session });
                    console.log("Offline GraphQL client created for shop ".concat(shop));
                    return [2 /*return*/, { client: client, shop: shop, session: session }]; // Return the client, shop, and session
            }
        });
    }); },
    /**
     * Creates a Shopify REST client for offline access.
     *
     * @async
     * @function restClient
     * @param {RestClientParams} params - The parameters.
     * @returns {Promise<{ client: any; shop: string; session: Session }>} The REST client, shop, and session.
     */
    restClient: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var session, client;
        var shop = _b.shop;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("Creating offline REST client for shop: ".concat(shop));
                    return [4 /*yield*/, fetchOfflineSession(shop)];
                case 1:
                    session = _c.sent();
                    client = new shopify.clients.Rest({
                        session: session,
                        apiVersion: process.env.SHOPIFY_API_VERSION,
                    });
                    console.log("Offline REST client created for shop ".concat(shop));
                    return [2 /*return*/, { client: client, shop: shop, session: session }]; // Return the client, shop, and session
            }
        });
    }); },
};
/**
 * Fetches the online session associated with a request.
 *
 * @async
 * @function fetchOnlineSession
 * @param {FetchOnlineSessionParams} params - The request and response objects.
 * @returns {Promise<Session>} The online session associated with the request.
 * @throws Will throw an error if no session is found for the request.
 */
var fetchOnlineSession = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var sessionID, session;
    var req = _b.req, res = _b.res;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("Fetching online session for request");
                return [4 /*yield*/, shopify.session.getCurrentId({
                        isOnline: true,
                        rawRequest: req,
                        rawResponse: res,
                    })];
            case 1:
                sessionID = _c.sent();
                console.log("Online session ID: ".concat(sessionID));
                if (!sessionID) {
                    console.error("Invalid session ID");
                    throw new Error("Invalid session ID"); // Throw an error if no session ID is found
                }
                return [4 /*yield*/, sessionHandler.loadSession(Number(sessionID))];
            case 2:
                session = _c.sent();
                if (!session) {
                    console.error("No session found for request");
                    throw new Error("No session found for request"); // Throw an error if no session is found
                }
                console.log("Online session fetched:", session);
                return [2 /*return*/, session]; // Return the session
        }
    });
}); };
/**
 * Provides methods to create Shopify clients for online access.
 * @namespace online
 */
var online = {
    /**
     * Creates a Shopify GraphQL client for online access.
     *
     * @async
     * @function graphqlClient
     * @param {FetchOnlineSessionParams} params - The request and response objects.
     * @returns {Promise<{ client: any; shop: string; session: Session }>} The GraphQL client, shop, and session.
     */
    graphqlClient: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var session, client, shop;
        var req = _b.req, res = _b.res;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("Creating online GraphQL client");
                    return [4 /*yield*/, fetchOnlineSession({ req: req, res: res })];
                case 1:
                    session = _c.sent();
                    client = new shopify.clients.Graphql({ session: session });
                    shop = session.shop;
                    console.log("Online GraphQL client created for shop ".concat(shop));
                    return [2 /*return*/, { client: client, shop: shop, session: session }]; // Return the client, shop, and session
            }
        });
    }); },
    /**
     * Creates a Shopify REST client for online access.
     *
     * @async
     * @function restClient
     * @param {FetchOnlineSessionParams} params - The request and response objects.
     * @returns {Promise<{ client: any; shop: string; session: Session }>} The REST client, shop, and session.
     */
    restClient: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var session, shop, client;
        var req = _b.req, res = _b.res;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("Creating online REST client");
                    return [4 /*yield*/, fetchOnlineSession({ req: req, res: res })];
                case 1:
                    session = _c.sent();
                    shop = session.shop;
                    client = new shopify.clients.Rest({
                        session: session,
                        apiVersion: process.env.SHOPIFY_API_VERSION,
                    });
                    console.log("Online REST client created for shop ".concat(shop));
                    return [2 /*return*/, { client: client, shop: shop, session: session }]; // Return the client, shop, and session
            }
        });
    }); },
};
/**
 * Provides Shopify client providers for both online and offline access.
 * @namespace clientProvider
 */
var clientProvider = {
    offline: offline,
    online: online,
};
export default clientProvider; // Export the client provider

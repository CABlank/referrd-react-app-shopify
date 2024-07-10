/**
 * This file defines a function to handle the initial load checking for a Shopify application using Next.js.
 * It verifies and exchanges tokens, stores session data, registers webhooks, and checks for fresh installs.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as session handlers, Shopify client, and fresh install checker.
 * 2. Defines Environment Variables: It sets up environment variables for Directus URL and token.
 * 3. Defines Context Interface: It defines a custom interface extending GetServerSidePropsContext to include specific query parameters.
 * 4. Checks Initial Load: It defines an asynchronous function `initialLoadChecker` to handle initial load checking and processing.
 * 5. Token Exchange and Session Handling: It exchanges tokens, stores session data, and registers webhooks.
 * 6. Fresh Install Checking: It checks if the current install is fresh or a reinstall and handles accordingly.
 * 7. Exports the Function: Finally, it exports the `initialLoadChecker` function for use in your application.
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
import { RequestedTokenType } from "@shopify/shopify-api"; // Import necessary types from Shopify API
import sessionHandler from "../session/sessionHandler"; // Import session handler functions
import shopify from "../shopify/shopifyClient"; // Import configured Shopify client
import freshInstallChecker from "../install/freshInstallChecker"; // Import fresh install checker function
// Set up environment variables for Directus URL and token
var DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
var DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "your_directus_token";
/**
 * Handles initial load checking and processing for a Shopify application.
 *
 * @async
 * @function initialLoadChecker
 * @param {Context} context - The context object containing various parameters.
 * @returns {Promise<GetServerSidePropsResult<{ [key: string]: any }>>} Object with props to be passed to the page component.
 */
var initialLoadChecker = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var shop, idToken, offlineSession, onlineSession, webhookRegisterResponse, isFreshInstallChecker, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                shop = context.query.shop;
                idToken = context.query.id_token;
                if (!(idToken && shop)) return [3 /*break*/, 7];
                return [4 /*yield*/, shopify.auth.tokenExchange({
                        sessionToken: idToken,
                        shop: shop,
                        requestedTokenType: RequestedTokenType.OfflineAccessToken,
                    })];
            case 1:
                offlineSession = (_a.sent()).session;
                return [4 /*yield*/, shopify.auth.tokenExchange({
                        sessionToken: idToken,
                        shop: shop,
                        requestedTokenType: RequestedTokenType.OnlineAccessToken,
                    })];
            case 2:
                onlineSession = (_a.sent()).session;
                sessionHandler.storeSession(offlineSession);
                sessionHandler.storeSession(onlineSession);
                return [4 /*yield*/, shopify.webhooks.register({
                        session: offlineSession,
                    })];
            case 3:
                webhookRegisterResponse = _a.sent();
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/stores"), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN),
                        },
                        body: JSON.stringify({
                            filter: { shop: onlineSession.shop },
                        }),
                    }).then(function (res) { return res.json(); })];
            case 4:
                isFreshInstallChecker = _a.sent();
                if (!(!isFreshInstallChecker.data.length ||
                    isFreshInstallChecker.data[0].isActive === false)) return [3 /*break*/, 6];
                // !isFreshInstallChecker.data.length -> New Install
                // isFreshInstallChecker.data[0].isActive === false -> Reinstall
                return [4 /*yield*/, freshInstallChecker({ shop: onlineSession.shop })];
            case 5:
                // !isFreshInstallChecker.data.length -> New Install
                // isFreshInstallChecker.data[0].isActive === false -> Reinstall
                _a.sent();
                _a.label = 6;
            case 6:
                console.dir(webhookRegisterResponse, { depth: null });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/, {
                    props: {
                        data: "ok",
                    },
                }];
            case 8:
                e_1 = _a.sent();
                if (e_1 instanceof Error && e_1.message.startsWith("InvalidJwtError")) {
                    console.error("JWT Error - happens in dev mode and can be safely ignored, even in prod.");
                }
                else {
                    console.error("---> An error occurred at initialLoadChecker: ".concat(e_1.message), e_1);
                    return [2 /*return*/, {
                            props: {
                                serverError: true,
                            },
                        }];
                }
                return [2 /*return*/, {
                        props: {
                            data: "ok",
                        },
                    }];
            case 9: return [2 /*return*/];
        }
    });
}); };
export default initialLoadChecker; // Export the function

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
import { RequestedTokenType, Session } from "@shopify/shopify-api"; // Import necessary types from Shopify API
import validateJWT from "../jwt/jwtValidator"; // Import custom JWT validator
/**
 * Middleware to verify incoming requests and attach session data.
 *
 * @async
 * @function verifyRequest
 * @param {NextApiRequest} req - The Next.js API request object, expected to have an 'authorization' header.
 * @param {NextApiResponse} res - The Next.js API response object, used to send back error messages if needed.
 * @param {NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 * @throws Will throw an error if the authorization header is missing or invalid, or if no shop is found in the payload.
 */
var verifyRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, payload, shop, sessionId, session, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                authHeader = req.headers["authorization"];
                if (!authHeader) {
                    throw new Error("No authorization header found."); // Throw error if authorization header is missing
                }
                payload = validateJWT(authHeader.split(" ")[1]);
                shop = shopify.utils.sanitizeShop(payload.dest.replace("https://", ""));
                if (!shop) {
                    throw new Error("No shop found, not a valid request"); // Throw error if shop is not found
                }
                return [4 /*yield*/, shopify.session.getCurrentId({
                        isOnline: true,
                        rawRequest: req,
                        rawResponse: res,
                    })];
            case 1:
                sessionId = _b.sent();
                return [4 /*yield*/, sessionHandler.loadSession(Number(sessionId))];
            case 2:
                session = _b.sent();
                if (!!session) return [3 /*break*/, 4];
                return [4 /*yield*/, getSession({ shop: shop, authHeader: authHeader })];
            case 3:
                session = _b.sent(); // Create a new session if one does not exist
                _b.label = 4;
            case 4:
                if (!((session === null || session === void 0 ? void 0 : session.expires) &&
                    new Date(session.expires) > new Date() &&
                    ((_a = shopify.config.scopes) === null || _a === void 0 ? void 0 : _a.equals(session.scope)))) return [3 /*break*/, 5];
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, getSession({ shop: shop, authHeader: authHeader })];
            case 6:
                session = _b.sent(); // Refresh the session if it is expired or the scope is invalid
                _b.label = 7;
            case 7:
                // Add session and shop to the request object for use in subsequent routes
                req.user_session = session;
                req.user_shop = session === null || session === void 0 ? void 0 : session.shop;
                return [4 /*yield*/, next(req, res)];
            case 8:
                _b.sent(); // Pass control to the next middleware function
                return [2 /*return*/];
            case 9:
                e_1 = _b.sent();
                console.error("---> An error happened at verifyRequest middleware: ".concat(e_1.message));
                return [2 /*return*/, res.status(401).send({ error: "Unauthorized call" })]; // Send error response if an exception occurs
            case 10: return [2 /*return*/];
        }
    });
}); };
export default verifyRequest; // Export the middleware function
/**
 * Retrieves and stores session information based on the provided authentication header and offline flag.
 *
 * @async
 * @function getSession
 * @param {Object} params - The function parameters.
 * @param {string} params.shop - The xxx.myshopify.com URL of the requesting store.
 * @param {string} params.authHeader - The authorization header containing the session token.
 * @returns {Promise<Session>} The online session object
 */
function getSession(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var sessionToken, userId, onlineSession, offlineSession, e_2;
        var shop = _b.shop, authHeader = _b.authHeader;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    sessionToken = authHeader.split(" ")[1];
                    userId = "defaultUserId";
                    return [4 /*yield*/, shopify.auth.tokenExchange({
                            sessionToken: sessionToken,
                            shop: shop,
                            requestedTokenType: RequestedTokenType.OnlineAccessToken,
                        })];
                case 1:
                    onlineSession = (_c.sent()).session;
                    return [4 /*yield*/, sessionHandler.storeSession(onlineSession, userId)];
                case 2:
                    _c.sent(); // Store the online session with userId
                    return [4 /*yield*/, shopify.auth.tokenExchange({
                            sessionToken: sessionToken,
                            shop: shop,
                            requestedTokenType: RequestedTokenType.OfflineAccessToken,
                        })];
                case 3:
                    offlineSession = (_c.sent()).session;
                    return [4 /*yield*/, sessionHandler.storeSession(offlineSession, userId)];
                case 4:
                    _c.sent(); // Store the offline session with userId
                    return [2 /*return*/, new Session(onlineSession)]; // Return the online session as a new Session object
                case 5:
                    e_2 = _c.sent();
                    console.error("---> Error happened while pulling session from Shopify: ".concat(e_2.message)); // Log any errors that occur
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}

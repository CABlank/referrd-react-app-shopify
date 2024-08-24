var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import jwtValidator from "../jwt/jwtValidator";
import shopify from "../shopify/shopifyClient";
import { RequestedTokenType } from "@shopify/shopify-api";
import { prisma } from "../../lib/prisma"; // Adjust the path as needed
var lastOrderId = null; // Store the last order ID in memory
// Function to decode and verify the JWT token
var decodeAndVerifyToken = function (token) {
    try {
        console.log("Starting JWT validation...");
        var decodedPayload = jwtValidator(token); // Use the jwtValidator function
        var currentTime = Math.floor(Date.now() / 1000);
        if (!decodedPayload || currentTime > decodedPayload.exp) {
            throw new Error("Token has expired or is invalid");
        }
        console.log("JWT validation successful:", decodedPayload);
        return __assign(__assign({}, decodedPayload), { exp: decodedPayload.exp || 0 });
    }
    catch (error) {
        console.error("JWT validation failed:", error);
        throw new Error("Token validation failed");
    }
};
var getUserIdByShopEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _a.sent();
                return [2 /*return*/, user ? user.id : null];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching user by email:", error_1);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTokensByUserId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.token.findMany({
                        where: { userId: userId },
                    })];
            case 1:
                tokens = _a.sent();
                return [2 /*return*/, tokens];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching tokens for user:", error_2);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var sessionLoadCheckerUtil = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, shop, idToken, decodedToken, tokenExchange, onlineSession, client, SHOP_QUERY, shopResponse, shopDetails, shopEmail, userId, accessToken, refreshToken, tokens, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = context.query, shop = _a.shop, idToken = _a.id_token;
                if (!shop) {
                    console.log("Missing shop parameter");
                    return [2 /*return*/, {
                            props: {
                                error: "missing_shop",
                            },
                        }];
                }
                if (!idToken) {
                    console.log("Missing id_token parameter");
                    return [2 /*return*/, {
                            props: {
                                error: "missing_id_token",
                            },
                        }];
                }
                console.log("Shop:", shop);
                console.log("ID Token:", idToken);
                decodedToken = decodeAndVerifyToken(idToken);
                tokenExchange = shopify.auth.tokenExchange;
                return [4 /*yield*/, tokenExchange({
                        sessionToken: idToken,
                        shop: shop,
                        requestedTokenType: RequestedTokenType.OnlineAccessToken,
                    })];
            case 1:
                onlineSession = (_b.sent()).session;
                console.log("Online session obtained:", onlineSession);
                client = new shopify.clients.Graphql({ session: onlineSession });
                SHOP_QUERY = "{\n      shop {\n        email\n      }\n    }";
                return [4 /*yield*/, client.request(SHOP_QUERY)];
            case 2:
                shopResponse = _b.sent();
                shopDetails = shopResponse.data;
                if (!shopDetails || !shopDetails.shop || !shopDetails.shop.email) {
                    throw new Error("Failed to fetch shop details.");
                }
                shopEmail = shopDetails.shop.email;
                console.log("Shop owner's email:", shopEmail);
                return [4 /*yield*/, getUserIdByShopEmail(shopEmail)];
            case 3:
                userId = _b.sent();
                accessToken = null;
                refreshToken = null;
                if (!userId) return [3 /*break*/, 5];
                console.log("User ID:", userId);
                return [4 /*yield*/, getTokensByUserId(userId)];
            case 4:
                tokens = _b.sent();
                console.log("Tokens for user:", tokens);
                if (tokens.length > 0) {
                    accessToken = tokens[0].accessToken;
                    refreshToken = tokens[0].refreshToken;
                }
                return [3 /*break*/, 6];
            case 5:
                console.log("User ID not found for email:", shopEmail);
                _b.label = 6;
            case 6: return [2 /*return*/, {
                    props: {
                        userId: userId, // Pass the user ID as a prop
                        accessToken: accessToken, // Pass the access token as a prop
                        refreshToken: refreshToken,
                    },
                }];
            case 7:
                error_3 = _b.sent();
                console.error("An error occurred at sessionLoadCheckerUtil:", error_3);
                return [2 /*return*/, {
                        props: {
                            error: "An error occurred",
                        },
                    }];
            case 8: return [2 /*return*/];
        }
    });
}); };
export default sessionLoadCheckerUtil;

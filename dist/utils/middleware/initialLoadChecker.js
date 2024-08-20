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
import bcrypt from "bcrypt";
import { RequestedTokenType } from "@shopify/shopify-api";
import shopify from "../shopify/shopifyClient";
import { PrismaClient } from "@prisma/client";
import authService from "../../services/auth/auth";
import jwtValidator from "../jwt/jwtValidator";
var prisma = new PrismaClient();
var decodeAndVerifyToken = function (token) {
    var decodedPayload = jwtValidator(token);
    var currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > decodedPayload.exp) {
        throw new Error("Token has expired");
    }
    return decodedPayload;
};
var upsertSession = function (session, shop) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!session) {
                    console.error("Session is undefined for shop: ".concat(shop));
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.session.upsert({
                        where: { sessionId: session.id },
                        update: { updatedAt: new Date() },
                        create: {
                            shop: {
                                connectOrCreate: {
                                    where: { domain: shop },
                                    create: { domain: shop, isActive: true },
                                },
                            },
                            sessionId: session.id,
                        },
                    })];
            case 2:
                _a.sent();
                console.log("Stored ".concat(session.isOnline ? "online" : "offline", " session for shop:"), session.shop);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error storing ".concat(session.isOnline ? "online" : "offline", " session:"), error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var handleError = function (message, error) {
    if (error instanceof Error) {
        console.error(message, error);
    }
    else {
        console.error(message);
    }
    return {
        props: {
            serverError: true,
        },
    };
};
var upsertUser = function (ownerEmail, ownerFirstName, ownerLastName) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, hashedPassword, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: ownerEmail },
                    })];
            case 1:
                existingUser = _a.sent();
                if (!!existingUser) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.hash(ownerEmail, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: ownerEmail,
                            firstName: ownerFirstName,
                            lastName: ownerLastName,
                            password: hashedPassword,
                            directusId: "1637e8a5-22f9-4e1b-b378-97828291ef8a",
                        },
                    })];
            case 3:
                existingUser = _a.sent();
                console.log("User created in Prisma.");
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.user.update({
                    where: { email: ownerEmail },
                    data: {
                        firstName: ownerFirstName,
                        lastName: ownerLastName,
                        updatedAt: new Date(),
                    },
                })];
            case 5:
                _a.sent();
                console.log("User details updated in Prisma.");
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                return [2 /*return*/, handleError("Error registering user in Prisma:", error_2)];
            case 8: return [2 /*return*/];
        }
    });
}); };
var saveDirectusTokens = function (userId, accessToken, refreshToken, expiresAt) { return __awaiter(void 0, void 0, void 0, function () {
    var existingToken, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, prisma.token.findFirst({
                        where: {
                            userId: userId,
                        },
                    })];
            case 1:
                existingToken = _a.sent();
                if (!existingToken) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.token.update({
                        where: {
                            id: existingToken.id, // Use id to uniquely identify the token record
                        },
                        data: {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expiresAt: expiresAt,
                            updatedAt: new Date(),
                        },
                    })];
            case 2:
                _a.sent();
                console.log("Directus tokens updated in Prisma.");
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.token.create({
                    data: {
                        userId: userId,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expiresAt: expiresAt,
                    },
                })];
            case 4:
                _a.sent();
                console.log("Directus tokens saved in Prisma.");
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                console.error("Error saving Directus tokens in Prisma:", error_3);
                throw error_3;
            case 7: return [2 /*return*/];
        }
    });
}); };
var handleDirectusUser = function (ownerEmail, ownerFirstName, ownerLastName) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, accessToken, refreshToken, directusUser, error_4, loginData, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                credentials = { email: ownerEmail, password: ownerEmail };
                accessToken = null;
                refreshToken = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                directusUser = void 0;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 6]);
                return [4 /*yield*/, authService.login(credentials)];
            case 3:
                directusUser = _a.sent();
                console.log("User already exists in Directus, logging in...");
                return [3 /*break*/, 6];
            case 4:
                error_4 = _a.sent();
                return [4 /*yield*/, authService.createUser({
                        email: ownerEmail,
                        password: ownerEmail,
                        first_name: ownerFirstName,
                        last_name: ownerLastName,
                    })];
            case 5:
                directusUser = _a.sent();
                console.log("User created in Directus.");
                return [3 /*break*/, 6];
            case 6: return [4 /*yield*/, authService.login(credentials)];
            case 7:
                loginData = _a.sent();
                console.log("User logged in Directus:", loginData);
                accessToken = loginData.data.access_token;
                refreshToken = loginData.data.refresh_token;
                return [3 /*break*/, 9];
            case 8:
                error_5 = _a.sent();
                handleError("Error creating user, logging into Directus or storing tokens:", error_5);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
        }
    });
}); };
var initialLoadChecker = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken, _a, shop, idToken, decodedToken, userId, tokenExchange, offlineSession, onlineSession, client, QUERY, response, shopDetails, _b, ownerEmail, ownerName, _c, ownerFirstName, ownerLastNameParts, ownerLastName, user, directusTokens, expiresAt, error_6;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                accessToken = null;
                refreshToken = null;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 11, , 12]);
                _a = context.query, shop = _a.shop, idToken = _a.id_token;
                // Check if we are running inside a Shopify app
                if (!shop) {
                    console.log("Not a Shopify app, skipping Shopify-specific logic.");
                    return [2 /*return*/, {
                            props: {
                                data: "not_shopify",
                            },
                        }];
                }
                if (!idToken) {
                    console.log("Missing idToken, redirecting...");
                    return [2 /*return*/, {
                            redirect: {
                                destination: "/your-error-page?error=missing_id_token",
                                permanent: false,
                            },
                        }];
                }
                console.log("Shop:", shop);
                console.log("ID Token:", idToken);
                decodedToken = decodeAndVerifyToken(idToken);
                userId = ((_d = context.req.cookies) === null || _d === void 0 ? void 0 : _d.userId) || "some_logic_to_get_user_id";
                if (!userId) {
                    throw new Error("User ID is required and could not be determined.");
                }
                console.log("User ID:", userId);
                console.log("Performing token exchange...");
                tokenExchange = shopify.auth.tokenExchange;
                return [4 /*yield*/, tokenExchange({
                        sessionToken: idToken,
                        shop: shop,
                        requestedTokenType: RequestedTokenType.OfflineAccessToken,
                    })];
            case 2:
                offlineSession = (_e.sent()).session;
                console.log("Offline session obtained:", offlineSession);
                return [4 /*yield*/, tokenExchange({
                        sessionToken: idToken,
                        shop: shop,
                        requestedTokenType: RequestedTokenType.OnlineAccessToken,
                    })];
            case 3:
                onlineSession = (_e.sent()).session;
                console.log("Online session obtained:", onlineSession);
                return [4 /*yield*/, upsertSession(offlineSession, shop)];
            case 4:
                _e.sent();
                return [4 /*yield*/, upsertSession(onlineSession, shop)];
            case 5:
                _e.sent();
                console.log("Fetching shop details to get the owner's email...");
                client = new shopify.clients.Graphql({ session: onlineSession });
                QUERY = "{\n      shop {\n        email\n        name\n      }\n    }";
                return [4 /*yield*/, client.request(QUERY)];
            case 6:
                response = _e.sent();
                shopDetails = response.data;
                if (!shopDetails || !shopDetails.shop) {
                    throw new Error("Failed to fetch shop details.");
                }
                _b = shopDetails.shop, ownerEmail = _b.email, ownerName = _b.name;
                _c = ownerName.split(" "), ownerFirstName = _c[0], ownerLastNameParts = _c.slice(1);
                ownerLastName = ownerLastNameParts.join(" ");
                console.log("Shop owner's email:", ownerEmail);
                return [4 /*yield*/, upsertUser(ownerEmail, ownerFirstName, ownerLastName)];
            case 7:
                _e.sent();
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: ownerEmail },
                    })];
            case 8:
                user = _e.sent();
                if (!user) {
                    throw new Error("User not found after upsertion.");
                }
                return [4 /*yield*/, handleDirectusUser(ownerEmail, ownerFirstName, ownerLastName)];
            case 9:
                directusTokens = _e.sent();
                accessToken = directusTokens.accessToken;
                refreshToken = directusTokens.refreshToken;
                console.log("Obtained Directus Tokens:", { accessToken: accessToken, refreshToken: refreshToken });
                expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 1); // Example: tokens expire in 1 hour
                return [4 /*yield*/, saveDirectusTokens(user.id, accessToken, refreshToken, expiresAt)];
            case 10:
                _e.sent();
                return [2 /*return*/, {
                        props: {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            userId: user.id, // Add userId to props
                        },
                    }];
            case 11:
                error_6 = _e.sent();
                return [2 /*return*/, handleError("An error occurred at initialLoadChecker: ".concat(error_6 instanceof Error ? error_6.message : "Unknown error"), error_6)];
            case 12: return [2 /*return*/];
        }
    });
}); };
export default initialLoadChecker;

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
import bcrypt from "bcryptjs";
import { RequestedTokenType } from "@shopify/shopify-api";
import shopify from "../shopify/shopifyClient";
import { prisma } from "../../lib/prisma"; // Adjust the path as needed
import authService from "../../services/auth/auth";
// Handle errors consistently and return a server error result
var handleError = function (message, error) {
    console.error(message, error);
    return { props: { serverError: true } };
};
// Create or update a user in the database
var upsertUser = function (email, firstName, lastName, shopDomain) { return __awaiter(void 0, void 0, void 0, function () {
    var user, hashedPassword, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.hash(email, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            password: hashedPassword,
                            directusId: "1637e8a5-22f9-4e1b-b378-97828291ef8a",
                            shopDomain: shopDomain,
                        },
                    })];
            case 3:
                user = _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.user.update({
                    where: { email: email },
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        shopDomain: shopDomain || user.shopDomain,
                        updatedAt: new Date(),
                    },
                })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/, user];
            case 7:
                error_1 = _a.sent();
                return [2 /*return*/, handleError("Error registering user in the database", error_1)];
            case 8: return [2 /*return*/];
        }
    });
}); };
// Save or update Directus tokens in the database
var saveDirectusTokens = function (userId, accessToken, refreshToken, expiresAt) { return __awaiter(void 0, void 0, void 0, function () {
    var existingToken, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, prisma.token.findFirst({ where: { userId: userId } })];
            case 1:
                existingToken = _a.sent();
                if (!existingToken) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.token.update({
                        where: { id: existingToken.id },
                        data: { accessToken: accessToken, refreshToken: refreshToken, expiresAt: expiresAt, updatedAt: new Date() },
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.token.create({
                    data: { userId: userId, accessToken: accessToken, refreshToken: refreshToken, expiresAt: expiresAt },
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error("Error saving tokens in the database", error_2);
                throw error_2;
            case 7: return [2 /*return*/];
        }
    });
}); };
// Handle user creation and login in Directus
var handleDirectusUser = function (email, firstName, lastName) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, loginData, _a, loginData, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                credentials = { email: email, password: email };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 9]);
                return [4 /*yield*/, authService.login(credentials)];
            case 2:
                loginData = _b.sent();
                return [2 /*return*/, {
                        accessToken: loginData.data.access_token,
                        refreshToken: loginData.data.refresh_token,
                    }];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                _b.trys.push([4, 7, , 8]);
                return [4 /*yield*/, authService.createUser({
                        email: email,
                        password: email,
                        first_name: firstName,
                        last_name: lastName,
                    })];
            case 5:
                _b.sent();
                return [4 /*yield*/, authService.login(credentials)];
            case 6:
                loginData = _b.sent();
                return [2 /*return*/, {
                        accessToken: loginData.data.access_token,
                        refreshToken: loginData.data.refresh_token,
                    }];
            case 7:
                error_3 = _b.sent();
                console.error("Failed to create or log in user in Directus", error_3);
                throw new Error("Directus user handling failed");
            case 8: return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
var initialLoadChecker = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken, _a, shop, idToken, onlineSession, ownerEmail, ownerFirstName, ownerLastName, user, uniqueEmail, userId, tokenRecord, currentTime, directusTokens, expiresAt, error_4, statusCode;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                accessToken = null;
                refreshToken = null;
                _h.label = 1;
            case 1:
                _h.trys.push([1, 18, , 19]);
                _a = context.query, shop = _a.shop, idToken = _a.id_token;
                // Validate the shop parameter
                if (!shop || !shop.endsWith(".myshopify.com")) {
                    return [2 /*return*/, handleError("Invalid shop parameter")];
                }
                // Redirect if idToken is missing
                if (!idToken) {
                    return [2 /*return*/, {
                            redirect: {
                                destination: "/brand/dashboard?shop=".concat(shop),
                                permanent: false,
                            },
                        }];
                }
                return [4 /*yield*/, shopify.auth.tokenExchange({
                        sessionToken: idToken,
                        shop: shop,
                        requestedTokenType: RequestedTokenType.OnlineAccessToken,
                    })];
            case 2:
                onlineSession = (_h.sent()).session;
                if (!(onlineSession === null || onlineSession === void 0 ? void 0 : onlineSession.accessToken)) {
                    throw new Error("Failed to obtain a valid online session.");
                }
                ownerEmail = (_b = onlineSession.onlineAccessInfo) === null || _b === void 0 ? void 0 : _b.associated_user.email;
                ownerFirstName = (_d = (_c = onlineSession.onlineAccessInfo) === null || _c === void 0 ? void 0 : _c.associated_user.first_name) !== null && _d !== void 0 ? _d : "";
                ownerLastName = (_f = (_e = onlineSession.onlineAccessInfo) === null || _e === void 0 ? void 0 : _e.associated_user.last_name) !== null && _f !== void 0 ? _f : "";
                if (!ownerEmail) {
                    throw new Error("Owner email is required but not found.");
                }
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: ownerEmail } })];
            case 3:
                user = _h.sent();
                uniqueEmail = ownerEmail;
                if (!user) return [3 /*break*/, 9];
                if (!(user.shopDomain && user.shopDomain !== shop)) return [3 /*break*/, 6];
                // Handle shop domain conflict by generating a unique email
                uniqueEmail = "".concat(ownerEmail.split("@")[0], "+").concat(shop.replace(".myshopify.com", ""), "@").concat(ownerEmail.split("@")[1]);
                return [4 /*yield*/, upsertUser(uniqueEmail, ownerFirstName, ownerLastName, shop)];
            case 4:
                _h.sent();
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: uniqueEmail } })];
            case 5:
                user = _h.sent();
                return [3 /*break*/, 8];
            case 6: 
            // Update the user with the current shop domain if needed
            return [4 /*yield*/, upsertUser(ownerEmail, ownerFirstName, ownerLastName, shop)];
            case 7:
                // Update the user with the current shop domain if needed
                _h.sent();
                _h.label = 8;
            case 8: return [3 /*break*/, 12];
            case 9: 
            // Create a new user if one doesn't exist
            return [4 /*yield*/, upsertUser(ownerEmail, ownerFirstName, ownerLastName, shop)];
            case 10:
                // Create a new user if one doesn't exist
                _h.sent();
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: ownerEmail } })];
            case 11:
                user = _h.sent();
                _h.label = 12;
            case 12:
                if (!user) {
                    throw new Error("Failed to upsert or find the user.");
                }
                userId = user.id;
                return [4 /*yield*/, prisma.token.findFirst({ where: { userId: userId } })];
            case 13:
                tokenRecord = _h.sent();
                currentTime = new Date();
                if (!(tokenRecord &&
                    tokenRecord.expiresAt > currentTime &&
                    tokenRecord.refreshToken)) return [3 /*break*/, 14];
                accessToken = tokenRecord.accessToken;
                refreshToken = tokenRecord.refreshToken;
                return [3 /*break*/, 17];
            case 14: return [4 /*yield*/, handleDirectusUser(uniqueEmail, ownerFirstName, ownerLastName)];
            case 15:
                directusTokens = _h.sent();
                accessToken = directusTokens.accessToken;
                refreshToken = directusTokens.refreshToken;
                expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 1);
                return [4 /*yield*/, saveDirectusTokens(userId, accessToken, refreshToken, expiresAt)];
            case 16:
                _h.sent();
                _h.label = 17;
            case 17: return [2 /*return*/, {
                    props: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: userId,
                    },
                }];
            case 18:
                error_4 = _h.sent();
                statusCode = (_g = error_4.response) === null || _g === void 0 ? void 0 : _g.code;
                if (statusCode === 401) {
                    console.error("Unauthorized access when fetching data from Shopify: ".concat(error_4.response.statusText), error_4);
                }
                else {
                    console.error("An error occurred at initialLoadChecker: ".concat(error_4 instanceof Error ? error_4.message : "Unknown error"), error_4);
                }
                return [2 /*return*/, handleError("An error occurred while processing your request.", error_4)];
            case 19: return [2 /*return*/];
        }
    });
}); };
export default initialLoadChecker;

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
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Cookies from "js-cookie";
import { getTokensFromShopify } from "../shopify/shopifyClient";
import prisma from "../database/prismaClient";
var DIRECTUS_URL = process.env.DIRECTUS_URL || "https://api.referrd.com.au";
var DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "po4uje7gIaooHBbh7EAncPd2aBSH5wwL";
var DIRECTUS_ROLE_ID = "1637e8a5-22f9-4e1b-b378-97828291ef8a";
var createUser = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var response, userData, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Creating user with email: ".concat(email));
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/users"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN),
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                            role: DIRECTUS_ROLE_ID,
                            status: "active",
                        }),
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    console.error("Failed to create the user in Directus", response.status, response.statusText);
                    throw new Error("Failed to create the user in Directus");
                }
                return [4 /*yield*/, response.json()];
            case 2:
                userData = _a.sent();
                console.log("User created with Directus ID: ".concat(userData.data.id));
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: email,
                            directusId: userData.data.id,
                        },
                    })];
            case 3:
                user = _a.sent();
                return [2 /*return*/, user.id];
        }
    });
}); };
var getDirectusTokens = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var response, tokenData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Fetching Directus tokens for email: ".concat(email));
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/auth/login"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                        }),
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    console.error("Failed to login and get tokens from Directus", response.status, response.statusText);
                    throw new Error("Failed to login and get tokens from Directus");
                }
                return [4 /*yield*/, response.json()];
            case 2:
                tokenData = _a.sent();
                console.log("Directus tokens fetched successfully");
                return [2 /*return*/, {
                        accessToken: tokenData.data.access_token,
                        refreshToken: tokenData.data.refresh_token,
                        expiresIn: tokenData.data.expires_in,
                    }];
        }
    });
}); };
var freshInstallChecker = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var email, password, hashedPassword, userId, tokensFromShopify, _c, directusAccessToken, directusRefreshToken, expiresIn, e_1;
    var shop = _b.shop, userEmail = _b.userEmail;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                console.log("This is a fresh install, running onboarding functions");
                email = userEmail;
                password = Math.random().toString(36).slice(-8);
                console.log("Generated email: ".concat(email, " and password: ").concat(password));
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 1:
                hashedPassword = _d.sent();
                return [4 /*yield*/, createUser(email, hashedPassword)];
            case 2:
                userId = _d.sent();
                console.log("Upserting shop data for domain: ".concat(shop));
                return [4 /*yield*/, prisma.shop.upsert({
                        where: { domain: shop },
                        update: { isActive: true, updatedAt: new Date() },
                        create: { domain: shop, isActive: true },
                    })];
            case 3:
                _d.sent();
                console.log("Fetching tokens from Shopify for shop: ".concat(shop));
                return [4 /*yield*/, getTokensFromShopify(shop, "authorization_code")];
            case 4:
                tokensFromShopify = _d.sent();
                if (!tokensFromShopify.accessToken || !tokensFromShopify.refreshToken) {
                    console.error("Tokens from Shopify are undefined", tokensFromShopify);
                    throw new Error("Tokens from Shopify are undefined");
                }
                console.log("Saving Shopify tokens");
                return [4 /*yield*/, saveToken(userId, tokensFromShopify.accessToken, tokensFromShopify.refreshToken, tokensFromShopify.expiresAt)];
            case 5:
                _d.sent();
                console.log("Shopify tokens saved successfully");
                console.log("Fetching Directus tokens");
                return [4 /*yield*/, getDirectusTokens(email, password)];
            case 6:
                _c = _d.sent(), directusAccessToken = _c.accessToken, directusRefreshToken = _c.refreshToken, expiresIn = _c.expiresIn;
                console.log("Saving Directus tokens in cookies");
                Cookies.set("directus_access_token", directusAccessToken, {
                    secure: true,
                    sameSite: "Strict",
                });
                Cookies.set("directus_refresh_token", directusRefreshToken, {
                    secure: true,
                    sameSite: "Strict",
                });
                Cookies.set("token_expiration", String(Date.now() + expiresIn * 1000), {
                    secure: true,
                    sameSite: "Strict",
                });
                return [3 /*break*/, 8];
            case 7:
                e_1 = _d.sent();
                console.error("An error occurred in freshInstallChecker function: ".concat(e_1.message), e_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var saveToken = function (userId, accessToken, refreshToken, expiresAt) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Saving token for userId: ".concat(userId));
                return [4 /*yield*/, prisma.token.create({
                        data: {
                            userId: userId,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expiresAt: expiresAt,
                        },
                    })];
            case 1:
                _a.sent();
                console.log("Token saved in database");
                return [2 /*return*/];
        }
    });
}); };
export default freshInstallChecker;

/**
 * This file handles session management for your Shopify application.
 * It provides functions to store, load, and delete session data in a Directus database.
 * This ensures that session data is securely managed and easily retrievable.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports the required modules from the @shopify/shopify-api package and your custom cryption handler.
 * 2. Extracts and Validates Environment Variables: It retrieves essential environment variables needed for Directus API configuration and validates their presence.
 * 3. Encrypts Session Data: It uses a custom cryption module to encrypt session data before storing it.
 * 4. Stores Session Data: It defines a function to store session data into the Directus database.
 * 5. Loads Session Data: It defines a function to load session data from the Directus database.
 * 6. Deletes Session Data: It defines a function to delete session data from the Directus database.
 * 7. Exports Session Handler: Finally, it exports the session handler functions so they can be used throughout your application.
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
import { Session } from "@shopify/shopify-api";
import { encrypt, decrypt } from "../security/encryption";
import fetch from "node-fetch";
import { getTokensFromShopify } from "../shopify/shopifyClient"; // Importing getTokensFromShopify
var DIRECTUS_URL = process.env.DIRECTUS_URL || "https://api.referrd.com.au";
var DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "po4uje7gIaooHBbh7EAncPd2aBSH5wwL";
// Function to get shop owner's email from Shopify API
var getShopOwnerEmail = function (shop, accessToken) { return __awaiter(void 0, void 0, void 0, function () {
    var response, errorText, shopData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Fetching shop owner email for shop: ".concat(shop));
                return [4 /*yield*/, fetch("https://".concat(shop, "/admin/api/2023-07/shop.json"), {
                        method: "GET",
                        headers: {
                            "X-Shopify-Access-Token": accessToken,
                            "Content-Type": "application/json",
                        },
                    })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.text()];
            case 2:
                errorText = _a.sent();
                throw new Error("Failed to fetch shop details from Shopify: ".concat(errorText));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                shopData = _a.sent();
                console.log("Shop owner email fetched: ".concat(shopData.shop.email));
                return [2 /*return*/, shopData.shop.email];
        }
    });
}); };
var storeSession = function (session, authCode // Accepting authCode as a parameter to use it in getTokensFromShopify
) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens, email, encryptedContent, response, errorText, responseData, sessionId, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                console.log("Storing session for shop: ".concat(session.shop));
                return [4 /*yield*/, getTokensFromShopify(session.shop, authCode)];
            case 1:
                tokens = _a.sent();
                console.log("Access tokens retrieved: ".concat(JSON.stringify(tokens)));
                return [4 /*yield*/, getShopOwnerEmail(session.shop, tokens.accessToken)];
            case 2:
                email = _a.sent();
                console.log("Shop owner email: ".concat(email));
                encryptedContent = encrypt(JSON.stringify(session));
                console.log("Encrypted session content: ".concat(encryptedContent));
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/sessions"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN),
                        },
                        body: JSON.stringify({
                            content: encryptedContent,
                            shop: session.shop,
                            is_active: "true",
                            email: email, // Using the shop owner's email
                        }),
                    })];
            case 3:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 5];
                return [4 /*yield*/, response.text()];
            case 4:
                errorText = _a.sent();
                throw new Error("Failed to store the session in Directus: ".concat(errorText));
            case 5: return [4 /*yield*/, response.json()];
            case 6:
                responseData = _a.sent();
                sessionId = responseData.data.id;
                console.log("Session stored successfully with ID: ".concat(sessionId));
                return [2 /*return*/, sessionId];
            case 7:
                error_1 = _a.sent();
                console.error("Error storing session: ".concat(error_1));
                return [2 /*return*/, null];
            case 8: return [2 /*return*/];
        }
    });
}); };
var loadSession = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, errorText, sessionResult, decryptedContent, sessionObj, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                console.log("Loading session for session ID: ".concat(id));
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/sessions/").concat(id), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN),
                        },
                    })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.text()];
            case 2:
                errorText = _a.sent();
                throw new Error("Failed to load the session from Directus: ".concat(errorText));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                sessionResult = _a.sent();
                console.log("Session data fetched: ".concat(JSON.stringify(sessionResult)));
                if (!sessionResult.data.content) {
                    console.log("No session found for session ID: ".concat(id));
                    return [2 /*return*/, undefined];
                }
                decryptedContent = decrypt(sessionResult.data.content);
                console.log("Decrypted session content: ".concat(decryptedContent));
                if (decryptedContent) {
                    sessionObj = JSON.parse(decryptedContent);
                    console.log("Session loaded successfully for session ID: ".concat(id));
                    return [2 /*return*/, new Session(sessionObj)];
                }
                console.log("Failed to decrypt session content for session ID: ".concat(id));
                return [2 /*return*/, undefined];
            case 5:
                error_2 = _a.sent();
                console.error("Error loading session: ".concat(error_2));
                return [2 /*return*/, undefined];
            case 6: return [2 /*return*/];
        }
    });
}); };
var deleteSession = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, errorText, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                console.log("Deleting session for session ID: ".concat(id));
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/sessions/").concat(id), {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN),
                        },
                    })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.text()];
            case 2:
                errorText = _a.sent();
                throw new Error("Failed to delete the session from Directus: ".concat(errorText));
            case 3:
                console.log("Session deleted successfully for session ID: ".concat(id));
                return [2 /*return*/, true];
            case 4:
                error_3 = _a.sent();
                console.error("Error deleting session: ".concat(error_3));
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
var sessionHandler = { storeSession: storeSession, loadSession: loadSession, deleteSession: deleteSession };
export default sessionHandler;

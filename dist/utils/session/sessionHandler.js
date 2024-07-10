/**
 * This file handles session management for your Shopify application.
 * It provides functions to store, load, and delete session data in a Directus database.
 * This ensures that session data is securely managed and easily retrievable.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports the required modules from the `@shopify/shopify-api` package and your custom encryption handler.
 * 2. Extracts and Validates Environment Variables: It retrieves essential environment variables needed for Directus API configuration and validates their presence.
 * 3. Encrypts Session Data: It uses a custom encryption module to encrypt session data before storing it.
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
import { Session } from "@shopify/shopify-api"; // Import the Session object from Shopify API
import encryption from "../security/encryption"; // Import custom encryption module
// Extract necessary environment variables with default values for Directus URL and token
var DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
var DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "your_directus_token";
/**
 * Helper function to handle connection errors.
 * Logs specific errors for connection refusal and other errors.
 *
 * @param {unknown} error - The error object.
 * @param {string} action - The action being performed (store, load, delete).
 * @returns {boolean | undefined} - Returns false for store/delete errors, and undefined for load errors.
 */
var handleConnectionError = function (error, action) {
    if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
        console.error("Connection refused when trying to ".concat(action, " session in Directus"));
        // Return fallback values
        return action === "load" ? undefined : false;
    }
    console.error("Error ".concat(action, " session:"), error);
    throw error;
};
/**
 * Stores the session data into the Directus database.
 *
 * @param {Session} session - The Shopify session object to be stored.
 * @returns {Promise<boolean>} - Returns true if the operation was successful, otherwise returns false.
 */
var storeSession = function (session) { return __awaiter(void 0, void 0, void 0, function () {
    var encryptedContent, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                encryptedContent = encryption.encrypt(JSON.stringify(session));
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/session/upsert"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json", // Set content type to JSON
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN), // Use Directus token for authorization
                        },
                        body: JSON.stringify({
                            filter: { id: session.id }, // Filter to check if session exists
                            update: {
                                content: encryptedContent, // Encrypted session data
                                shop: session.shop, // Associated shop information
                            },
                            create: {
                                id: session.id, // Session ID
                                content: encryptedContent, // Encrypted session data
                                shop: session.shop, // Associated shop information
                            },
                        }),
                    })];
            case 1:
                response = _a.sent();
                // Check if the response is not OK and throw an error
                if (!response.ok) {
                    throw new Error("Failed to store the session in Directus");
                }
                return [2 /*return*/, true]; // Return true if the session is successfully stored
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, handleConnectionError(error_1, "store")]; // Handle connection errors
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Loads the session data from the Directus database.
 *
 * @param {string} id - The session ID to be loaded.
 * @returns {Promise<Session | undefined>} - Returns the Shopify session object or undefined if not found.
 */
var loadSession = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, sessionResult, decryptedContent, sessionObj, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/session"), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json", // Set content type to JSON
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN), // Use Directus token for authorization
                        },
                        body: JSON.stringify({
                            filter: { id: id }, // Filter to retrieve session by ID
                        }),
                    })];
            case 1:
                response = _a.sent();
                // Check if the response is not OK and throw an error
                if (!response.ok) {
                    throw new Error("Failed to load the session from Directus");
                }
                return [4 /*yield*/, response.json()];
            case 2:
                sessionResult = _a.sent();
                // Return undefined if no session data is found
                if (!sessionResult.data.length || !sessionResult.data[0].content) {
                    return [2 /*return*/, undefined];
                }
                decryptedContent = encryption.decrypt(sessionResult.data[0].content);
                if (decryptedContent) {
                    sessionObj = JSON.parse(decryptedContent);
                    return [2 /*return*/, new Session(sessionObj)];
                }
                return [2 /*return*/, undefined]; // Return undefined if decryption fails
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, handleConnectionError(error_2, "load")]; // Handle connection errors
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Deletes the session data from the Directus database.
 *
 * @param {string} id - The session ID to be deleted.
 * @returns {Promise<boolean>} - Returns true if the operation was successful, otherwise returns false.
 */
var deleteSession = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/session"), {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json", // Set content type to JSON
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN), // Use Directus token for authorization
                        },
                        body: JSON.stringify({
                            filter: { id: id }, // Filter to delete session by ID
                        }),
                    })];
            case 1:
                response = _a.sent();
                // Check if the response is not OK and throw an error
                if (!response.ok) {
                    throw new Error("Failed to delete the session from Directus");
                }
                return [2 /*return*/, true]; // Return true if the session is successfully deleted
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, handleConnectionError(error_3, "delete")]; // Handle connection errors
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Session handler object containing storeSession, loadSession, and deleteSession functions.
 */
var sessionHandler = { storeSession: storeSession, loadSession: loadSession, deleteSession: deleteSession };
export default sessionHandler; // Export the session handler functions

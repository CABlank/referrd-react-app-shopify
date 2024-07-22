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
import prisma from "../database/prismaClient";
var DIRECTUS_URL = process.env.DIRECTUS_URL || "https://api.referrd.com.au";
var DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "1zXm5k0Ii_wyWEXWxZWG9ZIxzzpTwzZs"; // Ensure Directus token is set in environment variables
/**
 * Handler function for the APP_UNINSTALLED webhook.
 *
 * @async
 * @function appUninstallHandler
 * @param {string} topic - The webhook topic.
 * @param {string} shop - The shop domain.
 * @param {string} webhookRequestBody - The webhook request body.
 * @returns {Promise<void>} A promise that resolves when the handler completes.
 */
var appUninstallHandler = function (topic, shop, webhookRequestBody) { return __awaiter(void 0, void 0, void 0, function () {
    var shopRecord, sessionDeleteResponse, storeUpsertResponse, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (topic !== "APP_UNINSTALLED") {
                    console.error("Unexpected topic: ".concat(topic));
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                // Ensure the request body is a valid APP_UNINSTALLED type
                JSON.parse(webhookRequestBody);
                return [4 /*yield*/, prisma.shop.findUnique({
                        where: { domain: shop },
                    })];
            case 2:
                shopRecord = _a.sent();
                if (!shopRecord) return [3 /*break*/, 5];
                // Delete all related sessions
                return [4 /*yield*/, prisma.session.deleteMany({
                        where: { shopId: shopRecord.id },
                    })];
            case 3:
                // Delete all related sessions
                _a.sent();
                // Mark the store as inactive
                return [4 /*yield*/, prisma.shop.update({
                        where: { domain: shop },
                        data: { isActive: false },
                    })];
            case 4:
                // Mark the store as inactive
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/shopify_sessions"), {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer ".concat(DIRECTUS_TOKEN),
                    },
                    body: JSON.stringify({ filter: { shop: shop } }),
                })];
            case 6:
                sessionDeleteResponse = _a.sent();
                return [4 /*yield*/, fetch("".concat(DIRECTUS_URL, "/items/shopify_sessions/upsert"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(DIRECTUS_TOKEN),
                        },
                        body: JSON.stringify({
                            filter: { shop: shop },
                            update: { is_active: false },
                            create: { shop: shop, is_active: false },
                        }),
                    })];
            case 7:
                storeUpsertResponse = _a.sent();
                if (!sessionDeleteResponse.ok || !storeUpsertResponse.ok) {
                    throw new Error("Failed to perform database operations in Directus");
                }
                console.log("Successfully handled APP_UNINSTALLED for shop: ".concat(shop));
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                // Improved error logging
                console.error("Error handling APP_UNINSTALLED for shop: ".concat(shop));
                console.error("Webhook Request Body: ".concat(webhookRequestBody));
                console.error("Error: ".concat(error_1.message));
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
export default appUninstallHandler;

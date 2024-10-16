/**
 * This file implements a middleware function for verifying Shopify proxy requests.
 * It ensures that the incoming requests are legitimate by checking their signature against a calculated HMAC.
 * If the verification is successful, it adds the shop domain to the request object and passes control to the next middleware.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as `crypto` for HMAC calculation and Next.js types.
 * 2. Extends Next.js Request Interface: It extends the `NextApiRequest` interface to include an optional `user_shop` property.
 * 3. Defines Middleware for Request Verification: It defines an asynchronous middleware function `proxyVerifier` to verify the incoming proxy requests.
 * 4. Encodes Query Data: It includes a helper function `encodeQueryData` to encode query parameters into a URL query string format.
 * 5. Exports the Middleware Function: Finally, it exports the `proxyVerifier` middleware function for use in your application.
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
import crypto from "crypto"; // Import crypto module for HMAC calculation
/**
 * Middleware to verify Shopify proxy requests and attach the shop domain to the request object.
 *
 * @async
 * @function proxyVerifier
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object.
 * @param {NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 */
var proxyVerifier = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var signature, queryURI, calculatedSignature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                signature = req.query.signature;
                queryURI = encodeQueryData(req.query)
                    .replace("/?", "")
                    .replace(/&signature=[^&]*/, "")
                    .split("&")
                    .map(function (x) { return decodeURIComponent(x); })
                    .sort()
                    .join("");
                calculatedSignature = crypto
                    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
                    .update(queryURI, "utf-8")
                    .digest("hex");
                if (!(calculatedSignature === signature)) return [3 /*break*/, 2];
                req.user_shop = req.query.shop; // Add shop domain to request object
                return [4 /*yield*/, next(req, res)];
            case 1:
                _a.sent(); // Pass control to the next middleware function
                return [3 /*break*/, 3];
            case 2: 
            // Send unauthorized response if the signature verification fails
            return [2 /*return*/, res.status(401).send({
                    success: false,
                    message: "Signature verification failed",
                })];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Encodes the provided data into a URL query string format.
 *
 * @param {Record<string, any>} data - The data to be encoded.
 * @returns {string} The encoded query string.
 */
function encodeQueryData(data) {
    var queryString = [];
    for (var d in data) {
        queryString.push(d + "=" + encodeURIComponent(data[d])); // Encode each key-value pair
    }
    return queryString.join("&"); // Join the encoded pairs with '&'
}
export default proxyVerifier; // Export the middleware function

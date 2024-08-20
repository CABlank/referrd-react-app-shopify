/**
 * This file handles requests to a proxy route.
 * It verifies the request, retrieves a Shopify GraphQL client for offline access, and responds with a status message.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as client providers, middleware utilities, and Next.js types.
 * 2. Defines the Handler Function: It defines an asynchronous handler function to process incoming requests.
 * 3. Verifies the Request: It uses middleware to verify the request before processing.
 * 4. Creates a Shopify GraphQL Client: It creates a Shopify GraphQL client for offline access.
 * 5. Responds with Status: It responds with a status message indicating the proxy is working.
 * 6. Exports the Middleware-Applied Handler: Finally, it exports the handler function wrapped with the proxy verifier middleware.
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
import clientProvider from "../../../../utils/client/clientProvider"; // Import client provider for Shopify clients
import withMiddleware from "../../../../utils/middleware/applyMiddleware"; // Import middleware utility
/**
 * Handler for the proxy route.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
var handler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var client;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, clientProvider.offline.graphqlClient({
                    shop: (_a = req.user_shop) !== null && _a !== void 0 ? _a : "",
                })];
            case 1:
                client = (_b.sent()).client;
                return [2 /*return*/, res.status(200).json({ content: "Proxy Be Working" })]; // Respond with status message
        }
    });
}); };
export default withMiddleware("proxyVerifier")(handler); // Export the middleware-applied handler

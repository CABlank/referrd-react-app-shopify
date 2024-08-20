/**
 * This file handles Shopify webhook requests.
 * It processes incoming webhook POST requests, verifies their integrity, and logs the processing status.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as the Shopify client and Next.js types.
 * 2. Defines the Handler Function: It defines an asynchronous handler function to process incoming webhook requests.
 * 3. Verifies Request Method: It ensures that only POST requests are processed.
 * 4. Extracts and Logs Webhook Information: It extracts the topic and shop domain from request headers and logs them.
 * 5. Buffers the Request Body: It buffers the request body for processing.
 * 6. Processes Webhook: It processes the webhook using the Shopify client.
 * 7. Handles Errors: It logs errors and responds with an appropriate status if the processing fails.
 * 8. Configures API: It configures the API to disable body parsing.
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import shopify from "../../../../utils/shopify/shopifyClient"; // Import the Shopify client
/**
 * Handles Shopify webhook requests.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 */
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var topic, shop, buff, rawBody, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (req.method !== "POST") {
                        return [2 /*return*/, res.status(400).send("It ain't POST mate.")]; // Reject non-POST requests
                    }
                    topic = req.headers["x-shopify-topic"] || "";
                    shop = req.headers["x-shopify-shop-domain"] || "";
                    return [4 /*yield*/, buffer(req)];
                case 1:
                    buff = _a.sent();
                    rawBody = buff.toString("utf8");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, shopify.webhooks.process({
                            rawBody: rawBody,
                            rawRequest: req,
                            rawResponse: res,
                        })];
                case 3:
                    _a.sent(); // Process the webhook using Shopify client
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error("---> Error while processing webhooks for ".concat(shop, " at ").concat(topic, " | ").concat(e_1.message)); // Log error
                    if (!res.headersSent) {
                        res.status(500).send(e_1.message); // Send error response
                    }
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
export var config = {
    api: {
        bodyParser: false, // Disable body parsing for raw request handling
    },
};
/**
 * Buffers the request body.
 *
 * @async
 * @function buffer
 * @param {NodeJS.ReadableStream} readable - The readable stream to buffer.
 * @returns {Promise<Buffer>} The buffered data.
 */
function buffer(readable) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, chunk, e_2_1;
        var _a, readable_1, readable_1_1;
        var _b, e_2, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    chunks = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _a = true, readable_1 = __asyncValues(readable);
                    _e.label = 2;
                case 2: return [4 /*yield*/, readable_1.next()];
                case 3:
                    if (!(readable_1_1 = _e.sent(), _b = readable_1_1.done, !_b)) return [3 /*break*/, 5];
                    _d = readable_1_1.value;
                    _a = false;
                    chunk = _d;
                    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk); // Convert string chunks to Buffer
                    _e.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_2_1 = _e.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(!_a && !_b && (_c = readable_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(readable_1)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, Buffer.concat(chunks)]; // Concatenate chunks into a single Buffer
            }
        });
    });
}

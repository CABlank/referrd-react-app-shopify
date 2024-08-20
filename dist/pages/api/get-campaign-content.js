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
import { initialize } from "./initialize/initialize";
import { handleCors } from "./handlers/handleCors";
import { fetchCampaign } from "./services/fetchCampaign";
import { extractReferralUuid } from "./handlers/extractReferralUuid";
import { handleReferral } from "./handlers/handleReferral";
import { generateScriptContent } from "./handlers/generateScriptContent";
/**
 * The main handler function for the API endpoint.
 * Manages the full request lifecycle including CORS, referral handling, and script content generation.
 *
 * This function coordinates the entire flow of the API request, starting from handling CORS,
 * initializing the request, fetching and validating campaigns, handling referrals, and
 * generating the appropriate script content to be sent back as the response.
 *
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 */
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var fullUrl, _a, companyId, BOT_TOKEN, campaignDetails, campaign, format, campaignData, referralUuid, scriptContent, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // 1. Handle CORS: Ensure the request is from an allowed source.
                    if (handleCors(req, res))
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    fullUrl = req.query.fullUrl;
                    console.log("Full URL:", fullUrl);
                    // 3. Initialize request by extracting company ID and BOT_TOKEN.
                    console.log("Initializing request...");
                    _a = initialize(req), companyId = _a.companyId, BOT_TOKEN = _a.BOT_TOKEN;
                    console.log("Company ID:", companyId);
                    return [4 /*yield*/, fetchCampaign(companyId, BOT_TOKEN)];
                case 2:
                    campaignDetails = _b.sent();
                    if (!campaignDetails) {
                        // If no valid campaign is found, notify the website and stop here.
                        return [2 /*return*/, res
                                .status(404)
                                .json({ success: false, message: "No valid campaign found" })];
                    }
                    campaign = campaignDetails.campaign, format = campaignDetails.format, campaignData = campaignDetails.campaignData;
                    referralUuid = extractReferralUuid(fullUrl);
                    return [4 /*yield*/, handleReferral(referralUuid, req, res, BOT_TOKEN)];
                case 3:
                    // If the referral is valid, track it and set a cookie.
                    if (!(_b.sent())) {
                        return [2 /*return*/]; // Stop if there's an issue with the referral.
                    }
                    scriptContent = generateScriptContent(format, campaignData);
                    res.setHeader("Content-Type", "application/javascript");
                    res.status(200).send(scriptContent);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("Error fetching campaign data:", error_1);
                    res.setHeader("Content-Type", "application/javascript");
                    res.status(500).send("\n      console.error('Internal Server Error');\n    ");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}

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
import geoip from "geoip-lite";
import { fetchCompanyUrls } from "../../services/company/company";
import { registerSignup, createCustomer, } from "../../services/referrals/referralTracking";
var BOT_TOKEN = process.env.BOT_TOKEN || "";
// Utility function to extract the hostname from a URL
function extractHostname(url) {
    return new URL(url).hostname;
}
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var formData, metadata, companyUrls, origin_1, originHostname_1, matchedDomain, ip, geo, location_1, locationData, newCustomer, createdCustomer, customerUUID, nameSlug, generatedUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (req.method === "OPTIONS") {
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
                        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
                        return [2 /*return*/, res.status(200).end()];
                    }
                    if (req.method !== "POST") {
                        return [2 /*return*/, res
                                .status(405)
                                .json({ success: false, message: "Method not allowed" })];
                    }
                    formData = req.body;
                    console.log("Form data received:", formData);
                    if (!formData.name || !formData.email) {
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: "Name and email are required.",
                            })];
                    }
                    try {
                        metadata =
                            typeof formData.metadata === "string"
                                ? JSON.parse(formData.metadata)
                                : formData.metadata;
                    }
                    catch (error) {
                        console.error("Failed to parse metadata:", error);
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: "Invalid metadata format.",
                            })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetchCompanyUrls(BOT_TOKEN)];
                case 2:
                    companyUrls = _a.sent();
                    console.log("Company URLs:", companyUrls);
                    if (!Array.isArray(companyUrls) || companyUrls.length === 0) {
                        throw new Error("No company URLs found");
                    }
                    origin_1 = (metadata === null || metadata === void 0 ? void 0 : metadata.origin) || "https://default-domain.com";
                    originHostname_1 = extractHostname(origin_1);
                    console.log("Origin:", origin_1);
                    console.log("Extracted Hostname:", originHostname_1);
                    matchedDomain = companyUrls.find(function (domain) { return originHostname_1 === domain; });
                    console.log("Matched Domain:", matchedDomain);
                    if (!matchedDomain) {
                        return [2 /*return*/, res.status(403).json({
                                success: false,
                                message: "Origin does not match any company's domain",
                            })];
                    }
                    res.setHeader("Access-Control-Allow-Origin", origin_1);
                    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
                    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
                    console.log("Form Data Received:", formData);
                    ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                    geo = ip ? geoip.lookup(ip) : null;
                    console.log("Request IP:", ip);
                    console.log("Request Location:", geo);
                    location_1 = {
                        country: (geo === null || geo === void 0 ? void 0 : geo.country) || "",
                        city: (geo === null || geo === void 0 ? void 0 : geo.city) || "",
                    };
                    locationData = location_1.country || location_1.city ? location_1 : null;
                    newCustomer = {
                        name: formData.name || "", // Ensure that name is always a string
                        email: formData.email || "", // Ensure that email is always a string
                        mobile: formData.phone || "", // Ensure that mobile is always a string
                        conversion_count: 0,
                        click_count: 0,
                        signup_count: 0,
                        location: locationData, // Add location data
                        referred_by: formData.referred_by || "", // Add referred_by property if provided
                        campaign_uuid: formData.campaign_uuid || "", // Add campaign_id property if provided
                        company_id: formData.company_id || "", // Add company_id property if provided
                    };
                    // Log the customer data before creating it
                    console.log("Creating customer with data:", newCustomer);
                    return [4 /*yield*/, createCustomer(newCustomer, BOT_TOKEN)];
                case 3:
                    createdCustomer = _a.sent();
                    console.log("New customer created:", createdCustomer);
                    customerUUID = createdCustomer.uuid;
                    nameSlug = formData.name
                        ? formData.name.toLowerCase().replace(/\s+/g, "-")
                        : "referral";
                    generatedUrl = "".concat(origin_1, "?").concat(customerUUID, "?").concat(encodeURIComponent(nameSlug));
                    console.log("Generated URL:", generatedUrl);
                    if (!formData.referred_by) return [3 /*break*/, 5];
                    return [4 /*yield*/, registerSignup(formData.referred_by, createdCustomer, BOT_TOKEN)];
                case 4:
                    _a.sent(); // Use the created customer object
                    console.log("Signup registered for referrer:", formData.referred_by);
                    _a.label = 5;
                case 5: return [2 /*return*/, res.status(200).json({ success: true, generatedUrl: generatedUrl })];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error processing form data:", error_1);
                    return [2 /*return*/, res
                            .status(500)
                            .json({ success: false, message: "Internal server error" })];
                case 7: return [2 /*return*/];
            }
        });
    });
}

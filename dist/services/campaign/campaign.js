var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var API_URL = process.env.NEXT_PUBLIC_API_URL;
// Helper function to make API requests
var fetchFromAPI = function (endpoint_1, token_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([endpoint_1, token_1], args_1, true), void 0, function (endpoint, token, options) {
        var headers, response, data;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = __assign({ "Content-Type": options.body instanceof FormData
                            ? "multipart/form-data"
                            : "application/json" }, options.headers);
                    if (token) {
                        headers.Authorization = "Bearer ".concat(token);
                    }
                    return [4 /*yield*/, fetch("".concat(API_URL).concat(endpoint), __assign(__assign({}, options), { headers: headers }))];
                case 1:
                    response = _a.sent();
                    if (response.status === 204) {
                        // No content to parse, return an empty object or undefined
                        return [2 /*return*/, {}];
                    }
                    if (!response.ok) {
                        throw new Error("Failed to fetch ".concat(endpoint));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.data];
            }
        });
    });
};
// Duplicate campaign data to the public page collection
var duplicateCampaignToPublicPage = function (campaign, token) { return __awaiter(void 0, void 0, void 0, function () {
    var publicPageData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publicPageData = {
                    campaign_id: campaign.id,
                    closeDate: campaign.closeDate,
                    discountType: campaign.discountType,
                    discountValue: campaign.discountValue,
                    format: campaign.format,
                    amountFunded: campaign.amountFunded,
                    settingsTopbarState: campaign.settingsTopbarState,
                    settingsPopupState: campaign.settingsPopupState,
                    serializedTopbarState: campaign.serializedTopbarState,
                    serializedPopupState: campaign.serializedPopupState,
                    status: campaign.status,
                    commission: campaign.commission,
                    commissionType: campaign.commissionType,
                };
                return [4 /*yield*/, fetchFromAPI("/items/campaign_public_page", token, {
                        method: "POST",
                        body: JSON.stringify(publicPageData),
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Fetch all campaigns
export var fetchCampaigns = function (token) {
    return fetchFromAPI("/items/campaigns", token);
};
// Fetch a specific campaign by ID
export var fetchCampaign = function (id, token) {
    return fetchFromAPI("/items/campaigns/".concat(id), token);
};
// Create a new campaign
export var createCampaign = function (campaign, token) { return __awaiter(void 0, void 0, void 0, function () {
    var createdCampaign;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchFromAPI("/items/campaigns", token, {
                    method: "POST",
                    body: JSON.stringify(campaign),
                })];
            case 1:
                createdCampaign = _a.sent();
                // Duplicate the created campaign to the public page collection
                return [4 /*yield*/, duplicateCampaignToPublicPage(createdCampaign, token)];
            case 2:
                // Duplicate the created campaign to the public page collection
                _a.sent();
                return [2 /*return*/, createdCampaign];
        }
    });
}); };
// Update an existing campaign
export var updateCampaign = function (campaign, token) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchFromAPI("/items/campaigns/".concat(campaign.id), token, {
                    method: "PATCH",
                    body: JSON.stringify(campaign),
                })];
            case 1:
                _a.sent();
                // Duplicate the updated campaign to the public page collection
                return [4 /*yield*/, duplicateCampaignToPublicPage(campaign, token)];
            case 2:
                // Duplicate the updated campaign to the public page collection
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Update the status of a campaign
export var updateCampaignStatus = function (id, status, token) {
    return fetchFromAPI("/items/campaigns/".concat(id), token, {
        method: "PATCH",
        body: JSON.stringify({ status: status }),
    });
};
export var updateCampaignStatusAndAmount = function (id, amountFunded, token) {
    return fetchFromAPI("/items/campaigns/".concat(id), token, {
        method: "PATCH",
        body: JSON.stringify({ amountFunded: amountFunded }),
    });
};
// Delete a campaign
export var deleteCampaign = function (id, token) {
    return fetchFromAPI("/items/campaigns/".concat(id), token, {
        method: "DELETE",
    });
};
// Upload a file
export var uploadFile = function (file, token) { return __awaiter(void 0, void 0, void 0, function () {
    var formData, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                formData = new FormData();
                formData.append("file", file);
                return [4 /*yield*/, fetch("".concat(API_URL, "/files"), {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer ".concat(token),
                        },
                        body: formData,
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to upload file");
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data.data.id];
        }
    });
}); };

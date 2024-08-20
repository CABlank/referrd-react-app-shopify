// services/payment.ts
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
var API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.referrd.com.au";
// Helper function to make API requests
var fetchFromAPI = function (endpoint_1, token_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([endpoint_1, token_1], args_1, true), void 0, function (endpoint, token, options) {
        var headers, response, responseText, data;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = __assign({ "Content-Type": "application/json" }, options.headers);
                    if (token) {
                        headers.Authorization = "Bearer ".concat(token);
                    }
                    return [4 /*yield*/, fetch("".concat(API_URL).concat(endpoint), __assign(__assign({}, options), { headers: headers }))];
                case 1:
                    response = _a.sent();
                    if (response.status === 204) {
                        console.log("No content from ".concat(endpoint));
                        return [2 /*return*/, null]; // Return null explicitly for 204 No Content
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    responseText = _a.sent();
                    if (!responseText) {
                        console.error("Empty response from ".concat(endpoint));
                        throw new Error("Empty response from ".concat(endpoint));
                    }
                    try {
                        data = JSON.parse(responseText);
                        return [2 /*return*/, data.data];
                    }
                    catch (error) {
                        console.error("Error parsing JSON from ".concat(endpoint, ":"), error);
                        console.error("Response text: ".concat(responseText));
                        throw new Error("Failed to parse JSON from ".concat(endpoint));
                    }
                    return [2 /*return*/];
            }
        });
    });
};
// Function to fetch the company UUID
export var fetchCompanyUUID = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var companyData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetchFromAPI("/items/company", token)];
            case 1:
                companyData = _a.sent();
                if (companyData && companyData.length > 0) {
                    return [2 /*return*/, companyData[0].UUID];
                }
                else {
                    console.error("Company not found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching company data:", error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Function to fetch all payments related to a company UUID
export var fetchPaymentsByCompanyId = function (companyId, token) { return __awaiter(void 0, void 0, void 0, function () {
    var payments, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetchFromAPI("/items/payments?filter[company_id][_eq]=".concat(companyId), token)];
            case 1:
                payments = _a.sent();
                if (payments) {
                    return [2 /*return*/, payments];
                }
                else {
                    console.log("No payments found for this company ID.");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching payments by company ID:", error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Create a new payment
export var createPayment = function (payment, token) { return __awaiter(void 0, void 0, void 0, function () {
    var createdPayment, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("Creating payment with data:", payment);
                console.log("Using token:", token);
                return [4 /*yield*/, fetchFromAPI("/items/payments", token, {
                        method: "POST",
                        body: JSON.stringify(payment),
                    })];
            case 1:
                createdPayment = _a.sent();
                if (!createdPayment) {
                    console.log("Payment creation failed, no data was returned.");
                    return [2 /*return*/, null]; // Explicitly return null if no data is returned
                }
                console.log("Created new payment:", createdPayment);
                return [2 /*return*/, createdPayment]; // Return the created payment object
            case 2:
                error_3 = _a.sent();
                console.error("Error creating payment:", error_3);
                throw error_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
export var updatePaymentStatus = function (paymentId, status, token) { return __awaiter(void 0, void 0, void 0, function () {
    var response, updatedPayment, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("".concat(API_URL, "/items/payments/").concat(paymentId), {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(token),
                        },
                        body: JSON.stringify({ status: status }), // Send the new status
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to update payment status. Status code: ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                updatedPayment = _a.sent();
                return [2 /*return*/, updatedPayment.data || null];
            case 3:
                error_4 = _a.sent();
                console.error("Error updating payment status:", error_4);
                throw error_4;
            case 4: return [2 /*return*/];
        }
    });
}); };
export var fetchReferrer = function (referralUUID, token) { return __awaiter(void 0, void 0, void 0, function () {
    var referrerData, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetchFromAPI("/items/customers?filter[uuid][_eq]=".concat(referralUUID), token)];
            case 1:
                referrerData = _a.sent();
                if (referrerData && referrerData.length > 0) {
                    return [2 /*return*/, referrerData[0]];
                }
                else {
                    console.error("Referrer not found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error fetching referrer data:", error_5);
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
export var fetchCampaignMetadata = function (campaignUUID, token) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignData, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetchFromAPI("/items/campaign_metadata?filter[campaign_uuid][_eq]=".concat(campaignUUID), token)];
            case 1:
                campaignData = _a.sent();
                if (campaignData && campaignData.length > 0) {
                    return [2 /*return*/, campaignData[0]];
                }
                else {
                    console.error("Campaign metadata not found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Error fetching campaign metadata:", error_6);
                throw error_6;
            case 3: return [2 /*return*/];
        }
    });
}); };

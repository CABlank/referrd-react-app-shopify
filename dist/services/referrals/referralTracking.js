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
// Fetch a specific customer by UUID
export var fetchCustomerByUUID = function (uuid, token) { return __awaiter(void 0, void 0, void 0, function () {
    var customers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchFromAPI("/items/customers?filter[uuid][_eq]=".concat(uuid), token)];
            case 1:
                customers = _a.sent();
                if (!customers || customers.length === 0) {
                    throw new Error("Customer with UUID ".concat(uuid, " not found"));
                }
                return [2 /*return*/, customers[0]];
        }
    });
}); };
// Create a new customer
export var createCustomer = function (customer, token) { return __awaiter(void 0, void 0, void 0, function () {
    var createdCustomer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("Creating customer with data:", customer);
                console.log("Using token:", token);
                return [4 /*yield*/, fetchFromAPI("/items/customers", token, {
                        method: "POST",
                        body: JSON.stringify(customer),
                    })];
            case 1:
                createdCustomer = _a.sent();
                if (createdCustomer === null) {
                    console.log("Customer created successfully but no content was returned.");
                    throw new Error("Customer creation failed, no data returned.");
                }
                else {
                    console.log("Created new customer:", createdCustomer);
                    return [2 /*return*/, createdCustomer]; // Return the created customer object
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error creating customer:", error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Manually increment a customer field value
export var incrementCustomerField = function (customerId, fieldName, currentValue, token) { return __awaiter(void 0, void 0, void 0, function () {
    var newValue, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                newValue = currentValue + 1;
                return [4 /*yield*/, fetchFromAPI("/items/customers/".concat(customerId), token, {
                        method: "PATCH",
                        body: JSON.stringify((_a = {},
                            _a[fieldName] = newValue,
                            _a)),
                    })];
            case 1:
                _b.sent();
                console.log("Incremented field ".concat(fieldName, " for customer ID ").concat(customerId, " to ").concat(newValue));
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error("Error incrementing field ".concat(fieldName, " for customer ID ").concat(customerId, ":"), error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Register a click on a referral link (Ensuring Atomic Operation)
export var registerClick = function (referralUuid, token) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetchCustomerByUUID(referralUuid, token)];
            case 1:
                customer = _a.sent();
                return [4 /*yield*/, incrementCustomerField(customer.id, "click_count", customer.click_count, token)];
            case 2:
                _a.sent();
                console.log("Registered click for referral UUID ".concat(referralUuid));
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error registering click:", error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Register a sign-up (registration) through a referral
export var registerSignup = function (referralUuid, newCustomer, token) { return __awaiter(void 0, void 0, void 0, function () {
    var referringCustomer, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, fetchCustomerByUUID(referralUuid, token)];
            case 1:
                referringCustomer = _a.sent();
                // Create new customer with `referred_by` set to the referring customer's UUID
                return [4 /*yield*/, createCustomer(__assign(__assign({}, newCustomer), { referred_by: referringCustomer.uuid }), token)];
            case 2:
                // Create new customer with `referred_by` set to the referring customer's UUID
                _a.sent();
                // Increment the signup count for the referring customer
                return [4 /*yield*/, incrementCustomerField(referringCustomer.id, "signup_count", referringCustomer.signup_count, token)];
            case 3:
                // Increment the signup count for the referring customer
                _a.sent();
                console.log("Registered signup for referrer UUID ".concat(referralUuid));
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Error registering signup:", error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Register a conversion (e.g., purchase) attributed to a referral
export var registerConversion = function (customerUuid, token) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, referrer, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, fetchCustomerByUUID(customerUuid, token)];
            case 1:
                customer = _a.sent();
                if (!customer.referred_by) return [3 /*break*/, 4];
                return [4 /*yield*/, fetchCustomerByUUID(customer.referred_by, token)];
            case 2:
                referrer = _a.sent();
                return [4 /*yield*/, incrementCustomerField(referrer.id, "conversion_count", referrer.conversion_count, token)];
            case 3:
                _a.sent();
                console.log("Registered conversion for referrer UUID ".concat(customer.referred_by));
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                console.error("Error registering conversion:", error_5);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Fetch referrals and stats for a specific customer
export var fetchReferralsForCustomer = function (customerUuid, token) { return __awaiter(void 0, void 0, void 0, function () {
    var referrals, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetchFromAPI("/items/customers?filter[referred_by][_eq]=".concat(customerUuid), token)];
            case 1:
                referrals = _a.sent();
                if (!referrals) {
                    throw new Error("No referrals found for customer UUID ".concat(customerUuid));
                }
                console.log("Fetched referrals for customer UUID ".concat(customerUuid, ":"), referrals);
                return [2 /*return*/, referrals];
            case 2:
                error_6 = _a.sent();
                console.error("Error fetching referrals:", error_6);
                throw error_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Fetch stats for a specific customer
export var fetchReferralStats = function (customerUuid, token) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetchCustomerByUUID(customerUuid, token)];
            case 1:
                customer = _a.sent();
                console.log("Fetched stats for customer UUID ".concat(customerUuid));
                return [2 /*return*/, {
                        clicks: customer.click_count,
                        signups: customer.signup_count,
                        conversions: customer.conversion_count,
                    }];
            case 2:
                error_7 = _a.sent();
                console.error("Error fetching referral stats:", error_7);
                throw error_7;
            case 3: return [2 /*return*/];
        }
    });
}); };

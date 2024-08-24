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
var login = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("".concat(API_URL, "/auth/login"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                error = _a.sent();
                console.error("Login failed:", error);
                throw new Error("Login failed: ".concat(error.message));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
var refreshToken = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, fetch("".concat(API_URL, "/auth/refresh"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refresh_token: refreshToken }),
                    })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                error = _a.sent();
                console.error("Token refresh failed:", error);
                throw new Error("Token refresh failed: ".concat(error.message || "No error message returned"));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                return [2 /*return*/, data];
            case 5:
                error_1 = _a.sent();
                console.error("Error refreshing access token:", error_1);
                throw error_1; // Re-throw the error to be caught by the calling function
            case 6: return [2 /*return*/];
        }
    });
}); };
var logout = function (refreshToken_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([refreshToken_1], args_1, true), void 0, function (refreshToken, mode) {
        var response, error, err_1, data, err_2;
        if (mode === void 0) { mode = "json"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(API_URL, "/auth/logout"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refresh_token: refreshToken, mode: mode }),
                    })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, response.json()];
                case 3:
                    error = _a.sent();
                    console.error("Logout failed:", error);
                    throw new Error("Logout failed: ".concat(error.message));
                case 4:
                    err_1 = _a.sent();
                    console.error("Unexpected response during logout");
                    throw new Error("Logout failed with unexpected response");
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, response.json()];
                case 6:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 7:
                    err_2 = _a.sent();
                    console.warn("Logout response was not JSON, treating as success");
                    return [2 /*return*/, {}]; // Assuming empty response body is still a success
                case 8: return [2 /*return*/];
            }
        });
    });
};
var fetchUserData = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("".concat(API_URL, "/users/me"), {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer ".concat(token),
                        "Content-Type": "application/json",
                    },
                })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                error = _a.sent();
                if (error.errors[0].extensions.code === "TOKEN_EXPIRED") {
                    console.error("Token expired:", error);
                    throw new Error("Token expired");
                }
                console.error("Failed to fetch user data:", error);
                throw new Error("Failed to fetch user data: ".concat(error.message));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                return [2 /*return*/, data.data]; // Assuming the user data is under a "data" key
        }
    });
}); };
var fetchUserRole = function (token, roleId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("".concat(API_URL, "/roles/").concat(roleId), {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer ".concat(token),
                        "Content-Type": "application/json",
                    },
                })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                error = _a.sent();
                console.error("Failed to fetch user role:", error);
                throw new Error("Failed to fetch user role: ".concat(error.message));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                return [2 /*return*/, data.data];
        }
    });
}); };
var createUser = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("".concat(API_URL, "/users/register"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                })];
            case 1:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                error = _a.sent();
                console.error("Failed to create user:", error);
                throw new Error("Failed to create user: ".concat(error.message));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                return [2 /*return*/, data.data];
        }
    });
}); };
export default {
    login: login,
    refreshToken: refreshToken,
    logout: logout,
    fetchUserData: fetchUserData,
    fetchUserRole: fetchUserRole,
    createUser: createUser,
};

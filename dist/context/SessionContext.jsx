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
import React, { createContext, useContext, useState, useEffect, useRef, } from "react";
import authService from "../services/auth/auth";
import Cookies from "js-cookie";
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var SessionContext = createContext(undefined);
export var SessionProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), session = _b[0], setSession = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(undefined), name = _d[0], setName = _d[1];
    var refreshPromiseRef = useRef(null);
    var hasInitialized = useRef(false);
    var saveTokensToCookies = function (token, refreshToken, expires) {
        var expirationTime = Date.now() + expires * 1000;
        Cookies.set("token_expiration", String(expirationTime), {
            secure: true,
            sameSite: "Strict",
        });
        Cookies.set("access_token", token, { secure: true, sameSite: "Strict" });
        Cookies.set("refresh_token", refreshToken, {
            secure: true,
            sameSite: "Strict",
        });
    };
    var clearSession = function () {
        setSession(null);
        setName(undefined);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("token_expiration");
        Cookies.remove("__stripe_mid");
        Cookies.remove("__stripe_sid");
    };
    var login = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
        var data, token, refreshToken, expires, user, role, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, authService.login(credentials)];
                case 2:
                    data = (_a.sent()).data;
                    token = data.access_token, refreshToken = data.refresh_token, expires = data.expires;
                    saveTokensToCookies(token, refreshToken, expires);
                    return [4 /*yield*/, authService.fetchUserData(token)];
                case 3:
                    user = _a.sent();
                    return [4 /*yield*/, authService.fetchUserRole(token, user.role)];
                case 4:
                    role = _a.sent();
                    setSession({
                        user: {
                            id: user.id,
                            name: user.first_name,
                            email: user.email,
                            role: role.name,
                        },
                        token: token,
                        refreshToken: refreshToken,
                        expires: expires,
                    });
                    setName(user.first_name);
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error("Login error:", error_1);
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var logout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var refreshToken, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    refreshToken = Cookies.get("refresh_token") || (session === null || session === void 0 ? void 0 : session.refreshToken);
                    if (!refreshToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, authService.logout(refreshToken)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error("Logout error:", error_2);
                    return [3 /*break*/, 5];
                case 4:
                    clearSession();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var isRefreshing = false;
    var withTokenRefresh = function (apiCall, // Accept optional userId
    propsRefreshToken, userId) { return __awaiter(void 0, void 0, void 0, function () {
        var PrismaUserId, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("user id SESSIONCONTEXT:", userId); // Log the userId
                    PrismaUserId = userId;
                    console.log("Prisma user id:", PrismaUserId); // Log the userId
                    return [4 /*yield*/, refreshAccessToken(propsRefreshToken, session === null || session === void 0 ? void 0 : session.user.id, PrismaUserId)];
                case 1:
                    token = _a.sent();
                    if (!token)
                        throw new Error("Failed to refresh token");
                    console.log("Using access token for API call:", token);
                    return [4 /*yield*/, apiCall(token, session === null || session === void 0 ? void 0 : session.user.id)];
                case 2: return [2 /*return*/, _a.sent()]; // Pass userId to the API call
            }
        });
    }); };
    var refreshAccessToken = function (propsRefreshToken, userId, // Optional userId parameter
    PrismaUserId // Optional userId parameter
    ) { return __awaiter(void 0, void 0, void 0, function () {
        var refreshPromise, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (refreshPromiseRef.current)
                        return [2 /*return*/, refreshPromiseRef.current];
                    refreshPromise = (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var refreshTokenToUse, tokenRecord, data, token_1, newRefreshToken_1, expires_1, user_1, role_1, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    refreshTokenToUse = propsRefreshToken ||
                                        Cookies.get("refresh_token") ||
                                        (session === null || session === void 0 ? void 0 : session.refreshToken);
                                    if (!(!refreshTokenToUse && (session === null || session === void 0 ? void 0 : session.token))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, prisma.token.findFirst({
                                            where: {
                                                accessToken: session.token,
                                            },
                                        })];
                                case 1:
                                    tokenRecord = _a.sent();
                                    if (tokenRecord) {
                                        refreshTokenToUse = tokenRecord.refreshToken;
                                    }
                                    _a.label = 2;
                                case 2:
                                    if (!refreshTokenToUse) {
                                        console.error("No refresh token found");
                                        return [2 /*return*/, null];
                                    }
                                    console.log("Using refresh token:", refreshTokenToUse);
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 9, , 11]);
                                    console.log("PrismaUserId id:", PrismaUserId); // Log the userId
                                    return [4 /*yield*/, authService.refreshToken(refreshTokenToUse)];
                                case 4:
                                    data = (_a.sent()).data;
                                    token_1 = data.access_token, newRefreshToken_1 = data.refresh_token, expires_1 = data.expires;
                                    console.log("New access token obtained:", token_1);
                                    console.log("New refresh token obtained:", newRefreshToken_1);
                                    return [4 /*yield*/, authService.fetchUserData(token_1)];
                                case 5:
                                    user_1 = _a.sent();
                                    return [4 /*yield*/, authService.fetchUserRole(token_1, user_1.role)];
                                case 6:
                                    role_1 = _a.sent();
                                    setSession(function (prev) {
                                        return prev
                                            ? __assign(__assign({}, prev), { token: token_1, refreshToken: newRefreshToken_1, expires: expires_1, user: {
                                                    id: user_1.id,
                                                    name: user_1.first_name,
                                                    email: user_1.email,
                                                    role: role_1.name,
                                                } }) : {
                                            user: {
                                                id: user_1.id,
                                                name: user_1.first_name,
                                                email: user_1.email,
                                                role: role_1.name,
                                            },
                                            token: token_1,
                                            refreshToken: newRefreshToken_1,
                                            expires: expires_1,
                                        };
                                    });
                                    setName(user_1.first_name);
                                    saveTokensToCookies(token_1, newRefreshToken_1, expires_1);
                                    if (!PrismaUserId) return [3 /*break*/, 8];
                                    return [4 /*yield*/, fetch("/api/sessionLoadChecker", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                PrismaUserId: PrismaUserId,
                                                accessToken: token_1,
                                                refreshToken: newRefreshToken_1,
                                                expires: expires_1,
                                            }),
                                        })];
                                case 7:
                                    _a.sent();
                                    _a.label = 8;
                                case 8:
                                    console.log("Refreshed access token for user:", userId); // Log the userId
                                    return [2 /*return*/, token_1];
                                case 9:
                                    error_3 = _a.sent();
                                    console.error("Error refreshing access token:", error_3);
                                    return [4 /*yield*/, logout()];
                                case 10:
                                    _a.sent();
                                    return [2 /*return*/, null];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })();
                    refreshPromiseRef.current = refreshPromise;
                    return [4 /*yield*/, refreshPromise];
                case 1:
                    token = _a.sent();
                    refreshPromiseRef.current = null;
                    return [2 /*return*/, token];
            }
        });
    }); };
    var handleFetchUserDataError = function (error) { return __awaiter(void 0, void 0, void 0, function () {
        var token, user, role, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 || error.message === "Token expired")) return [3 /*break*/, 8];
                    return [4 /*yield*/, refreshAccessToken()];
                case 1:
                    token = _b.sent();
                    if (!token) return [3 /*break*/, 6];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, authService.fetchUserData(token)];
                case 3:
                    user = _b.sent();
                    return [4 /*yield*/, authService.fetchUserRole(token, user.role)];
                case 4:
                    role = _b.sent();
                    setSession({
                        user: {
                            id: user.id,
                            name: user.first_name,
                            email: user.email,
                            role: role.name,
                        },
                        token: token,
                        refreshToken: (session === null || session === void 0 ? void 0 : session.refreshToken) || "",
                        expires: (session === null || session === void 0 ? void 0 : session.expires) || 0,
                    });
                    setName(user.first_name);
                    console.log("User data fetched after token refresh:", user);
                    return [2 /*return*/];
                case 5:
                    err_1 = _b.sent();
                    console.error("Error fetching user data after refresh:", err_1);
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, logout()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 8:
                    console.error("Error fetching user data:", error);
                    return [4 /*yield*/, logout()];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        var initializeSession = function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, refreshToken, user, role, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hasInitialized.current)
                            return [2 /*return*/];
                        setLoading(true);
                        token = Cookies.get("access_token");
                        refreshToken = Cookies.get("refresh_token");
                        if (!token) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 6]);
                        return [4 /*yield*/, authService.fetchUserData(token)];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, authService.fetchUserRole(token, user.role)];
                    case 3:
                        role = _a.sent();
                        setSession({
                            user: {
                                id: user.id,
                                name: user.first_name,
                                email: user.email,
                                role: role.name,
                            },
                            token: token,
                            refreshToken: refreshToken || "",
                            expires: Number(Cookies.get("token_expiration")) || 0,
                        });
                        setName(user.first_name);
                        return [3 /*break*/, 6];
                    case 4:
                        error_4 = _a.sent();
                        return [4 /*yield*/, handleFetchUserDataError(error_4)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        setLoading(false);
                        hasInitialized.current = true;
                        return [2 /*return*/];
                }
            });
        }); };
        initializeSession();
    }, []);
    return (<SessionContext.Provider value={{
            session: session,
            setSession: setSession,
            login: login,
            logout: logout,
            refreshAccessToken: refreshAccessToken,
            withTokenRefresh: withTokenRefresh,
            loading: loading,
            name: name,
        }}>
      {children}
    </SessionContext.Provider>);
};
export var useSession = function () {
    var context = useContext(SessionContext);
    if (!context)
        throw new Error("useSession must be used within a SessionProvider");
    return context;
};

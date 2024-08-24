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
import { prisma } from "../lib/prisma"; // Adjust the path as needed
import { saveTokensToCookies, logout, handleFetchUserDataError, login, } from "./sessionUtils";
var SessionContext = createContext(undefined);
export var SessionProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), session = _b[0], setSession = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(undefined), name = _d[0], setName = _d[1];
    var refreshPromiseRef = useRef(null);
    var refreshQueue = [];
    var hasInitialized = useRef(false);
    var withTokenRefresh = function (makeApiCall, overrideRefreshToken, userIdForApiCall) { return __awaiter(void 0, void 0, void 0, function () {
        var newToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Current User ID:", userIdForApiCall);
                    return [4 /*yield*/, refreshAccessToken(overrideRefreshToken, session === null || session === void 0 ? void 0 : session.user.id, userIdForApiCall)];
                case 1:
                    newToken = _a.sent();
                    if (!newToken) {
                        throw new Error("Could not refresh the token");
                    }
                    console.log("New token for API call:", newToken);
                    return [4 /*yield*/, makeApiCall(newToken, session === null || session === void 0 ? void 0 : session.user.id)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    // Updated refreshAccessToken function in SessionContext.tsx
    var refreshAccessToken = function (overrideToken, sessionUserId, apiRequestUserId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (refreshPromiseRef.current) {
                return [2 /*return*/, refreshPromiseRef.current];
            }
            refreshPromiseRef.current = new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var tokenToUse, newToken, error_1, error_2, nextInQueue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 10, 11, 12]);
                            return [4 /*yield*/, getRefreshToken(overrideToken, apiRequestUserId)];
                        case 1:
                            tokenToUse = _a.sent();
                            if (!tokenToUse) {
                                console.error("No refresh token found");
                                resolve(null);
                                return [2 /*return*/];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, , 9]);
                            return [4 /*yield*/, requestNewTokens(tokenToUse)];
                        case 3:
                            newToken = _a.sent();
                            console.log("API Request User ID:", apiRequestUserId);
                            console.log("New Token:", newToken);
                            if (!apiRequestUserId) return [3 /*break*/, 5];
                            // Save the new tokens to the database
                            return [4 /*yield*/, updateTokensInDatabase(apiRequestUserId, newToken)];
                        case 4:
                            // Save the new tokens to the database
                            _a.sent();
                            _a.label = 5;
                        case 5: return [4 /*yield*/, updateSessionWithNewToken(newToken)];
                        case 6:
                            _a.sent();
                            resolve(newToken.access_token);
                            return [3 /*break*/, 9];
                        case 7:
                            error_1 = _a.sent();
                            console.error("Failed to refresh access token:", error_1);
                            return [4 /*yield*/, logout(setSession, setName, session)];
                        case 8:
                            _a.sent();
                            resolve(null);
                            return [3 /*break*/, 9];
                        case 9: return [3 /*break*/, 12];
                        case 10:
                            error_2 = _a.sent();
                            console.error("Error during token refresh:", error_2);
                            reject(null);
                            return [3 /*break*/, 12];
                        case 11:
                            refreshPromiseRef.current = null;
                            // Process the next request in the queue
                            if (refreshQueue.length > 0) {
                                nextInQueue = refreshQueue.shift();
                                nextInQueue && nextInQueue();
                            }
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/, new Promise(function (resolve) {
                    refreshQueue.push(function () {
                        resolve(refreshPromiseRef.current);
                    });
                    // If we're the only item in the queue, execute immediately
                    if (refreshQueue.length === 1) {
                        refreshQueue[0]();
                    }
                })];
        });
    }); };
    var updateTokensInDatabase = function (userId, newToken) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Update the tokens in the database using Prisma
                    return [4 /*yield*/, prisma.token.updateMany({
                            where: { userId: userId },
                            data: {
                                accessToken: newToken.access_token,
                                refreshToken: newToken.refresh_token,
                                expiresAt: new Date(Date.now() + newToken.expires * 1000),
                                updatedAt: new Date(),
                            },
                        })];
                case 1:
                    // Update the tokens in the database using Prisma
                    _a.sent();
                    console.log("Tokens updated successfully in the database");
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error updating tokens in the database:", error_3);
                    throw new Error("Failed to update tokens in the database");
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getRefreshToken = function (overrideToken, apiRequestUserId) { return __awaiter(void 0, void 0, void 0, function () {
        var response, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!apiRequestUserId) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/api/sessionLoadChecker", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ apiRequestUserId: apiRequestUserId }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (result.refreshToken) {
                        console.log("Found refresh token in the database");
                        return [2 /*return*/, result.refreshToken];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Error fetching refresh token from database:", error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, (overrideToken || Cookies.get("refresh_token") || (session === null || session === void 0 ? void 0 : session.refreshToken))];
            }
        });
    }); };
    var requestNewTokens = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authService.refreshToken(refreshToken)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, {
                            access_token: data.access_token,
                            refresh_token: data.refresh_token,
                            expires: data.expires,
                        }];
            }
        });
    }); };
    var updateSessionWithNewToken = function (newToken) { return __awaiter(void 0, void 0, void 0, function () {
        var user, role;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authService.fetchUserData(newToken.access_token)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, authService.fetchUserRole(newToken.access_token, user.role)];
                case 2:
                    role = _a.sent();
                    setSession(function (prevSession) { return (__assign(__assign({}, prevSession), { token: newToken.access_token, refreshToken: newToken.refresh_token, expires: newToken.expires, user: {
                            id: user.id,
                            name: user.first_name,
                            email: user.email,
                            role: role.name,
                        } })); });
                    setName(user.first_name);
                    saveTokensToCookies(newToken.access_token, newToken.refresh_token, newToken.expires);
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        var initializeSession = function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, refreshToken, user, role, error_5;
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
                        error_5 = _a.sent();
                        return [4 /*yield*/, handleFetchUserDataError(error_5, refreshAccessToken, setSession, setName, session)];
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
            login: function (credentials) {
                return login(credentials, setLoading, setSession, setName);
            },
            logout: function () { return logout(setSession, setName, session); },
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

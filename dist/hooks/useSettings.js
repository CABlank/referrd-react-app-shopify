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
import { useState, useEffect, useRef } from "react";
import { fetchSettings, updateSettings, } from "../services/settings";
import { useSession } from "../contexts/SessionContext";
// Custom hook to manage settings
var useSettings = function () {
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    // State management using a single object to avoid multiple state updates
    var _b = useState({
        settings: null,
        loading: true,
        error: null,
    }), settingsState = _b[0], setSettingsState = _b[1];
    var loadExecutedRef = useRef(false);
    useEffect(function () {
        var loadSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && !loadExecutedRef.current)) return [3 /*break*/, 4];
                        setSettingsState(function (prevState) { return (__assign(__assign({}, prevState), { loading: true })); });
                        loadExecutedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, withTokenRefresh(function (token) { return fetchSettings(token); })];
                    case 2:
                        data = _a.sent();
                        setSettingsState({ settings: data, loading: false, error: null });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error("Error fetching settings:", err_1);
                        setSettingsState({
                            settings: null,
                            loading: false,
                            error: "Failed to fetch settings. Please try again.",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        if (session) {
            loadSettings();
        }
    }, [session, withTokenRefresh]);
    var handleChange = function (field, value) {
        setSettingsState(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), { settings: prevState.settings
                    ? __assign(__assign({}, prevState.settings), (_a = {}, _a[field] = value, _a)) : null }));
        });
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((session === null || session === void 0 ? void 0 : session.token) && settingsState.settings)) return [3 /*break*/, 5];
                    setSettingsState(function (prevState) { return (__assign(__assign({}, prevState), { loading: true })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return updateSettings(settingsState.settings, token);
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    console.error("Error updating settings:", err_2);
                    setSettingsState(function (prevState) { return (__assign(__assign({}, prevState), { loading: false, error: "Failed to update settings. Please try again." })); });
                    return [3 /*break*/, 5];
                case 4:
                    setSettingsState(function (prevState) { return (__assign(__assign({}, prevState), { loading: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return {
        settings: settingsState.settings,
        loading: settingsState.loading,
        error: settingsState.error,
        handleChange: handleChange,
        handleSave: handleSave,
    };
};
export default useSettings;

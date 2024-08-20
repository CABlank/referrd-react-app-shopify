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
import { fetchCustomers, fetchCampaigns, fetchCompanies, } from "../services/referrals/referrals";
import { useSession } from "../context/SessionContext";
var useCustomers = function () {
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var _b = useState({
        customers: [],
        campaigns: [],
        loading: true,
        error: null,
    }), state = _b[0], setState = _b[1];
    var loadExecutedRef = useRef(false);
    useEffect(function () {
        var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var companiesData, companyUUID_1, _a, customersData, campaignsData, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && !loadExecutedRef.current)) return [3 /*break*/, 5];
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { loading: true })); });
                        loadExecutedRef.current = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, withTokenRefresh(function (token) {
                                return fetchCompanies(token);
                            })];
                    case 2:
                        companiesData = _b.sent();
                        if (!companiesData || companiesData.length === 0) {
                            throw new Error("No companies found");
                        }
                        companyUUID_1 = companiesData[0].UUID;
                        if (!companyUUID_1) {
                            throw new Error("Company UUID is undefined");
                        }
                        return [4 /*yield*/, Promise.all([
                                withTokenRefresh(function (token) { return fetchCustomers(token, companyUUID_1); }),
                                withTokenRefresh(function (token) { return fetchCampaigns(token); }),
                            ])];
                    case 3:
                        _a = _b.sent(), customersData = _a[0], campaignsData = _a[1];
                        // Set the state with the fetched data
                        setState({
                            customers: customersData,
                            campaigns: campaignsData,
                            loading: false,
                            error: null,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        console.error("Error fetching data:", err_1);
                        setState({
                            customers: [],
                            campaigns: [],
                            loading: false,
                            error: "Failed to fetch customers. Please try again.",
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, [session, withTokenRefresh]);
    return state;
};
export default useCustomers;

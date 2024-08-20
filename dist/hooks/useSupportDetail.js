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
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { fetchSupportQuery, fetchSupportResponses, submitResponse, updateSupportQueryStatus, } from "../services/support/support";
import { useSession } from "../context/SessionContext";
// Custom hook to manage support query details and responses
var useSupportDetail = function () {
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var router = useRouter();
    var supportId = router.query.supportId;
    var _b = useState({
        query: null,
        responses: [],
        loading: true,
        error: null,
        newMessage: "",
    }), state = _b[0], setState = _b[1];
    var loadExecutedRef = useRef(false);
    useEffect(function () {
        // Load support query and responses
        var loadQueryAndResponses = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, queryData_1, responsesData_1, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && supportId && !loadExecutedRef.current)) return [3 /*break*/, 4];
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { loading: true })); });
                        loadExecutedRef.current = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                withTokenRefresh(function (token) {
                                    return fetchSupportQuery(supportId, token);
                                }),
                                withTokenRefresh(function (token) { return fetchSupportResponses(token); }),
                            ])];
                    case 2:
                        _a = _b.sent(), queryData_1 = _a[0], responsesData_1 = _a[1];
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { query: queryData_1, responses: responsesData_1.filter(function (response) {
                                return response.support_query_id === parseInt(supportId);
                            }), loading: false, error: null })); });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.error("Error fetching support query or responses:", err_1);
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { loading: false, error: "Failed to fetch support query or responses. Please try again." })); });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadQueryAndResponses();
    }, [session, supportId, withTokenRefresh]);
    // Handle new message input change
    var handleNewMessageChange = function (value) {
        setState(function (prevState) { return (__assign(__assign({}, prevState), { newMessage: value })); });
    };
    // Submit a new message
    var handleNewMessageSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response_1, responsesData_2, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(state.query && (session === null || session === void 0 ? void 0 : session.token))) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    response_1 = {
                        support_query_id: state.query.id,
                        message: state.newMessage,
                    };
                    return [4 /*yield*/, withTokenRefresh(function (token) { return submitResponse(response_1, token); })];
                case 2:
                    _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { newMessage: "" })); });
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return fetchSupportResponses(token);
                        })];
                case 3:
                    responsesData_2 = _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { responses: responsesData_2.filter(function (response) { return response.support_query_id === state.query.id; }) })); });
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.error("Error submitting new message:", err_2);
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { error: "Failed to submit new message. Please try again." })); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Update the status of the support query
    var handleStatusChange = function (status) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedQuery_1, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(state.query && (session === null || session === void 0 ? void 0 : session.token))) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return updateSupportQueryStatus(state.query.id, { status: status }, token);
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return fetchSupportQuery(state.query.id, token);
                        })];
                case 3:
                    updatedQuery_1 = _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { query: updatedQuery_1 })); });
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    console.error("Error updating query status:", err_3);
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { error: "Failed to update query status. Please try again." })); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Combine query and response messages for display
    var combinedMessages = __spreadArray(__spreadArray([], state.responses.map(function (response) { return (__assign(__assign({}, response), { type: "response" })); }), true), [
        state.query && __assign(__assign({}, state.query), { type: "query", message: state.query.question }),
    ], false).filter(Boolean)
        .sort(function (a, b) {
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
    });
    return {
        state: state,
        handleNewMessageChange: handleNewMessageChange,
        handleNewMessageSubmit: handleNewMessageSubmit,
        handleStatusChange: handleStatusChange,
        combinedMessages: combinedMessages,
    };
};
export default useSupportDetail;

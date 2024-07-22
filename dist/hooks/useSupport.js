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
import { useRouter } from "next/router";
import { fetchSupportQueries, submitSupportQuery, fetchSupportQuery, fetchSupportResponses, submitResponse, updateSupportQueryStatus, } from "../services/support/support";
// Custom hook to manage support queries and responses
var useSupport = function () {
    // const { session, withTokenRefresh } = useSession(); // No longer needed since we're using a hardcoded token
    var router = useRouter(); // Add router here
    var _a = useState({
        queries: [],
        query: null,
        responses: [],
        loading: true,
        error: null,
        newMessage: "",
        queryTitle: "",
        question: "",
        topic: "Payment",
    }), state = _a[0], setState = _a[1];
    var loadExecutedRef = useRef(false);
    useEffect(function () {
        var loadQueries = function () { return __awaiter(void 0, void 0, void 0, function () {
            var hardcodedToken, data_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
                        if (!(hardcodedToken && !loadExecutedRef.current)) return [3 /*break*/, 4];
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { loading: true })); });
                        loadExecutedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetchSupportQueries(hardcodedToken)];
                    case 2:
                        data_1 = _a.sent();
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { queries: data_1, loading: false, error: null })); });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error("Error fetching support queries:", err_1);
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { loading: false, error: "Failed to fetch support queries. Please try again." })); });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadQueries();
    }, []);
    // Handle input changes
    var handleChange = function (field, value) {
        setState(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[field] = value, _a)));
        });
    };
    // Submit a new support query
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var hardcodedToken, data, updatedQueries_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
                    if (!hardcodedToken) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    data = {
                        title: state.queryTitle,
                        question: state.question,
                        topic: state.topic,
                        status: "Pending",
                    };
                    return [4 /*yield*/, submitSupportQuery(data, hardcodedToken)];
                case 2:
                    _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { queryTitle: "", question: "", topic: "Payment" })); });
                    return [4 /*yield*/, fetchSupportQueries(hardcodedToken)];
                case 3:
                    updatedQueries_1 = _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { queries: updatedQueries_1 })); });
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.error("Error submitting support query:", err_2);
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { error: "Failed to submit support query. Please try again." })); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Submit a new message for a specific support query
    var handleNewMessageSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var hardcodedToken, response, responsesData_1, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
                    if (!(state.query && hardcodedToken)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    response = {
                        support_query_id: state.query.id,
                        message: state.newMessage,
                    };
                    return [4 /*yield*/, submitResponse(response, hardcodedToken)];
                case 2:
                    _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { newMessage: "" })); });
                    return [4 /*yield*/, fetchSupportResponses(hardcodedToken)];
                case 3:
                    responsesData_1 = _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { responses: responsesData_1.filter(function (response) { return response.support_query_id === state.query.id; }) })); });
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    console.error("Error submitting new message:", err_3);
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { error: "Failed to submit new message. Please try again." })); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Update the status of a specific support query
    var handleStatusChange = function (status) { return __awaiter(void 0, void 0, void 0, function () {
        var hardcodedToken, updatedQuery_1, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
                    if (!(state.query && hardcodedToken)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, updateSupportQueryStatus(state.query.id, { status: status }, hardcodedToken)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchSupportQuery(state.query.id, hardcodedToken)];
                case 3:
                    updatedQuery_1 = _a.sent();
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { query: updatedQuery_1 })); });
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _a.sent();
                    console.error("Error updating query status:", err_4);
                    setState(function (prevState) { return (__assign(__assign({}, prevState), { error: "Failed to update query status. Please try again." })); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Handle selecting a query
    var handleQuerySelect = function (query) {
        router.push("/brand/support/".concat(query.id)); // Navigate to the support detail page
    };
    return {
        state: state,
        handleChange: handleChange,
        handleSubmit: handleSubmit,
        handleNewMessageSubmit: handleNewMessageSubmit,
        handleStatusChange: handleStatusChange,
        handleQuerySelect: handleQuerySelect,
    };
};
export default useSupport;
// };

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
import React, { useEffect, useRef, useState } from "react";
import SearchSortSection from "../../components/common/SearchSortSection";
import DataTableHeader from "../../components/common/DataTableHeader";
import PerformanceSummary from "../../components/common/PerformanceSummary";
import Pagination from "../../components/common/Pagination";
import { useRouter } from "next/router";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import DataTableRows from "../../components/common/DataTableRows";
import { fetchPayments, updatePaymentStatus, fetchCustomers, fetchCampaigns, fetchReferrals, } from "../../services/payments/payments";
import { useSession } from "../../contexts/SessionContext";
import DeclineIcon from "@/components/Icons/DeclineIcon";
import AcceptIcon from "@/components/Icons/AcceptIcon";
import SeparatorIcon from "@/components/Icons/SeparatorIcon";
import ScrollableContainer from "@/components/common/ScrollableContainer";
var Payments = function () {
    var router = useRouter();
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var _b = useState([]), payments = _b[0], setPayments = _b[1];
    var _c = useState([]), customers = _c[0], setCustomers = _c[1];
    var _d = useState([]), campaigns = _d[0], setCampaigns = _d[1];
    var _e = useState([]), referrals = _e[0], setReferrals = _e[1];
    var _f = useState(true), loading = _f[0], setLoading = _f[1];
    var _g = useState(null), error = _g[0], setError = _g[1];
    var loadExecutedRef = useRef(false);
    // Search, sort, and pagination states
    var _h = useState(""), searchQuery = _h[0], setSearchQuery = _h[1];
    var _j = useState("date"), sortOrder = _j[0], setSortOrder = _j[1];
    var _k = useState(1), currentPage = _k[0], setCurrentPage = _k[1];
    var itemsPerPage = 10;
    useEffect(function () {
        var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var hardcodedToken, _a, paymentsData, customersData, campaignsData, referralsData, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
                        if (!(hardcodedToken && !loadExecutedRef.current)) return [3 /*break*/, 5];
                        setLoading(true);
                        loadExecutedRef.current = true; // Set the ref to true to indicate loadData has been called
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([
                                fetchPayments(hardcodedToken),
                                fetchCustomers(hardcodedToken),
                                fetchCampaigns(hardcodedToken),
                                fetchReferrals(hardcodedToken),
                            ])];
                    case 2:
                        _a = _b.sent(), paymentsData = _a[0], customersData = _a[1], campaignsData = _a[2], referralsData = _a[3];
                        setPayments(paymentsData);
                        setCustomers(customersData);
                        setCampaigns(campaignsData);
                        setReferrals(referralsData);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        console.error("Error loading data:", err_1);
                        setError("Failed to load data. Please try again.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, []);
    var handlePaymentAction = function (paymentId, action) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(session === null || session === void 0 ? void 0 : session.token)) return [3 /*break*/, 5];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return updatePaymentStatus(paymentId, action, token);
                        })];
                case 2:
                    _a.sent();
                    setPayments(function (prevPayments) {
                        return prevPayments.map(function (payment) {
                            return payment.id === paymentId ? __assign(__assign({}, payment), { status: action }) : payment;
                        });
                    });
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    console.error("Error processing payment action:", err_2);
                    setError("Failed to process payment action. Please try again.");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var ActionButtons = function (_a) {
        var payment = _a.payment;
        if (payment.status === "Pending") {
            return (<div className="flex justify-start items-center gap-2">
          <div className="flex items-center gap-1 cursor-pointer" onClick={function () { var _a; return handlePaymentAction((_a = payment.id) !== null && _a !== void 0 ? _a : 0, "Accepted"); }}>
            <p className="text-base text-[#10ad1b]">Accept</p>
            <AcceptIcon />
          </div>
          <SeparatorIcon />
          <div className="flex items-center gap-1 cursor-pointer" onClick={function () { var _a; return handlePaymentAction((_a = payment.id) !== null && _a !== void 0 ? _a : 0, "Declined"); }}>
            <p className="text-base text-[#d52121]">Decline</p>
            <DeclineIcon />
          </div>
        </div>);
        }
        else {
            return <p className="text-base text-gray-500">{payment.status}</p>;
        }
    };
    var mapPaymentData = function () {
        return payments.map(function (payment) {
            var referral = referrals.find(function (ref) { return ref.id === payment.referral_id; });
            var customer = customers.find(function (c) { return c.id === (referral === null || referral === void 0 ? void 0 : referral.referrer); });
            var campaign = campaigns.find(function (c) { return c.id === (referral === null || referral === void 0 ? void 0 : referral.campaign); });
            return __assign(__assign({}, payment), { referrer: (customer === null || customer === void 0 ? void 0 : customer.name) || "N/A", campaign: (campaign === null || campaign === void 0 ? void 0 : campaign.name) || "N/A", referralCashback: (referral === null || referral === void 0 ? void 0 : referral.spend) || 0, date: new Date(payment.date_created).toLocaleString(), status: payment.status, referral_id: payment.referral_id, date_created: payment.date_created }); // Add type assertion to MappedPayment
        });
    };
    var handleSearch = function (query) {
        setSearchQuery(query);
    };
    var handleSort = function (order) {
        setSortOrder(order);
    };
    var handlePageChange = function (page) {
        setCurrentPage(page);
    };
    var filteredPayments = mapPaymentData().filter(function (payment) {
        return (payment.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.campaign.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    var sortedPayments = filteredPayments.sort(function (a, b) {
        if (sortOrder === "date") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a[sortOrder].localeCompare(b[sortOrder]);
    });
    var paginatedPayments = sortedPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    var columns = [
        { dataIndex: "date", className: "text-center text-sm" },
        { dataIndex: "referrer", className: "text-center" },
        { dataIndex: "campaign", className: "text-center" },
        { dataIndex: "referralCashback", className: "text-center" },
        {
            dataIndex: "id",
            className: "text-center flex justify-center items-center",
            customRender: function (id, record) { return (<ActionButtons payment={record}/>); },
        },
    ];
    var computePerformanceMetrics = function () {
        var totalPayments = payments.length;
        var acceptedPayments = payments.filter(function (p) { return p.status === "Accepted"; }).length;
        var declinedPayments = payments.filter(function (p) { return p.status === "Declined"; }).length;
        var pendingPayments = payments.filter(function (p) { return p.status === "Pending"; }).length;
        var totalReferralCashback = payments.reduce(function (acc, p) { var _a; return acc + (((_a = referrals.find(function (ref) { return ref.id === p.referral_id; })) === null || _a === void 0 ? void 0 : _a.spend) || 0); }, 0);
        var averageReferralCashback = totalPayments > 0 ? totalReferralCashback / totalPayments : 0;
        return {
            totalPayments: totalPayments,
            acceptedPayments: acceptedPayments,
            declinedPayments: declinedPayments,
            pendingPayments: pendingPayments,
            totalReferralCashback: totalReferralCashback.toFixed(2),
            averageReferralCashback: averageReferralCashback.toFixed(2),
        };
    };
    var metrics = computePerformanceMetrics();
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}

      <div className="flex flex-col justify-center items-center mx-auto gap-4 mt-6">
        {/* Performance Metrics */}
        <div className="relative w-full flex justify-center items-center">
          <ScrollableContainer>
            <PerformanceSummary metricName="Accepted Payments" value={metrics.acceptedPayments.toString()}/>
            <PerformanceSummary metricName="Declined Payments" value={metrics.declinedPayments.toString()}/>
            <PerformanceSummary metricName="Pending Payments" value={metrics.pendingPayments.toString()}/>
            <PerformanceSummary metricName="Total Ref Cashback" value={"$".concat(metrics.totalReferralCashback)}/>
            <PerformanceSummary metricName="Avg Ref Cashback" value={"$".concat(metrics.averageReferralCashback)}/>
          </ScrollableContainer>
        </div>

        {/* Search and Sort */}
        <SearchSortSection onSearch={handleSearch} onSort={handleSort}/>

        {/* Data Table and Pagination */}
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center">
          <DataTableHeader headers={[
            { title: "Date", align: "center" },
            { title: "Referrer", align: "center" },
            { title: "Campaign", align: "center" },
            { title: "Referral Fee", align: "center" },
            { title: "Action", align: "center", className: "extra-styles" },
        ]}/>
          <DataTableRows rowData={paginatedPayments} columns={columns}/>
          {sortedPayments.length > 0 && (<Pagination totalItems={sortedPayments.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>)}
        </div>
      </div>
    </div>);
};
export default Payments;

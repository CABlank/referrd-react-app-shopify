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
import React, { useEffect, useRef, useState } from "react";
import SearchSortSection from "../../components/common/SearchSortSection";
import DataTableHeader from "../../components/common/DataTableHeader";
import PerformanceSummary from "../../components/common/PerformanceSummary";
import Pagination from "../../components/common/Pagination";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import DataTableRows from "../../components/common/DataTableRows";
import { fetchCompanyUUID, fetchPaymentsByCompanyId, fetchReferrer, fetchCampaignMetadata, updatePaymentStatus as updatePaymentStatusService, } from "../../services/payments/payments";
import { useSession } from "../../context/SessionContext";
import DeclineIcon from "@/components/Icons/DeclineIcon";
import AcceptIcon from "@/components/Icons/AcceptIcon";
import SeparatorIcon from "@/components/Icons/SeparatorIcon";
import ScrollableContainer from "@/components/common/ScrollableContainer";
var Payments = function () {
    var _a = useSession(), session = _a.session, withTokenRefresh = _a.withTokenRefresh;
    var _b = useState([]), payments = _b[0], setPayments = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var loadExecutedRef = useRef(false);
    var _e = useState(""), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = useState("date"), sortOrder = _f[0], setSortOrder = _f[1];
    var _g = useState(1), currentPage = _g[0], setCurrentPage = _g[1];
    var _h = useState(10), itemsPerPage = _h[0], setItemsPerPage = _h[1];
    var _j = useState(null), buttonClicked = _j[0], setButtonClicked = _j[1];
    var _k = useState([]), selectedPayments = _k[0], setSelectedPayments = _k[1];
    var _l = useState(false), selectAll = _l[0], setSelectAll = _l[1];
    useEffect(function () {
        var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var companyUUID, paymentsData, mappedPayments, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((session === null || session === void 0 ? void 0 : session.token) && !loadExecutedRef.current)) return [3 /*break*/, 10];
                        setLoading(true);
                        loadExecutedRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, 9, 10]);
                        return [4 /*yield*/, fetchCompanyUUID(session.token)];
                    case 2:
                        companyUUID = _a.sent();
                        if (!companyUUID) return [3 /*break*/, 6];
                        return [4 /*yield*/, fetchPaymentsByCompanyId(companyUUID, session.token)];
                    case 3:
                        paymentsData = _a.sent();
                        if (!paymentsData) return [3 /*break*/, 5];
                        return [4 /*yield*/, Promise.all(paymentsData.map(function (payment) { return __awaiter(void 0, void 0, void 0, function () {
                                var referrer, _a, campaign, _b, referrerName, campaignName, referralFee;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!payment.referral_uuid) return [3 /*break*/, 2];
                                            return [4 /*yield*/, fetchReferrer(payment.referral_uuid, session.token)];
                                        case 1:
                                            _a = _c.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = null;
                                            _c.label = 3;
                                        case 3:
                                            referrer = _a;
                                            if (!payment.campaign_uuid) return [3 /*break*/, 5];
                                            return [4 /*yield*/, fetchCampaignMetadata(payment.campaign_uuid, session.token)];
                                        case 4:
                                            _b = _c.sent();
                                            return [3 /*break*/, 6];
                                        case 5:
                                            _b = null;
                                            _c.label = 6;
                                        case 6:
                                            campaign = _b;
                                            referrerName = (referrer === null || referrer === void 0 ? void 0 : referrer.name) || (referrer === null || referrer === void 0 ? void 0 : referrer.email) || "N/A";
                                            campaignName = campaign ? "".concat(campaign.name) : "N/A";
                                            referralFee = campaign
                                                ? calculateReferralFee(payment.total_price, campaign.commission, campaign.commissionType)
                                                : 0;
                                            return [2 /*return*/, __assign(__assign({}, payment), { referrer: referrerName, campaign: campaignName, referralCashback: referralFee, date: new Date(payment.date_created).toLocaleString(), order: "#".concat(payment.order_number) })];
                                    }
                                });
                            }); }))];
                    case 4:
                        mappedPayments = _a.sent();
                        setPayments(mappedPayments);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        setError("Failed to load company UUID.");
                        _a.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        err_1 = _a.sent();
                        console.error("Error loading data:", err_1);
                        setError("Failed to load data. Please try again.");
                        return [3 /*break*/, 10];
                    case 9:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, [session === null || session === void 0 ? void 0 : session.token]);
    var calculateReferralFee = function (totalPrice, commission, commissionType) {
        if (commissionType === "FixedAmount") {
            return commission;
        }
        else if (commissionType === "Percentage") {
            return (parseFloat(totalPrice) * commission) / 100;
        }
        return 0;
    };
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
                            return updatePaymentStatusService(paymentId, action, token);
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
    var handleBulkAction = function (action) { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((session === null || session === void 0 ? void 0 : session.token) && selectedPayments.length > 0)) return [3 /*break*/, 5];
                    setLoading(true);
                    setButtonClicked(action);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, withTokenRefresh(function (token) {
                            return Promise.all(selectedPayments.map(function (paymentId) {
                                return updatePaymentStatusService(paymentId, action, token);
                            }));
                        })];
                case 2:
                    _a.sent();
                    setPayments(function (prevPayments) {
                        return prevPayments.map(function (payment) {
                            var _a;
                            return selectedPayments.includes((_a = payment.id) !== null && _a !== void 0 ? _a : 0)
                                ? __assign(__assign({}, payment), { status: action }) : payment;
                        });
                    });
                    setSelectedPayments([]); // Clear selected payments
                    setSelectAll(false); // Reset select all state
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    console.error("Error processing bulk payment action:", err_3);
                    setError("Failed to process bulk payment action. Please try again.");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    setTimeout(function () {
                        setButtonClicked(null);
                    }, 3000); // Reset buttonClicked after 3 seconds
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var ActionButtons = function (_a) {
        var payment = _a.payment;
        var statusStyles = {
            Accepted: {
                container: "text-[#10ad1b] bg-[#d6f5d6]/5 border-[#10ad1b]",
                text: "text-[#10ad1b]",
            },
            Declined: {
                container: "text-[#d52121] bg-[#f5d6d6]/5 border-[#d52121]",
                text: "text-[#d52121]",
            },
            Pending: {
                container: "text-gray-500 bg-gray-200/5 border-gray-500",
                text: "text-gray-500",
            },
        };
        var status = payment.status;
        if (status === "Pending") {
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
            return (<div className={"flex items-center gap-2 ".concat(statusStyles[status].container, " rounded-[40px] px-4 py-0.5 border")}>
          <p className={"text-base ".concat(statusStyles[status].text)}>
            {payment.status}
          </p>
        </div>);
        }
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
    var handleItemsPerPageChange = function (event) {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to the first page whenever items per page changes
    };
    var handleCheckboxChange = function (paymentId, isChecked) {
        setSelectedPayments(function (prevSelectedPayments) {
            if (isChecked) {
                return __spreadArray(__spreadArray([], prevSelectedPayments, true), [paymentId], false);
            }
            else {
                return prevSelectedPayments.filter(function (id) { return id !== paymentId; });
            }
        });
    };
    var handleSelectAll = function () {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedPayments(paginatedPayments.map(function (payment) { var _a; return (_a = payment.id) !== null && _a !== void 0 ? _a : 0; }));
        }
        else {
            setSelectedPayments([]);
        }
    };
    var filteredPayments = payments.filter(function (payment) {
        return (payment.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.campaign.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    var sortedPayments = filteredPayments.sort(function (a, b) {
        if (sortOrder === "date") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        else if (sortOrder === "order") {
            return a.order.localeCompare(b.order);
        }
        else if (sortOrder === "referrer") {
            return a.referrer.localeCompare(b.referrer);
        }
        else if (sortOrder === "campaign") {
            return a.campaign.localeCompare(b.campaign);
        }
        else if (sortOrder === "referralCashback") {
            return b.referralCashback - a.referralCashback; // Assuming referralCashback is a number
        }
        else {
            return 0; // Default case if sortOrder doesn't match any known property
        }
    });
    var paginatedPayments = sortedPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    var columns = [
        { dataIndex: "order", className: "text-center" },
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
        // Calculate the total order value
        var totalOrderValue = payments.reduce(function (acc, p) { return acc + parseFloat(p.total_price); }, 0);
        // Calculate the average order value
        var averageOrderValue = totalPayments > 0 ? totalOrderValue / totalPayments : 0;
        return {
            totalPayments: totalPayments,
            acceptedPayments: acceptedPayments,
            declinedPayments: declinedPayments,
            pendingPayments: pendingPayments,
            totalOrderValue: totalOrderValue.toFixed(2),
            averageOrderValue: averageOrderValue.toFixed(2),
        };
    };
    var metrics = computePerformanceMetrics();
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}

      <div className="flex flex-col justify-center items-center mx-auto gap-4 mt-6">
        {/* Performance Metrics */}
        <div className="relative w-full flex justify-center items-center">
          <ScrollableContainer>
            <PerformanceSummary metricName="Accepted Payments" value={metrics.acceptedPayments.toString()} iconName="MouseClickIcon"/>
            <PerformanceSummary metricName="Declined Payments" value={metrics.declinedPayments.toString()} iconName="Conversions"/>
            <PerformanceSummary metricName="Pending Payments" value={metrics.pendingPayments.toString()} iconName="ConversionRate"/>
            <PerformanceSummary metricName="Total Order Value" value={"$".concat(metrics.totalOrderValue)} iconName="TotalSpends"/>
            <PerformanceSummary metricName="Avg Order Value" value={"$".concat(metrics.averageOrderValue)} iconName="MouseClickedIcon"/>
          </ScrollableContainer>
        </div>

        {/* Data Table */}
        <div className="w-full">
          {/* Search, Sort, Items Per Page, and Bulk Actions */}
          <div className="flex justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              {selectedPayments.length > 0 && (<>
                  <button onClick={function () { return handleBulkAction("Accepted"); }} className={"h-10 px-6 py-2 rounded-lg ".concat(buttonClicked === "Accepted"
                ? "bg-[#47B775] text-white"
                : "bg-[#47B775] text-white hover:bg-[#3a955d]", " font-medium")}>
                    {buttonClicked === "Accepted"
                ? "Accepted"
                : "Accept Selected"}
                  </button>
                  <button onClick={function () { return handleBulkAction("Declined"); }} className={"h-10 px-6 py-2 rounded-lg ".concat(buttonClicked === "Declined"
                ? "bg-[#D52121] text-white"
                : "bg-[#D52121] text-white hover:bg-[#b41b1b]", " font-medium")}>
                    {buttonClicked === "Declined"
                ? "Declined"
                : "Decline Selected"}
                  </button>
                </>)}
            </div>
            <div className="flex items-center gap-4">
              <SearchSortSection onSearch={handleSearch} onSort={handleSort}/>
              <div className="flex items-center px-0 py-2 justify-center rounded-lg bg-white w-[30%] sm:w-auto">
                <select className="text-[.8rem] sm:text-base font-medium text-left text-black/80" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  <option value={10}>10 Items Per Page</option>
                  <option value={20}>20 Items Per Page</option>
                  <option value={50}>50 Items Per Page</option>
                  <option value={100}>100 Items Per Page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table and Pagination */}
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center">
          <DataTableHeader headers={{
            selectAll: selectAll,
            handleSelectAll: handleSelectAll,
            columns: [
                { title: "Order", align: "center", className: "extra-styles" },
                { title: "Date", align: "center" },
                { title: "Referrer", align: "center" },
                { title: "Campaign", align: "center" },
                { title: "Referral Fee", align: "center" },
                { title: "Action", align: "center" },
            ],
        }}/>
          <DataTableRows rowData={paginatedPayments.map(function (payment) {
            var _a;
            return (__assign(__assign({}, payment), { selected: selectedPayments.includes((_a = payment.id) !== null && _a !== void 0 ? _a : 0) }));
        })} columns={columns} selectable={true} handleCheckboxChange={handleCheckboxChange} selectedPayments={selectedPayments}/>
          {sortedPayments.length > 0 && (<Pagination totalItems={sortedPayments.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>)}
        </div>
      </div>
    </div>);
};
export var getStaticProps = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                props: {
                    title: "Payments",
                },
            }];
    });
}); };
export default Payments;

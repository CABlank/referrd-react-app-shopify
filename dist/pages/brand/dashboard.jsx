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
import React, { useEffect, useRef, useState, useCallback } from "react";
import PerformanceSummary from "../../components/common/PerformanceSummary";
import CampaignItem from "../../components/common/CampaignItem";
import ReferralCard from "../../components/common/ReferralCard";
import DataTableHeader from "../../components/common/DataTableHeader";
import DataTableRows from "../../components/common/DataTableRows";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import Link from "next/link";
import { useSession } from "../../context/SessionContext";
import { fetchDashboardData, } from "../../services/dashboard/dashboard";
import { fetchCompanyUUID, } from "../../services/payments/payments";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import ArrowSeeMoreIcon from "@/components/Icons/ArrowSeeMoreIcon";
import initialLoadChecker from "../../utils/middleware/initialLoadChecker";
var DashboardCampaigns = function (_a) {
    var accessToken = _a.accessToken, refreshToken = _a.refreshToken, userId = _a.userId, // Receive userId as prop
    title = _a.title;
    var _b = useSession(), session = _b.session, withTokenRefresh = _b.withTokenRefresh, sessionLoading = _b.loading;
    var _c = useState(true), dataLoading = _c[0], setDataLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState([]), payments = _e[0], setPayments = _e[1];
    var _f = useState([]), customers = _f[0], setCustomers = _f[1];
    var _g = useState([]), campaigns = _g[0], setCampaigns = _g[1];
    var loadExecutedRef = useRef(false);
    var loadData = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var companyUUID_1, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(((session === null || session === void 0 ? void 0 : session.token) || accessToken) && !loadExecutedRef.current)) return [3 /*break*/, 6];
                    setDataLoading(true);
                    loadExecutedRef.current = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, withTokenRefresh(function (token) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, fetchCompanyUUID(token)];
                            });
                        }); }, refreshToken, userId)];
                case 2:
                    companyUUID_1 = _a.sent();
                    if (!companyUUID_1) {
                        throw new Error("Failed to load company UUID.");
                    }
                    return [4 /*yield*/, withTokenRefresh(function (token) { return fetchDashboardData(token, companyUUID_1); }, refreshToken, userId // Pass userId directly to withTokenRefresh
                        )];
                case 3:
                    data = _a.sent();
                    // Set the fetched data to state
                    setCustomers(data.customers);
                    setCampaigns(data.campaigns);
                    setPayments(data.payments);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    console.error("Error loading data:", err_1);
                    setError("Failed to load data. Please try again.");
                    return [3 /*break*/, 6];
                case 5:
                    setDataLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [session === null || session === void 0 ? void 0 : session.token, accessToken, refreshToken, withTokenRefresh, userId]);
    useEffect(function () {
        if (!sessionLoading) {
            loadData();
        }
    }, [session, sessionLoading, loadData]);
    var computePerformanceMetrics = function () {
        var totalClicks = customers.reduce(function (sum, customer) { return sum + customer.click_count; }, 0);
        var totalConversions = customers.reduce(function (sum, customer) { return sum + customer.conversion_count; }, 0);
        var totalSpend = payments.reduce(function (sum, payment) { return sum + parseFloat(payment.total_price); }, 0);
        var conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
        var cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
        return {
            totalClicks: totalClicks,
            totalConversions: totalConversions,
            totalSpend: totalSpend.toFixed(2),
            conversionRate: conversionRate.toFixed(2),
            cpa: cpa.toFixed(2),
        };
    };
    var metrics = computePerformanceMetrics();
    var prioritizeCampaigns = function () {
        var publishedCampaigns = campaigns.filter(function (campaign) { return campaign.status && campaign.status.toLowerCase() === "live"; });
        var otherCampaigns = campaigns
            .filter(function (campaign) { var _a; return ((_a = campaign.status) !== null && _a !== void 0 ? _a : "").toLowerCase() !== "live"; })
            .sort(function (a, b) {
            var _a, _b;
            return new Date((_a = b.date_updated) !== null && _a !== void 0 ? _a : 0).getTime() -
                new Date((_b = a.date_updated) !== null && _b !== void 0 ? _b : 0).getTime();
        });
        return __spreadArray(__spreadArray([], publishedCampaigns, true), otherCampaigns, true).slice(0, 3);
    };
    var prioritizedCampaigns = prioritizeCampaigns();
    // Map the payments data for displaying in Latest Conversions
    var latestConversions = payments.slice(0, 5).map(function (payment) { return ({
        date: new Date(payment.date_created).toLocaleString(),
        referrer: payment.customer_email,
        conversion: payment.status,
        spend: "Order #".concat(payment.order_number),
    }); });
    var latestConversionColumns = [
        { dataIndex: "date", className: "text-left" },
        { dataIndex: "referrer", className: "text-left" },
        { dataIndex: "conversion", className: "text-left" },
        { dataIndex: "spend", className: "text-left" },
    ];
    var parseLocation = function (locationString) {
        if (!locationString)
            return "N/A";
        try {
            var location_1 = JSON.parse(locationString);
            return "".concat(location_1.city, ", ").concat(location_1.country);
        }
        catch (_a) {
            return "N/A";
        }
    };
    return (<div className={"relative ".concat(sessionLoading || dataLoading ? "blur" : "")}>
      {(sessionLoading || dataLoading) && <LoadingOverlay />}
      <div className="relative w-full flex justify-center">
        <div className="flex overflow-hidden scroll-smooth scrollbar-hide gap-4 pb-4">
          <ScrollableContainer>
            <PerformanceSummary metricName="Total Clicks" value={metrics.totalClicks.toString()} iconName="MouseClickIcon"/>
            <PerformanceSummary metricName="Total Conversions" value={metrics.totalConversions.toString()} iconName="Conversions"/>
            <PerformanceSummary metricName="Conversion Rate" value={"".concat(metrics.conversionRate, "%")} iconName="ConversionRate"/>
            <PerformanceSummary metricName="Total Spend" value={"$".concat(metrics.totalSpend)} iconName="TotalSpends"/>
            <PerformanceSummary metricName="CPA" value={"$".concat(metrics.cpa)} iconName="MouseClickedIcon"/>
          </ScrollableContainer>
        </div>
      </div>
      <div className="flex flex-auto justify-center items-start max-w-full mx-auto gap-4 flex-col xl:flex-row">
        <div className="flex flex-col justify-start items-start flex-grow gap-8 rounded-2xl contents overflow-x-auto">
          <div className="flex flex-col justify-start items-start xl:overflow-hidden overflow-x-auto gap-4 lg:p-8 p-4 rounded-2xl bg-white xl:w-2/3 w-full">
            <div className="flex justify-between items-center w-full">
              <p className="text-2xl font-medium text-[#10ad1b]">Campaigns</p>
              <Link href="/brand/campaigns" passHref>
                <div className="flex items-center gap-1 cursor-pointer">
                  <p className="text-base font-medium text-[#851087]/80">
                    See More
                  </p>
                  <ArrowSeeMoreIcon />
                </div>
              </Link>
            </div>
            <hr className="w-full border-t border-black/15"/>
            {prioritizedCampaigns.length > 0 ? (prioritizedCampaigns.map(function (campaign, index) { return (<React.Fragment key={index}>
                  <CampaignItem imageSrc={"default-image.png"} // Replacing with a fallback
         title={campaign.name} test={"Start: ".concat(new Date(campaign.startDate).toLocaleDateString(), " ")} price={"$ ".concat(String(campaign.amountFunded)) || "Unknown"} // Convert to string
         status={campaign.status || "Unknown"} // Handle potential undefined status
         endDate={campaign.closeDate
                ? "Until ".concat(new Date(campaign.closeDate).toLocaleDateString())
                : "No End Date"} openTo={"All"} // Set this to a default value or remove if not relevant
        />
                  {index < prioritizedCampaigns.length - 1 && (<hr className="w-full border-t border-black/15"/>)}
                </React.Fragment>); })) : (<p>No campaigns found.</p>)}
          </div>
          <div className="flex flex-col justify-start items-start overflow-x-auto sm:overflow-hidden gap-4 p-8 rounded-2xl bg-white xl:w-1/3 w-full flex-grow">
            <ReferralCard data={customers.slice(0, 3).map(function (customer) { return ({
            name: customer.name || "Unknown",
            location: parseLocation(customer.location), // Use parsed location
            email: customer.email || "N/A", // Use email
            date: new Date(customer.date_created).toLocaleDateString(),
        }); })}/>
          </div>
        </div>
      </div>
      {/* Full-width table */}
      <div className="flex flex-col w-full overflow-x-auto xl:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4 p-4 mobile-scroll">
        <div className="flex justify-between items-center w-[1024px] lg:w-full p-4">
          <p className="text-2xl font-medium text-[#10ad1b]">Payments</p>
          <Link href="/brand/payments" passHref>
            <div className="flex items-center gap-1 cursor-pointer">
              <p className="text-base font-medium text-[#851087]/80">
                See More
              </p>
              <ArrowSeeMoreIcon />
            </div>
          </Link>
        </div>
        <DataTableHeader headers={{
            columns: [
                { title: "Date/Time", align: "center" },
                { title: "Referrer", align: "center" },
                { title: "Conversion", align: "center" },
                { title: "Orders", align: "center" },
            ],
        }}/>
        <DataTableRows rowData={latestConversions} columns={latestConversionColumns}/>
      </div>
    </div>);
};
export var getServerSideProps = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var result, session, userName, title;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, initialLoadChecker(context)];
            case 1:
                result = _c.sent();
                if ("redirect" in result || "notFound" in result) {
                    return [2 /*return*/, result];
                }
                if (!("props" in result)) {
                    return [2 /*return*/, {
                            props: {
                                title: "Hi, there!",
                            },
                        }];
                }
                session = (_a = result.props) === null || _a === void 0 ? void 0 : _a.session;
                userName = ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.name) || "there";
                title = "Hi, ".concat(userName, "!");
                return [2 /*return*/, {
                        props: __assign(__assign({}, result.props), { title: title }),
                    }];
        }
    });
}); };
export default DashboardCampaigns;

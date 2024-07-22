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
import { useSession } from "../../contexts/SessionContext";
import { fetchDashboardData, } from "../../services/dashboard/dashboard";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import ArrowSeeMoreIcon from "@/components/Icons/ArrowSeeMoreIcon";
import initialLoadChecker from "../../utils/middleware/initialLoadChecker";
export var getServerSideProps = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initialLoadChecker(context)];
            case 1: 
            // DO NOT REMOVE THIS.
            return [2 /*return*/, _a.sent()];
        }
    });
}); };
var DashboardCampaigns = function (_a) {
    var accessToken = _a.accessToken, refreshToken = _a.refreshToken;
    var _b = useSession(), session = _b.session, withTokenRefresh = _b.withTokenRefresh, sessionLoading = _b.loading;
    var _c = useState(true), dataLoading = _c[0], setDataLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState([]), payments = _e[0], setPayments = _e[1];
    var _f = useState([]), customers = _f[0], setCustomers = _f[1];
    var _g = useState([]), campaigns = _g[0], setCampaigns = _g[1];
    var _h = useState([]), referrals = _h[0], setReferrals = _h[1];
    var _j = useState([]), referralCodes = _j[0], setReferralCodes = _j[1];
    var loadExecutedRef = useRef(false);
    var loadData = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(((session === null || session === void 0 ? void 0 : session.token) || accessToken) && !loadExecutedRef.current)) return [3 /*break*/, 5];
                    setDataLoading(true);
                    loadExecutedRef.current = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, withTokenRefresh(function (token) { return fetchDashboardData(token); }, refreshToken)];
                case 2:
                    data = _a.sent();
                    setPayments(data.payments);
                    setCustomers(data.customers);
                    setCampaigns(data.campaigns);
                    setReferrals(data.referrals);
                    setReferralCodes(data.referralCodes);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error("Error loading data:", err_1);
                    setError("Failed to load data. Please try again.");
                    return [3 /*break*/, 5];
                case 4:
                    setDataLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [session === null || session === void 0 ? void 0 : session.token, accessToken, refreshToken, withTokenRefresh]);
    useEffect(function () {
        if (!sessionLoading) {
            loadData();
        }
    }, [session, sessionLoading, loadData]);
    var computePerformanceMetrics = function () {
        var totalClicks = referrals.length;
        var totalConversions = referrals.filter(function (ref) { return ref.conversion === "true"; }).length;
        var totalSpend = referrals.reduce(function (acc, ref) { return acc + (ref.spend || 0); }, 0);
        var conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
        var cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
        return {
            totalClicks: totalClicks,
            totalConversions: totalConversions,
            totalSpend: totalSpend,
            conversionRate: conversionRate.toFixed(2),
            cpa: cpa.toFixed(2),
        };
    };
    var metrics = computePerformanceMetrics();
    var prioritizeCampaigns = function () {
        var publishedCampaigns = campaigns.filter(function (campaign) { return campaign.status.toLowerCase() === "published"; });
        var otherCampaigns = campaigns
            .filter(function (campaign) { return campaign.status.toLowerCase() !== "published"; })
            .sort(function (a, b) {
            return new Date(b.date_updated).getTime() -
                new Date(a.date_updated).getTime();
        });
        return __spreadArray(__spreadArray([], publishedCampaigns, true), otherCampaigns, true).slice(0, 3);
    };
    var prioritizedCampaigns = prioritizeCampaigns();
    var mapReferralData = function () {
        return referrals.map(function (referral) {
            var customer = customers.find(function (c) { return c.id === referral.referrer; });
            var campaign = campaigns.find(function (c) { return c.id === referral.campaign; });
            var referralCode = referralCodes.find(function (code) { return code.id === referral.referralCode; });
            return {
                id: referral.id,
                date: new Date(referral.date_created).toLocaleString(),
                referrer: (customer === null || customer === void 0 ? void 0 : customer.name) || "N/A",
                campaign: (campaign === null || campaign === void 0 ? void 0 : campaign.name) || "N/A",
                location: referral.location || "N/A",
                spend: referral.spend ? "$".concat(referral.spend) : "No Spend",
                conversion: referral.conversion === "true" ? "Yes" : "No",
                referralCode: (referralCode === null || referralCode === void 0 ? void 0 : referralCode.code) || "N/A",
                test: referral.test || "N/A",
            };
        });
    };
    var latestConversions = mapReferralData().slice(0, 5);
    var latestConversionColumns = [
        { dataIndex: "date", className: "text-left" },
        { dataIndex: "location", className: "text-left" },
        { dataIndex: "referrer", className: "text-left" },
        { dataIndex: "conversion", className: "text-left" },
        { dataIndex: "spend", className: "text-left" },
    ];
    return (<div className={"relative ".concat(sessionLoading || dataLoading ? "blur" : "")}>
      {(sessionLoading || dataLoading) && <LoadingOverlay />}
      <p className="text-[40px] font-semibold text-left text-[#10ad1b] ">
        Hi, {(session === null || session === void 0 ? void 0 : session.user.name) || "there"}!
      </p>
      <div className="relative w-full flex justify-center">
        <div className="flex overflow-hidden scroll-smooth scrollbar-hide gap-4 py-4">
          <ScrollableContainer>
            <PerformanceSummary metricName="Total Clicks" value={metrics.totalClicks.toString()}/>
            <PerformanceSummary metricName="Total Conversions" value={metrics.totalConversions.toString()}/>
            <PerformanceSummary metricName="Conversion Rate" value={"".concat(metrics.conversionRate, "%")}/>
            <PerformanceSummary metricName="Total Spend" value={"$".concat(metrics.totalSpend)}/>
            <PerformanceSummary metricName="CPA" value={"$".concat(metrics.cpa)}/>
          </ScrollableContainer>
        </div>
      </div>

      <div className="flex flex-auto justify-center items-start max-w-full mx-auto gap-4  flex-col xl:flex-row">
        <div className="flex flex-col justify-start items-start flex-grow gap-8 rounded-2xl contents overflow-x-auto">
          <div className="flex flex-col justify-start items-start xl:overflow-hidden overflow-x-auto gap-4 lg:p-8 p-4 rounded-2xl bg-white xl:w-2/3 w-full">
            <div className="flex justify-between items-center w-full">
              <p className="text-2xl font-medium text-[#10ad1b]">Campaigns</p>
              <div className="flex items-center gap-1">
                <p className="text-base font-medium text-[#851087]/80">
                  See More
                </p>
                <ArrowSeeMoreIcon />
              </div>
            </div>
            <hr className="w-full border-t border-black/15"/>
            {prioritizedCampaigns.length > 0 ? (prioritizedCampaigns.map(function (campaign, index) { return (<React.Fragment key={index}>
                  <CampaignItem imageSrc={campaign.imageSrc || "default-image.png"} title={campaign.name} test={campaign.test || "Default Test"} price={campaign.price ? "$".concat(campaign.price) : "No Price"} status={campaign.status} endDate={campaign.closeDate
                ? "Until ".concat(new Date(campaign.closeDate).toLocaleDateString())
                : "No End Date"} openTo={campaign.openTo || "All"}/>
                  {index < prioritizedCampaigns.length - 1 && (<hr className="w-full border-t border-black/15"/>)}
                </React.Fragment>); })) : (<p>No campaigns found.</p>)}
          </div>
          <div className="flex flex-col justify-start items-start overflow-x-auto sm:overflow-hidden gap-4 p-8 rounded-2xl bg-white xl:w-1/3 w-full flex-grow">
            <ReferralCard data={referrals.slice(0, 4).map(function (referral) {
            var customer = customers.find(function (c) { return c.id === referral.referrer; });
            var referralCode = referralCodes.find(function (code) { return code.id === referral.referralCode; });
            return {
                name: (customer === null || customer === void 0 ? void 0 : customer.name) || "Unknown",
                test: referral.location || "N/A",
                code: (referralCode === null || referralCode === void 0 ? void 0 : referralCode.code) || "N/A",
                date: new Date(referral.date_created).toLocaleDateString(),
            };
        })}/>
          </div>
        </div>
      </div>
      {/* Full-width table */}
      <div className="flex flex-col w-full overflow-x-auto xl:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4 p-4 mobile-scroll">
        <div className="flex justify-between items-center w-[1024px] lg:w-full p-4">
          <p className="text-2xl font-medium text-[#10ad1b]">
            Latest Conversions
          </p>
          <div className="flex items-center gap-1">
            <p className="text-base font-medium text-[#851087]/80">See More</p>
            <ArrowSeeMoreIcon />
          </div>
        </div>
        <DataTableHeader headers={[
            { title: "Date/Time", align: "left" },
            { title: "Location", align: "left" },
            { title: "Referrer", align: "left" },
            { title: "Conversion", align: "left" },
            { title: "Spend", align: "left" },
        ]}/>
        <DataTableRows rowData={latestConversions} columns={latestConversionColumns}/>
      </div>
    </div>);
};
export default DashboardCampaigns;

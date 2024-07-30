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
import React, { useState } from "react";
import SearchSortSection from "../../../components/common/SearchSortSection";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import Pagination from "../../../components/common/Pagination";
import EyeIconDetail from "../../../components/Icons/EyeIconDetail";
import { useRouter } from "next/router";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DataTableRows from "../../../components/common/DataTableRows";
import useReferrals from "../../../hooks/useReferrals";
var ReferralsIndex = function () {
    var router = useRouter(); // Hook to programmatically navigate
    var _a = useReferrals(), referrals = _a.referrals, customers = _a.customers, referralCodes = _a.referralCodes, campaigns = _a.campaigns, loading = _a.loading, error = _a.error; // Custom hook to fetch referral-related data
    // State for search query, sort order, and pagination
    var _b = useState(""), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = useState("date"), sortOrder = _c[0], setSortOrder = _c[1];
    var _d = useState(1), currentPage = _d[0], setCurrentPage = _d[1];
    var itemsPerPage = 10;
    // Map raw referral data to a structured format
    var mapReferralData = function () {
        return referrals.map(function (referral) {
            var customer = customers.find(function (c) { return c.id === referral.referrer; });
            var campaign = campaigns.find(function (c) { return c.id === referral.campaign; });
            var referralCode = referralCodes.find(function (code) { return code.id === referral.referralCode; });
            return {
                id: referral.id,
                date: new Date(referral.date_created).toLocaleString(),
                referrer: customer ? customer.name : "N/A",
                campaign: campaign ? campaign.name : "N/A",
                referralCode: referralCode ? referralCode.code : "N/A",
                location: referral.location,
                spend: referral.spend,
                conversion: referral.conversion === "true",
            };
        });
    };
    // Handle search query change
    var handleSearch = function (query) {
        setSearchQuery(query);
    };
    // Handle sort order change
    var handleSort = function (order) {
        setSortOrder(order);
    };
    // Handle page change
    var handlePageChange = function (page) {
        setCurrentPage(page);
    };
    // Filter and sort referral data based on search query and sort order
    var filteredReferrals = mapReferralData().filter(function (referral) {
        return (referral.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            referral.campaign.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    var sortedReferrals = filteredReferrals.sort(function (a, b) {
        if (sortOrder === "date") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a[sortOrder].localeCompare(b[sortOrder]);
    });
    // Paginate sorted referrals
    var paginatedReferrals = sortedReferrals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // Define table columns
    var columns = [
        { dataIndex: "date", className: "text-center text-sm" },
        { dataIndex: "referrer", className: "text-center" },
        { dataIndex: "campaign", className: "text-center" },
        { dataIndex: "referralCode", className: "text-center text-xs" },
        { dataIndex: "location", className: "text-center" },
        {
            dataIndex: "id",
            className: "text-center flex justify-center items-center",
            customRender: function (id) { return (<button className="text-[#3f59e4] flex items-center justify-center gap-2" onClick={function () { return router.push("/brand/referrals/".concat(id)); }}>
          <EyeIconDetail />
          Details
        </button>); },
        },
    ];
    // Compute performance metrics for referrals
    var computePerformanceMetrics = function () {
        var clicks = sortedReferrals.length;
        var conversions = sortedReferrals.filter(function (r) { return r.conversion; }).length;
        var totalSpends = sortedReferrals.reduce(function (acc, r) { return acc + r.spend; }, 0);
        var conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
        var cpa = conversions > 0 ? totalSpends / conversions : 0;
        return {
            clicks: clicks,
            conversions: conversions,
            totalSpends: totalSpends,
            conversionRate: conversionRate.toFixed(2),
            cpa: cpa.toFixed(2),
        };
    };
    var metrics = computePerformanceMetrics();
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}

      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
        {/* Performance Metrics */}
        <ScrollableContainer>
          <PerformanceSummary metricName="Clicks" value={metrics.clicks.toString()}/>
          <PerformanceSummary metricName="Conversions" value={metrics.conversions.toString()}/>
          <PerformanceSummary metricName="Conversion Rate" value={"".concat(metrics.conversionRate, "%")}/>
          <PerformanceSummary metricName="Total Spends" value={"$".concat(metrics.totalSpends)}/>
          <PerformanceSummary metricName="CPA" value={"$".concat(metrics.cpa)}/>
        </ScrollableContainer>
        {/* Search and Sort */}
        <SearchSortSection onSearch={handleSearch} onSort={handleSort}/>
        {/* Data Table and Pagination */}
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center mobile-scroll">
          <DataTableHeader headers={[
            { title: "Date", align: "center" },
            { title: "Referrer", align: "center" },
            { title: "Campaign", align: "center" },
            { title: "Referral Code", align: "center" },
            { title: "Location", align: "center" },
            { title: "Action", align: "center", className: "extra-styles" },
        ]}/>
          <DataTableRows rowData={paginatedReferrals} columns={columns}/>
          {sortedReferrals.length > 0 && (<Pagination totalItems={sortedReferrals.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>)}
        </div>
      </div>
    </div>);
};
export var getStaticProps = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                props: {
                    title: "Referrals",
                },
            }];
    });
}); };
export default ReferralsIndex;

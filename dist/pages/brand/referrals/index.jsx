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
import { useRouter } from "next/router";
import SearchSortSection from "../../../components/common/SearchSortSection";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import Pagination from "../../../components/common/Pagination";
import EyeIconDetail from "../../../components/Icons/EyeIconDetail";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DataTableRows from "../../../components/common/DataTableRows";
import useReferrals from "../../../hooks/useReferrals";
var parseLocation = function (location) {
    try {
        var parsedLocation = JSON.parse(location);
        return "".concat(parsedLocation.city, ", ").concat(parsedLocation.country);
    }
    catch (_a) {
        return "Unknown";
    }
};
var CustomersIndex = function () {
    var router = useRouter();
    var _a = useReferrals(), customers = _a.customers, campaigns = _a.campaigns, loading = _a.loading;
    var _b = useState(""), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = useState("date"), sortOrder = _c[0], setSortOrder = _c[1];
    var _d = useState(1), currentPage = _d[0], setCurrentPage = _d[1];
    var itemsPerPage = 10;
    var mapCustomerData = function () {
        return customers.map(function (customer) {
            var _a;
            return ({
                id: customer.id,
                uuid: customer.uuid, // Map the uuid for routing
                date: new Date(customer.date_created).toLocaleString(),
                name: customer.name || "N/A",
                campaign: ((_a = campaigns.find(function (c) { return c.uuid === customer.campaign_uuid; })) === null || _a === void 0 ? void 0 : _a.name) || "N/A",
                location: parseLocation(customer.location),
                signup_count: customer.signup_count,
                click_count: customer.click_count,
                conversion_count: customer.conversion_count,
                spend: customer.conversion_count * 10, // Example spend calculation
            });
        });
    };
    var handleSearch = function (query) { return setSearchQuery(query); };
    var handleSort = function (order) {
        return setSortOrder(order);
    };
    var handlePageChange = function (page) { return setCurrentPage(page); };
    var filteredCustomers = mapCustomerData().filter(function (customer) {
        return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    });
    var sortedCustomers = filteredCustomers.sort(function (a, b) {
        return sortOrder === "date"
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : a[sortOrder].localeCompare(b[sortOrder]);
    });
    var paginatedCustomers = sortedCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    var computePerformanceMetrics = function () {
        var totalSignups = sortedCustomers.reduce(function (acc, c) { return acc + c.signup_count; }, 0);
        var totalClicks = sortedCustomers.reduce(function (acc, c) { return acc + c.click_count; }, 0);
        var totalConversions = sortedCustomers.reduce(function (acc, c) { return acc + c.conversion_count; }, 0);
        var totalSpends = sortedCustomers.reduce(function (acc, c) { return acc + c.spend; }, 0);
        var conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
        var cpa = totalConversions > 0 ? totalSpends / totalConversions : 0;
        return {
            totalSignups: totalSignups,
            totalClicks: totalClicks,
            totalConversions: totalConversions,
            conversionRate: conversionRate.toFixed(2),
            totalSpends: totalSpends.toFixed(2),
            cpa: cpa.toFixed(2),
        };
    };
    var metrics = computePerformanceMetrics();
    var columns = [
        { dataIndex: "date", className: "text-center text-xs", title: "Date" },
        { dataIndex: "name", className: "text-center", title: "Name" },
        { dataIndex: "campaign", className: "text-center", title: "Campaign" },
        { dataIndex: "location", className: "text-center", title: "Location" },
        { dataIndex: "signup_count", className: "text-center", title: "Sign Ups" },
        { dataIndex: "click_count", className: "text-center", title: "Clicks" },
        {
            dataIndex: "uuid", // Change to uuid here
            className: "text-center flex justify-center items-center",
            customRender: function (uuid) { return (<button className="text-[#3f59e4] flex items-center justify-center gap-2" onClick={function () { return router.push("/brand/referrals/".concat(uuid)); }} // Navigate using uuid
            >
          <EyeIconDetail />
          Details
        </button>); },
            title: "Actions", // Updated title
        },
    ];
    return (<div className={"relative ".concat(loading ? "blur" : "")}>
      {loading && <LoadingOverlay />}
      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
        <ScrollableContainer>
          <PerformanceSummary metricName="Sign Ups" value={metrics.totalSignups.toString()} iconName=""/>
          <PerformanceSummary metricName="Clicks" value={metrics.totalClicks.toString()} iconName="MouseClickIcon"/>
          <PerformanceSummary metricName="Conversions" value={metrics.totalConversions.toString()} iconName="Conversions"/>
          <PerformanceSummary metricName="Conversion Rate" value={"".concat(metrics.conversionRate, "%")} iconName="ConversionRate"/>
          <PerformanceSummary metricName="Total Spends" value={"$".concat(metrics.totalSpends)} iconName="TotalSpends"/>
          <PerformanceSummary metricName="CPA" value={"$".concat(metrics.cpa)} iconName="MouseClickedIcon"/>
        </ScrollableContainer>
        <SearchSortSection onSearch={handleSearch} onSort={handleSort}/>
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center mobile-scroll">
          <DataTableHeader headers={{
            columns: columns.map(function (col) { return ({
                title: col.title,
                align: "center",
                className: col.className,
            }); }),
        }}/>
          <DataTableRows rowData={paginatedCustomers} columns={columns}/>
          {sortedCustomers.length > 0 && (<Pagination totalItems={sortedCustomers.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>)}
        </div>
      </div>
    </div>);
};
export var getStaticProps = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                props: {
                    title: "Referrals",
                },
            })];
    });
}); };
export default CustomersIndex;

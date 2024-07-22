import React, { useState } from "react";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import DataTableRows from "@/components/common/DataTableRows";
import Pagination from "@/components/common/Pagination";
import { useRouter } from "next/router";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import DetailSection from "@/components/Referrals/DetailSection";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import useReferralDetails from "../../../hooks/useReferralDetails";
var ReferralDetails = function () {
    var router = useRouter(); // Hook to programmatically navigate
    var referralsId = router.query.referralsId; // Get referral ID from the query parameters
    var _a = useReferralDetails(referralsId), referral = _a.referral, customer = _a.customer, referralCode = _a.referralCode, campaign = _a.campaign, loading = _a.loading, error = _a.error; // Custom hook to fetch referral details
    // State for search query, sort order, and pagination
    var _b = useState(""), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = useState("date"), sortOrder = _c[0], setSortOrder = _c[1];
    var _d = useState(1), currentPage = _d[0], setCurrentPage = _d[1];
    var itemsPerPage = 10;
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
    // Filter and sort row data based on search query and sort order
    var filterAndSortData = function (data) {
        var filteredData = data.filter(function (item) {
            return (item.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase()));
        });
        var sortedData = filteredData.sort(function (a, b) {
            if (sortOrder === "date") {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return a[sortOrder].localeCompare(b[sortOrder]);
        });
        return sortedData;
    };
    // Paginate the sorted data
    var paginatedData = function (data) {
        return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    };
    // Compute performance metrics for the referral
    var computePerformanceMetrics = function () {
        var clicks = referral ? 1 : 0;
        var conversions = referral && referral.conversion === "true" ? 1 : 0;
        var totalSpends = referral ? referral.spend || 0 : 0;
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
    // Handle loading state
    if (loading) {
        return <LoadingOverlay />;
    }
    // Handle error state
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }
    // Prepare row data for the referral details table
    var rowData = referral
        ? [
            {
                date: new Date(referral.date_created).toLocaleString(),
                location: referral.location || "N/A",
                UserName: (customer === null || customer === void 0 ? void 0 : customer.name) || "N/A",
                Valid: referral.conversion === "true" ? "Yes" : "No",
                CartValue: referral.spend ? "$".concat(referral.spend) : "No Spend",
            },
        ]
        : [];
    var filteredSortedData = filterAndSortData(rowData);
    var paginatedRowData = paginatedData(filteredSortedData);
    // Define table columns
    var columns = [
        { dataIndex: "date", className: "text-left" },
        { dataIndex: "location", className: "text-left" },
        { dataIndex: "UserName", className: "text-left" },
        { dataIndex: "Valid", className: "text-left" },
        { dataIndex: "CartValue", className: "text-left" },
    ];
    return (<div className="relative">
      <p className="text-[40px] font-semibold text-left text-[#10ad1b] mx-auto">
        Referrals
      </p>

      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
        {/* Performance Metrics */}
        <ScrollableContainer>
          <PerformanceSummary metricName="Clicks" value={metrics.clicks.toString()}/>
          <PerformanceSummary metricName="Conversions" value={metrics.conversions.toString()}/>
          <PerformanceSummary metricName="Conversion Rate" value={"".concat(metrics.conversionRate, "%")}/>
          <PerformanceSummary metricName="Total Spends" value={"$".concat(metrics.totalSpends)}/>
          <PerformanceSummary metricName="CPA" value={"$".concat(metrics.cpa)}/>
        </ScrollableContainer>
        <div className="flex flex-col w-full overflow-hidden rounded-2xl bg-[#f3f3f3]">
          {/* Container for the two side-by-side tables */}
          <div className="flex w-full gap-4 flex-col lg:flex-row">
            {/* Added padding around the container and gap between children */}
            {/* First table with 30% width */}
            <DetailSection referral={referral} customer={customer} referralCode={referralCode} campaign={campaign}/>
            {/* Second table with 70% width */}
            <div className="bg-white flex flex-col lg:overflow-hidden lg:w-5/6 overflow-x-auto rounded-2xl shadow-lg text-center w-full">
              {/* Added shadow for depth */}
              <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">
                Share Clicks
              </h2>
              <DataTableHeader headers={[
            { title: "Date/Time", align: "left" },
            { title: "Location", align: "left" },
            { title: "User", align: "left" },
            { title: "Valid", align: "left" },
            { title: "Cart Value", align: "left" },
        ]}/>
              <DataTableRows rowData={paginatedRowData} columns={columns}/>
              {filteredSortedData.length > 0 && (<Pagination totalItems={filteredSortedData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>)}
            </div>
          </div>

          {/* Full-width table */}
          <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4">
            {/* Added shadow and margin-top for separation */}
            <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">
              Latest Conversion
            </h2>
            <DataTableHeader headers={[
            { title: "Date/Time", align: "left" },
            { title: "Location", align: "left" },
            { title: "User", align: "left" },
            { title: "Valid", align: "left" },
            { title: "Cart Value", align: "left" },
        ]}/>
            <DataTableRows rowData={paginatedRowData} columns={columns}/>
          </div>
        </div>
      </div>
    </div>);
};
export default ReferralDetails;

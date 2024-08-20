import React, { useState } from "react";
import { useRouter } from "next/router";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import DataTableRows from "@/components/common/DataTableRows";
import Pagination from "@/components/common/Pagination";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import DetailSection from "@/components/Referrals/DetailSection";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import useReferralDetails from "../../../hooks/useReferralDetails";
// Function to parse the location
var parseLocation = function (location) {
    try {
        var parsedLocation = JSON.parse(location);
        return "".concat(parsedLocation.city, ", ").concat(parsedLocation.country);
    }
    catch (_a) {
        return "Unknown";
    }
};
var ReferralDetails = function () {
    var _a, _b;
    var router = useRouter();
    var referralId = router.query.referralId;
    var _c = useReferralDetails(referralId), customer = _c.customer, campaign = _c.campaign, conversions = _c.conversions, shares = _c.shares, loading = _c.loading, error = _c.error;
    var _d = useState(""), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = useState("date"), sortOrder = _e[0], setSortOrder = _e[1];
    var _f = useState(1), currentPage = _f[0], setCurrentPage = _f[1];
    var itemsPerPage = 10;
    var handlePageChange = function (page) { return setCurrentPage(page); };
    var filterAndSortData = function (data) {
        return data
            .filter(function (item) {
            return item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase());
        })
            .sort(function (a, b) {
            return sortOrder === "date"
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : a[sortOrder].localeCompare(b[sortOrder]);
        });
    };
    var paginatedData = function (data) {
        return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    };
    // Calculate metrics based on conversions and shares
    var totalShares = shares.length; // Total users who signed up
    var totalConversions = conversions.length; // Total users who converted
    var metrics = {
        clicks: (_a = customer === null || customer === void 0 ? void 0 : customer.click_count) !== null && _a !== void 0 ? _a : 0, // Total signups (shares)
        conversions: totalConversions, // Total conversions
        totalSpends: conversions.reduce(function (total, conversion) { return total + conversion.conversion_count * 10; }, 0), // Assuming each conversion is worth $10
        conversionRate: totalShares > 0
            ? (totalConversions / (totalConversions + totalShares)) * 100
            : 0, // Conversion rate based on total signups
        signups: (_b = customer === null || customer === void 0 ? void 0 : customer.signup_count) !== null && _b !== void 0 ? _b : 0, // Cost per acquisition
    };
    if (loading)
        return <LoadingOverlay />;
    if (error)
        return <div className="error-message">Error: {error}</div>;
    var conversionRowData = conversions.map(function (conversion) { return ({
        date: new Date(conversion.date_created).toLocaleString(),
        location: parseLocation(conversion.location),
        user: conversion.name || "N/A",
        campaign: (campaign === null || campaign === void 0 ? void 0 : campaign.name) || "N/A",
        value: conversion.conversion_count > 0
            ? "$".concat(conversion.conversion_count * 10)
            : "No Spend",
    }); });
    // Handle all shares (signups) whether converted or not
    var shareRowData = shares.map(function (share) { return ({
        date: new Date(share.date_created).toLocaleString(),
        location: parseLocation(share.location),
        user: share.name || "N/A",
        campaign: (campaign === null || campaign === void 0 ? void 0 : campaign.name) || "N/A",
        value: share.conversion_count > 0
            ? "$".concat(share.conversion_count * 10)
            : "No Spend",
    }); });
    var filteredConversionData = filterAndSortData(conversionRowData);
    var filteredShareData = filterAndSortData(shareRowData);
    var paginatedConversionData = paginatedData(filteredConversionData);
    var paginatedShareData = paginatedData(filteredShareData);
    var columns = [
        { dataIndex: "date", className: "text-left", title: "Date" },
        { dataIndex: "location", className: "text-left", title: "Location" },
        { dataIndex: "user", className: "text-left", title: "User" },
        { dataIndex: "campaign", className: "text-left", title: "Campaign" },
        { dataIndex: "value", className: "text-left", title: "Value" },
    ];
    return (<div className="relative">
      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
        <ScrollableContainer>
          <PerformanceSummary metricName="Clicks" value={metrics.clicks.toString()} iconName="MouseClickIcon"/>
          <PerformanceSummary metricName="Conversions" value={metrics.conversions.toString()} iconName="Conversions"/>
          <PerformanceSummary metricName="Conversion Rate" value={"".concat(metrics.conversionRate.toFixed(2), "%")} iconName="ConversionRate"/>
          <PerformanceSummary metricName="Total Spends" value={"$".concat(metrics.totalSpends)} iconName="TotalSpends"/>
          <PerformanceSummary metricName="Sign ups" value={"".concat(metrics.signups)} iconName="MouseClickedIcon"/>
        </ScrollableContainer>
        <div className="flex flex-col w-full overflow-hidden rounded-2xl bg-[#f3f3f3]">
          <div className="flex w-full gap-4 flex-col lg:flex-row">
            <DetailSection customer={customer} referralCode={null} // Assuming no referral code data
     campaign={campaign}/>
            <div className="bg-white flex flex-col lg:overflow-hidden lg:w-5/6 overflow-x-auto rounded-2xl shadow-lg text-center w-full">
              <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">
                Conversions
              </h2>
              <DataTableHeader headers={{
            columns: columns.map(function (col) { return ({
                title: col.title,
                align: "center",
            }); }),
        }}/>
              <DataTableRows rowData={paginatedConversionData} columns={columns}/>
              {filteredConversionData.length > 0 && (<Pagination totalItems={filteredConversionData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>)}
            </div>
          </div>
          <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4">
            <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">
              Shares
            </h2>
            <DataTableHeader headers={{
            columns: columns.map(function (col) { return ({
                title: col.title,
                align: "center",
            }); }),
        }}/>
            <DataTableRows rowData={paginatedShareData} columns={columns}/>
            {filteredShareData.length > 0 && (<Pagination totalItems={filteredShareData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>)}
          </div>
        </div>
      </div>
    </div>);
};
export default ReferralDetails;

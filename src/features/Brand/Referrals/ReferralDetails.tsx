// src/features/Brand/Referrals/ReferralDetails.tsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import DataTableRows from "../../../components/common/DataTableRows";
import Pagination from "../../../components/common/Pagination";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import DetailSection from "./components/DetailSection"; // Make sure this component exists
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import useReferralDetails, { Customer, Campaign } from "./hooks/useReferralDetails";
import Link from "next/link";

interface RowData {
  date: string;
  location: string;
  user: string;
  campaign: string;
  value: string;
}

const parseLocation = (location: string): string => {
  try {
    const parsedLocation = JSON.parse(location);
    return `${parsedLocation.city}, ${parsedLocation.country}`;
  } catch {
    return "Unknown";
  }
};

const ReferralDetails: React.FC = () => {
  const router = useRouter();
  const { referralId } = router.query;
  const { customer, campaign, conversions, shares, loading, error } = useReferralDetails(
    referralId as string
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<keyof RowData>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const filterAndSortData = (data: RowData[]): RowData[] => {
    return data
      .filter(
        (item) =>
          item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "date"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : (a[sortOrder] as string).localeCompare(b[sortOrder] as string)
      );
  };

  const paginatedData = (data: RowData[]): RowData[] =>
    data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate metrics based on conversions and shares
  const totalShares = shares.length;
  const totalConversions = conversions.length;

  const metrics = {
    clicks: customer?.click_count ?? 0,
    conversions: customer?.conversion_count,
    totalSpends: Array.isArray(conversions)
      ? conversions.reduce((total, conversion) => total + conversion.conversion_count * 10, 0)
      : 0, // default to 0 if conversions is not an array
    conversionRate:
      totalShares > 0 ? (totalConversions / (totalConversions + totalShares)) * 100 : 0,
    signups: customer?.signup_count ?? 0,
  };

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="error-message">Error: {error}</div>;

  const conversionRowData: RowData[] = Array.isArray(conversions)
    ? conversions.map((conversion) => ({
        date: new Date(conversion.date_created).toLocaleString(),
        location: parseLocation(conversion.location),
        user: conversion.name || "N/A",
        campaign: campaign?.name || "N/A",
        value:
          conversion.conversion_count > 0 ? `$${conversion.conversion_count * 10}` : "No Spend",
      }))
    : [];

  const shareRowData: RowData[] = shares.map((share) => ({
    date: new Date(share.date_created).toLocaleString(),
    location: parseLocation(share.location),
    user: share.name || "N/A",
    campaign: campaign?.name || "N/A",
    value: share.conversion_count > 0 ? `$${share.conversion_count * 10}` : "No Spend",
  }));

  const filteredConversionData = filterAndSortData(conversionRowData);
  const filteredShareData = filterAndSortData(shareRowData);

  const paginatedConversionData = paginatedData(filteredConversionData);
  const paginatedShareData = paginatedData(filteredShareData);

  const columns = [
    { dataIndex: "date", className: "text-left", title: "Date" },
    { dataIndex: "location", className: "text-left", title: "Location" },
    { dataIndex: "user", className: "text-left", title: "User" },
    { dataIndex: "campaign", className: "text-left", title: "Campaign" },
    { dataIndex: "value", className: "text-left", title: "Value" },
  ];

  const { shop, host, id_token } = router.query;

  let referralsUrl = "";

  // Build the base URL depending on the user role
  if (router.pathname.includes("brand")) {
    referralsUrl = `/brand/referrals`;
  } else {
    referralsUrl = `/customer/referrals`;
  }

  if (shop || host || id_token) {
    const urlObj = new URL(window.location.origin + referralsUrl);
    if (shop) urlObj.searchParams.set("shop", shop as string);
    if (host) urlObj.searchParams.set("host", host as string);
    if (id_token) urlObj.searchParams.set("id_token", id_token as string);

    referralsUrl = urlObj.toString().replace(window.location.origin, "");
  }

  return (
    <div className="relative">
      <div className="flex justify-start items-center relative gap-2">
        <Link
          href={referralsUrl}
          className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50"
        >
          Referral
        </Link>
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-4 h-4 relative"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M5.75 3.5L10.25 8L5.75 12.5"
            stroke="black"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50">
          Referral Detail
        </p>
      </div>
      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
        <ScrollableContainer>
          <PerformanceSummary
            metricName="Clicks"
            value={metrics.clicks.toString()}
            iconName="MouseClickIcon"
          />
          <PerformanceSummary
            metricName="Conversions"
            value={(metrics.conversions ?? 0).toString()}
            iconName="Conversions"
          />
          <PerformanceSummary
            metricName="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(2)}%`}
            iconName="ConversionRate"
          />
          <PerformanceSummary
            metricName="Total Spends"
            value={`$${metrics.totalSpends}`}
            iconName="TotalSpends"
          />
          <PerformanceSummary
            metricName="Sign ups"
            value={`${metrics.signups}`}
            iconName="MouseClickedIcon"
          />
        </ScrollableContainer>
        <div className="flex flex-col w-full overflow-hidden rounded-2xl bg-[#f3f3f3]">
          <div className="flex w-full gap-4 flex-col lg:flex-row">
            <DetailSection customer={customer} referralCode={null} campaign={campaign} />
            <div className="bg-white flex flex-col lg:overflow-hidden lg:w-5/6 overflow-x-auto rounded-2xl shadow-lg text-center w-full">
              <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">
                Conversions
              </h2>
              <DataTableHeader
                headers={{
                  columns: columns.map((col) => ({
                    title: col.title,
                    align: "center",
                  })),
                }}
              />
              <DataTableRows rowData={paginatedConversionData} columns={columns} />
              {filteredConversionData.length > 0 && (
                <Pagination
                  totalItems={filteredConversionData.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4">
            <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">Shares</h2>
            <DataTableHeader
              headers={{
                columns: columns.map((col) => ({
                  title: col.title,
                  align: "center",
                })),
              }}
            />
            <DataTableRows rowData={paginatedShareData} columns={columns} />
            {filteredShareData.length > 0 && (
              <Pagination
                totalItems={filteredShareData.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDetails;

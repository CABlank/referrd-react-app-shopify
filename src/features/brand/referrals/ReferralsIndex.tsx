// src/features/Brand/Referrals/ReferralsIndex.tsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import SearchSortSection from "../../../components/common/SearchSortSection";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import Pagination from "../../../components/common/Pagination";
import EyeIconDetail from "../../../components/icons/EyeIconDetail";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DataTableRows from "../../../components/common/DataTableRows";
import useCustomers from "./hooks/useReferrals"; // Updated path to your hook

interface CustomerData {
  id: number;
  uuid: string;
  date: string;
  name: string;
  campaign: string;
  location: string;
  signup_count: number;
  click_count: number;
  conversion_count: number;
  spend: number;
}

interface ReferralsIndexProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const parseLocation = (location: string): string => {
  try {
    const parsedLocation = JSON.parse(location);
    return `${parsedLocation.city}, ${parsedLocation.country}`;
  } catch {
    return "Unknown";
  }
};

const ReferralsIndex: React.FC<ReferralsIndexProps> = ({ accessToken, refreshToken, userId }) => {
  const router = useRouter();
  const { customers, campaigns, loading } = useCustomers({
    accessToken,
    refreshToken,
    userId,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<keyof CustomerData>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mapCustomerData = (): CustomerData[] =>
    customers.map((customer) => ({
      id: customer.id,
      uuid: customer.uuid,
      date: new Date(customer.date_created).toLocaleString(),
      name: customer.name || "N/A",
      campaign: campaigns.find((c) => c.uuid === customer.campaign_uuid)?.name || "N/A",
      location: parseLocation(customer.location),
      signup_count: customer.signup_count,
      click_count: customer.click_count,
      conversion_count: customer.conversion_count,
      spend: customer.conversion_count * 10, // Example spend calculation
    }));

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleSort = (order: string) => setSortOrder(order as keyof CustomerData);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const filteredCustomers = mapCustomerData().filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCustomers = filteredCustomers.sort((a, b) =>
    sortOrder === "date"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : (a[sortOrder] as string).localeCompare(b[sortOrder] as string)
  );

  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const computePerformanceMetrics = () => {
    const totalSignups = sortedCustomers.reduce((acc, c) => acc + c.signup_count, 0);
    const totalClicks = sortedCustomers.reduce((acc, c) => acc + c.click_count, 0);
    const totalConversions = sortedCustomers.reduce((acc, c) => acc + c.conversion_count, 0);
    const totalSpends = sortedCustomers.reduce((acc, c) => acc + c.spend, 0);
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const cpa = totalConversions > 0 ? totalSpends / totalConversions : 0;

    return {
      totalSignups,
      totalClicks,
      totalConversions,
      conversionRate: conversionRate.toFixed(2),
      totalSpends: totalSpends.toFixed(2),
      cpa: cpa.toFixed(2),
    };
  };

  const metrics = computePerformanceMetrics();

  const columns = [
    { dataIndex: "date", className: "text-center text-xs", title: "Date" },
    { dataIndex: "name", className: "text-center", title: "Name" },
    { dataIndex: "campaign", className: "text-center", title: "Campaign" },
    { dataIndex: "location", className: "text-center", title: "Location" },
    { dataIndex: "signup_count", className: "text-center", title: "Sign Ups" },
    { dataIndex: "click_count", className: "text-center", title: "Clicks" },
    {
      dataIndex: "uuid",
      className: "text-center flex justify-center items-center",
      customRender: (uuid: string) => (
        <button
          className="text-[#3f59e4] flex items-center justify-center gap-2"
          onClick={() => {
            const { shop, host, id_token } = router.query; // Extract existing query parameters

            let url = `/brand/referrals/${uuid}`; // Base URL with the uuid

            if (shop || host || id_token) {
              const urlObj = new URL(window.location.origin + url);
              if (shop) urlObj.searchParams.set("shop", shop as string);
              if (host) urlObj.searchParams.set("host", host as string);
              if (id_token) urlObj.searchParams.set("id_token", id_token as string);

              url = urlObj.toString().replace(window.location.origin, "");
            }

            router.push(url);
          }}
        >
          <EyeIconDetail />
          Details
        </button>
      ),
      title: "Actions",
    },
  ];

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}
      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
        <ScrollableContainer>
          <PerformanceSummary
            metricName="Sign Ups"
            value={metrics.totalSignups.toString()}
            iconName=""
          />
          <PerformanceSummary
            metricName="Clicks"
            value={metrics.totalClicks.toString()}
            iconName="MouseClickIcon"
          />
          <PerformanceSummary
            metricName="Conversions"
            value={metrics.totalConversions.toString()}
            iconName="Conversions"
          />
          <PerformanceSummary
            metricName="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            iconName="ConversionRate"
          />
          <PerformanceSummary
            metricName="Total Spends"
            value={`$${metrics.totalSpends}`}
            iconName="TotalSpends"
          />
          <PerformanceSummary
            metricName="CPA"
            value={`$${metrics.cpa}`}
            iconName="MouseClickedIcon"
          />
        </ScrollableContainer>
        <SearchSortSection onSearch={handleSearch} onSort={handleSort} />
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center mobile-scroll">
          <DataTableHeader
            headers={{
              columns: columns.map((col) => ({
                title: col.title,
                align: "center",
                className: col.className,
              })),
            }}
          />
          <DataTableRows rowData={paginatedCustomers} columns={columns} />
          {sortedCustomers.length > 0 && (
            <Pagination
              totalItems={sortedCustomers.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralsIndex;

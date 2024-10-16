import React, { useState } from "react";
import { useRouter } from "next/router";
import SearchSortSection from "../../../components/common/SearchSortSection";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import Pagination from "../../../components/common/Pagination";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DataTableRows from "../../../components/common/DataTableRows";
import useCustomers from "./hooks/useReferrals"; // Updated path to your hook

interface CustomerData {
  id: number;
  uuid: string;
  date: string;
  name: string;
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

const ReferralsIndex: React.FC<ReferralsIndexProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  const router = useRouter();
  const { customers, loading } = useCustomers({
    accessToken,
    refreshToken,
    userId,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<keyof CustomerData>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const mapCustomerData = (): CustomerData[] =>
    customers.map((customer) => ({
      id: customer.id,
      uuid: customer.uuid,
      date: new Date(customer.date_created).toLocaleString(),
      name: customer.name || "N/A",
      location: parseLocation(customer.location),
      signup_count: customer.signup_count,
      click_count: customer.click_count,
      conversion_count: customer.conversion_count,
      spend: customer.conversion_count * 10, // Example spend calculation
    }));

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleSort = (order: string) =>
    setSortOrder(order as keyof CustomerData);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const filteredCustomers = mapCustomerData().filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by name
      customer.location.toLowerCase().includes(searchQuery.toLowerCase()) // Search by location
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
    const totalSignups = sortedCustomers.reduce(
      (acc, c) => acc + c.signup_count,
      0
    );
    const totalClicks = sortedCustomers.reduce(
      (acc, c) => acc + c.click_count,
      0
    );
    const totalConversions = sortedCustomers.reduce(
      (acc, c) => acc + c.conversion_count,
      0
    );
    const totalSpends = sortedCustomers.reduce((acc, c) => acc + c.spend, 0);
    const conversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
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

  // Updated columns with Campaign and Actions removed
  const columns = [
    { dataIndex: "date", className: "text-center text-xs", title: "Date" },
    { dataIndex: "name", className: "text-center", title: "Name" },
    { dataIndex: "location", className: "text-center", title: "Location" },
    { dataIndex: "signup_count", className: "text-center", title: "Sign Ups" },
    { dataIndex: "click_count", className: "text-center", title: "Clicks" },
  ];

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}
      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
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

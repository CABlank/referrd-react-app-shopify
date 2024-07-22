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

// Define an interface for the row data structure
interface RowData {
  date: string;
  location: string;
  UserName: string;
  Valid: string;
  CartValue: string;
}

const ReferralDetails: React.FC = () => {
  const router = useRouter(); // Hook to programmatically navigate
  const { referralsId } = router.query; // Get referral ID from the query parameters
  const { referral, customer, referralCode, campaign, loading, error } =
    useReferralDetails(referralsId); // Custom hook to fetch referral details

  // State for search query, sort order, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<keyof RowData>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle sort order change
  const handleSort = (order: keyof RowData) => {
    setSortOrder(order);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter and sort row data based on search query and sort order
  const filterAndSortData = (data: RowData[]): RowData[] => {
    const filteredData = data.filter((item) => {
      return (
        item.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    const sortedData = filteredData.sort((a, b) => {
      if (sortOrder === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return (a[sortOrder] as string).localeCompare(b[sortOrder] as string);
    });

    return sortedData;
  };

  // Paginate the sorted data
  const paginatedData = (data: RowData[]): RowData[] => {
    return data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  };

  // Compute performance metrics for the referral
  const computePerformanceMetrics = () => {
    const clicks = referral ? 1 : 0;
    const conversions = referral && referral.conversion === "true" ? 1 : 0;
    const totalSpends = referral ? referral.spend || 0 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const cpa = conversions > 0 ? totalSpends / conversions : 0;

    return {
      clicks,
      conversions,
      totalSpends,
      conversionRate: conversionRate.toFixed(2),
      cpa: cpa.toFixed(2),
    };
  };

  const metrics = computePerformanceMetrics();

  // Handle loading state
  if (loading) {
    return <LoadingOverlay />;
  }

  // Handle error state
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Prepare row data for the referral details table
  const rowData: RowData[] = referral
    ? [
        {
          date: new Date(referral.date_created).toLocaleString(),
          location: referral.location || "N/A",
          UserName: customer?.name || "N/A",
          Valid: referral.conversion === "true" ? "Yes" : "No",
          CartValue: referral.spend ? `$${referral.spend}` : "No Spend",
        },
      ]
    : [];

  const filteredSortedData = filterAndSortData(rowData);
  const paginatedRowData = paginatedData(filteredSortedData);

  // Define table columns
  const columns = [
    { dataIndex: "date", className: "text-left" },
    { dataIndex: "location", className: "text-left" },
    { dataIndex: "UserName", className: "text-left" },
    { dataIndex: "Valid", className: "text-left" },
    { dataIndex: "CartValue", className: "text-left" },
  ];

  return (
    <div className="relative">
      <p className="text-[40px] font-semibold text-left text-[#10ad1b] mx-auto">
        Referrals
      </p>

      <div className="flex flex-col justify-center items-center mx-auto gap-4 sm:p-4">
        {/* Performance Metrics */}
        <ScrollableContainer>
          <PerformanceSummary
            metricName="Clicks"
            value={metrics.clicks.toString()}
          />
          <PerformanceSummary
            metricName="Conversions"
            value={metrics.conversions.toString()}
          />
          <PerformanceSummary
            metricName="Conversion Rate"
            value={`${metrics.conversionRate}%`}
          />
          <PerformanceSummary
            metricName="Total Spends"
            value={`$${metrics.totalSpends}`}
          />
          <PerformanceSummary metricName="CPA" value={`$${metrics.cpa}`} />
        </ScrollableContainer>
        <div className="flex flex-col w-full overflow-hidden rounded-2xl bg-[#f3f3f3]">
          {/* Container for the two side-by-side tables */}
          <div className="flex w-full gap-4 flex-col lg:flex-row">
            {/* Added padding around the container and gap between children */}
            {/* First table with 30% width */}
            <DetailSection
              referral={referral}
              customer={customer}
              referralCode={referralCode}
              campaign={campaign}
            />
            {/* Second table with 70% width */}
            <div className="bg-white flex flex-col lg:overflow-hidden lg:w-5/6 overflow-x-auto rounded-2xl shadow-lg text-center w-full">
              {/* Added shadow for depth */}
              <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">
                Share Clicks
              </h2>
              <DataTableHeader
                headers={[
                  { title: "Date/Time", align: "left" },
                  { title: "Location", align: "left" },
                  { title: "User", align: "left" },
                  { title: "Valid", align: "left" },
                  { title: "Cart Value", align: "left" },
                ]}
              />
              <DataTableRows rowData={paginatedRowData} columns={columns} />
              {filteredSortedData.length > 0 && (
                <Pagination
                  totalItems={filteredSortedData.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>

          {/* Full-width table */}
          <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4">
            {/* Added shadow and margin-top for separation */}
            <h2 className="text-[#10ad1b] text-2xl font-semibold text-left px-8 py-4">
              Latest Conversion
            </h2>
            <DataTableHeader
              headers={[
                { title: "Date/Time", align: "left" },
                { title: "Location", align: "left" },
                { title: "User", align: "left" },
                { title: "Valid", align: "left" },
                { title: "Cart Value", align: "left" },
              ]}
            />
            <DataTableRows rowData={paginatedRowData} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDetails;

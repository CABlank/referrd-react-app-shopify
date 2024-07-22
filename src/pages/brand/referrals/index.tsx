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

// Define an interface for the referral data structure
interface ReferralData {
  id: number;
  date: string;
  referrer: string;
  campaign: string;
  referralCode: string;
  location: string;
  spend: number;
  conversion: boolean;
}

const ReferralsIndex: React.FC = () => {
  const router = useRouter(); // Hook to programmatically navigate
  const { referrals, customers, referralCodes, campaigns, loading, error } =
    useReferrals(); // Custom hook to fetch referral-related data

  // State for search query, sort order, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<keyof ReferralData>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Map raw referral data to a structured format
  const mapReferralData = (): ReferralData[] => {
    return referrals.map((referral) => {
      const customer = customers.find((c) => c.id === referral.referrer);
      const campaign = campaigns.find((c) => c.id === referral.campaign);
      const referralCode = referralCodes.find(
        (code) => code.id === referral.referralCode
      );

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
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle sort order change
  const handleSort = (order: string) => {
    setSortOrder(order as keyof ReferralData);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter and sort referral data based on search query and sort order
  const filteredReferrals = mapReferralData().filter((referral) => {
    return (
      referral.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedReferrals = filteredReferrals.sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return (a[sortOrder] as string).localeCompare(b[sortOrder] as string);
  });

  // Paginate sorted referrals
  const paginatedReferrals = sortedReferrals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Define table columns
  const columns = [
    { dataIndex: "date", className: "text-center text-sm" },
    { dataIndex: "referrer", className: "text-center" },
    { dataIndex: "campaign", className: "text-center" },
    { dataIndex: "referralCode", className: "text-center text-xs" },
    { dataIndex: "location", className: "text-center" },
    {
      dataIndex: "id",
      className: "text-center flex justify-center items-center",
      customRender: (id: number) => (
        <button
          className="text-[#3f59e4] flex items-center justify-center gap-2"
          onClick={() => router.push(`/brand/referrals/${id}`)}
        >
          <EyeIconDetail />
          Details
        </button>
      ),
    },
  ];

  // Compute performance metrics for referrals
  const computePerformanceMetrics = () => {
    const clicks = sortedReferrals.length;
    const conversions = sortedReferrals.filter((r) => r.conversion).length;
    const totalSpends = sortedReferrals.reduce((acc, r) => acc + r.spend, 0);
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

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}

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
        {/* Search and Sort */}
        <SearchSortSection onSearch={handleSearch} onSort={handleSort} />
        {/* Data Table and Pagination */}
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center mobile-scroll">
          <DataTableHeader
            headers={[
              { title: "Date", align: "center" },
              { title: "Referrer", align: "center" },
              { title: "Campaign", align: "center" },
              { title: "Referral Code", align: "center" },
              { title: "Location", align: "center" },
              { title: "Action", align: "center", className: "extra-styles" },
            ]}
          />
          <DataTableRows rowData={paginatedReferrals} columns={columns} />
          {sortedReferrals.length > 0 && (
            <Pagination
              totalItems={sortedReferrals.length}
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

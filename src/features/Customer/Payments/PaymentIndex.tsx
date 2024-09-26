import React, { useState } from "react";
import SearchSortSection from "../../../components/common/SearchSortSection";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import Pagination from "../../../components/common/Pagination";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DataTableRows from "../../../components/common/DataTableRows";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import { usePayments } from "./hooks/usePayments";
import { MappedPayment } from "./types";

interface PaymentIndexProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const PaymentIndex: React.FC<PaymentIndexProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  const { payments, loading } = usePayments(accessToken, refreshToken, userId);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleSort = (order: string) => setSortOrder(order);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to the first page whenever items per page changes
  };

  const filteredPayments = payments.filter((payment) => {
    return (
      payment.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedPayments = filteredPayments.sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === "referrer") {
      return a.referrer.localeCompare(b.referrer);
    } else if (sortOrder === "campaign") {
      return a.campaign.localeCompare(b.campaign);
    } else if (sortOrder === "referralCashback") {
      return b.referralCashback - a.referralCashback;
    } else {
      return 0;
    }
  });

  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Define styles for the payment status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-600 px-3 py-1 rounded-full";
      case "Declined":
        return "bg-red-100 text-red-600 px-3 py-1 rounded-full";
      case "Pending":
        return "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full";
      default:
        return "bg-gray-100 text-gray-600 px-3 py-1 rounded-full";
    }
  };

  const columns = [
    { dataIndex: "date", className: "text-center text-sm" },
    { dataIndex: "referrer", className: "text-center" },
    { dataIndex: "campaign", className: "text-center" },
    {
      dataIndex: "referralCashback",
      className: "text-center",
      customRender: (value: number) => `$${value.toFixed(2)}`, // Format as currency
    },
    {
      dataIndex: "status",
      className: "text-center",
      customRender: (status: string) => {
        // Apply styles dynamically based on the status value
        return <span className={getStatusStyle(status)}>{status}</span>;
      },
    },
  ];

  const computePerformanceMetrics = () => {
    const totalPayments = payments.length;
    const approvedPayments = payments.filter(
      (p) => p.status === "Approved"
    ).length;
    const declinedPayments = payments.filter(
      (p) => p.status === "Declined"
    ).length;
    const pendingPayments = payments.filter(
      (p) => p.status === "Pending"
    ).length;

    const totalPaymentsValue = payments.reduce(
      (acc, p) => acc + (p.referralCashback || 0),
      0
    );

    const averagePaymentsValue =
      totalPayments > 0 ? totalPaymentsValue / totalPayments : 0;

    return {
      totalPayments,
      approvedPayments,
      declinedPayments,
      pendingPayments,
      totalPaymentsValue: totalPaymentsValue.toFixed(2),
      averagePaymentsValue: averagePaymentsValue.toFixed(2),
    };
  };

  const metrics = computePerformanceMetrics();

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}

      <div className="flex flex-col justify-center items-center mx-auto gap-4 mt-6">
        {/* Performance Metrics */}
        <div className="relative w-full flex justify-center items-center">
          <ScrollableContainer>
            <PerformanceSummary
              metricName="Approved Payments"
              value={metrics.approvedPayments.toString()}
              iconName="MouseClickIcon"
            />
            <PerformanceSummary
              metricName="Declined Payments"
              value={metrics.declinedPayments.toString()}
              iconName="Conversions"
            />
            <PerformanceSummary
              metricName="Pending Payments"
              value={metrics.pendingPayments.toString()}
              iconName="ConversionRate"
            />
            <PerformanceSummary
              metricName="Total Payments"
              value={`$${metrics.totalPaymentsValue}`}
              iconName="TotalSpends"
            />
            <PerformanceSummary
              metricName="Avg Payments"
              value={`$${metrics.averagePaymentsValue}`}
              iconName="MouseClickedIcon"
            />
          </ScrollableContainer>
        </div>

        {/* Data Table */}
        <div className="w-full">
          {/* Search, Sort, and Items Per Page */}
          <div className="flex justify-end w-full mb-4 ">
            <div className="flex items-center gap-4">
              <SearchSortSection onSearch={handleSearch} onSort={handleSort} />
              <div className="hidden sm:flex items-center px-0 py-2 justify-center rounded-lg bg-white w-[30%] sm:w-auto">
                <select
                  className="text-[.8rem] sm:text-base font-medium text-left text-black/80"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={10}>10 Items Per Page</option>
                  <option value={20}>20 Items Per Page</option>
                  <option value={50}>50 Items Per Page</option>
                  <option value={100}>100 Items Per Page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table and Pagination */}
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center">
          <DataTableHeader
            headers={{
              columns: [
                { title: "Date", align: "center" },
                { title: "Referrer", align: "center" },
                { title: "Campaign", align: "center" },
                { title: "Referral Fee", align: "center" },
                { title: "Status", align: "center" }, // Status column
              ],
            }}
          />
          <DataTableRows
            rowData={paginatedPayments.map((payment) => ({
              ...payment,
            }))}
            columns={columns}
            selectable={false} // Disable checkbox selection
          />
          {sortedPayments.length > 0 && (
            <Pagination
              totalItems={sortedPayments.length}
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

export default PaymentIndex;

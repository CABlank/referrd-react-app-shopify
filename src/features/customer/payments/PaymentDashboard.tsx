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
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
      return b.referralCashback - a.referralCashback; // Assuming referralCashback is a number
    } else {
      return 0; // Default case if sortOrder doesn't match any known property
    }
  });

  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Updated columns without "Order" and without Action buttons
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
      dataIndex: "status", // Added status instead of action buttons
      className: "text-center",
      customRender: (status: string) => {
        // Simply return the status text
        return <span>{status}</span>;
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

    // Calculate the total order value
    const totalOrderValue = payments.reduce(
      (acc, p) => acc + parseFloat(p.total_price),
      0
    );

    // Calculate the average order value
    const averageOrderValue =
      totalPayments > 0 ? totalOrderValue / totalPayments : 0;

    return {
      totalPayments,
      approvedPayments,
      declinedPayments,
      pendingPayments,
      totalOrderValue: totalOrderValue.toFixed(2),
      averageOrderValue: averageOrderValue.toFixed(2),
    };
  };

  const metrics = computePerformanceMetrics();

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}

      <div className="flex flex-col justify-center items-center mx-auto gap-4 mt-6">
        {/* Data Table and Pagination */}
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center">
          <DataTableHeader
            headers={{
              columns: [
                { title: "Date", align: "center" },
                { title: "Referrer", align: "center" },
                { title: "Campaign", align: "center" },
                { title: "Referral Fee", align: "center" },
                { title: "Status", align: "center" }, // Changed "Action" to "Status"
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

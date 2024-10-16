import React, { useState } from "react";
import SearchSortSection from "../../../components/common/SearchSortSection";
import DataTableHeader from "../../../components/common/DataTableHeader";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import Pagination from "../../../components/common/Pagination";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DataTableRows from "../../../components/common/DataTableRows";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import ActionButtons from "./components/ActionButtons";
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
  const {
    payments,
    loading,
    error,
    handlePaymentAction,
    handleBulkAction,
    selectedPayments,
    setSelectedPayments,
    selectAll,
    setSelectAll,
  } = usePayments(accessToken, refreshToken, userId);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Add this state for button clicked tracking
  const [buttonClicked, setButtonClicked] = useState<
    "Approved" | "Declined" | "Pending" | null
  >(null);

  // This function should handle "Pending", "Approved", and "Declined" actions
  const handlePaymentActionWithPending = async (
    paymentId: number,
    action: "Approved" | "Declined" | "Pending"
  ): Promise<void> => {
    try {
      setButtonClicked(action); // Track which button was clicked
      await handlePaymentAction(paymentId, action as "Approved" | "Declined");
    } catch (error) {
      console.error(
        `Error handling payment action for ID ${paymentId}:`,
        error
      );
    } finally {
      setButtonClicked(null); // Reset the button click state after action is complete
    }
  };

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleSort = (order: string) => setSortOrder(order);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleCheckboxChange = (paymentId: number, isChecked: boolean) => {
    setSelectedPayments((prevSelectedPayments) => {
      if (isChecked) {
        return [...prevSelectedPayments, paymentId];
      } else {
        return prevSelectedPayments.filter((id) => id !== paymentId);
      }
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedPayments(payments.map((payment) => payment.id ?? 0));
    } else {
      setSelectedPayments([]);
    }
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
    } else if (sortOrder === "order") {
      return a.order.localeCompare(b.order);
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

  const columns = [
    { dataIndex: "order", className: "text-center" },
    { dataIndex: "date", className: "text-center text-sm" },
    { dataIndex: "referrer", className: "text-center" },
    { dataIndex: "campaign", className: "text-center" },
    {
      dataIndex: "referralCashback",
      className: "text-center",
      customRender: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      dataIndex: "id",
      className: "text-center flex justify-center items-center",
      customRender: (id: number, record: MappedPayment) => (
        <ActionButtons
          payment={record}
          handlePaymentAction={handlePaymentActionWithPending}
        />
      ),
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

    const totalOrderValue = payments.reduce(
      (acc, p) => acc + parseFloat(p.total_price),
      0
    );

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
              metricName="Total Order Value"
              value={`$${metrics.totalOrderValue}`}
              iconName="TotalSpends"
            />
            <PerformanceSummary
              metricName="Avg Order Value"
              value={`$${metrics.averageOrderValue}`}
              iconName="MouseClickedIcon"
            />
          </ScrollableContainer>
        </div>

        <div className="w-full">
          <div className="flex justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              {selectedPayments.length > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction("Approved")}
                    className={`h-10 px-6 py-2 rounded-lg ${
                      buttonClicked === "Approved"
                        ? "bg-[#47B775] text-white"
                        : "bg-[#47B775] text-white hover:bg-[#3a955d]"
                    } font-medium`}
                  >
                    {buttonClicked === "Approved"
                      ? "Approved"
                      : "Approve Selected"}
                  </button>
                  <button
                    onClick={() => handleBulkAction("Declined")}
                    className={`h-10 px-6 py-2 rounded-lg ${
                      buttonClicked === "Declined"
                        ? "bg-[#D52121] text-white"
                        : "bg-[#D52121] text-white hover:bg-[#b41b1b]"
                    } font-medium`}
                  >
                    {buttonClicked === "Declined"
                      ? "Declined"
                      : "Decline Selected"}
                  </button>
                </>
              )}
            </div>
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

        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center">
          <DataTableHeader
            headers={{
              selectAll,
              handleSelectAll,
              columns: [
                { title: "Order", align: "center", className: "extra-styles" },
                { title: "Date", align: "center" },
                { title: "Referrer", align: "center" },
                { title: "Campaign", align: "center" },
                { title: "Referral Fee", align: "center" },
                { title: "Action", align: "center" },
              ],
            }}
          />
          <DataTableRows
            rowData={paginatedPayments.map((payment) => ({
              ...payment,
              selected: selectedPayments.includes(payment.id ?? 0),
            }))}
            columns={columns}
            selectable={true}
            handleCheckboxChange={handleCheckboxChange}
            selectedPayments={selectedPayments}
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

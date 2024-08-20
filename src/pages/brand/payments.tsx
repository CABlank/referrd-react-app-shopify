import React, { useEffect, useRef, useState } from "react";
import SearchSortSection from "../../components/common/SearchSortSection";
import DataTableHeader from "../../components/common/DataTableHeader";
import PerformanceSummary from "../../components/common/PerformanceSummary";
import Pagination from "../../components/common/Pagination";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import DataTableRows from "../../components/common/DataTableRows";
import {
  fetchCompanyUUID,
  fetchPaymentsByCompanyId,
  Payment,
  fetchReferrer,
  fetchCampaignMetadata,
  updatePaymentStatus as updatePaymentStatusService,
} from "../../services/payments/payments";
import { useSession } from "../../context/SessionContext";
import DeclineIcon from "@/components/Icons/DeclineIcon";
import AcceptIcon from "@/components/Icons/AcceptIcon";
import SeparatorIcon from "@/components/Icons/SeparatorIcon";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import initialLoadChecker from "@/utils/middleware/initialLoadChecker";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

interface MappedPayment extends Payment {
  referrer: string;
  campaign: string;
  referralCashback: number;
  date: string;
  order: string;
}

interface PaymentsProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  title: string;
}

const Payments: React.FC<PaymentsProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  const { session, withTokenRefresh } = useSession();
  const [payments, setPayments] = useState<MappedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [buttonClicked, setButtonClicked] = useState<
    "Accepted" | "Declined" | null
  >(null);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if ((session?.token || accessToken) && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true;

        try {
          const companyUUID = await withTokenRefresh(
            (token) => fetchCompanyUUID(token),
            refreshToken,
            userId
          );

          if (companyUUID) {
            const paymentsData = await withTokenRefresh(
              (token) => fetchPaymentsByCompanyId(companyUUID, token),
              refreshToken,
              userId
            );

            if (paymentsData) {
              const mappedPayments = await Promise.all(
                paymentsData.map(
                  async (payment: {
                    referral_uuid: string;
                    campaign_uuid: string;
                    total_price: string;
                    date_created: string | number | Date;
                    order_number: any;
                  }) => {
                    const referrer = payment.referral_uuid
                      ? await withTokenRefresh(
                          (token) =>
                            fetchReferrer(payment.referral_uuid, token),
                          refreshToken,
                          userId
                        )
                      : null;
                    const campaign = payment.campaign_uuid
                      ? await withTokenRefresh(
                          (token) =>
                            fetchCampaignMetadata(payment.campaign_uuid, token),
                          refreshToken,
                          userId
                        )
                      : null;

                    const referrerName =
                      referrer?.name || referrer?.email || "N/A";
                    const campaignName = campaign ? `${campaign.name}` : "N/A";

                    // Calculate referral fee
                    const referralFee = campaign
                      ? calculateReferralFee(
                          payment.total_price,
                          campaign.commission,
                          campaign.commissionType
                        )
                      : 0;

                    return {
                      ...payment,
                      referrer: referrerName,
                      campaign: campaignName,
                      referralCashback: referralFee,
                      date: new Date(payment.date_created).toLocaleString(),
                      order: `#${payment.order_number}`,
                    };
                  }
                )
              );
              setPayments(mappedPayments);
            }
          } else {
            setError("Failed to load company UUID.");
          }
        } catch (err) {
          console.error("Error loading data:", err);
          setError("Failed to load data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [session?.token, accessToken, refreshToken, userId, withTokenRefresh]);

  const calculateReferralFee = (
    totalPrice: string,
    commission: number,
    commissionType: string
  ): number => {
    if (commissionType === "FixedAmount") {
      return commission;
    } else if (commissionType === "Percentage") {
      return (parseFloat(totalPrice) * commission) / 100;
    }
    return 0;
  };

  const handlePaymentAction = async (
    paymentId: number,
    action: "Accepted" | "Declined"
  ) => {
    if (session?.token || accessToken) {
      setLoading(true);
      try {
        await withTokenRefresh(
          (token) => updatePaymentStatusService(paymentId, action, token),
          refreshToken,
          userId
        );
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === paymentId ? { ...payment, status: action } : payment
          )
        );
      } catch (err) {
        console.error("Error processing payment action:", err);
        setError("Failed to process payment action. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkAction = async (action: "Accepted" | "Declined") => {
    if ((session?.token || accessToken) && selectedPayments.length > 0) {
      setLoading(true);
      setButtonClicked(action);
      try {
        await withTokenRefresh(
          (token) =>
            Promise.all(
              selectedPayments.map((paymentId) =>
                updatePaymentStatusService(paymentId, action, token)
              )
            ),
          refreshToken,
          userId
        );
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            selectedPayments.includes(payment.id ?? 0)
              ? { ...payment, status: action }
              : payment
          )
        );
        setSelectedPayments([]); // Clear selected payments
        setSelectAll(false); // Reset select all state
      } catch (err) {
        console.error("Error processing bulk payment action:", err);
        setError("Failed to process bulk payment action. Please try again.");
      } finally {
        setLoading(false);
        setTimeout(() => {
          setButtonClicked(null);
        }, 3000); // Reset buttonClicked after 3 seconds
      }
    }
  };

  const ActionButtons = ({ payment }: { payment: MappedPayment }) => {
    const statusStyles = {
      Accepted: {
        container: "text-[#10ad1b] bg-[#d6f5d6]/5 border-[#10ad1b]",
        text: "text-[#10ad1b]",
      },
      Declined: {
        container: "text-[#d52121] bg-[#f5d6d6]/5 border-[#d52121]",
        text: "text-[#d52121]",
      },
      Pending: {
        container: "text-gray-500 bg-gray-200/5 border-gray-500",
        text: "text-gray-500",
      },
    };

    const status = payment.status as keyof typeof statusStyles;

    if (status === "Pending") {
      return (
        <div className="flex justify-start items-center gap-2">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handlePaymentAction(payment.id ?? 0, "Accepted")}
          >
            <p className="text-base text-[#10ad1b]">Accept</p>
            <AcceptIcon />
          </div>
          <SeparatorIcon />
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handlePaymentAction(payment.id ?? 0, "Declined")}
          >
            <p className="text-base text-[#d52121]">Decline</p>
            <DeclineIcon />
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={`flex items-center gap-2 ${statusStyles[status].container} rounded-[40px] px-4 py-0.5 border`}
        >
          <p className={`text-base ${statusStyles[status].text}`}>
            {payment.status}
          </p>
        </div>
      );
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to the first page whenever items per page changes
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
      setSelectedPayments(paginatedPayments.map((payment) => payment.id ?? 0));
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
      return b.referralCashback - a.referralCashback; // Assuming referralCashback is a number
    } else {
      return 0; // Default case if sortOrder doesn't match any known property
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
    { dataIndex: "referralCashback", className: "text-center" },
    {
      dataIndex: "id",
      className: "text-center flex justify-center items-center",
      customRender: (id: number, record: MappedPayment) => (
        <ActionButtons payment={record} />
      ),
    },
  ];

  const computePerformanceMetrics = () => {
    const totalPayments = payments.length;
    const acceptedPayments = payments.filter(
      (p) => p.status === "Accepted"
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
      acceptedPayments,
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
        {/* Performance Metrics */}
        <div className="relative w-full flex justify-center items-center">
          <ScrollableContainer>
            <PerformanceSummary
              metricName="Accepted Payments"
              value={metrics.acceptedPayments.toString()}
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

        {/* Data Table */}
        <div className="w-full">
          {/* Search, Sort, Items Per Page, and Bulk Actions */}
          <div className="flex justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              {selectedPayments.length > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction("Accepted")}
                    className={`h-10 px-6 py-2 rounded-lg ${
                      buttonClicked === "Accepted"
                        ? "bg-[#47B775] text-white"
                        : "bg-[#47B775] text-white hover:bg-[#3a955d]"
                    } font-medium`}
                  >
                    {buttonClicked === "Accepted"
                      ? "Accepted"
                      : "Accept Selected"}
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
              <div className="flex items-center px-0 py-2 justify-center rounded-lg bg-white w-[30%] sm:w-auto">
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

export const getServerSideProps: GetServerSideProps<PaymentsProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PaymentsProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Payments",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Payments",
    },
  };
};

export default Payments;

import React, { useEffect, useRef, useState } from "react";
import SearchSortSection from "../../components/common/SearchSortSection";
import DataTableHeader from "../../components/common/DataTableHeader";
import PerformanceSummary from "../../components/common/PerformanceSummary";
import Pagination from "../../components/common/Pagination";
import { useRouter } from "next/router";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import DataTableRows from "../../components/common/DataTableRows";
import {
  fetchPayments,
  updatePaymentStatus,
  Payment,
  fetchCustomers,
  fetchCampaigns,
  fetchReferrals,
  Referral,
  Customer,
  Campaign,
} from "../../services/payments/payments";
import { useSession } from "../../contexts/SessionContext";
import DeclineIcon from "@/components/Icons/DeclineIcon";
import AcceptIcon from "@/components/Icons/AcceptIcon";
import SeparatorIcon from "@/components/Icons/SeparatorIcon";
import ScrollableContainer from "@/components/common/ScrollableContainer";

interface MappedPayment extends Payment {
  referrer: string;
  campaign: string;
  referralCashback: number;
  date: string;
}

const Payments: React.FC = () => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);

  // Search, sort, and pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      const hardcodedToken = "KMH1iScAlNZQO_cZ3FrqRzy8Zn6T91CV";
      if (hardcodedToken && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true; // Set the ref to true to indicate loadData has been called
        try {
          const [paymentsData, customersData, campaignsData, referralsData] =
            await Promise.all([
              fetchPayments(hardcodedToken),
              fetchCustomers(hardcodedToken),
              fetchCampaigns(hardcodedToken),
              fetchReferrals(hardcodedToken),
            ]);

          setPayments(paymentsData);
          setCustomers(customersData);
          setCampaigns(campaignsData);
          setReferrals(referralsData);
        } catch (err) {
          console.error("Error loading data:", err);
          setError("Failed to load data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, []);

  const handlePaymentAction = async (
    paymentId: number,
    action: "Accepted" | "Declined"
  ) => {
    if (session?.token) {
      setLoading(true);
      try {
        await withTokenRefresh((token) =>
          updatePaymentStatus(paymentId, action, token)
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

  const ActionButtons = ({ payment }: { payment: Payment }) => {
    if (payment.status === "Pending") {
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
      return <p className="text-base text-gray-500">{payment.status}</p>;
    }
  };

  const mapPaymentData = (): MappedPayment[] => {
    return payments.map((payment) => {
      const referral = referrals.find((ref) => ref.id === payment.referral_id);
      const customer = customers.find((c) => c.id === referral?.referrer);
      const campaign = campaigns.find((c) => c.id === referral?.campaign);

      return {
        ...payment, // Include all properties from the original payment object
        referrer: customer?.name || "N/A",
        campaign: campaign?.name || "N/A",
        referralCashback: referral?.spend || 0,
        date: new Date(payment.date_created).toLocaleString(), // Derived property for formatted date
        status: payment.status, // Include status property
        referral_id: payment.referral_id, // Include referral_id property
        date_created: payment.date_created, // Include date_created property
      } as MappedPayment; // Add type assertion to MappedPayment
    });
  };

  interface MappedPayment extends Payment {
    referrer: string;
    campaign: string;
    referralCashback: number;
    date: string;
    [key: string]: any; // Add index signature to allow indexing with a string
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredPayments = mapPaymentData().filter((payment) => {
    return (
      payment.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedPayments = filteredPayments.sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a[sortOrder].localeCompare(b[sortOrder]);
  });

  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
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
    const totalReferralCashback = payments.reduce(
      (acc, p) =>
        acc + (referrals.find((ref) => ref.id === p.referral_id)?.spend || 0),
      0
    );
    const averageReferralCashback =
      totalPayments > 0 ? totalReferralCashback / totalPayments : 0;

    return {
      totalPayments,
      acceptedPayments,
      declinedPayments,
      pendingPayments,
      totalReferralCashback: totalReferralCashback.toFixed(2),
      averageReferralCashback: averageReferralCashback.toFixed(2),
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
            />
            <PerformanceSummary
              metricName="Declined Payments"
              value={metrics.declinedPayments.toString()}
            />
            <PerformanceSummary
              metricName="Pending Payments"
              value={metrics.pendingPayments.toString()}
            />
            <PerformanceSummary
              metricName="Total Ref Cashback"
              value={`$${metrics.totalReferralCashback}`}
            />
            <PerformanceSummary
              metricName="Avg Ref Cashback"
              value={`$${metrics.averageReferralCashback}`}
            />
          </ScrollableContainer>
        </div>

        {/* Search and Sort */}
        <SearchSortSection onSearch={handleSearch} onSort={handleSort} />

        {/* Data Table and Pagination */}
        <div className="flex flex-col w-full overflow-x-auto lg:overflow-hidden rounded-2xl bg-white text-center">
          <DataTableHeader
            headers={[
              { title: "Date", align: "center" },
              { title: "Referrer", align: "center" },
              { title: "Campaign", align: "center" },
              { title: "Referral Fee", align: "center" },
              { title: "Action", align: "center", className: "extra-styles" },
            ]}
          />
          <DataTableRows rowData={paginatedPayments} columns={columns} />
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

export default Payments;

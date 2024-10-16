import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "../../../../context/SessionContext";
import {
  fetchDashboardData,
  Payment,
  Customer,
  Campaign,
} from "../../../../services/dashboard/dashboard";
import { fetchCompanyUUID } from "../../../../services/payments/payments";

export const useDashboard = (
  accessToken?: string,
  refreshToken?: string,
  userId?: number
) => {
  const { session, withTokenRefresh, loading: sessionLoading } = useSession();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const loadExecutedRef = useRef(false);

  const loadData = useCallback(async () => {
    if ((session?.accessToken || accessToken) && !loadExecutedRef.current) {
      setDataLoading(true);
      loadExecutedRef.current = true;
      try {
        const companyUUID = await withTokenRefresh(
          async (token) => fetchCompanyUUID(token),
          refreshToken,
          userId
        );

        if (!companyUUID) {
          throw new Error("Failed to load company UUID.");
        }

        const data = await withTokenRefresh(
          (token) => fetchDashboardData(token, companyUUID),
          refreshToken,
          userId
        );

        setCustomers(data.customers);
        setCampaigns(data.campaigns);
        setPayments(data.payments);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }
  }, [
    session?.accessToken,
    accessToken,
    refreshToken,
    withTokenRefresh,
    userId,
  ]);

  useEffect(() => {
    if (!sessionLoading) {
      loadData();
    }
  }, [sessionLoading, loadData]);

  const computePerformanceMetrics = () => {
    const totalClicks = customers.reduce(
      (sum, customer) => sum + customer.click_count,
      0
    );
    const totalConversions = customers.reduce(
      (sum, customer) => sum + customer.conversion_count,
      0
    );

    const totalSpend = payments.reduce(
      (sum, payment) => sum + parseFloat(payment.total_price),
      0
    );

    const conversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

    return {
      totalClicks,
      totalConversions,
      totalSpend: totalSpend.toFixed(2),
      conversionRate: conversionRate.toFixed(2),
      cpa: cpa.toFixed(2),
    };
  };

  const prioritizeCampaigns = () => {
    const publishedCampaigns = campaigns.filter(
      (campaign) => campaign.status && campaign.status.toLowerCase() === "live"
    );

    const otherCampaigns = campaigns
      .filter((campaign) => (campaign.status ?? "").toLowerCase() !== "live")
      .sort(
        (a, b) =>
          new Date(b.date_updated ?? 0).getTime() -
          new Date(a.date_updated ?? 0).getTime()
      );

    return [...publishedCampaigns, ...otherCampaigns].slice(0, 3);
  };

  return {
    dataLoading,
    error,
    payments,
    customers,
    campaigns,
    sessionLoading,
    metrics: computePerformanceMetrics(),
    prioritizedCampaigns: prioritizeCampaigns(),
    latestConversions: payments.slice(0, 5).map((payment) => ({
      date: new Date(payment.date_created).toLocaleString(),
      referrer: payment.customer_email,
      conversion: payment.status,
      spend: `Order #${payment.order_number}`,
    })),
    latestConversionColumns: [
      { dataIndex: "date", className: "text-left" },
      { dataIndex: "referrer", className: "text-left" },
      { dataIndex: "conversion", className: "text-left" },
      { dataIndex: "spend", className: "text-left" },
    ],
  };
};

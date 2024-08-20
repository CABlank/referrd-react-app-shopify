import React, { useEffect, useRef, useState, useCallback } from "react";
import PerformanceSummary from "../../components/common/PerformanceSummary";
import CampaignItem from "../../components/common/CampaignItem";
import ReferralCard from "../../components/common/ReferralCard";
import DataTableHeader from "../../components/common/DataTableHeader";
import DataTableRows from "../../components/common/DataTableRows";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import Link from "next/link";
import { useSession } from "../../context/SessionContext";
import {
  fetchDashboardData,
  Payment,
  Customer,
  Campaign,
} from "../../services/dashboard/dashboard";
import {
  fetchCompanyUUID,
  fetchPaymentsByCompanyId,
} from "../../services/payments/payments";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import ArrowSeeMoreIcon from "@/components/Icons/ArrowSeeMoreIcon";
import initialLoadChecker from "../../utils/middleware/initialLoadChecker";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"; // Import Next.js API types

type DashboardCampaignsProps = {
  data?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: number; // Add optional userId prop
  serverError?: boolean;
  title: string;
};

const DashboardCampaigns: React.FC<DashboardCampaignsProps> = ({
  accessToken,
  refreshToken,
  userId, // Receive userId as prop
  title,
}) => {
  const { session, withTokenRefresh, loading: sessionLoading } = useSession();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const loadExecutedRef = useRef(false);

  const loadData = useCallback(async () => {
    if ((session?.token || accessToken) && !loadExecutedRef.current) {
      setDataLoading(true);
      loadExecutedRef.current = true;
      try {
        // Fetch company UUID first
        const companyUUID = await withTokenRefresh(
          async (token) => {
            return fetchCompanyUUID(token);
          },
          refreshToken,
          userId
        );

        if (!companyUUID) {
          throw new Error("Failed to load company UUID.");
        }

        // Use the fetched companyUUID to fetch dashboard data
        const data = await withTokenRefresh(
          (token) => fetchDashboardData(token, companyUUID),
          refreshToken,
          userId // Pass userId directly to withTokenRefresh
        );

        // Set the fetched data to state
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
  }, [session?.token, accessToken, refreshToken, withTokenRefresh, userId]);

  useEffect(() => {
    if (!sessionLoading) {
      loadData();
    }
  }, [session, sessionLoading, loadData]);

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

  const metrics = computePerformanceMetrics();

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

  const prioritizedCampaigns = prioritizeCampaigns();

  // Map the payments data for displaying in Latest Conversions
  const latestConversions = payments.slice(0, 5).map((payment) => ({
    date: new Date(payment.date_created).toLocaleString(),
    referrer: payment.customer_email,
    conversion: payment.status,
    spend: `Order #${payment.order_number}`,
  }));

  const latestConversionColumns = [
    { dataIndex: "date", className: "text-left" },
    { dataIndex: "referrer", className: "text-left" },
    { dataIndex: "conversion", className: "text-left" },
    { dataIndex: "spend", className: "text-left" },
  ];

  const parseLocation = (locationString: string | undefined) => {
    if (!locationString) return "N/A";
    try {
      const location = JSON.parse(locationString);
      return `${location.city}, ${location.country}`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className={`relative ${sessionLoading || dataLoading ? "blur" : ""}`}>
      {(sessionLoading || dataLoading) && <LoadingOverlay />}
      <div className="relative w-full flex justify-center">
        <div className="flex overflow-hidden scroll-smooth scrollbar-hide gap-4 pb-4">
          <ScrollableContainer>
            <PerformanceSummary
              metricName="Total Clicks"
              value={metrics.totalClicks.toString()}
              iconName="MouseClickIcon"
            />
            <PerformanceSummary
              metricName="Total Conversions"
              value={metrics.totalConversions.toString()}
              iconName="Conversions"
            />
            <PerformanceSummary
              metricName="Conversion Rate"
              value={`${metrics.conversionRate}%`}
              iconName="ConversionRate"
            />
            <PerformanceSummary
              metricName="Total Spend"
              value={`$${metrics.totalSpend}`}
              iconName="TotalSpends"
            />
            <PerformanceSummary
              metricName="CPA"
              value={`$${metrics.cpa}`}
              iconName="MouseClickedIcon"
            />
          </ScrollableContainer>
        </div>
      </div>
      <div className="flex flex-auto justify-center items-start max-w-full mx-auto gap-4 flex-col xl:flex-row">
        <div className="flex flex-col justify-start items-start flex-grow gap-8 rounded-2xl contents overflow-x-auto">
          <div className="flex flex-col justify-start items-start xl:overflow-hidden overflow-x-auto gap-4 lg:p-8 p-4 rounded-2xl bg-white xl:w-2/3 w-full">
            <div className="flex justify-between items-center w-full">
              <p className="text-2xl font-medium text-[#10ad1b]">Campaigns</p>
              <Link href="/brand/campaigns" passHref>
                <div className="flex items-center gap-1 cursor-pointer">
                  <p className="text-base font-medium text-[#851087]/80">
                    See More
                  </p>
                  <ArrowSeeMoreIcon />
                </div>
              </Link>
            </div>
            <hr className="w-full border-t border-black/15" />
            {prioritizedCampaigns.length > 0 ? (
              prioritizedCampaigns.map((campaign, index) => (
                <React.Fragment key={index}>
                  <CampaignItem
                    imageSrc={"default-image.png"} // Replacing with a fallback
                    title={campaign.name}
                    test={`Start: ${new Date(campaign.startDate!).toLocaleDateString()} `}
                    price={`$ ${String(campaign.amountFunded)}` || "Unknown"} // Convert to string
                    status={campaign.status || "Unknown"} // Handle potential undefined status
                    endDate={
                      campaign.closeDate
                        ? `Until ${new Date(
                            campaign.closeDate
                          ).toLocaleDateString()}`
                        : "No End Date"
                    }
                    openTo={"All"} // Set this to a default value or remove if not relevant
                  />
                  {index < prioritizedCampaigns.length - 1 && (
                    <hr className="w-full border-t border-black/15" />
                  )}
                </React.Fragment>
              ))
            ) : (
              <p>No campaigns found.</p>
            )}
          </div>
          <div className="flex flex-col justify-start items-start overflow-x-auto sm:overflow-hidden gap-4 p-8 rounded-2xl bg-white xl:w-1/3 w-full flex-grow">
            <ReferralCard
              data={customers.slice(0, 3).map((customer) => ({
                name: customer.name || "Unknown",
                location: parseLocation(customer.location), // Use parsed location
                email: customer.email || "N/A", // Use email
                date: new Date(customer.date_created).toLocaleDateString(),
              }))}
            />
          </div>
        </div>
      </div>
      {/* Full-width table */}
      <div className="flex flex-col w-full overflow-x-auto xl:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4 p-4 mobile-scroll">
        <div className="flex justify-between items-center w-[1024px] lg:w-full p-4">
          <p className="text-2xl font-medium text-[#10ad1b]">Payments</p>
          <Link href="/brand/payments" passHref>
            <div className="flex items-center gap-1 cursor-pointer">
              <p className="text-base font-medium text-[#851087]/80">
                See More
              </p>
              <ArrowSeeMoreIcon />
            </div>
          </Link>
        </div>
        <DataTableHeader
          headers={{
            columns: [
              { title: "Date/Time", align: "center" },
              { title: "Referrer", align: "center" },
              { title: "Conversion", align: "center" },
              { title: "Orders", align: "center" },
            ],
          }}
        />
        <DataTableRows
          rowData={latestConversions}
          columns={latestConversionColumns}
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  DashboardCampaignsProps
> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DashboardCampaignsProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Hi, there!",
      },
    };
  }

  // Extract the session from the result
  const session = (result.props as { session?: any })?.session;
  const userName = session?.user?.name || "there";
  const title = `Hi, ${userName}!`;

  return {
    props: {
      ...result.props,
      title,
    },
  };
};

export default DashboardCampaigns;

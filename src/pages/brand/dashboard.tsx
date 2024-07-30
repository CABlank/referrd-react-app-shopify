import React, { useEffect, useRef, useState, useCallback } from "react";
import PerformanceSummary from "../../components/common/PerformanceSummary";
import CampaignItem from "../../components/common/CampaignItem";
import ReferralCard from "../../components/common/ReferralCard";
import DataTableHeader from "../../components/common/DataTableHeader";
import DataTableRows from "../../components/common/DataTableRows";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import Link from "next/link";
import { useSession } from "../../contexts/SessionContext";
import {
  fetchDashboardData,
  Payment,
  Referral,
  Customer,
  Campaign,
} from "../../services/dashboard/dashboard";
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
  serverError?: boolean;
  title: string;
};

const DashboardCampaigns: React.FC<DashboardCampaignsProps> = ({
  accessToken,
  refreshToken,
  title,
}) => {
  const { session, withTokenRefresh, loading: sessionLoading } = useSession();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCodes, setReferralCodes] = useState<any[]>([]);
  const loadExecutedRef = useRef(false);

  const loadData = useCallback(async () => {
    if ((session?.token || accessToken) && !loadExecutedRef.current) {
      setDataLoading(true);
      loadExecutedRef.current = true;
      try {
        const data = await withTokenRefresh(
          (token) => fetchDashboardData(token),
          refreshToken
        );
        setPayments(data.payments);
        setCustomers(data.customers);
        setCampaigns(data.campaigns);
        setReferrals(data.referrals);
        setReferralCodes(data.referralCodes);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }
  }, [session?.token, accessToken, refreshToken, withTokenRefresh]);

  useEffect(() => {
    if (!sessionLoading) {
      loadData();
    }
  }, [session, sessionLoading, loadData]);

  const computePerformanceMetrics = () => {
    const totalClicks = referrals.length;
    const totalConversions = referrals.filter(
      (ref) => ref.conversion === "true"
    ).length;
    const totalSpend = referrals.reduce(
      (acc, ref) => acc + (ref.spend || 0),
      0
    );
    const conversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

    return {
      totalClicks,
      totalConversions,
      totalSpend,
      conversionRate: conversionRate.toFixed(2),
      cpa: cpa.toFixed(2),
    };
  };

  const metrics = computePerformanceMetrics();

  const prioritizeCampaigns = () => {
    const publishedCampaigns = campaigns.filter(
      (campaign) => campaign.status.toLowerCase() === "published"
    );

    const otherCampaigns = campaigns
      .filter((campaign) => campaign.status.toLowerCase() !== "published")
      .sort(
        (a, b) =>
          new Date(b.date_updated).getTime() -
          new Date(a.date_updated).getTime()
      );

    return [...publishedCampaigns, ...otherCampaigns].slice(0, 3);
  };

  const prioritizedCampaigns = prioritizeCampaigns();

  const mapReferralData = () => {
    return referrals.map((referral) => {
      const customer = customers.find((c) => c.id === referral.referrer);
      const campaign = campaigns.find((c) => c.id === referral.campaign);
      const referralCode = referralCodes.find(
        (code) => code.id === referral.referralCode
      );

      return {
        id: referral.id,
        date: new Date(referral.date_created).toLocaleString(),
        referrer: customer?.name || "N/A",
        campaign: campaign?.name || "N/A",
        location: referral.location || "N/A",
        spend: referral.spend ? `$${referral.spend}` : "No Spend",
        conversion: referral.conversion === "true" ? "Yes" : "No",
        referralCode: referralCode?.code || "N/A",
        test: referral.test || "N/A",
      };
    });
  };

  const latestConversions = mapReferralData().slice(0, 5);

  const latestConversionColumns = [
    { dataIndex: "date", className: "text-left" },
    { dataIndex: "location", className: "text-left" },
    { dataIndex: "referrer", className: "text-left" },
    { dataIndex: "conversion", className: "text-left" },
    { dataIndex: "spend", className: "text-left" },
  ];

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

      <div className="flex flex-auto justify-center items-start max-w-full mx-auto gap-4  flex-col xl:flex-row">
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
                    imageSrc={campaign.imageSrc || "default-image.png"}
                    title={campaign.name}
                    test={campaign.test || "Default Test"}
                    price={campaign.price ? `$${campaign.price}` : "No Price"}
                    status={campaign.status}
                    endDate={
                      campaign.closeDate
                        ? `Until ${new Date(
                            campaign.closeDate
                          ).toLocaleDateString()}`
                        : "No End Date"
                    }
                    openTo={campaign.openTo || "All"}
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
              data={referrals.slice(0, 4).map((referral) => {
                const customer = customers.find(
                  (c) => c.id === referral.referrer
                );
                const referralCode = referralCodes.find(
                  (code) => code.id === referral.referralCode
                );
                return {
                  name: customer?.name || "Unknown",
                  test: referral.location || "N/A",
                  code: referralCode?.code || "N/A",
                  date: new Date(referral.date_created).toLocaleDateString(),
                };
              })}
            />
          </div>
        </div>
      </div>
      {/* Full-width table */}
      <div className="flex flex-col w-full overflow-x-auto xl:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4 p-4 mobile-scroll">
        <div className="flex justify-between items-center w-[1024px] lg:w-full p-4">
          <p className="text-2xl font-medium text-[#10ad1b]">
            Latest Conversions
          </p>
        </div>
        <DataTableHeader
          headers={[
            { title: "Date/Time", align: "left" },
            { title: "Location", align: "left" },
            { title: "Referrer", align: "left" },
            { title: "Conversion", align: "left" },
            { title: "Spend", align: "left" },
          ]}
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

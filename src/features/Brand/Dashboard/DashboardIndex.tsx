import React from "react";
import PerformanceSummary from "../../../components/common/PerformanceSummary";
import CampaignItem from "../../../components/common/CampaignItem";
import ReferralCard from "../../../components/common/ReferralCard";
import DataTableHeader from "../../../components/common/DataTableHeader";
import DataTableRows from "../../../components/common/DataTableRows";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import ScrollableContainer from "../../../components/common/ScrollableContainer";
import Link from "next/link";
import ArrowSeeMoreIcon from "../../../components/icons/ArrowSeeMoreIcon";
import { useRouter } from "next/router"; // Import useRouter to access query parameters
import { useDashboard } from "./hooks/useDashboard";
import { Customer } from "../../../services/dashboard/dashboard"; // Import the Customer type

type DashboardProps = {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
};

const DashboardIndex: React.FC<DashboardProps> = ({ accessToken, refreshToken, userId }) => {
  const {
    dataLoading,
    error,
    sessionLoading,
    metrics,
    prioritizedCampaigns,
    latestConversions,
    latestConversionColumns,
    customers, // Make sure to destructure customers from the hook
  } = useDashboard(accessToken, refreshToken, userId);

  // useRouter to access query parameters
  const router = useRouter();
  const { shop, host, id_token } = router.query;

  // Determine if we are in a Shopify environment
  const isShopifyStore = Boolean(shop || host || id_token);

  const parseLocation = (locationString: string | undefined): string => {
    if (!locationString) return "N/A";
    try {
      const location = JSON.parse(locationString);
      return `${location.city}, ${location.country}`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center ">
      {(sessionLoading || dataLoading) && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <LoadingOverlay />
        </div>
      )}
      <div className={`relative w-full ${sessionLoading || dataLoading ? "blur-sm" : ""}`}>
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

                {/* Conditionally hide the "See More" button for Campaigns */}
                {!isShopifyStore && (
                  <Link href="/brand/campaigns" passHref>
                    <div
                      data-testid="campaigns-see-more"
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <p className="text-base font-medium text-[#851087]/80">See More</p>
                      <ArrowSeeMoreIcon />
                    </div>
                  </Link>
                )}
              </div>
              <hr className="w-full border-t border-black/15" />
              {prioritizedCampaigns.length > 0 ? (
                prioritizedCampaigns.map((campaign, index) => (
                  <React.Fragment key={index}>
                    <CampaignItem
                      imageSrc={"default-image.png"}
                      title={campaign.name}
                      test={`Start: ${new Date(campaign.startDate!).toLocaleDateString()} `}
                      price={`$ ${String(campaign.amountFunded)}` || "Unknown"}
                      status={campaign.status || "Unknown"}
                      endDate={
                        campaign.closeDate
                          ? `Until ${new Date(campaign.closeDate).toLocaleDateString()}`
                          : "No End Date"
                      }
                      openTo={"All"}
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
                data={customers.slice(0, 3).map((customer: Customer) => ({
                  name: customer.name || "Unknown",
                  location: parseLocation(customer.location),
                  email: customer.email || "N/A",
                  date: new Date(customer.date_created).toLocaleDateString(),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full overflow-x-auto xl:overflow-hidden rounded-2xl bg-white text-center shadow-lg mt-4 p-4 mobile-scroll">
          <div className="flex justify-between items-center w-[1024px] lg:w-full p-4">
            <p className="text-2xl font-medium text-[#10ad1b]">Payments</p>

            {/* Conditionally hide the "See More" button for Payments */}
            {!isShopifyStore && (
              <Link href="/brand/payments" passHref>
                <div
                  data-testid="payments-see-more"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <p className="text-base font-medium text-[#851087]/80">See More</p>
                  <ArrowSeeMoreIcon />
                </div>
              </Link>
            )}
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
          <DataTableRows rowData={latestConversions} columns={latestConversionColumns} />
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;

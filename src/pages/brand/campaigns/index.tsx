import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CalendarIcon from "../../../components/Icons/CalendarIcon";
import DeleteIcon from "../../../components/Icons/DeleteIcon";
import EditIcon from "../../../components/Icons/EditIcon";
import CampaignPayment from "../../../components/campaign/CampaignPayment";
import QRCode from "qrcode.react";

import {
  deleteCampaign,
  updateCampaignStatus,
  createCampaign,
  Campaign,
  fetchCampaigns,
} from "../../../services/campaign/campaign";
import { useSession } from "../../../context/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import CampaignItemIconSmall from "../../../components/Icons/CampaignItemIconSmall";
import DoubleMoneyIcon from "../../../components/Icons/DoubleMoneyIcon";
import LiveStatusIcon from "@/components/Icons/LiveStatusIcon";
import EndedStatusIcon from "@/components/Icons/EndedStatusIcon";
import DraftStatusIcon from "@/components/Icons/DraftStatusIcon";
import PendingStatusIcon from "@/components/Icons/PendingStatusIcon";
import initialLoadChecker from "../../../utils/middleware/initialLoadChecker/initialLoadChecker";
import { fetchCompanyId } from "@/services/company/company";
import { fetchUserData } from "@/services/auth/auth";

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"; // Import Next.js API types

interface CampaignIndexProps {
  accessToken?: string;
  refreshToken?: string;
  title: string;
  userId?: number;
  shop?: string;
  host?: string;
}

const CampaignIndex: React.FC<CampaignIndexProps> = ({
  accessToken,
  refreshToken,
  title,
  userId,
  shop,
  host,
}) => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState<Campaign | null>(
    null
  );
  const [deleteCampaignId, setDeleteCampaignId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState<number | null>(null);
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadCampaigns = async () => {
      if ((session?.accessToken || accessToken) && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true;

        try {
          const campaignsData = await withTokenRefresh(
            (token) => fetchCampaigns(token),
            refreshToken,
            userId
          );
          const currentDate = new Date();

          for (const campaign of campaignsData) {
            const closeDate = campaign.closeDate
              ? new Date(campaign.closeDate)
              : null;
            if (closeDate && closeDate < currentDate) {
              if (
                campaign.amountFunded &&
                campaign.amountFunded <= 0 &&
                campaign.status !== "Ended"
              ) {
                await withTokenRefresh((token) =>
                  updateCampaignStatus(campaign.id!, "Ended", token)
                );
                campaign.status = "Ended";
              }
            } else if (
              campaign.amountFunded &&
              campaign.amountFunded > 0 &&
              closeDate &&
              closeDate > currentDate &&
              campaign.status !== "Live"
            ) {
              await withTokenRefresh((token) =>
                updateCampaignStatus(campaign.id!, "Live", token)
              );
              campaign.status = "Live";
            }
          }

          setCampaigns(campaignsData);
        } catch (err) {
          console.error("Error loading campaigns:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCampaigns();
  }, [session, accessToken, refreshToken, withTokenRefresh]);

  // Handle campaign deletion
  const handleDelete = async () => {
    if ((session?.accessToken || accessToken) && deleteCampaignId !== null) {
      setDeleting(true);
      try {
        await withTokenRefresh(
          (token) => deleteCampaign(deleteCampaignId, token),
          refreshToken,
          userId // Pass userId here
        );
        setShowDeletePopup(false);
        setDeleteCampaignId(null);
        setDeleting(false);

        // Extract existing query parameters
        const { shop, host, id_token } = router.query;

        let reloadUrl = window.location.pathname;

        // If the environment is a Shopify store, append the required query parameters
        if (shop || host || id_token) {
          const urlObj = new URL(window.location.origin + reloadUrl);
          if (shop) urlObj.searchParams.set("shop", shop as string);
          if (host) urlObj.searchParams.set("host", host as string);
          if (id_token) urlObj.searchParams.set("id_token", id_token as string);

          reloadUrl = urlObj.toString().replace(window.location.origin, "");
        }

        // Replace the current URL to ensure the page reloads with the query parameters
        router.replace(reloadUrl);

        // Force a full page reload
        window.location.reload();
      } catch (err) {
        setDeleting(false);
        console.error("Error deleting campaign:", err);
      }
    }
  };

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    if (session?.accessToken || accessToken) {
      setLoading(true);

      try {
        // fetch company id
        const companyId = await withTokenRefresh(
          (token) => fetchCompanyId(token),
          refreshToken,
          userId
        );

        console.log("Company ID: ", companyId);

        // Extract existing query parameters
        const { shop, host, id_token } = router.query;

        const newCampaign: Campaign = {
          name: "New Campaign",
          startDate: null,
          closeDate: null,
          company: Array.isArray(shop) ? shop[0] : shop || null,
          terms: null,
          discountType: "FixedAmount",
          discountValue: null,
          appliesTo: null,
          format: "Popup",
          commission: null,
          commissionType: "FixedAmount",
          amountFunded: 0,
          company_id: companyId,
        };

        const createdCampaign = await withTokenRefresh(
          (token) => createCampaign(newCampaign, token),
          refreshToken,
          userId // Pass userId here
        );

        let url = `/brand/campaigns/edit?campaignId=${createdCampaign.id}`;

        // If the environment is a Shopify store, append the required query parameters
        if (shop || host || id_token) {
          const urlObj = new URL(window.location.origin + url);
          if (shop) urlObj.searchParams.set("shop", shop as string);
          if (host) urlObj.searchParams.set("host", host as string);
          if (id_token) urlObj.searchParams.set("id_token", id_token as string);

          url = urlObj.toString().replace(window.location.origin, "");
        }

        // fetch shopify token
        const shopifyTokenResponse = await withTokenRefresh(
          (token) => fetchUserData(token),
          refreshToken,
          userId
        );

        const shopifyToken = shopifyTokenResponse.ShopifyToken;

        // Call the backend API route to create the Shopify page using fetch
        await fetch("/api/campaign-content/create-shopify-page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shopifyToken,
            shopName: shop?.toString() ?? "",
            campaignUuid: createdCampaign.uuid,
            pageTitle: `Referral Page `,
            pageBodyHtml: ``,
          }),
        });

        router.push(url); // Navigate to the campaign edit page with the updated URL
      } catch (err) {
        console.error("Error creating campaign:", err);
        setError("Failed to create campaign. Please try again.");
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "Draft":
        return "text-blue-600";
      case "Ended":
        return "text-red-600";
      case "Live":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: any) => {
    switch (status) {
      case "Live":
        return <LiveStatusIcon />;
      case "Ended":
        return <EndedStatusIcon />;
      case "Draft":
        return <DraftStatusIcon />;
      case "Pending":
        return <PendingStatusIcon />;
      default:
        return null;
    }
  };

  const downloadQR = (campaignId: number) => {
    const canvas = document.getElementById(
      `qr-${campaignId}`
    ) as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `campaign-${campaignId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Re-fetch the updated campaign data after the payment is successful
      const updatedCampaigns = await withTokenRefresh(
        (token) => fetchCampaigns(token),
        refreshToken,
        userId
      );

      // Update the state with the new campaigns data
      setCampaigns(updatedCampaigns);

      // Close the payment popup
      setShowPaymentPopup(null);

      // Optionally, display a success message or notification
      console.log(
        "Payment was successful, and campaign data has been updated."
      );
    } catch (error) {
      console.error("Failed to refresh campaign data after payment", error);
      setError("Failed to refresh campaign data. Please try again.");
    }
  };
  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg z-60">
            <p>Are you sure you want to delete this campaign?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showPaymentPopup !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg z-60 w-full max-w-lg max-h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
              <CampaignPayment
                campaignId={showPaymentPopup?.id ?? 0} // Provide a default value for campaignId
                token={session?.accessToken ?? ""}
                amountFunded={showPaymentPopup?.amountFunded || 0} // Correctly access amountFunded
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
            <div className="flex justify-end sticky bottom-0 bg-white py-2">
              <button
                onClick={() => {
                  setShowPaymentPopup(null);
                  router.reload(); // Reload the page when the popup is closed
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showQRPopup !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg z-60 flex flex-col items-center">
            <QRCode
              id={`qr-${showQRPopup}`}
              value={`https://${campaigns.find((campaign) => campaign.id === showQRPopup)?.company}/pages/referrd-${campaigns.find((campaign) => campaign.id === showQRPopup)?.uuid}`}
            />
            <div className="flex justify-end mt-4 w-full">
              <button
                onClick={() => setShowQRPopup(null)}
                className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => downloadQR(showQRPopup!)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handleCreateCampaign}
        className="h-12 px-6 py-2 rounded-lg bg-[#47B775] text-white font-medium hover:bg-[#47B775] mb-8"
      >
        Create Campaign
      </button>
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="relative flex flex-col items-start p-4 gap-2 w-full rounded-2xl bg-white shadow-lg overflow-hidden"
            >
              <div className="flex justify-between w-full items-center">
                <div className="flex gap-3">
                  <CampaignItemIconSmall />
                  <p className="text-xl font-medium text-gray-800">
                    {campaign.name || ""}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const { shop, host, id_token } = router.query; // Extract existing query parameters

                      let url = `/brand/campaigns/edit?campaignId=${campaign.id}`;

                      // Check if any query parameter exists
                      if (shop || host || id_token) {
                        const urlObj = new URL(window.location.origin + url);

                        // Append the required query parameters if they exist
                        if (shop)
                          urlObj.searchParams.set("shop", shop as string);
                        if (host)
                          urlObj.searchParams.set("host", host as string);
                        if (id_token)
                          urlObj.searchParams.set(
                            "id_token",
                            id_token as string
                          );

                        // Generate the final URL string with parameters
                        url = urlObj
                          .toString()
                          .replace(window.location.origin, "");
                      } else {
                        // If no query parameters, remove the query part from the URL
                        url = `/brand/campaigns/edit?campaignId=${campaign.id}`;
                      }

                      // Redirect to the URL
                      router.push(url);
                    }}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteCampaignId(campaign.id!);
                      setShowDeletePopup(true);
                    }}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center w-full">
                <div className="sm:h-[164px] md:h-fit"></div>
                <div className="flex flex-col items-start gap-1.5 w-full">
                  <div className="flex justify-between w-full">
                    <p className="flex items-center gap-2">
                      <DoubleMoneyIcon />
                      Amount Available
                      <span className="font-bold">
                        ${campaign.amountFunded || "0"}
                      </span>
                    </p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(campaign.status)}
                      <p className={`${getStatusColor(campaign.status!)}`}>
                        Status:{" "}
                        <span className="font-bold">
                          {campaign.status || ""}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <p className="text-sm text-gray-600">
                      Created on{" "}
                      <span className="font-semibold">
                        {campaign.date_created
                          ? new Date(campaign.date_created).toLocaleDateString()
                          : ""}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    <p className="text-sm text-gray-600">
                      Start Date:{" "}
                      <span className="">
                        {campaign.startDate
                          ? new Date(campaign.startDate).toLocaleDateString()
                          : ""}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    <p className="text-sm text-gray-600">
                      Close Date:{" "}
                      <span className="">
                        {campaign.closeDate
                          ? new Date(campaign.closeDate).toLocaleDateString()
                          : ""}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full items-center mt-4">
                {/* Payment Button */}
                <button
                  className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-1.5 rounded bg-[#47B775] text-white font-medium hover:bg-[#45a66b]"
                  onClick={() => setShowPaymentPopup(campaign)}
                >
                  Fund Campaign
                </button>

                {/* QR Code Button */}
                <button
                  className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-1.5 rounded bg-[#fef]"
                  onClick={() =>
                    setShowQRPopup(
                      showQRPopup === campaign.id ? null : campaign.id ?? null
                    )
                  }
                >
                  <span className="text-[#851087] font-semibold">QR Code</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  CampaignIndexProps
> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<CampaignIndexProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Campaigns",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Campaigns",
    },
  };
};

export default CampaignIndex;

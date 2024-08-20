import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Redirect } from "@shopify/app-bridge/actions"; // Import Redirect from Shopify App Bridge
import CalendarIcon from "../../../components/Icons/CalendarIcon";
import DeleteIcon from "../../../components/Icons/DeleteIcon";
import EditIcon from "../../../components/Icons/EditIcon";
import PaymentFormInline from "../../../components/campaign/PaymentFormInline";
import StripeWrapper from "../../../components/campaign/StripeWrapper";
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
import initialLoadChecker from "../../../utils/middleware/initialLoadChecker";

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
  const [deleteCampaignId, setDeleteCampaignId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState<number | null>(null);
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadCampaigns = async () => {
      if ((session?.token || accessToken) && !loadExecutedRef.current) {
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
    if ((session?.token || accessToken) && deleteCampaignId !== null) {
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
        router.reload(); // Reload the page after deletion
      } catch (err) {
        setDeleting(false);
        console.error("Error deleting campaign:", err);
      }
    }
  };

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    if (session?.token || accessToken) {
      setLoading(true);
      try {
        const newCampaign: Campaign = {
          name: "New Campaign",
          startDate: null,
          closeDate: null,
          company: null,
          terms: null,
          discountType: "FixedAmount",
          discountValue: null,
          appliesTo: null,
          format: "Popup",
          commission: null,
          commissionType: "FixedAmount",
          amountFunded: 0,
        };
        const createdCampaign = await withTokenRefresh(
          (token) => createCampaign(newCampaign, token),
          refreshToken,
          userId // Pass userId here
        );

        // Use Shopify App Bridge for navigation if in Shopify
        if (shop && host) {
          const appBridge = window.shopify;
          const redirect = Redirect.create(appBridge);
          redirect.dispatch(
            Redirect.Action.APP,
            `/brand/campaigns/edit?campaignId=${createdCampaign.id}&shop=${shop}&host=${host}`
          );
        } else {
          router.push(`/brand/campaigns/edit?campaignId=${createdCampaign.id}`);
        }
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
      {showQRPopup !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg z-60 flex flex-col items-center">
            <QRCode id={`qr-${showQRPopup}`} value="https://example.com" />
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
                      if (shop && host) {
                        const appBridge = window.shopify;
                        const redirect = Redirect.create(appBridge);
                        redirect.dispatch(
                          Redirect.Action.APP,
                          `/brand/campaigns/edit?campaignId=${campaign.id}&shop=${shop}&host=${host}`
                        );
                      } else {
                        router.push(
                          `/brand/campaigns/edit?campaignId=${campaign.id}`
                        );
                      }
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
                <StripeWrapper>
                  <PaymentFormInline campaign={campaign} loading={false} />
                </StripeWrapper>

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

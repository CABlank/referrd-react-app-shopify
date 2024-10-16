// External libraries
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Context
import { useSession } from "../../../../context/SessionContext";

// Components
import LoadingOverlay from "../../../../components/common/LoadingOverlay";
import CampaignCard from "./components/CampaignCard";
import DeleteConfirmationPopup from "./components/DeleteConfirmationPopup";
import PaymentPopup from "./components/PaymentPopup";
import QRPopup from "./components/QRPopup";

// Services
import {
  deleteCampaign,
  updateCampaignStatus,
  createCampaign,
  Campaign,
  fetchCampaigns,
} from "../../../../services/campaign/campaign";
import { fetchCompanyId, fetchCompanyUrl } from "@/services/company/company";
import { fetchUserData } from "@/services/auth/auth";

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
  const [showPaymentPopup, setShowPaymentPopup] = useState<Campaign | null>(null);
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
            const closeDate = campaign.closeDate ? new Date(campaign.closeDate) : null;
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
              await withTokenRefresh((token) => updateCampaignStatus(campaign.id!, "Live", token));
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

  const handleDelete = async () => {
    if ((session?.accessToken || accessToken) && deleteCampaignId !== null) {
      setDeleting(true);
      try {
        await withTokenRefresh(
          (token) => deleteCampaign(deleteCampaignId, token),
          refreshToken,
          userId
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
        router.reload();
      } catch (err) {
        setDeleting(false);
        console.error("Error deleting campaign:", err);
      }
    }
  };

  const handleCreateCampaign = async () => {
    if (session?.accessToken || accessToken) {
      setLoading(true);

      try {
        const companyId = await withTokenRefresh(
          (token) => fetchCompanyId(token),
          refreshToken,
          userId
        );

        const companyUrl = await withTokenRefresh(
          (token) => fetchCompanyUrl(token),
          refreshToken,
          userId
        );

        const { shop, host, id_token } = router.query;

        const newCampaign: Campaign = {
          name: "New Campaign",
          startDate: null,
          closeDate: null,
          company: companyUrl,
          terms: null,
          discountType: "FixedAmount",
          discountValue: null,
          allowDiscounts: false,
          appliesTo: null,
          format: "Popup",
          commission: null,
          commissionType: "Fix",
          amountFunded: 0,
          company_id: companyId,
        };

        const createdCampaign = await withTokenRefresh(
          (token) => createCampaign(newCampaign, token),
          refreshToken,
          userId
        );

        let url = `/brand/campaigns/edit?campaignId=${createdCampaign.id}`;

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
            shopName: companyUrl,
            campaignUuid: createdCampaign.uuid,
            pageTitle: `Referral Page `,
            pageBodyHtml: ``,
          }),
        });

        router.push(url);
      } catch (err) {
        console.error("Error creating campaign:", err);
        setError("Failed to create campaign. Please try again.");
        setLoading(false);
      }
    }
  };

  const downloadQR = (campaignId: number) => {
    const canvas = document.getElementById(`qr-${campaignId}`) as HTMLCanvasElement;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `campaign-${campaignId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePaymentSuccess = async () => {
    try {
      const updatedCampaigns = await withTokenRefresh(
        (token) => fetchCampaigns(token),
        refreshToken,
        userId
      );
      setCampaigns(updatedCampaigns);
      setShowPaymentPopup(null);
    } catch (error) {
      console.error("Failed to refresh campaign data after payment", error);
      setError("Failed to refresh campaign data. Please try again.");
    }
  };

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}

      {showDeletePopup && (
        <DeleteConfirmationPopup
          onDelete={handleDelete}
          onCancel={() => setShowDeletePopup(false)}
          isDeleting={deleting}
        />
      )}

      {showPaymentPopup && (
        <PaymentPopup
          campaign={showPaymentPopup}
          token={session?.accessToken ?? ""}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentPopup(null)}
        />
      )}

      {showQRPopup !== null && (
        <QRPopup
          campaignId={showQRPopup}
          qrValue={`https://${campaigns.find((campaign) => campaign.id === showQRPopup)?.company}/pages/referrd-${campaigns.find((campaign) => campaign.id === showQRPopup)?.uuid}`}
          onClose={() => setShowQRPopup(null)}
          onDownload={downloadQR}
        />
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
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => {
                // Extract existing query parameters
                const { shop, host, id_token } = router.query;

                // Build the base edit URL for the campaign
                let editUrl = `/brand/campaigns/edit?campaignId=${campaign.id}`;

                // If the environment is a Shopify store, append the required query parameters
                if (shop || host || id_token) {
                  const urlObj = new URL(window.location.origin + editUrl);
                  if (shop) urlObj.searchParams.set("shop", shop as string);
                  if (host) urlObj.searchParams.set("host", host as string);
                  if (id_token) urlObj.searchParams.set("id_token", id_token as string);

                  editUrl = urlObj.toString().replace(window.location.origin, "");
                }

                // Navigate to the updated URL with the necessary query parameters
                router.push(editUrl);
              }}
              onDelete={() => {
                setDeleteCampaignId(campaign.id!);
                setShowDeletePopup(true);
              }}
              onShowPayment={() => setShowPaymentPopup(campaign)}
              onShowQR={() =>
                setShowQRPopup(showQRPopup === campaign.id ? null : campaign.id ?? null)
              }
              isQRVisible={showQRPopup === campaign.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignIndex;

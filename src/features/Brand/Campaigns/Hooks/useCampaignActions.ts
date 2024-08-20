import { useState } from "react";
import { useRouter } from "next/router";
import {
  deleteCampaign,
  createCampaign,
  Campaign,
} from "../../../../services/campaign/campaign";
import { useSession } from "../../../../context/SessionContext";

export const useCampaignActions = () => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (campaignId: number | null) => {
    if ((session?.token || session?.token) && campaignId !== null) {
      setDeleting(true);
      try {
        await withTokenRefresh(
          (token) => deleteCampaign(campaignId, token),
          session?.refreshToken
        );
        setDeleting(false);
        router.reload();
      } catch (err) {
        setDeleting(false);
        console.error("Error deleting campaign:", err);
      }
    }
  };

  const handleCreateCampaign = async () => {
    if (session?.token || session?.refreshToken) {
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
          session?.refreshToken
        );
        router.push(`/brand/campaigns/edit?campaignId=${createdCampaign.id}`);
      } catch (err) {
        console.error("Error creating campaign:", err);
        setError("Failed to create campaign. Please try again.");
        setLoading(false);
      }
    }
  };

  const downloadQR = (campaignId: number) => {
    const canvas = document.getElementById(
      `qr-${campaignId}`
    ) as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `campaign-${campaignId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return {
    deleting,
    error,
    loading,
    handleDelete,
    handleCreateCampaign,
    downloadQR,
  };
};

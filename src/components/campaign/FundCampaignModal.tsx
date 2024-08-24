import React, { useState } from "react";
import { useRouter } from "next/router"; // Import the useRouter hook from Next.js
import StripeWrapper from "./StripeWrapper";
import PaymentForm from "./PaymentForm";
import Spinner from "../common/Spinner";
import { updateCampaignStatus } from "../../services/campaign/campaign";

interface FundCampaignModalProps {
  amountFunded: number;
  setFundAmount: (value: number) => void;
  setShowFundPopup: (value: boolean) => void;
  saving: boolean;
  token: string;
  campaignId: string;
  oldAmountFunded: number;
  onPaymentSuccess: () => void;
}

const FundCampaignModal: React.FC<FundCampaignModalProps> = ({
  amountFunded,
  setFundAmount,
  setShowFundPopup,
  saving,
  token,
  campaignId,
  oldAmountFunded,
  onPaymentSuccess,
}) => {
  const [loadingPayment, setLoadingPayment] = useState(false); // State for payment button loading
  const [loadingSave, setLoadingSave] = useState(false); // State for save without fund button loading
  const router = useRouter(); // Initialize the useRouter hook

  const handlePaymentSuccess = async () => {
    setLoadingPayment(true);
    try {
      // Update the campaign status to "Live" after successful payment
      await updateCampaignStatus(Number(campaignId), "Live", token);
      onPaymentSuccess(); // Notify parent component
    } catch (error) {
      console.error("Failed to update campaign status after payment", error);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleSaveWithoutFund = async () => {
    setLoadingSave(true);
    try {
      // Optionally, update the campaign status to "Draft" or another status
      await updateCampaignStatus(Number(campaignId), "Draft", token);
      const { shop, host, id_token } = router.query; // Extract existing query parameters

      let url = `/brand/campaigns/edit?campaignId=${campaignId}`;

      // Check if any query parameter exists
      if (shop || host || id_token) {
        const urlObj = new URL(window.location.origin + url);

        // Append the required query parameters if they exist
        if (shop) urlObj.searchParams.set("shop", shop as string);
        if (host) urlObj.searchParams.set("host", host as string);
        if (id_token) urlObj.searchParams.set("id_token", id_token as string);

        // Generate the final URL string with parameters
        url = urlObj.toString().replace(window.location.origin, "");
      }

      // Redirect to the generated URL
      router.push(url);
      setShowFundPopup(false);
    } catch (error) {
      console.error("Failed to save campaign without funding", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-medium text-left text-[#10ad1b]">
            4. Boost this Campaign
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Fund Amount</label>
              <input
                type="number"
                value={amountFunded}
                onChange={(e) => setFundAmount(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded mb-4 w-full"
              />
            </div>
          </div>
          <p className="text-xs text-left text-black/75">
            Left Campaign Budget: {oldAmountFunded}
          </p>
          <div className="flex justify-between gap-2">
            <button
              onClick={() => setShowFundPopup(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={saving || loadingSave || loadingPayment}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveWithoutFund}
              className={`px-4 py-2 rounded ${
                loadingSave ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
              } text-white flex justify-center items-center`}
              disabled={loadingSave || saving || loadingPayment}
            >
              {loadingSave ? <Spinner /> : "Save Without Fund"}
            </button>
            <StripeWrapper>
              <PaymentForm
                campaignId={Number(campaignId)}
                amountFunded={amountFunded || 0}
                oldAmount={oldAmountFunded || 0}
                disabled={saving || loadingSave}
                onSuccess={handlePaymentSuccess} // Pass handlePaymentSuccess as onSuccess
              />
            </StripeWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCampaignModal;

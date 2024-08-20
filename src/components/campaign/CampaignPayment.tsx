import React, { useState } from "react";
import StripeWrapper from "./StripeWrapper";
import PaymentForm from "./PaymentForm";
import Spinner from "../common/Spinner";
import { updateCampaignStatus } from "../../services/campaign/campaign";

interface CampaignPaymentProps {
  campaignId: number;
  token: string;
  onPaymentSuccess: () => void;
}

const CampaignPayment: React.FC<CampaignPaymentProps> = ({
  campaignId,
  token,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      // Update the campaign status to "Live" after successful payment
      await updateCampaignStatus(campaignId, "Live", token);
      onPaymentSuccess(); // Notify parent component
    } catch (error) {
      console.error("Failed to update campaign status after payment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" items-center p-6 bg-white rounded-lg shadow-md w-full my-12">
      <h2 className="flex text-xl font-semibold text-green-500 text-center mb-4 self-start">
        5. Campaign Payment
      </h2>
      <hr className="border-gray-200 mb-6" />
      <p className="text-center text-gray-600 mb-6">
        To activate your campaign, please complete the payment below.
      </p>

      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full flex justify-center">
          <StripeWrapper>
            <PaymentForm
              campaignId={campaignId}
              amountFunded={100} // Replace with actual amount if needed
              oldAmount={0} // Replace with actual old amount if needed
              onSuccess={handlePaymentSuccess} // Pass handlePaymentSuccess as onSuccess
              disabled={false} // Adjust if needed
            />
          </StripeWrapper>
        </div>
      )}
    </div>
  );
};

export default CampaignPayment;

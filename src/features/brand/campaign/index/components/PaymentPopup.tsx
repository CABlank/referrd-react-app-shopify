import React from "react";
import CampaignPayment from "../../edit/step-5/CampaignPayment";
import { Campaign } from "../../../../../services/campaign/campaign";

interface PaymentPopupProps {
  campaign: Campaign | null;
  token: string;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  campaign,
  token,
  onPaymentSuccess,
  onClose,
}) => {
  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg z-60 w-full max-w-lg max-h-full flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <CampaignPayment
            campaignId={campaign.id!}
            token={token}
            amountFunded={campaign.amountFunded ?? 0}
            onPaymentSuccess={onPaymentSuccess}
          />
        </div>
        <div className="flex justify-end sticky bottom-0 bg-white py-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;

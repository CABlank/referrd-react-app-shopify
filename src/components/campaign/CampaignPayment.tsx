import React, { useState, useEffect } from "react";
import StripeWrapper from "./StripeWrapper";
import PaymentForm from "./PaymentForm";
import Spinner from "../common/Spinner";
import { updateCampaignStatus } from "../../services/campaign/campaign";

interface CampaignPaymentProps {
  amountFunded: number;
  campaignId: number;
  token: string;
  onPaymentSuccess: () => void;
}

const CampaignPayment: React.FC<CampaignPaymentProps> = ({
  amountFunded,
  campaignId,
  token,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState<string>("100"); // Initialize as a string
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [componentKey, setComponentKey] = useState(0); // To force re-render

  useEffect(() => {
    const createPaymentIntent = async () => {
      setLoading(true);
      try {
        const amountValue = parseFloat(newAmount); // Parse the newAmount value correctly
        if (isNaN(amountValue) || amountValue <= 0) return; // Guard clause for invalid amounts

        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amountFunded: amountValue,
            campaignId,
            token,
            oldAmount: amountFunded,
          }),
        });
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Failed to create payment intent", error);
      } finally {
        setLoading(false);
      }
    };

    if (newAmount !== "") {
      createPaymentIntent();
    }
  }, [campaignId, token, newAmount, amountFunded, componentKey]);

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      await updateCampaignStatus(campaignId, "Live", token);
      setPaymentSuccess(true);
      onPaymentSuccess();
    } catch (error) {
      console.error("Failed to update campaign status after payment", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAnotherPayment = () => {
    setPaymentSuccess(false);
    setClientSecret(null);
    setNewAmount("100"); // Reset the payment amount if desired
    setComponentKey((prevKey) => prevKey + 1); // Force component re-render
  };

  return (
    <div
      key={componentKey} // Use the key to force re-render
      className="flex items-center justify-center min-h-[200px] p-6 bg-white rounded-lg shadow-md w-full"
    >
      <div className="w-full">
        <h2 className="flex text-xl font-semibold text-green-500 text-center mb-4">
          5. Campaign Payment
        </h2>
        <hr className="border-gray-200 mb-6" />

        <div className="mb-6 w-full flex justify-center">
          <div className="w-full max-w-[300px]">
            <label htmlFor="newAmount" className="block text-gray-700">
              Enter Payment Amount (AUD):
            </label>
            <input
              id="newAmount"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)} // Handle the input value as a string
              className="mt-1 block w-full p-2 border rounded"
              min="1"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : paymentSuccess ? (
          <div className="flex flex-col items-center">
            <h3 className="text-green-500 text-lg font-semibold mb-4">
              Payment Successful!
            </h3>
            <button
              onClick={handleMakeAnotherPayment} // Reset the component state to allow another payment
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Make Another Payment
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            {clientSecret && (
              <StripeWrapper clientSecret={clientSecret}>
                <PaymentForm
                  campaignId={campaignId}
                  amountFunded={parseFloat(newAmount)} // Pass the parsed number
                  oldAmount={amountFunded}
                  onSuccess={handlePaymentSuccess}
                  disabled={false}
                />
              </StripeWrapper>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignPayment;

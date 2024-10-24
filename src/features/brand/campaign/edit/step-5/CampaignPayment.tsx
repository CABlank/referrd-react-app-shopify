import React, { useState } from "react";
import StripeWrapper from "./StripeWrapper";
import PaymentForm from "./PaymentForm";
import Spinner from "../../../../../components/common/Spinner";
import { updateCampaignStatus } from "../../../../../services/campaign/campaign";
import EditIcon from "@/components/icons/EditIcon"; // Assuming you have the EditIcon component

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
  const [loading, setLoading] = useState(false); // General loading state
  const [clientSecret, setClientSecret] = useState<string | null>(null); // Stripe clientSecret
  const [newAmount, setNewAmount] = useState<number>(100); // Payment amount input
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Track payment success
  const [confirming, setConfirming] = useState(false); // Track amount confirmation
  const [amountConfirmed, setAmountConfirmed] = useState(false); // Track if amount is confirmed
  const [error, setError] = useState<string | null>(null); // Track errors

  // Handle input change for the payment amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAmount(parseFloat(e.target.value) || 0); // Update the payment amount
  };

  // Handle the "Confirm Amount" button click
  const handleConfirmAmount = async () => {
    if (newAmount <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    setError(null); // Clear any previous errors
    setLoading(true);
    setConfirming(true); // Disable inputs while confirming

    try {
      // Call backend to create payment intent
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountFunded: newAmount, // Use the confirmed amount
          campaignId,
          token,
          oldAmount: amountFunded,
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret); // Save clientSecret for Stripe payment form
      setAmountConfirmed(true); // Mark amount as confirmed
    } catch (error) {
      console.error("Failed to create payment intent", error);
      setError("Failed to create payment intent. Please try again.");
    } finally {
      setLoading(false);
      setConfirming(false); // Re-enable inputs after confirmation
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async () => {
    setLoading(true); // Show spinner while updating status

    try {
      // Update the campaign status after successful payment
      await updateCampaignStatus(campaignId, "Live", token);
      setPaymentSuccess(true); // Show success message
      onPaymentSuccess(); // Trigger parent callback if necessary
    } catch (error) {
      console.error("Failed to update campaign status after payment", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  // Handle editing the payment amount
  const handleEditAmount = () => {
    setAmountConfirmed(false); // Allow re-confirmation of the amount
    setClientSecret(null); // Reset payment form until new amount is confirmed
  };

  // Allow the user to make another payment
  const handleMakeAnotherPayment = () => {
    setPaymentSuccess(false); // Reset payment success
    setClientSecret(null); // Reset clientSecret to show the input form again
    setNewAmount(100); // Reset the amount input field
    setAmountConfirmed(false); // Allow re-confirmation of the amount
  };

  return (
    <div className="flex items-center justify-center min-h-[200px] p-6 bg-white rounded-lg shadow-md w-full">
      <div className="w-full">
        <h2 className="flex text-xl font-semibold text-green-500 text-center mb-4">
          5. Campaign Payment
        </h2>
        <hr className="border-gray-200 mb-6" />

        {/* Display error message if there's any */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Payment success message */}
        {paymentSuccess ? (
          <div className="flex flex-col items-center">
            <h3 className="text-green-500 text-lg font-semibold mb-4">Payment Successful!</h3>
            <button
              onClick={handleMakeAnotherPayment}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Make Another Payment
            </button>
          </div>
        ) : (
          <>
            {/* Input field for payment amount */}
            {!amountConfirmed ? (
              <div className="mb-6 w-full flex justify-center">
                <div className="w-full max-w-[300px]">
                  <label htmlFor="newAmount" className="block text-gray-700">
                    Enter Payment Amount (AUD):
                  </label>
                  <input
                    id="newAmount"
                    type="number"
                    value={newAmount.toString()} // Show as string
                    onChange={handleAmountChange} // Update state on change
                    className="mt-1 block w-full p-2 border rounded"
                    min="1"
                    disabled={confirming} // Disable while confirming
                  />

                  {/* Confirm Amount button */}
                  <button
                    onClick={handleConfirmAmount}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={confirming || loading} // Disable during confirm or loading
                  >
                    {confirming ? "Confirming..." : "Confirm Amount"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Show confirmation message when the amount is confirmed */}
                <div className="flex items-center justify-center mb-4">
                  <p className="text-green-600 text-center mr-4">
                    Amount Confirmed: AUD {newAmount}
                  </p>
                  {/* Edit icon to modify the amount */}
                  <button
                    onClick={handleEditAmount}
                    className="px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    <EditIcon /> {/* Assuming EditIcon is properly imported */}
                  </button>
                </div>
              </>
            )}

            {/* Show payment form only after amount is confirmed */}
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              clientSecret && (
                <div className="w-full flex justify-center">
                  <StripeWrapper clientSecret={clientSecret}>
                    <PaymentForm
                      campaignId={campaignId}
                      amountFunded={newAmount} // Pass the confirmed amount
                      oldAmount={amountFunded}
                      onSuccess={handlePaymentSuccess}
                      disabled={false}
                    />
                  </StripeWrapper>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignPayment;

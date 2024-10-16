import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useSession } from "../../../../../context/SessionContext";

interface PaymentFormProps {
  campaignId: number;
  amountFunded: number;
  disabled?: boolean;
  oldAmount: number;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  campaignId,
  amountFunded,
  oldAmount,
  onSuccess,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false); // Track payment success
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const { withTokenRefresh } = useSession();

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const token = await withTokenRefresh((token) => Promise.resolve(token));

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: "if_required",
      });

      if (error) {
        console.error("Stripe payment error:", error);
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await handleUpdateCampaign(paymentIntent, token);

        setPaymentSuccessful(true); // Set success state
        onSuccess(); // Notify parent component
      } else {
        setErrorMessage("Payment was not successful. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async (paymentIntent: any, token: string) => {
    try {
      const response = await fetch("/api/stripe/update-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          campaignId,
          amountFunded,
          oldAmount,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update campaign.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error updating campaign:", error);
      setErrorMessage("Failed to update campaign. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      {!paymentSuccessful ? (
        <>
          <PaymentElement />
          {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
          <button
            type="submit"
            disabled={!stripe || loading || disabled}
            className="mt-5 flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775] text-white"
          >
            {loading ? "Processing..." : "Pay with Stripe"}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center mt-5">
          <p className="text-green-500 text-lg mt-2">Payment Successful!</p>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;

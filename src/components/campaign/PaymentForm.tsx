// components/campaign/PaymentForm.tsx

import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from "../../context/SessionContext";

interface PaymentFormProps {
  campaignId: number;
  amountFunded: number;
  disabled?: boolean;
  oldAmount: number;
  onSuccess: () => void; // Callback for handling successful payment
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  campaignId,
  amountFunded,
  oldAmount,
  onSuccess, // Destructure onSuccess from props
  disabled, // Declare the 'disabled' variable
}) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { withTokenRefresh } = useSession();

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const token = await withTokenRefresh((token) => Promise.resolve(token));

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountFunded,
          campaignId,
          token,
          oldAmount,
        }),
      });

      const { id } = await response.json();

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        console.error("Stripe checkout error:", error);
        setLoading(false);
      } else {
        onSuccess(); // Call onSuccess callback after successful payment
      }
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <button
        type="submit"
        disabled={!stripe || loading || disabled}
        className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative gap-2 px-4 py-2 rounded-lg bg-[#47b775] text-white"
      >
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </form>
  );
};

export default PaymentForm;

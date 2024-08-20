import React, { useState, useEffect, useRef } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from "../../context/SessionContext";

const PaymentFormInlineContent = ({
  campaign,
  loading,
  handlePayment,
  amount,
  setAmount,
}: {
  campaign: any;
  loading: boolean;
  handlePayment: (event: React.FormEvent) => void;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [inputWidth, setInputWidth] = useState(80);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      const newWidth = Math.max(80, spanRef.current.offsetWidth + 20);
      setInputWidth(newWidth);
    }
  }, [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row w-full">
      <form
        onSubmit={handlePayment}
        className="flex flex-col sm:flex-row w-full"
      >
        <button
          type="submit"
          disabled={loading || !amount}
          className="text-white cursor-pointer flex justify-center items-center gap-2.5 px-4 py-1.5 bg-[#47B775] border border-[#47B775] rounded-tl sm:rounded-tr-none sm:rounded-bl-none h-8"
        >
          {amount ? "Submit" : "Payment"}
        </button>
        <div className="flex justify-center items-center py-1.5 border border-gray-500 sm:border-l-0 sm:rounded-tr sm:rounded-br h-8">
          {amount && (
            <div className="flex items-left px-1 bg-transparent">
              <span className="text-gray-700">$</span>
            </div>
          )}
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="ml-2 bg-transparent border-none outline-none text-gray-700 text-left appearance-none"
            style={{
              width: `${inputWidth}px`,
              textAlign: amount ? "left" : "center",
            }}
            placeholder="Enter amount"
            min="20"
            step="10"
            required
          />
          <span ref={spanRef} className="absolute invisible whitespace-nowrap">
            {amount || "Enter amount"}
          </span>
        </div>
      </form>
    </div>
  );
};

const PaymentFormInline = ({
  campaign,
  loading,
}: {
  campaign: any;
  loading: boolean;
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { withTokenRefresh } = useSession();
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !amount) {
      return;
    }

    setInternalLoading(true);

    try {
      // Retrieve token using withTokenRefresh
      const token = await withTokenRefresh((token) => Promise.resolve(token));

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountFunded: parseFloat(amount),
          campaignId: campaign.id!,
          token,
          oldAmount: campaign.amountFunded || 0,
        }),
      });

      const { id } = await response.json();

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        console.error("Stripe checkout error:", error);
        setInternalLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setInternalLoading(false);
    }
  };

  return (
    <PaymentFormInlineContent
      campaign={campaign}
      loading={internalLoading || loading}
      handlePayment={handlePayment}
      amount={amount}
      setAmount={setAmount}
    />
  );
};

export default PaymentFormInline;

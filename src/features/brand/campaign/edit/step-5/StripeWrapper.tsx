import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeWrapperProps {
  clientSecret: string;
  children: React.ReactNode;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ clientSecret, children }) => {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const, // Customize the look if needed
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
var stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
var StripeWrapper = function (_a) {
    var children = _a.children;
    return <Elements stripe={stripePromise}>{children}</Elements>;
};
export default StripeWrapper;

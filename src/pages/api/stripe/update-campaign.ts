import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { updateCampaignStatusAndAmount } from "../../../services/campaign/campaign";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { paymentIntentId, campaignId, amountFunded, token, oldAmount } =
      req.body;

    try {
      // Retrieve the PaymentIntent to ensure it succeeded
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        const newTotalAmount = oldAmount + amountFunded; // Calculate the new total amount funded

        // Update the campaign with the new amount and status
        await updateCampaignStatusAndAmount(campaignId, newTotalAmount, token);

        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ error: "Payment did not succeed" });
      }
    } catch (err) {
      console.error("Error updating campaign:", err);
      res.status(500).json({ error: "Failed to update campaign" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

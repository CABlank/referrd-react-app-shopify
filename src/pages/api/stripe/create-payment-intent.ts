import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { campaignId, amountFunded, token, oldAmount } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountFunded * 100, // Amount in cents
        currency: "aud",
        metadata: {
          campaignId: campaignId.toString(),
          token,
          oldAmount,
        },
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error("Error creating payment intent:", err);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

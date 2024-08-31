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
    const { campaignId, amountFunded, token, oldAmount } = req.body; // Retrieve the token from the request body

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "aud",
              product_data: {
                name: `Campaign ${campaignId} Funding`,
              },
              unit_amount: amountFunded * 100, // Stripe expects amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/api/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/brand/campaigns?cancel`,
        metadata: {
          campaignId: campaignId.toString(),
          token,
          oldAmount,
        },
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      res.status(500).json({ error: "Failed to create session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

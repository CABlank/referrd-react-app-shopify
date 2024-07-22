import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { updateCampaignStatusAndAmount } from "../../services/campaign/campaign";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string
    );
    const campaignId = session.metadata?.campaignId
      ? parseInt(session.metadata.campaignId, 10)
      : null;
    const token = session.metadata?.token;
    const amountFunded = session.amount_total ? session.amount_total / 100 : 0; // Stripe returns amount in cents
    const oldAmount = session.metadata?.oldAmount
      ? parseFloat(session.metadata.oldAmount)
      : 0;

    if (campaignId) {
      const newTotalAmount = oldAmount + amountFunded; // Calculate the new total amount funded
      await updateCampaignStatusAndAmount(
        campaignId,
        newTotalAmount,
        token ?? ""
      );
      console.log(
        `Updated campaign ${campaignId} with amount ${newTotalAmount}`
      );
    } else {
      console.log(`No campaign ID found in session metadata`);
    }

    // Redirect to the campaigns page
    res.writeHead(302, { Location: "/brand/campaigns" });
    res.end();
  } catch (err) {
    console.error("Error retrieving session:", err);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
}

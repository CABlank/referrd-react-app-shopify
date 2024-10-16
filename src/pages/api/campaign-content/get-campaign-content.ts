import type { NextApiRequest, NextApiResponse } from "next";
import { initialize } from "./initialize/initialize";
import { handleCors } from "./handlers/handle-cors";
import { fetchCampaign } from "./services/fetch-campaign";
import { extractReferralUuid } from "./handlers/extract-referral-uuid";
import { handleReferral } from "./handlers/handle-referral";
import { generateScriptContent } from "./handlers/generate-script-content";

export type ApiResponse = {
  success: boolean;
  htmlContent?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | string>
) {
  // Early exit if the request is from a Shopify admin page
  const fullUrl = req.query.fullUrl as string;
  if (fullUrl.startsWith("https://admin.shopify.com/store/")) {
    return res
      .status(200)
      .json({ success: false, message: "No action taken for admin page." });
  }

  // 1. Handle CORS: Ensure the request is from an allowed source.
  if (handleCors(req, res)) return;

  try {

    // 2. Check if the URL includes the path `/pages/referrd`.
    const isReferrdPage = fullUrl.includes("/pages/referrd");

    // 3. Extract the UUID from the URL if it is a referral page.
    const referralUuidFromUrl = isReferrdPage
      ? fullUrl.split("/pages/referrd-")[1]
      : null;


    // 4. Initialize request by extracting company ID and BOT_TOKEN.
    const { companyId, BOT_TOKEN } = initialize(req);

    // 5. Fetch and validate campaign data based on the company ID.
    const campaignDetails = await fetchCampaign(companyId, BOT_TOKEN);
    if (!campaignDetails) {
      return res
        .status(404)
        .json({ success: false, message: "No valid campaign found" });
    }

    const { campaign, format, campaignData } = campaignDetails;

    // 6. Handle referral logic (if applicable).
    const referralUuid = extractReferralUuid(fullUrl);

    const discountCode = await handleReferral(referralUuid, req, res, BOT_TOKEN, campaign, fullUrl);




    // 7. Generate script content based on the campaign format and whether it's a referrd page.
    const scriptContent = generateScriptContent(
      format,
      campaignData,
      isReferrdPage,
      referralUuidFromUrl,
      referralUuid,
      discountCode
    );
    res.setHeader("Content-Type", "application/javascript");
    res.status(200).send(scriptContent);
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    res.setHeader("Content-Type", "application/javascript");
    res.status(500).send(`
      console.error('Internal Server Error');
    `);
  }
}

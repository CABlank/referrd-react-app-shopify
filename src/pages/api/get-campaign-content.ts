import type { NextApiRequest, NextApiResponse } from "next";
import { initialize } from "./initialize/initialize";
import { handleCors } from "./handlers/handleCors";
import { fetchCampaign } from "./services/fetchCampaign";
import { extractReferralUuid } from "./handlers/extractReferralUuid";
import { handleReferral } from "./handlers/handleReferral";
import { generateScriptContent } from "./handlers/generateScriptContent";
import { ApiResponse } from "./types/ApiResponse";

/**
 * The main handler function for the API endpoint.
 * Manages the full request lifecycle including CORS, referral handling, and script content generation.
 *
 * This function coordinates the entire flow of the API request, starting from handling CORS,
 * initializing the request, fetching and validating campaigns, handling referrals, and
 * generating the appropriate script content to be sent back as the response.
 *
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | string>
) {
  // 1. Handle CORS: Ensure the request is from an allowed source.
  if (handleCors(req, res)) return;

  try {
    // 2. Extract full URL from query parameters (the link the visitor clicked).
    const fullUrl = req.query.fullUrl as string;
    console.log("Full URL:", fullUrl);

    // 3. Check if the URL includes the path `/pages/referrd`.
    const isReferrdPage = fullUrl.includes("/pages/referrd");

    // 4. Extract the UUID from the URL if it is a referral page.
    const referralUuidFromUrl = isReferrdPage
      ? fullUrl.split("/pages/referrd-")[1] // Split at 'referrd-' and get the UUID
      : null;

    console.log("Extracted UUID:", referralUuidFromUrl);

    // 5. Initialize request by extracting company ID and BOT_TOKEN.
    console.log("Initializing request...");
    const { companyId, BOT_TOKEN } = initialize(req);
    console.log("Company ID:", companyId);

    // 6. Fetch and validate campaign data based on the company ID.
    const campaignDetails = await fetchCampaign(companyId, BOT_TOKEN);
    if (!campaignDetails) {
      // If no valid campaign is found, notify the website and stop here.
      return res
        .status(404)
        .json({ success: false, message: "No valid campaign found" });
    }

    const { campaign, format, campaignData } = campaignDetails;

    // 7. Handle referral logic (if applicable).
    // Check if there's a referral in the URL or saved in cookies.
    const referralUuid = extractReferralUuid(fullUrl);

    // If the referral is valid, track it and set a cookie.
    if (!(await handleReferral(referralUuid, req, res, BOT_TOKEN))) {
      return; // Stop if there's an issue with the referral.
    }

    // 8. Generate script content based on the campaign format and whether it's a referrd page.
    const scriptContent = generateScriptContent(
      format,
      campaignData,
      isReferrdPage,
      referralUuidFromUrl
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

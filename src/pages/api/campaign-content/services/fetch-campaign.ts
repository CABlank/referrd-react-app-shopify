import { fetchCampaignData } from "../utils/fetch-campaign-data";
import { fetchCampaignMetadata } from "../utils/fetch-campaign-metadata";
import { validateCampaigns } from "../utils/validate-campaigns";

/**
 * Fetches and validates campaign metadata and data.
 *
 * This function is responsible for retrieving the campaign metadata using the company ID and token,
 * validating the campaigns, and then fetching the specific campaign data based on the validated campaign.
 *
 * @param {string} companyId - The ID of the company for which campaigns are being fetched.
 * @param {string} BOT_TOKEN - The authentication token for the API.
 * @returns {Promise<{ campaign: any, format: string, campaignData: any } | null>}
 *          The validated campaign data and format, or null if no valid campaign is found.
 */
export async function fetchCampaign(
  companyId: string,
  BOT_TOKEN: string
): Promise<{ campaign: any; format: string; campaignData: any } | null> {
  const campaigns = await fetchCampaignMetadata(companyId, BOT_TOKEN);
  const validatedCampaign = validateCampaigns(campaigns);

  if (!validatedCampaign) {
    return null;
  }

  const { campaign, format } = validatedCampaign;

  const API_URL = process.env.API_URL || "";
  const campaignData = await fetchCampaignData(campaign.id, API_URL, BOT_TOKEN);

  return { campaign, format, campaignData };
}

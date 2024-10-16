import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import {
  fetchCustomerByUUID,
  registerClick,
  updateReferralDiscountCode,
} from "../../../../services/referrals/referralTracking";

/**
 * Handles the referral logic including validation, registering clicks, and setting cookies.
 *
 * This function manages the process of checking whether a referral UUID is present either
 * in the request's URL or in the client's cookies. If a valid referral UUID is found,
 * it registers the click and sets a referral cookie if necessary. If any issues arise,
 * such as an invalid UUID, the function handles the error accordingly.
 *
 * @param {string | null} referralUuid - The referral UUID extracted from the URL, or null if not found.
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse} res - The outgoing HTTP response object.
 * @param {string} BOT_TOKEN - The authentication token used to interact with the backend services.
 * @param {any} campaignData - Additional campaign-related data used for discount code creation.
 * @param {string} fullUrl - The full URL of the request to extract the shop domain.
 * @returns {Promise<string | null>} - Returns the discount code if found or created, otherwise returns null.
 */
export async function handleReferral(
  referralUuid: string | null,
  req: NextApiRequest,
  res: NextApiResponse,
  BOT_TOKEN: string,
  campaignData: any,
  fullUrl: string
): Promise<string | null> {
  if (!referralUuid) return null;  // If referral UUID is not present, skip processing

  try {
    const referralRecord = await fetchCustomerByUUID(referralUuid, BOT_TOKEN);

    if (!referralRecord) {
      return null;
    }


    if (referralRecord.uuid !== undefined) {
      await registerClick(referralRecord.uuid, BOT_TOKEN);


      // Check if the campaign allows discounts before proceeding
      if (campaignData.allowDiscounts === true) {
        // Log the entire company_campaign_tracker structure

        // Ensure we check all companies and campaigns within the company_campaign_tracker
        const discountCode = referralRecord.company_campaign_tracker?.companies
          .flatMap(company => {
            return company.campaigns.map(campaign => {
              return campaign;
            });
          })
          .find(campaign => campaign.campaign_id === campaignData.campaign_uuid)?.discount_code;

        // Log the retrieved discount code
        console.log("campaign_id", campaignData.campaign_uuid);
        console.log("discountCode", discountCode);

        // If a discount code already exists in the referral record, return it
        if (discountCode) {
          return discountCode;
        }
      }
    }

  } catch (error) {
    console.error("Error handling referral:", error);
    // Continue without interrupting the flow
  }

  return null;
}


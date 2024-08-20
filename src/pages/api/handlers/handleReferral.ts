import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchCustomerByUUID,
  registerClick,
} from "../../../services/referrals/referralTracking";

/**
 * Handles the referral logic including validation, registering clicks, and setting cookies.
 *
 * This function manages the process of checking whether a referral UUID is present either
 * in the request's URL or in the client's cookies. If a valid referral UUID is found,
 * it registers the click and sets a referral cookie if necessary. If any issues arise,
 * such as an invalid UUID, the function handles the error accordingly.
 *
 * @param {string | null} referralUuid - The referral UUID extracted from the URL, or null if not found.
 * @param {string | null} existingReferralCookie - The existing referral cookie value, or null if not found.
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse} res - The outgoing HTTP response object.
 * @param {string} BOT_TOKEN - The authentication token used to interact with the backend services.
 * @returns {Promise<boolean>} - Returns true if the referral was successfully handled, otherwise false.
 */
export async function handleReferral(
  referralUuid: string | null,
  req: NextApiRequest,
  res: NextApiResponse,
  BOT_TOKEN: string
): Promise<boolean> {
  if (referralUuid) {
    try {
      console.log("Fetching referral record from DB...");
      const referralRecord = await fetchCustomerByUUID(referralUuid, BOT_TOKEN);

      if (!referralRecord) {
        console.log("Invalid referral code");
        res.status(404).json({
          success: false,
          message: "Invalid referral code",
        });
        return false;
      }

      console.log("Referral Record Found:", referralRecord);

      console.log("Registering click...");
      if (referralRecord.uuid !== undefined) {
        await registerClick(referralRecord.uuid, BOT_TOKEN);
      } else {
        console.error("Referral record UUID is undefined.");
      }

      return true;
    } catch (error) {
      console.error("Error handling referral:", error);
      res.status(500).json({
        success: false,
        message: "Error processing referral",
      });
      return false;
    }
  }

  return true;
}

import {
  fetchCustomerByUUID,
  registerClick,
} from "../../../services/referrals/referralTracking";

/**
 * Fetches referral data based on the UUID.
 *
 * This function interacts with the referral tracking service to retrieve customer information
 * and register clicks based on the referral UUID provided.
 *
 * @param {string} uuid - The UUID of the referral.
 * @param {string} BOT_TOKEN - The authentication token used to interact with the backend services.
 * @returns {Promise<any>} The referral data associated with the given UUID.
 */
export async function fetchReferral(
  uuid: string,
  BOT_TOKEN: string
): Promise<any> {
  return fetchCustomerByUUID(uuid, BOT_TOKEN);
}

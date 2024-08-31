import {
  getPopupSettings,
  getTopbarSettings,
  generatePopupScriptContent,
  generateTopbarScriptContent,
  generateSectionScriptContent,
} from "../utils/fetch-html-content";

/**
 * Generates the script content based on the campaign format and URL path.
 *
 * This function determines the correct format (Popup, Section, or Topbar) for the campaign, retrieves
 * the necessary settings, and generates the appropriate HTML script content.
 *
 * @param {string} format - The format of the campaign, e.g., "Popup" or "Topbar".
 * @param {object} campaignData - The data related to the campaign.
 * @param {boolean} isReferrdPage - Whether the URL path is `/pages/referrd`.
 * @param {string | null} referralUuidFromUrl - The UUID extracted from the URL.
 * @returns {string} - The generated script content as a string.
 * @throws {Error} - Throws an error if the format is unsupported or if the UUIDs do not match.
 */
export function generateScriptContent(
  format: string,
  campaignData: any,
  isReferrdPage: boolean,
  referralUuidFromUrl: string | null
): string {
  console.log("Generating script content...");
  let scriptContent = "";

  if (isReferrdPage) {
    // Validate the UUID from the URL against the campaign UUID
    if (
      referralUuidFromUrl &&
      referralUuidFromUrl === campaignData.campaign_uuid
    ) {
      // UUIDs match, generate the section script
      const settings = getPopupSettings(campaignData);
      scriptContent = generateSectionScriptContent(campaignData, settings);
    } else {
      // UUIDs do not match, throw an error or handle it as needed
      throw new Error(
        `UUID mismatch or missing: Expected ${campaignData.campaign_uuid}, but got ${referralUuidFromUrl}`
      );
    }
  } else if (format === "Popup") {
    // Generate popup script for non-referral pages
    const settings = getPopupSettings(campaignData);
    scriptContent = generatePopupScriptContent(campaignData, settings);
  } else if (format === "Both") {
    // Generate topbar script for non-referral pages
    const settings = getTopbarSettings(campaignData);
    scriptContent = generateTopbarScriptContent(campaignData, settings);
  } else {
    throw new Error(`Unsupported format: ${format}`);
  }

  console.log("Script content generated successfully");
  return scriptContent;
}

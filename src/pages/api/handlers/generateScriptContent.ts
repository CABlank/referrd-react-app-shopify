import {
  getPopupSettings,
  getTopbarSettings,
  generatePopupScriptContent,
  generateTopbarScriptContent,
} from "../utils/fetchHtmlContent";

/**
 * Generates the script content based on the campaign format.
 *
 * This function determines the correct format (Popup or Topbar) for the campaign, retrieves
 * the necessary settings, and generates the appropriate HTML script content.
 *
 * @param {string} format - The format of the campaign, e.g., "Popup" or "Topbar".
 * @param {object} campaignData - The data related to the campaign.
 * @returns {string} - The generated script content as a string.
 * @throws {Error} - Throws an error if the format is unsupported.
 */
export function generateScriptContent(
  format: string,
  campaignData: any
): string {
  console.log("Generating script content...");
  let scriptContent = "";

  if (format === "Popup") {
    const settings = getPopupSettings(campaignData);
    scriptContent = generatePopupScriptContent(campaignData, settings);
  } else if (format === "Topbar") {
    const settings = getTopbarSettings(campaignData);
    scriptContent = generateTopbarScriptContent(campaignData, settings);
  } else {
    throw new Error(`Unsupported format: ${format}`);
  }

  console.log("Script content generated successfully");
  return scriptContent;
}

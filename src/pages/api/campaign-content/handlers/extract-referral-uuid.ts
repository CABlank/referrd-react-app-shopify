/**
 * Parses and returns the referral UUID from the provided URL.
 * The UUID can either be in the query string (as a key or value) or the pathname.
 *
 * This function is responsible for extracting a referral UUID from the full URL passed by the client.
 * It handles both query string and pathname variations where the UUID may be embedded.
 *
 * Examples of URLs it can handle:
 * - https://example.com/?referral=7db06504-8def-47d2-b350-3022d54b76cc
 * - https://example.com/?referrd-7db06504-8def-47d2-b350-3022d54b76cc
 * - https://example.com/pages/referrd-7db06504-8def-47d2-b350-3022d54b76cc
 * - https://overboard-development-2.myshopify.com/?referrd?-96e1d5e7-b0c6-4d71-abca-7d559c1ebce4&test
 *
 * @param {string} fullUrl - The full URL string received from the client.
 * @returns {string | null} - The extracted referral UUID or null if not found.
 */
export function extractReferralUuid(fullUrl: string): string | null {
  const url = new URL(fullUrl);
  const queryParams = new URLSearchParams(url.search);

  // Case 1: Handle unconventional "referrd?-UUID" case
  if (fullUrl.includes('?referrd?-')) {
    const referrdIndex = fullUrl.indexOf('?referrd?-');
    if (referrdIndex !== -1) {
      const uuid = fullUrl.substring(referrdIndex + 10).split('&')[0]; // Extract UUID after "referrd?-"

      // Validate UUID format (optional)
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (uuidRegex.test(uuid)) {
        return uuid;
      }
    }
  }

  // Case 2: Check if the UUID exists in the query parameters (either as a key or value)
  let extractedUuid: string | null = null;

  queryParams.forEach((value, key) => {
    // Check if the key contains the UUID (e.g., referrd-UUID=)
    if (key.startsWith("referrd-")) {
      const uuid = key.substring(8); // Extract the UUID after "referrd-"
      extractedUuid = uuid || null;
      return;
    }

    // If the value is the UUID (e.g., ?referral=UUID)
    if (
      value &&
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        value
      )
    ) {
      extractedUuid = value;
      return;
    }
  });

  if (extractedUuid) {
    return extractedUuid;
  }

  // Case 3: Check if the UUID exists in the pathname (e.g., /pages/referrd-UUID)
  const pathname = url.pathname;
  const referrdIndex = pathname.indexOf("referrd-");

  if (referrdIndex !== -1) {
    const uuid = pathname.substring(referrdIndex + 8).split("/")[0]; // Extract UUID part after "referrd-"

    // Validate UUID format (optional)
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (uuidRegex.test(uuid)) {
      return uuid;
    }
  }

  // Return null if no UUID is found
  return null;
}

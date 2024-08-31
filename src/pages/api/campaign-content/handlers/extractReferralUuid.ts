/**
 * Parses and returns the referral UUID from the provided URL.
 * The UUID is assumed to be either in the query string or the pathname.
 *
 * This function is responsible for extracting a referral UUID from the full URL passed by the client.
 * It assumes that the UUID is included as part of the query string parameters.
 *
 * @param {string} fullUrl - The full URL string received from the client.
 * @returns {string | null} - The extracted referral UUID or null if not found.
 */
export function extractReferralUuid(fullUrl: string): string | null {
  const url = new URL(fullUrl);
  const queryParams = new URLSearchParams(url.search);

  if (queryParams.toString()) {
    const uuidNamePart = queryParams.keys().next().value;
    if (uuidNamePart) {
      const [uuid] = uuidNamePart.split("?");

      console.log("Referral UUID extracted from query string:", uuid);
      console.log("Query Params:", queryParams.toString());
      return uuid || null;
    }
  }

  return null;
}

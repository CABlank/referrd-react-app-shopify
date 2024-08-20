import cookie from "cookie";
/**
 * Retrieves the referral cookie if it exists from the request headers.
 *
 * This function parses the incoming request's cookies to find the referral cookie,
 * if it has been previously set. The referral cookie helps in persisting referral data across requests.
 *
 * @param {NextApiRequest} req - The incoming request object.
 * @returns {string | null} - The referral cookie value or null if not found.
 */
export function getExistingReferralCookie(req) {
    return req.headers.cookie ? cookie.parse(req.headers.cookie).referral : null;
}

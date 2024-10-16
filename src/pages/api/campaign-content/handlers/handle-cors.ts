import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles CORS (Cross-Origin Resource Sharing) by setting the appropriate headers.
 * Also manages preflight requests by responding to OPTIONS method.
 *
 * This function ensures that the API endpoint can be accessed by clients from different origins
 * by setting the appropriate CORS headers. It also handles OPTIONS requests that browsers
 * send as part of the preflight check for CORS.
 *
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 * @returns {boolean} - Returns true if the request was an OPTIONS preflight, otherwise false.
 */
export function handleCors(req: NextApiRequest, res: NextApiResponse): boolean {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}

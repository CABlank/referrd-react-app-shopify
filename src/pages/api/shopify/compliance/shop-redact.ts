/**
 * This file handles GDPR shop redact requests.
 * It verifies the HMAC signature of incoming POST requests and logs the request details.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required types from Next.js and the applyMiddleware utility.
 * 2. Defines the Handler Function: It defines an asynchronous handler function to process incoming GDPR shop redact requests.
 * 3. Verifies Request Method: It ensures that only POST requests are processed.
 * 4. Logs Request Details: It logs the body of the request and the shop domain.
 * 5. Exports the Middleware-Applied Handler: Finally, it exports the handler function wrapped with the HMAC verifier middleware.
 */

import withMiddleware from "../../../../utils/middleware/applyMiddleware"; // Import the applyMiddleware utility
import { NextApiRequest, NextApiResponse } from "next"; // Import Next.js API types

/**
 * Handler for GDPR shop redact request.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(401).send("Must be POST"); // Reject non-POST requests
  }

  const { body } = req;
  const shop = body.shop_domain; // Extract shop domain from request body
};

export default withMiddleware("hmacVerifier")(handler); // Export the middleware-applied handler

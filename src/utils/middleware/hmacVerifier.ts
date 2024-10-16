/**
 * This file implements a middleware function for verifying HMAC signatures of incoming Shopify requests.
 * It ensures that the incoming requests are legitimate by comparing the HMAC header with a generated hash.
 * If the verification is successful, it passes control to the next middleware.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as `crypto` for HMAC calculation, Next.js types, and the Shopify client.
 * 2. Extends Next.js Request Interface: It extends the `NextApiRequest` interface to define the `body` property.
 * 3. Defines Middleware for HMAC Verification: It defines an asynchronous middleware function `hmacVerifier` to verify the HMAC signature of incoming requests.
 * 4. Generates and Compares HMAC: It generates a hash from the request body and compares it with the HMAC header.
 * 5. Error Handling: It handles errors and logs them, sending an appropriate response if verification fails.
 * 6. Exports the Middleware Function: Finally, it exports the `hmacVerifier` middleware function for use in your application.
 */

import crypto from "crypto"; // Import crypto module for HMAC calculation
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"; // Import Next.js API types
import { NextResponse } from "next/server"; // Import NextResponse for server-side responses
import shopify from "../shopify/shopifyClient"; // Import configured Shopify client

// Extend the NextApiRequest interface to define the `body` property
declare module "next" {
  interface NextApiRequest {
    body: any; // Define body as any, or you can specify a more precise type if known
  }
}

/**
 * Middleware to verify HMAC signatures of incoming Shopify requests.
 *
 * @async
 * @function hmacVerifier
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object.
 * @param {NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 */
const hmacVerifier = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) => {
  try {
    // Generate HMAC hash from the request body using the Shopify API secret
    const generateHash = crypto
      .createHmac("SHA256", process.env.SHOPIFY_API_SECRET as string)
      .update(JSON.stringify(req.body), "utf8")
      .digest("base64");

    const hmac = req.headers["x-shopify-hmac-sha256"] as string; // Extract HMAC from request headers

    // Compare the generated HMAC hash with the provided HMAC
    if (shopify.auth.safeCompare(generateHash, hmac)) {
      await next(req, res); // Pass control to the next middleware function if verification succeeds
    } else {
      // Send unauthorized response if HMAC verification fails
      return res
        .status(401)
        .send({ success: false, message: "HMAC verification failed" });
    }
  } catch (e) {
    // Handle and log errors during HMAC verification

    return new NextResponse(
      JSON.stringify({ success: false, message: "HMAC verification failed" }),
      {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
};

export default hmacVerifier; // Export the middleware function

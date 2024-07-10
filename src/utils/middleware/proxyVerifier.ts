/**
 * This file implements a middleware function for verifying Shopify proxy requests.
 * It ensures that the incoming requests are legitimate by checking their signature against a calculated HMAC.
 * If the verification is successful, it adds the shop domain to the request object and passes control to the next middleware.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as `crypto` for HMAC calculation and Next.js types.
 * 2. Extends Next.js Request Interface: It extends the `NextApiRequest` interface to include an optional `user_shop` property.
 * 3. Defines Middleware for Request Verification: It defines an asynchronous middleware function `proxyVerifier` to verify the incoming proxy requests.
 * 4. Encodes Query Data: It includes a helper function `encodeQueryData` to encode query parameters into a URL query string format.
 * 5. Exports the Middleware Function: Finally, it exports the `proxyVerifier` middleware function for use in your application.
 */

import crypto from "crypto"; // Import crypto module for HMAC calculation
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"; // Import Next.js API types

// Extend the NextApiRequest interface to include an optional `user_shop` property
declare module "next" {
  interface NextApiRequest {
    user_shop?: string;
  }
}

/**
 * Middleware to verify Shopify proxy requests and attach the shop domain to the request object.
 *
 * @async
 * @function proxyVerifier
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object.
 * @param {NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 */
const proxyVerifier = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) => {
  const { signature } = req.query; // Extract signature from request query parameters

  // Encode query parameters, excluding the signature, and sort them
  const queryURI = encodeQueryData(req.query as Record<string, any>)
    .replace("/?", "")
    .replace(/&signature=[^&]*/, "")
    .split("&")
    .map((x) => decodeURIComponent(x))
    .sort()
    .join("");

  // Calculate the HMAC signature using the Shopify API secret
  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET as string)
    .update(queryURI, "utf-8")
    .digest("hex");

  // Compare the calculated signature with the provided signature
  if (calculatedSignature === signature) {
    req.user_shop = req.query.shop as string; // Add shop domain to request object
    await next(req, res); // Pass control to the next middleware function
  } else {
    // Send unauthorized response if the signature verification fails
    return res.status(401).send({
      success: false,
      message: "Signature verification failed",
    });
  }
};

/**
 * Encodes the provided data into a URL query string format.
 *
 * @param {Record<string, any>} data - The data to be encoded.
 * @returns {string} The encoded query string.
 */
function encodeQueryData(data: Record<string, any>): string {
  const queryString = [];
  for (let d in data) {
    queryString.push(d + "=" + encodeURIComponent(data[d])); // Encode each key-value pair
  }
  return queryString.join("&"); // Join the encoded pairs with '&'
}

export default proxyVerifier; // Export the middleware function

/**
 * This file handles Shopify webhook requests.
 * It processes incoming webhook POST requests, verifies their integrity, and logs the processing status.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as the Shopify client and Next.js types.
 * 2. Defines the Handler Function: It defines an asynchronous handler function to process incoming webhook requests.
 * 3. Verifies Request Method: It ensures that only POST requests are processed.
 * 4. Extracts and Logs Webhook Information: It extracts the topic and shop domain from request headers and logs them.
 * 5. Buffers the Request Body: It buffers the request body for processing.
 * 6. Processes Webhook: It processes the webhook using the Shopify client.
 * 7. Handles Errors: It logs errors and responds with an appropriate status if the processing fails.
 * 8. Configures API: It configures the API to disable body parsing.
 */

import shopify from "../../../../utils/shopify/shopifyClient"; // Import the Shopify client
import { NextApiRequest, NextApiResponse } from "next"; // Import Next.js API types

/**
 * Handles Shopify webhook requests.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).send("It ain't POST mate."); // Reject non-POST requests
  }

  const topic = (req.headers["x-shopify-topic"] as string) || ""; // Extract topic from headers
  const shop = (req.headers["x-shopify-shop-domain"] as string) || ""; // Extract shop domain from headers

  const buff = await buffer(req); // Buffer the request body
  const rawBody = buff.toString("utf8"); // Convert the buffer to a string

  try {
    await shopify.webhooks.process({
      rawBody: rawBody,
      rawRequest: req,
      rawResponse: res,
    }); // Process the webhook using Shopify client
  } catch (e) {
    console.error(
      `---> Error while processing webhooks for ${shop} at ${topic} | ${
        (e as Error).message
      }`
    ); // Log error
    if (!res.headersSent) {
      res.status(500).send((e as Error).message); // Send error response
    }
  }
}
 */
export const config = {
  api: {
    bodyParser: false, // Disable body parsing for raw request handling
  },
};

/**
 * Buffers the request body.
 *
 * @async
 * @function buffer
 * @param {NodeJS.ReadableStream} readable - The readable stream to buffer.
 * @returns {Promise<Buffer>} The buffered data.

async function buffer(readable: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk); // Convert string chunks to Buffer
  }
  return Buffer.concat(chunks); // Concatenate chunks into a single Buffer
}
 */
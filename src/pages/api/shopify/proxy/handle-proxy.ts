/**
 * This file handles requests to a proxy route.
 * It verifies the request, retrieves a Shopify GraphQL client for offline access, and responds with a status message.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as client providers, middleware utilities, and Next.js types.
 * 2. Defines the Handler Function: It defines an asynchronous handler function to process incoming requests.
 * 3. Verifies the Request: It uses middleware to verify the request before processing.
 * 4. Creates a Shopify GraphQL Client: It creates a Shopify GraphQL client for offline access.
 * 5. Responds with Status: It responds with a status message indicating the proxy is working.
 * 6. Exports the Middleware-Applied Handler: Finally, it exports the handler function wrapped with the proxy verifier middleware.
 */

import clientProvider from "../../../../utils/client/clientProvider"; // Import client provider for Shopify clients
import withMiddleware from "../../../../utils/middleware/applyMiddleware"; // Import middleware utility
import { NextApiRequest, NextApiResponse } from "next"; // Import Next.js API types

/**
 * Handler for the proxy route.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { client } = await clientProvider.offline.graphqlClient({
    shop: (req as any).user_shop ?? "",
  }); // Create a Shopify GraphQL client for offline access

  return res.status(200).json({ content: "Proxy Be Working" }); // Respond with status message
};

export default withMiddleware("proxyVerifier")(handler); // Export the middleware-applied handler

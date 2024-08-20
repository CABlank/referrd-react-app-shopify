/**
 * This file handles GraphQL API requests.
 * It defines a handler function that processes POST requests to the GraphQL API endpoint.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required types from Next.js and necessary utilities from Shopify.
 * 2. Defines the Handler Function: It defines an asynchronous handler function to process incoming POST requests.
 * 3. Fetches and Verifies Session: It fetches the current session and verifies it.
 * 4. Processes GraphQL Requests: It proxies the GraphQL request to Shopify and sends the response.
 * 5. Handles Errors: It logs and responds with an error if the request fails.
 * 6. Exports the Middleware-Applied Handler: Finally, it exports the handler function wrapped with the request verifier middleware.
 */
/*
import verifyRequest from "../../../utils/middleware/applyMiddleware"; // Import the request verifier middleware
import shopify from "../../../utils/shopify/shopifyClient"; // Import the Shopify clientimport sessionHandler from "../../../utils/session/sessionHandler"; // Import the session handler
import type { NextApiRequest, NextApiResponse } from "next"; // Import Next.js API types

/**
 * Handles GraphQL API requests.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 */ /*
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Reject anything that's not a POST
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    }); // Get the current session ID
    const session = await sessionHandler.loadSession(Number(sessionId)); // Load the session using the session handler
    const response = await shopify.clients.graphqlProxy({
      session: session!,
      rawBody: req.body,
    }); // Proxy the GraphQL request to Shopify

    res.status(200).send(response.body); // Send the response from Shopify
  } catch (e) {
    console.error("An error occurred at /api/graphql", e); // Log the error
    return res.status(403).send(e); // Respond with an error
  }
};

export default verifyRequest(handler); // Export the middleware-applied handler
*/

/**
 * This file handles the root API requests.
 * It defines a handler function that processes GET and POST requests to the root API endpoint.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required types from Next.js and the applyMiddleware utility.
 * 2. Defines the Handler Function: It defines an asynchronous handler function to process incoming requests.
 * 3. Processes GET Requests: It handles GET requests and responds with a welcome message.
 * 4. Processes POST Requests: It handles POST requests and responds with the request body.
 * 5. Handles Invalid Methods: It responds with a 400 status code for invalid request methods.
 * 6. Exports the Middleware-Applied Handler: Finally, it exports the handler function wrapped with the request verifier middleware.
 */

import { NextApiRequest, NextApiResponse } from "next"; // Import Next.js API types
import applyMiddleware from "../../utils/middleware/applyMiddleware"; // Import the applyMiddleware utility

/**
 * Handles the root API requests.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ message: "Welcome to the root API endpoint." }); // Handle GET requests
  }

  if (req.method === "POST") {
    return res.status(200).json(req.body); // Handle POST requests
  }

  return res.status(400).json({ error: "Bad request." }); // Handle invalid request methods
};

export default applyMiddleware("requestVerifier")(handler); // Export the middleware-applied handler

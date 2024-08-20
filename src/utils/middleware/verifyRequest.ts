import sessionHandler from "../session/sessionHandler"; // Import session handler functions
import shopify from "../shopify/shopifyClient"; // Import configured Shopify client
import { RequestedTokenType, Session } from "@shopify/shopify-api"; // Import necessary types from Shopify API
import validateJWT from "../jwt/jwtValidator"; // Import custom JWT validator
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"; // Import Next.js API types

/**
 * Middleware to verify incoming requests and attach session data.
 *
 * @async
 * @function verifyRequest
 * @param {NextApiRequest} req - The Next.js API request object, expected to have an 'authorization' header.
 * @param {NextApiResponse} res - The Next.js API response object, used to send back error messages if needed.
 * @param {NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 * @throws Will throw an error if the authorization header is missing or invalid, or if no shop is found in the payload.
 */
const verifyRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"]; // Extract authorization header from request
    if (!authHeader) {
      throw new Error("No authorization header found."); // Throw error if authorization header is missing
    }

    const payload = validateJWT(authHeader.split(" ")[1]); // Validate the JWT token from the authorization header

    let shop = shopify.utils.sanitizeShop(
      (payload as unknown as { dest: string }).dest.replace("https://", "")
    ); // Sanitize the shop URL from the payload
    if (!shop) {
      throw new Error("No shop found, not a valid request"); // Throw error if shop is not found
    }

    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    }); // Retrieve the current session ID

    let session = await sessionHandler.loadSession(Number(sessionId)); // Load session data using the session ID
    if (!session) {
      session = await getSession({ shop, authHeader }); // Create a new session if one does not exist
    }

    if (
      session?.expires &&
      new Date(session.expires) > new Date() &&
      shopify.config.scopes?.equals(session.scope)
    ) {
      // Validate session expiration and scope
    } else {
      session = await getSession({ shop, authHeader }); // Refresh the session if it is expired or the scope is invalid
    }

    // Add session and shop to the request object for use in subsequent routes
    (req as any).user_session = session;
    (req as any).user_shop = session?.shop;

    await next(req, res); // Pass control to the next middleware function

    return;
  } catch (e: any) {
    console.error(
      `---> An error happened at verifyRequest middleware: ${e.message}`
    );
    return res.status(401).send({ error: "Unauthorized call" }); // Send error response if an exception occurs
  }
};

export default verifyRequest; // Export the middleware function

/**
 * Retrieves and stores session information based on the provided authentication header and offline flag.
 *
 * @async
 * @function getSession
 * @param {Object} params - The function parameters.
 * @param {string} params.shop - The xxx.myshopify.com URL of the requesting store.
 * @param {string} params.authHeader - The authorization header containing the session token.
 * @returns {Promise<Session>} The online session object
 */
async function getSession({
  shop,
  authHeader,
}: {
  shop: string;
  authHeader: string;
}): Promise<Session | undefined> {
  try {
    const sessionToken = authHeader.split(" ")[1]; // Extract session token from the authorization header

    // Define the userId, you might want to retrieve this from context or another source
    const userId = "defaultUserId"; // Replace with the actual userId logic

    // Exchange the session token for an online access token
    const { session: onlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    await sessionHandler.storeSession(onlineSession, userId); // Store the online session with userId

    // Exchange the session token for an offline access token
    const { session: offlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });

    await sessionHandler.storeSession(offlineSession, userId); // Store the offline session with userId

    return new Session(onlineSession); // Return the online session as a new Session object
  } catch (e: any) {
    console.error(
      `---> Error happened while pulling session from Shopify: ${e.message}`
    ); // Log any errors that occur
  }
}

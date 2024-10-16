/**
 * This file provides functions to create Shopify clients for both online and offline access.
 * It includes methods to fetch sessions, and create GraphQL and REST clients for interacting with the Shopify API.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as session handlers, Shopify client, and Next.js types.
 * 2. Defines Interfaces for Function Parameters: It defines interfaces to ensure type safety for function parameters.
 * 3. Fetches Offline Sessions: It defines a function to fetch offline sessions associated with a shop.
 * 4. Provides Offline Clients: It provides methods to create Shopify GraphQL and REST clients for offline access.
 * 5. Fetches Online Sessions: It defines a function to fetch online sessions associated with a request.
 * 6. Provides Online Clients: It provides methods to create Shopify GraphQL and REST clients for online access.
 * 7. Exports the Client Provider: Finally, it exports the client provider containing methods for both online and offline clients.
 */

import { NextApiRequest, NextApiResponse } from "next"; // Import Next.js API types
import sessionHandler from "../session/sessionHandler"; // Import session handler functions
import shopify from "../shopify/shopifyClient"; // Import configured Shopify client
import { ApiVersion, Session } from "@shopify/shopify-api"; // Import necessary types from Shopify API

// Define interfaces for function parameters to ensure type safety
interface GraphqlClientParams {
  shop: string;
}

interface RestClientParams {
  shop: string;
}

interface FetchOnlineSessionParams {
  req: NextApiRequest;
  res: NextApiResponse;
}

/**
 * Fetches the offline session associated with a shop.
 *
 * @async
 * @function fetchOfflineSession
 * @param {string} shop - The shop's domain.
 * @returns {Promise<Session>} The offline session associated with the shop.
 * @throws Will throw an error if no session is found for the shop.
 */
const fetchOfflineSession = async (shop: string): Promise<Session> => {
  const sessionID = shopify.session.getOfflineId(shop); // Get the offline session ID for the shop

  const session = await sessionHandler.loadSession(Number(sessionID!)); // Load the session using the session handler
  if (!session) {
    console.error(`No session found for shop ${shop}`);
    throw new Error(`No session found for shop ${shop}`); // Throw an error if no session is found
  }

  return session; // Return the session
};

/**
 * Provides methods to create Shopify clients for offline access.
 * @namespace offline
 */
const offline = {
  /**
   * Creates a Shopify GraphQL client for offline access.
   *
   * @async
   * @function graphqlClient
   * @param {GraphqlClientParams} params - The parameters.
   * @returns {Promise<{ client: any; shop: string; session: Session }>} The GraphQL client, shop, and session.
   */
  graphqlClient: async ({ shop }: GraphqlClientParams) => {
    const session = await fetchOfflineSession(shop); // Fetch the offline session for the shop
    const client = new shopify.clients.Graphql({ session }); // Create a GraphQL client with the session

    return { client, shop, session }; // Return the client, shop, and session
  },
  /**
   * Creates a Shopify REST client for offline access.
   *
   * @async
   * @function restClient
   * @param {RestClientParams} params - The parameters.
   * @returns {Promise<{ client: any; shop: string; session: Session }>} The REST client, shop, and session.
   */
  restClient: async ({ shop }: RestClientParams) => {
    const session = await fetchOfflineSession(shop); // Fetch the offline session for the shop
    const client = new shopify.clients.Rest({
      session,
      apiVersion: process.env.SHOPIFY_API_VERSION as ApiVersion | undefined,
    }); // Create a REST client with the session and API version

    return { client, shop, session }; // Return the client, shop, and session
  },
};

/**
 * Fetches the online session associated with a request.
 *
 * @async
 * @function fetchOnlineSession
 * @param {FetchOnlineSessionParams} params - The request and response objects.
 * @returns {Promise<Session>} The online session associated with the request.
 * @throws Will throw an error if no session is found for the request.
 */
const fetchOnlineSession = async ({
  req,
  res,
}: FetchOnlineSessionParams): Promise<Session> => {
  const sessionID = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  }); // Get the current online session ID

  if (!sessionID) {
    console.error(`Invalid session ID`);
    throw new Error(`Invalid session ID`); // Throw an error if no session ID is found
  }

  const session = await sessionHandler.loadSession(Number(sessionID)); // Load the session using the session handler
  if (!session) {
    console.error(`No session found for request`);
    throw new Error(`No session found for request`); // Throw an error if no session is found
  }

  return session; // Return the session
};

/**
 * Provides methods to create Shopify clients for online access.
 * @namespace online
 */
const online = {
  /**
   * Creates a Shopify GraphQL client for online access.
   *
   * @async
   * @function graphqlClient
   * @param {FetchOnlineSessionParams} params - The request and response objects.
   * @returns {Promise<{ client: any; shop: string; session: Session }>} The GraphQL client, shop, and session.
   */
  graphqlClient: async ({ req, res }: FetchOnlineSessionParams) => {
    const session = await fetchOnlineSession({ req, res }); // Fetch the online session for the request
    const client = new shopify.clients.Graphql({ session }); // Create a GraphQL client with the session
    const { shop } = session; // Extract the shop from the session

    return { client, shop, session }; // Return the client, shop, and session
  },
  /**
   * Creates a Shopify REST client for online access.
   *
   * @async
   * @function restClient
   * @param {FetchOnlineSessionParams} params - The request and response objects.
   * @returns {Promise<{ client: any; shop: string; session: Session }>} The REST client, shop, and session.
   */
  restClient: async ({ req, res }: FetchOnlineSessionParams) => {
    const session = await fetchOnlineSession({ req, res }); // Fetch the online session for the request
    const { shop } = session; // Extract the shop from the session
    const client = new shopify.clients.Rest({
      session,
      apiVersion: process.env.SHOPIFY_API_VERSION as ApiVersion | undefined,
    }); // Create a REST client with the session and API version

    return { client, shop, session }; // Return the client, shop, and session
  },
};

/**
 * Provides Shopify client providers for both online and offline access.
 * @namespace clientProvider
 */
const clientProvider = {
  offline,
  online,
};

export default clientProvider; // Export the client provider

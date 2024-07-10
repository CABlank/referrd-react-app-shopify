/**
 * This file defines a function to handle the initial load checking for a Shopify application using Next.js.
 * It verifies and exchanges tokens, stores session data, registers webhooks, and checks for fresh installs.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules such as session handlers, Shopify client, and fresh install checker.
 * 2. Defines Environment Variables: It sets up environment variables for Directus URL and token.
 * 3. Defines Context Interface: It defines a custom interface extending GetServerSidePropsContext to include specific query parameters.
 * 4. Checks Initial Load: It defines an asynchronous function `initialLoadChecker` to handle initial load checking and processing.
 * 5. Token Exchange and Session Handling: It exchanges tokens, stores session data, and registers webhooks.
 * 6. Fresh Install Checking: It checks if the current install is fresh or a reinstall and handles accordingly.
 * 7. Exports the Function: Finally, it exports the `initialLoadChecker` function for use in your application.
 */

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"; // Import Next.js API types
import { RequestedTokenType } from "@shopify/shopify-api"; // Import necessary types from Shopify API
import sessionHandler from "../session/sessionHandler"; // Import session handler functions
import shopify from "../shopify/shopifyClient"; // Import configured Shopify client
import freshInstallChecker from "../install/freshInstallChecker"; // Import fresh install checker function

// Set up environment variables for Directus URL and token
const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "your_directus_token";

// Define a custom interface extending GetServerSidePropsContext to include specific query parameters
interface Context extends GetServerSidePropsContext {
  query: {
    shop?: string;
    id_token?: string;
    [key: string]: string | string[] | undefined;
  };
}

/**
 * Handles initial load checking and processing for a Shopify application.
 *
 * @async
 * @function initialLoadChecker
 * @param {Context} context - The context object containing various parameters.
 * @returns {Promise<GetServerSidePropsResult<{ [key: string]: any }>>} Object with props to be passed to the page component.
 */
const initialLoadChecker = async (
  context: Context
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  try {
    const shop = context.query.shop;
    const idToken = context.query.id_token;

    // Initial Load
    if (idToken && shop) {
      const { session: offlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      });

      const { session: onlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OnlineAccessToken,
      });

      sessionHandler.storeSession(offlineSession);
      sessionHandler.storeSession(onlineSession);

      const webhookRegisterResponse = await shopify.webhooks.register({
        session: offlineSession,
      });

      const isFreshInstallChecker = await fetch(
        `${DIRECTUS_URL}/items/stores`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DIRECTUS_TOKEN}`,
          },
          body: JSON.stringify({
            filter: { shop: onlineSession.shop },
          }),
        }
      ).then((res) => res.json());

      if (
        !isFreshInstallChecker.data.length ||
        isFreshInstallChecker.data[0].isActive === false
      ) {
        // !isFreshInstallChecker.data.length -> New Install
        // isFreshInstallChecker.data[0].isActive === false -> Reinstall
        await freshInstallChecker({ shop: onlineSession.shop });
      }

      console.dir(webhookRegisterResponse, { depth: null });
    } else {
      // The user has visited the page again.
      // We know this because we're not preserving any url params and idToken doesn't exist here
    }
    return {
      props: {
        data: "ok",
      },
    };
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("InvalidJwtError")) {
      console.error(
        "JWT Error - happens in dev mode and can be safely ignored, even in prod."
      );
    } else {
      console.error(
        `---> An error occurred at initialLoadChecker: ${(e as Error).message}`,
        e
      );
      return {
        props: {
          serverError: true,
        },
      };
    }
    return {
      props: {
        data: "ok",
      },
    };
  }
};

export default initialLoadChecker; // Export the function

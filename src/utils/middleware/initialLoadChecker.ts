import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"; // Import Next.js API types
import { RequestedTokenType } from "@shopify/shopify-api"; // Import necessary types from Shopify API
import sessionHandler from "../session/sessionHandler"; // Import session handler functions
import shopify from "../shopify/shopifyClient"; // Import configured Shopify client
import freshInstallChecker from "../install/freshInstallChecker"; // Import fresh install checker function

// Set up environment variables for Directus URL and token
const DIRECTUS_URL = "https://api.referrd.com.au";
const DIRECTUS_TOKEN = "1zXm5k0Ii_wyWEXWxZWG9ZIxzzpTwzZs"; // Set up Directus token environment variable

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

    // Define the userId, you might want to retrieve this from context or another source
    const userId = "defaultUserId"; // Replace with the actual userId logic

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

      await sessionHandler.storeSession(offlineSession, userId); // Provide userId
      await sessionHandler.storeSession(onlineSession, userId); // Provide userId

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

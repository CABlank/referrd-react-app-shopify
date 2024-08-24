import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { logAndReturnError } from "./ErrorModule"; // Importing the error handling module
import { createOrUpdateUser } from "./database/UserDatabaseModule"; // Importing user database operations
import { storeTokensInDatabase } from "./database/TokenDatabaseModule"; // Importing token database operations
import { createOrLoginDirectusUser } from "./directus/DirectusUserModule"; // Importing Directus user handling
import { exchangeTokenWithShopify } from "./shopify/ShopifyModule"; // Importing Shopify token exchange function
import { prisma } from "../../../lib/prisma"; // Importing Prisma client for direct database interaction
import { createCompany, fetchCompanies } from "@/services/company/company";
import shopify from "../../shopify/shopifyClient";
import { RequestedTokenType } from "@shopify/shopify-api";

// Define the context interface for server-side props, which includes potential query parameters.
interface Context extends GetServerSidePropsContext {
  query: {
    shop?: string;
    id_token?: string;
    [key: string]: string | string[] | undefined;
  };
}

// Main function to handle the initial load and session management logic
const initialLoadChecker = async (
  context: Context
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  // Variables to store tokens and session expiration time
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let sessionAccessTokenExpiresAt: string | null = null;

  try {
    // Extract shop and id_token from the query parameters
    const { shop, id_token: idToken } = context.query;

    // Validate the shop parameter; it must end with ".myshopify.com"
    if (!shop || !shop.endsWith(".myshopify.com")) {
      return logAndReturnError("Invalid shop parameter");
    }

    // Redirect to dashboard if no id_token is provided
    if (!idToken) {
      return {
        redirect: {
          destination: `/brand/dashboard?shop=${shop}`,
          permanent: false,
        },
      };
    }

    // Exchange the Shopify session token for an online session using the Shopify API
    const onlineSession = await exchangeTokenWithShopify(shop, idToken);

    console.log;

    // Extract user details from the Shopify session
    const ownerEmail = onlineSession.onlineAccessInfo?.associated_user.email;
    const ownerFirstName =
      onlineSession.onlineAccessInfo?.associated_user.first_name ?? "";
    const ownerLastName =
      onlineSession.onlineAccessInfo?.associated_user.last_name ?? "";
    console.log(onlineSession);
    // Ensure that the email is provided
    if (!ownerEmail) {
      throw new Error("Owner email is required but not found.");
    }

    // Refresh the token
    const tokenExchange = shopify.auth.tokenExchange;

    const { session: offlineSession } = await tokenExchange({
      sessionToken: idToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });
    console.log("New offline session obtained:", offlineSession);

    const ShopifyToken = offlineSession.accessToken as string;

    // Upsert (create or update) the user in the local database
    const user = await createOrUpdateUser(
      ownerEmail,
      ownerFirstName,
      ownerLastName,
      shop
    );
    // If user creation or update fails, log an error and return
    if (!user) {
      return logAndReturnError("Failed to upsert or find the user.");
    }

    const userId = user.id; // Retrieve the user ID after ensuring the user was successfully upserted

    // Check if there is an existing valid token for this user
    const tokenRecord = await prisma.token.findFirst({ where: { userId } });
    const currentTime = new Date();

    // If a valid token exists and the refresh token is present, use it
    if (
      tokenRecord &&
      tokenRecord.expiresAt > currentTime &&
      tokenRecord.refreshToken
    ) {
      accessToken = tokenRecord.accessToken;
      refreshToken = tokenRecord.refreshToken;
    } else {
      // If no valid token exists or the refresh token is empty, perform a Directus login and store new tokens
      const directusTokens = await createOrLoginDirectusUser(
        ownerEmail,
        ownerFirstName,
        ownerLastName,
        ShopifyToken
      );
      accessToken = directusTokens.accessToken;
      refreshToken = directusTokens.refreshToken;

      // Create a new company in the database

      const companyName = shop; // Using the shop domain as the company name
      const domain = shop; // Using the shop domain as the company's domain

      // **Check if the company already exists**
      const existingCompanies = await fetchCompanies(accessToken);
      const companyExists = existingCompanies.some(
        (company) => company.domain === shop
      );

      if (!companyExists) {
        const company = {
          name: companyName,
          domain: domain,
          logo: null, // Assuming no logo is provided at this point
          date_created: new Date(),
          UUID: "", // Using the user's UUID as the company's UUID
        };
        await createCompany(company, accessToken);
        console.log(`Company created: ${shop}`);
      } else {
        console.log(`Company already exists: ${shop}`);
      }

      // Set token expiration time to 1 hour from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Generate a new session access token expiration time (e.g., 1.5 hours from now)
      sessionAccessTokenExpiresAt = new Date(
        Date.now() + 1.5 * 60 * 60 * 1000
      ).toISOString();

      // Store the new tokens in the database
      await storeTokensInDatabase(
        userId,
        accessToken,
        refreshToken,
        expiresAt,
        sessionAccessTokenExpiresAt
      );
    }

    // Return the tokens and user ID as props for further use in the application
    return {
      props: {
        accessToken,
        refreshToken,
        sessionAccessTokenExpiresAt,
        userId,
      },
    };
  } catch (error) {
    const statusCode = (error as any).response?.code;

    // Handle specific error scenarios, such as unauthorized access to Shopify
    if (statusCode === 401) {
      console.error(
        `Unauthorized access when fetching data from Shopify: ${(error as any).response.statusText}`,
        error
      );
    } else {
      console.error(
        `An error occurred at initialLoadChecker: ${error instanceof Error ? error.message : "Unknown error"}`,
        error
      );
    }

    // Log the error and return an appropriate error message
    return logAndReturnError(
      "An error occurred while processing your request.",
      error
    );
  } finally {
    // Ensure the Prisma client is properly disconnected after use
    await prisma.$disconnect();
  }
};

export default initialLoadChecker;

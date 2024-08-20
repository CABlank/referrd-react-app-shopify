import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import jwtValidator from "../jwt/jwtValidator";
import shopify from "../shopify/shopifyClient";
import { PrismaClient } from "@prisma/client";
import { RequestedTokenType } from "@shopify/shopify-api";

const prisma = new PrismaClient();

interface ParsedUrlQuery {
  [key: string]: string | string[] | undefined;
}

interface CustomContext extends GetServerSidePropsContext {
  query: ParsedUrlQuery & {
    shop?: string;
    id_token?: string;
  };
}

interface JwtPayload {
  exp: number;
  [key: string]: any; // Include any additional properties
}

let lastOrderId: string | null = null; // Store the last order ID in memory

// Function to decode and verify the JWT token
const decodeAndVerifyToken = (token: string): JwtPayload => {
  try {
    console.log("Starting JWT validation...");

    const decodedPayload: JwtPayload = jwtValidator(token); // Use the jwtValidator function

    const currentTime = Math.floor(Date.now() / 1000);
    if (!decodedPayload || currentTime > decodedPayload.exp) {
      throw new Error("Token has expired or is invalid");
    }

    console.log("JWT validation successful:", decodedPayload);

    return {
      ...decodedPayload,
      exp: decodedPayload.exp || 0, // Provide a default value for 'exp' if it is missing
    };
  } catch (error) {
    console.error("JWT validation failed:", error);
    throw new Error("Token validation failed");
  }
};

const getUserIdByShopEmail = async (email: string): Promise<number | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    return user ? user.id : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

const getTokensByUserId = async (userId: number) => {
  try {
    const tokens = await prisma.token.findMany({
      where: { userId: userId },
    });
    return tokens;
  } catch (error) {
    console.error("Error fetching tokens for user:", error);
    return [];
  }
};

const sessionLoadCheckerUtil = async (
  context: CustomContext
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  try {
    const { shop, id_token: idToken } = context.query;

    if (!shop) {
      console.log("Missing shop parameter");
      return {
        props: {
          error: "missing_shop",
        },
      };
    }

    if (!idToken) {
      console.log("Missing id_token parameter");
      return {
        props: {
          error: "missing_id_token",
        },
      };
    }

    console.log("Shop:", shop);
    console.log("ID Token:", idToken);

    // Validate and decode the JWT token
    const decodedToken = decodeAndVerifyToken(idToken);

    // Extract any useful information from the decoded token if needed
    // For example: decodedToken.shopDomain or decodedToken.email

    const tokenExchange = shopify.auth.tokenExchange;

    const { session: onlineSession } = await tokenExchange({
      sessionToken: idToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });
    console.log("Online session obtained:", onlineSession);

    // Fetch the shop owner's email using the online session
    const client = new shopify.clients.Graphql({ session: onlineSession });

    const SHOP_QUERY = `{
      shop {
        email
      }
    }`;

    const shopResponse = await client.request(SHOP_QUERY);
    const shopDetails = shopResponse.data;

    if (!shopDetails || !shopDetails.shop || !shopDetails.shop.email) {
      throw new Error("Failed to fetch shop details.");
    }

    const shopEmail = shopDetails.shop.email;
    console.log("Shop owner's email:", shopEmail);

    const userId = await getUserIdByShopEmail(shopEmail);
    let accessToken = null;
    let refreshToken = null;

    if (userId) {
      console.log("User ID:", userId);

      // Fetch and log the tokens
      const tokens = await getTokensByUserId(userId);
      console.log("Tokens for user:", tokens);

      if (tokens.length > 0) {
        accessToken = tokens[0].accessToken;
        refreshToken = tokens[0].refreshToken;
      }
    } else {
      console.log("User ID not found for email:", shopEmail);
    }

    return {
      props: {
        userId, // Pass the user ID as a prop
        accessToken, // Pass the access token as a prop
        refreshToken,
      },
    };
  } catch (error) {
    console.error("An error occurred at sessionLoadCheckerUtil:", error);
    return {
      props: {
        error: "An error occurred",
      },
    };
  }
};

export default sessionLoadCheckerUtil;

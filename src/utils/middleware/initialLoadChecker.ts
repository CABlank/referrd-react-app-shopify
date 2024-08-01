import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import bcrypt from "bcrypt";
import { RequestedTokenType } from "@shopify/shopify-api";
import shopify from "../shopify/shopifyClient";
import prisma from "../database/prismaClient";
import authService from "../../services/auth/auth";
import jwtValidator from "../jwt/jwtValidator";
import sessionLoadChecker from "./sessionLoadChecker"; // Adjust the path as necessary

interface Context extends GetServerSidePropsContext {
  query: {
    shop?: string;
    id_token?: string;
    [key: string]: string | string[] | undefined;
  };
}

interface JwtPayload {
  exp: number;
  [key: string]: any; // Include any additional properties
}

const decodeAndVerifyToken = (token: string): JwtPayload => {
  const decodedPayload = jwtValidator(token) as JwtPayload;
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > decodedPayload.exp) {
    throw new Error("Token has expired");
  }
  return decodedPayload;
};

const upsertSession = async (session: any, shop: string) => {
  if (!session) {
    console.error(`Session is undefined for shop: ${shop}`);
    return;
  }

  try {
    await prisma.session.upsert({
      where: { sessionId: session.id },
      update: { updatedAt: new Date() },
      create: {
        shop: {
          connectOrCreate: {
            where: { domain: shop },
            create: { domain: shop, isActive: true },
          },
        },
        sessionId: session.id,
      },
    });
    console.log(
      `Stored ${session.isOnline ? "online" : "offline"} session for shop:`,
      session.shop
    );
  } catch (error) {
    console.error(
      `Error storing ${session.isOnline ? "online" : "offline"} session:`,
      error
    );
  }
};

const handleError = (message: string, error?: unknown) => {
  if (error instanceof Error) {
    console.error(message, error);
  } else {
    console.error(message);
  }
  return {
    props: {
      serverError: true,
    },
  };
};

const upsertUser = async (
  ownerEmail: string,
  ownerFirstName: string,
  ownerLastName: string
) => {
  try {
    let existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(ownerEmail, 10);
      existingUser = await prisma.user.create({
        data: {
          email: ownerEmail,
          firstName: ownerFirstName,
          lastName: ownerLastName,
          password: hashedPassword,
          directusId: "1637e8a5-22f9-4e1b-b378-97828291ef8a",
        },
      });
      console.log("User created in Prisma.");
    } else {
      await prisma.user.update({
        where: { email: ownerEmail },
        data: {
          firstName: ownerFirstName,
          lastName: ownerLastName,
          updatedAt: new Date(),
        },
      });
      console.log("User details updated in Prisma.");
    }
  } catch (error) {
    return handleError("Error registering user in Prisma:", error);
  }
};

interface DirectusTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

const handleDirectusUser = async (
  ownerEmail: string,
  ownerFirstName: string,
  ownerLastName: string
): Promise<DirectusTokens> => {
  const credentials = { email: ownerEmail, password: ownerEmail };
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  try {
    let directusUser;
    try {
      directusUser = await authService.login(credentials);
      console.log("User already exists in Directus, logging in...");
    } catch (error) {
      directusUser = await authService.createUser({
        email: ownerEmail,
        password: ownerEmail,
        first_name: ownerFirstName,
        last_name: ownerLastName,
      });
      console.log("User created in Directus.");
    }

    const loginData = await authService.login(credentials);
    console.log("User logged in Directus:", loginData);
    accessToken = loginData.data.access_token;
    refreshToken = loginData.data.refresh_token;
  } catch (error) {
    handleError(
      "Error creating user, logging into Directus or storing tokens:",
      error
    );
  }

  return { accessToken, refreshToken };
};

const initialLoadChecker = async (
  context: Context
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  try {
    const { shop, id_token: idToken } = context.query;

    // Check if we are running inside a Shopify app
    if (!shop) {
      console.log("Not a Shopify app, skipping Shopify-specific logic.");
      return {
        props: {
          data: "not_shopify",
        },
      };
    }

    if (!idToken) {
      console.log("Missing idToken, redirecting...");
      return {
        redirect: {
          destination: `/your-error-page?error=missing_id_token`,
          permanent: false,
        },
      };
    }

    console.log("Shop:", shop);
    console.log("ID Token:", idToken);

    const decodedToken = decodeAndVerifyToken(idToken);
    const userId = context.req.cookies?.userId || "some_logic_to_get_user_id";

    if (!userId) {
      throw new Error("User ID is required and could not be determined.");
    }
    console.log("User ID:", userId);

    console.log("Performing token exchange...");

    const tokenExchange = shopify.auth.tokenExchange;

    const { session: offlineSession } = await tokenExchange({
      sessionToken: idToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });
    console.log("Offline session obtained:", offlineSession);

    const { session: onlineSession } = await tokenExchange({
      sessionToken: idToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });
    console.log("Online session obtained:", onlineSession);

    await upsertSession(offlineSession, shop);
    await upsertSession(onlineSession, shop);

    console.log("Fetching shop details to get the owner's email...");
    const client = new shopify.clients.Graphql({ session: onlineSession });

    const QUERY = `{
      shop {
        email
        name
      }
    }`;

    const response = await client.request(QUERY);
    const shopDetails = response.data;

    if (!shopDetails || !shopDetails.shop) {
      throw new Error("Failed to fetch shop details.");
    }

    const { email: ownerEmail, name: ownerName } = shopDetails.shop;
    const [ownerFirstName, ...ownerLastNameParts] = ownerName.split(" ");
    const ownerLastName = ownerLastNameParts.join(" ");

    console.log("Shop owner's email:", ownerEmail);

    await upsertUser(ownerEmail, ownerFirstName, ownerLastName);

    const directusTokens = await handleDirectusUser(
      ownerEmail,
      ownerFirstName,
      ownerLastName
    );
    accessToken = directusTokens.accessToken;
    refreshToken = directusTokens.refreshToken;

    console.log("Obtained Directus Tokens:", { accessToken, refreshToken });

    // Log the tokens before calling sessionLoadChecker
    console.log("Passing tokens to sessionLoadChecker:", {
      accessToken,
      refreshToken,
    });

    // Call sessionLoadChecker with the tokens
    const sessionLoadResult = await sessionLoadChecker({
      ...context,
      query: {
        ...context.query,
        accessToken: accessToken || undefined,
        refreshToken: refreshToken || undefined,
      },
    });

    console.log(
      "Received response from sessionLoadChecker:",
      sessionLoadResult
    );

    return {
      ...sessionLoadResult,
      props: {
        ...("props" in sessionLoadResult ? sessionLoadResult.props : {}),
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    return handleError(
      `An error occurred at initialLoadChecker: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      error
    );
  }
};

export default initialLoadChecker;

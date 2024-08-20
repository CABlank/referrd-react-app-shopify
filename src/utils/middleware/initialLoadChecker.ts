import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import bcrypt from "bcrypt";
import { RequestedTokenType } from "@shopify/shopify-api";
import shopify from "../shopify/shopifyClient";
import { PrismaClient } from "@prisma/client";
import authService from "../../services/auth/auth";
import jwtValidator from "../jwt/jwtValidator";

const prisma = new PrismaClient();

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

// Function to check if session is still valid
const isSessionValid = (session: any) => {
  return (
    session &&
    session.accessToken &&
    (!session.expires || new Date(session.expires) > new Date())
  );
};

const decodeAndVerifyToken = async (
  token: string,
  shop: string
): Promise<JwtPayload> => {
  let decodedPayload: JwtPayload;

  try {
    decodedPayload = jwtValidator(token) as JwtPayload;
  } catch (error) {
    throw new Error("Token validation failed");
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > decodedPayload.exp) {
    console.log("Token has expired, refreshing...");

    // Refresh the token
    const tokenExchange = shopify.auth.tokenExchange;

    const { session: offlineSession } = await tokenExchange({
      sessionToken: token,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });
    console.log("New offline session obtained:", offlineSession);

    const { session: onlineSession } = await tokenExchange({
      sessionToken: token,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });
    console.log("New online session obtained:", onlineSession);

    // Assuming you want to use the online session's token
    if (onlineSession.accessToken) {
      return jwtValidator(onlineSession.accessToken) as JwtPayload;
    } else {
      throw new Error("Access token is undefined");
    }
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
  } as GetServerSidePropsResult<{ [key: string]: any }>;
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

const saveDirectusTokens = async (
  userId: number,
  accessToken: string | null,
  refreshToken: string | null,
  expiresAt: Date
) => {
  try {
    const existingToken = await prisma.token.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingToken) {
      await prisma.token.update({
        where: {
          id: existingToken.id, // Use id to uniquely identify the token record
        },
        data: {
          accessToken: accessToken!,
          refreshToken: refreshToken!,
          expiresAt: expiresAt,
          updatedAt: new Date(),
        },
      });
      console.log("Directus tokens updated in Prisma.");
    } else {
      await prisma.token.create({
        data: {
          userId: userId,
          accessToken: accessToken!,
          refreshToken: refreshToken!,
          expiresAt: expiresAt,
        },
      });
      console.log("Directus tokens saved in Prisma.");
    }
  } catch (error) {
    console.error("Error saving Directus tokens in Prisma:", error);
    throw error;
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

    // Log the incoming query parameters
    console.log("Received query parameters:", context.query);

    // Validate 'shop' parameter
    if (!shop || Array.isArray(shop) || !shop.endsWith(".myshopify.com")) {
      console.error("Invalid or missing 'shop' parameter:", shop);
      return {
        props: {
          serverError: true,
          errorMessage: `Invalid or missing 'shop' parameter: ${shop}`,
        },
      };
    }

    // Validate 'idToken'
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

    // Decode and verify the token, including handling expiration
    const decodedToken = await decodeAndVerifyToken(idToken, shop);

    const userId = context.req.cookies?.userId || "some_logic_to_get_user_id";
    if (!userId) {
      throw new Error("User ID is required and could not be determined.");
    }

    console.log("User ID:", userId);
    console.log("Performing token exchange...");

    // Check if a valid session already exists before performing a token exchange
    const existingOfflineSession = await prisma.session.findFirst({
      where: { sessionId: `offline_${shop}` },
    });
    const existingOnlineSession = await prisma.session.findFirst({
      where: { sessionId: `${shop}_${userId}` },
    });

    let offlineSession, onlineSession;

    if (isSessionValid(existingOfflineSession)) {
      console.log("Using cached offline session.");
      offlineSession = existingOfflineSession;
    } else {
      const tokenExchange = shopify.auth.tokenExchange;
      offlineSession = (
        await tokenExchange({
          sessionToken: idToken,
          shop,
          requestedTokenType: RequestedTokenType.OfflineAccessToken,
        })
      ).session;
      console.log("Offline session obtained:", offlineSession);
      await upsertSession(offlineSession, shop);
    }

    if (isSessionValid(existingOnlineSession)) {
      console.log("Using cached online session.");
      onlineSession = existingOnlineSession;
    } else {
      const tokenExchange = shopify.auth.tokenExchange;
      onlineSession = (
        await tokenExchange({
          sessionToken: idToken,
          shop,
          requestedTokenType: RequestedTokenType.OnlineAccessToken,
        })
      ).session;
      console.log("Online session obtained:", onlineSession);
      await upsertSession(onlineSession, shop);
    }

    // Ensure the online session contains an access token
    if (
      !onlineSession ||
      !("accessToken" in onlineSession) ||
      !onlineSession.accessToken
    ) {
      throw new Error("Online session does not have an access token.");
    }

    console.log("Fetching shop details to get the owner's email...");

    // Use the online session to make an API request
    const client = new shopify.clients.Graphql({ session: onlineSession });

    const QUERY = `{
      shop {
        email
        name
      }
    }`;

    // Execute the GraphQL query
    const response = await client.request(QUERY);
    const shopDetails = response.data;

    if (!shopDetails || !shopDetails.shop) {
      throw new Error("Failed to fetch shop details.");
    }

    const { email: ownerEmail, name: ownerName } = shopDetails.shop;
    const [ownerFirstName, ...ownerLastNameParts] = ownerName.split(" ");
    const ownerLastName = ownerLastNameParts.join(" ");

    console.log("Shop owner's email:", ownerEmail);

    // Upsert user information in the database
    await upsertUser(ownerEmail, ownerFirstName, ownerLastName);

    // Find the user ID to save tokens
    const user = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (!user) {
      throw new Error("User not found after upsertion.");
    }

    const directusTokens = await handleDirectusUser(
      ownerEmail,
      ownerFirstName,
      ownerLastName
    );
    accessToken = directusTokens.accessToken;
    refreshToken = directusTokens.refreshToken;

    console.log("Obtained Directus Tokens:", { accessToken, refreshToken });

    // Save Directus tokens in the database
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Example: tokens expire in 1 hour
    await saveDirectusTokens(user.id, accessToken, refreshToken, expiresAt);

    return {
      props: {
        accessToken,
        refreshToken,
        userId: user.id, // Add userId to props
      },
    };
  } catch (error) {
    if ((error as any).response?.code === 401) {
      console.error(
        `Unauthorized access when fetching data from Shopify: ${(error as any).response.statusText}`,
        (error as any).response
      );
    } else {
      console.error(
        `An error occurred at initialLoadChecker: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        error
      );
    }

    return handleError(
      "An error occurred while processing your request.",
      error
    );
  }
};

export default initialLoadChecker;

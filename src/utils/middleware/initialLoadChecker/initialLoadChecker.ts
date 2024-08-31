import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { logAndReturnError } from "./ErrorModule";
import {
  createUser,
  storeTokensInDatabase,
} from "./database/UserDatabaseModule";
import {
  createDirectusUser,
  loginDirectusUser,
} from "./directus/DirectusUserModule";
import { exchangeTokenWithShopify } from "./shopify/ShopifyModule";
import { prisma } from "../../../lib/prisma";
import { createCompany, fetchCompanies } from "@/services/company/company";
import shopify from "../../shopify/shopifyClient";
import { RequestedTokenType } from "@shopify/shopify-api";
import { updateUserData, fetchUserData } from "@/services/auth/auth";

interface User {
  id: number;
  email: string;
  password: string;
  shopDomain: string | null;
}

interface Context extends GetServerSidePropsContext {
  query: {
    shop?: string;
    id_token?: string;
    [key: string]: string | string[] | undefined;
  };
}

const normalizeShopDomain = (shopDomain: string): string =>
  shopDomain.replace(/\.myshopify\.com$/, "");

const validateShopParameter = (shop?: string): boolean =>
  Boolean(shop && shop.endsWith(".myshopify.com"));

const findExistingUser = async (
  email: string,
  shopDomain: string
): Promise<User | null> =>
  await prisma.user.findFirst({
    where: { email, shopDomain },
  });

const fetchExistingTokens = async (userId: number) => {
  return await prisma.token.findFirst({
    where: { userId },
  });
};

const getValidTokens = async (
  userId: number,
  email: string,
  password: string
) => {
  const tokenRecord = await fetchExistingTokens(userId);
  const currentTime = new Date();

  if (
    tokenRecord &&
    tokenRecord.expiresAt > currentTime &&
    tokenRecord.sessionAccessTokenExpiresAt > currentTime
  ) {
    console.log("Using existing valid tokens.");
    return {
      accessToken: tokenRecord.accessToken,
      refreshToken: tokenRecord.refreshToken,
      sessionAccessTokenExpiresAt: null,
    };
  } else {
    console.log("Tokens are invalid or expired, refreshing tokens.");

    // Fetch the user record from the database to retrieve the latest password
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }, // Only select the password field
    });

    if (!userRecord || !userRecord.password) {
      throw new Error("Failed to retrieve user password from the database.");
    }

    console.log("Retrieved password from database:", userRecord.password);

    // Use the retrieved password for the token refresh process
    return await handleTokenRefresh(email, userRecord.password, userId);
  }
};

const handleTokenRefresh = async (
  email: string,
  password: string,
  userId: number
) => {
  const directusTokens = await loginDirectusUser(email, password);
  const accessToken = directusTokens.accessToken;
  const refreshToken = directusTokens.refreshToken;

  const sessionAccessTokenExpiresAt = new Date(Date.now() + 1.5 * 3600 * 1000);
  await storeTokensInDatabase(
    userId,
    accessToken,
    refreshToken,
    new Date(Date.now() + 5 * 24 * 3600 * 1000),
    sessionAccessTokenExpiresAt
  );

  return { accessToken, refreshToken, sessionAccessTokenExpiresAt };
};

const ensureCompanyExists = async (shop: string, accessToken: string) => {
  const existingCompanies = await fetchCompanies(accessToken);
  console.log("Existing companies:", existingCompanies);

  const companyExists = existingCompanies.some(
    (company) => company.domain === shop
  );

  if (!companyExists) {
    await createCompany(
      {
        name: shop,
        domain: shop,
        logo: null,
        date_created: new Date(),
        UUID: "",
      },
      accessToken
    );
    console.log(`Company created: ${shop}`);
  } else {
    console.log(`Company already exists: ${shop}`);
  }
};

const ensureShopifyTokenExists = async (
  accessToken: string,
  shopifyOfflineToken: string
) => {
  // Fetch the user data based on the access token
  const userData = await fetchUserData(accessToken);
  const existingShopifyToken = userData?.shopifyOfflineToken;

  const TOKEN = process.env.TOKEN as string;

  if (!existingShopifyToken) {
    // If the Shopify token does not exist, update the user data
    await updateUserData(
      TOKEN, // Passing the access token as the Bearer token for the update
      userData.id, // Assuming userData has an ID property for the Directus user ID
      { ShopifyToken: shopifyOfflineToken } // Object containing the new Shopify token to be updated
    );
    console.log(`Shopify Token created for user ID: ${userData}`);
  } else {
    console.log(`Shopify Token already exists for user ID: ${userData}`);
  }
};

const processExistingUser = async (
  existingUser: User,
  shop: string,
  normalizedShopDomain: string
) => {
  console.log(
    `User already exists with email: ${existingUser.email} for shop domain: ${shop}. No need to create a new user.`
  );

  return await getValidTokens(
    existingUser.id,
    existingUser.email,
    existingUser.password
  );
};

const processNewUser = async (
  ownerEmail: string,
  ownerFirstName: string,
  ownerLastName: string,
  shop: string
): Promise<{ user: User }> => {
  const emailToUse = generateUniqueEmail(ownerEmail, shop);

  // Check if the user already exists
  let existingUser = await findExistingUser(emailToUse, shop);

  if (existingUser) {
    console.log("User already exists. Using existing user.");
    return {
      user: existingUser,
    };
  }

  const newUser = await createUser(
    emailToUse,
    ownerFirstName,
    ownerLastName,
    shop
  );

  if (!newUser) {
    throw new Error("Failed to create the user.");
  }

  // Log the password before creating the user in Directus
  console.log(`Creating Directus user with the following details:
    Email: ${emailToUse}
    First Name: ${ownerFirstName}
    Last Name: ${ownerLastName}
    Hashed Password: ${newUser.hashedPassword}`);

  // Create the user in Directus with the hashed password
  await createDirectusUser(
    emailToUse,
    ownerFirstName,
    ownerLastName,
    newUser.hashedPassword
  );

  // Return the newly created user object
  return {
    user: {
      ...newUser,
      password: "", // Add the password property
    },
  };
};

const generateUniqueEmail = (email: string, shop: string): string => {
  const [localPart, domainPart] = email.split("@");
  return `${localPart}+${shop}@${domainPart}`;
};

const obtainShopifyOfflineToken = async (idToken: string, shop: string) => {
  const { session: offlineSession } = await shopify.auth.tokenExchange({
    sessionToken: idToken,
    shop,
    requestedTokenType: RequestedTokenType.OfflineAccessToken,
  });

  console.log("New offline session obtained:", offlineSession);

  return offlineSession.accessToken as string;
};

const initialLoadChecker = async (
  context: Context
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let sessionAccessTokenExpiresAt: Date | null = null;
  let user: User | null = null;

  try {
    const shop = context.query.shop as string;
    const idToken = context.query.id_token as string;

    if (!validateShopParameter(shop)) {
      return logAndReturnError("Invalid shop parameter");
    }

    if (!idToken) {
      return {
        redirect: {
          destination: `/brand/dashboard?shop=${shop}`,
          permanent: false,
        },
      };
    }

    const onlineSession = await exchangeTokenWithShopify(shop, idToken);
    const ownerEmail = onlineSession.onlineAccessInfo?.associated_user.email;

    if (!ownerEmail) {
      throw new Error("Owner email is required but not found.");
    }

    const ownerFirstName =
      onlineSession.onlineAccessInfo?.associated_user.first_name ?? "";
    const ownerLastName =
      onlineSession.onlineAccessInfo?.associated_user.last_name ?? "";

    const normalizedShopDomain = normalizeShopDomain(shop);

    // Normalize the owner email to match the format used for user creation
    const normalizedOwnerEmail = generateUniqueEmail(ownerEmail, shop);

    user = await findExistingUser(normalizedOwnerEmail, normalizedShopDomain);
    console.log(
      "User already exists with email:",
      user?.email,
      " for shop domain: ",
      shop,
      " . No need to create a new user."
    );
    console.log("User ID:", user?.id);

    if (
      user &&
      user.email === normalizedOwnerEmail &&
      user.shopDomain === normalizedShopDomain
    ) {
      // Process existing user without attempting to refetch unnecessarily
      ({ accessToken, refreshToken, sessionAccessTokenExpiresAt } =
        await processExistingUser(user, shop, normalizedShopDomain));
    } else {
      const newUserResult = await processNewUser(
        ownerEmail,
        ownerFirstName,
        ownerLastName,
        shop
      );

      user = newUserResult.user;

      ({ accessToken, refreshToken, sessionAccessTokenExpiresAt } =
        await processExistingUser(user, shop, normalizedShopDomain));
    }

    console.log("accestoken", accessToken);

    await ensureCompanyExists(shop, accessToken);
    const shopifyOfflineToken = await obtainShopifyOfflineToken(idToken, shop);

    console.log("shopifyOfflineToken", shopifyOfflineToken);

    await ensureShopifyTokenExists(accessToken, shopifyOfflineToken);

    return {
      props: {
        accessToken,
        refreshToken,
        sessionAccessTokenExpiresAt:
          sessionAccessTokenExpiresAt?.toISOString() || null,
        userId: user.id,
        shopifyOfflineToken,
      },
    };
  } catch (error) {
    const statusCode = (error as any).response?.code;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (statusCode === 401) {
      console.error(
        `Unauthorized access when fetching data from Shopify: ${(error as any).response.statusText}`,
        error
      );
    } else {
      console.error(
        `An error occurred at initialLoadChecker: ${errorMessage}`,
        error
      );
    }

    return logAndReturnError(
      "An error occurred while processing your request.",
      error
    );
  } finally {
    await prisma.$disconnect();
  }
};

export default initialLoadChecker;

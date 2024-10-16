/**
 * This file handles session management for your Shopify application.
 * It provides functions to store, load, and delete session data in a Directus database.
 * This ensures that session data is securely managed and easily retrievable.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports the required modules from the @shopify/shopify-api package and your custom cryption handler.
 * 2. Extracts and Validates Environment Variables: It retrieves essential environment variables needed for Directus API configuration and validates their presence.
 * 3. Encrypts Session Data: It uses a custom cryption module to encrypt session data before storing it.
 * 4. Stores Session Data: It defines a function to store session data into the Directus database.
 * 5. Loads Session Data: It defines a function to load session data from the Directus database.
 * 6. Deletes Session Data: It defines a function to delete session data from the Directus database.
 * 7. Exports Session Handler: Finally, it exports the session handler functions so they can be used throughout your application.
 */

import { Session } from "@shopify/shopify-api";
import { encrypt, decrypt } from "../security/encryption";
import fetch from "node-fetch";

import { getTokensFromShopify } from "../shopify/shopifyClient"; // Importing getTokensFromShopify

const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://api.referrd.com.au";
const DIRECTUS_TOKEN =
  process.env.DIRECTUS_TOKEN || "po4uje7gIaooHBbh7EAncPd2aBSH5wwL";

// Function to get shop owner's email from Shopify API
const getShopOwnerEmail = async (
  shop: string,
  accessToken: string
): Promise<string> => {

  const response = await fetch(`https://${shop}/admin/api/2023-07/shop.json`, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch shop details from Shopify: ${errorText}`);
  }

  const shopData: any = await response.json();
  return shopData.shop.email;
};

const storeSession = async (
  session: Session,
  authCode: string // Accepting authCode as a parameter to use it in getTokensFromShopify
): Promise<number | null> => {
  try {

    // Retrieve the access token using the auth code
    const tokens = await getTokensFromShopify(session.shop, authCode);

    const email = await getShopOwnerEmail(session.shop, tokens.accessToken); // Fetch the shop owner's email

    const encryptedContent = encrypt(JSON.stringify(session));

    const response = await fetch(`${DIRECTUS_URL}/items/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify({
        content: encryptedContent,
        shop: session.shop,
        is_active: "true",
        email: email, // Using the shop owner's email
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to store the session in Directus: ${errorText}`);
    }

    const responseData: any = await response.json();
    const sessionId = responseData.data.id;
    return sessionId;
  } catch (error) {
    console.error(`Error storing session: ${error}`);
    return null;
  }
};

const loadSession = async (id: number): Promise<Session | undefined> => {
  try {

    const response = await fetch(`${DIRECTUS_URL}/items/sessions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load the session from Directus: ${errorText}`);
    }

    const sessionResult: any = await response.json();

    if (!sessionResult.data.content) {
      return undefined;
    }

    const decryptedContent = decrypt(sessionResult.data.content);

    if (decryptedContent) {
      const sessionObj = JSON.parse(decryptedContent);
      return new Session(sessionObj);
    }

    return undefined;
  } catch (error) {
    console.error(`Error loading session: ${error}`);
    return undefined;
  }
};

const deleteSession = async (id: number): Promise<boolean> => {
  try {

    const response = await fetch(`${DIRECTUS_URL}/items/sessions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete the session from Directus: ${errorText}`
      );
    }

    return true;
  } catch (error) {
    console.error(`Error deleting session: ${error}`);
    return false;
  }
};

const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;

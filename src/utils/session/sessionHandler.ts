/**
 * This file handles session management for your Shopify application.
 * It provides functions to store, load, and delete session data in a Directus database.
 * This ensures that session data is securely managed and easily retrievable.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports the required modules from the @shopify/shopify-api package and your custom encryption handler.
 * 2. Extracts and Validates Environment Variables: It retrieves essential environment variables needed for Directus API configuration and validates their presence.
 * 3. Encrypts Session Data: It uses a custom encryption module to encrypt session data before storing it.
 * 4. Stores Session Data: It defines a function to store session data into the Directus database.
 * 5. Loads Session Data: It defines a function to load session data from the Directus database.
 * 6. Deletes Session Data: It defines a function to delete session data from the Directus database.
 * 7. Exports Session Handler: Finally, it exports the session handler functions so they can be used throughout your application.
 */

import { Session } from "@shopify/shopify-api"; // Import the Session object from Shopify API
import encryption from "../security/encryption"; // Import custom encryption module
import fetch from "node-fetch"; // Import fetch for API calls

// Extract necessary environment variables with default values for Directus URL and token
const DIRECTUS_URL = "https://api.referrd.com.au";
const DIRECTUS_TOKEN = "1zXm5k0Ii_wyWEXWxZWG9ZIxzzpTwzZs"; // Set up Directus token environment variable

/**
 * Stores the session data into the Directus database.
 *
 * @param {Session} session - The Shopify session object to be stored.
 * @param {string} userId - The ID of the user associated with the session.
 * @returns {Promise<boolean>} - Returns true if the operation was successful, otherwise returns false.
 */
const storeSession = async (
  session: Session,
  userId: string
): Promise<boolean> => {
  try {
    // Encrypt the session data to ensure security
    const encryptedContent = encryption.encrypt(JSON.stringify(session));

    // Send a POST request to Directus to upsert (update or insert) the session data
    const response = await fetch(
      `${DIRECTUS_URL}/items/shopify_sessions/upsert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
          Authorization: `Bearer ${DIRECTUS_TOKEN}`, // Use Directus token for authorization
        },
        body: JSON.stringify({
          filter: { id: session.id }, // Filter to check if session exists
          update: {
            content: encryptedContent, // Encrypted session data
            shop: session.shop, // Associated shop information
            user_id: userId, // Associated user ID
          },
          create: {
            id: session.id, // Session ID
            content: encryptedContent, // Encrypted session data
            shop: session.shop, // Associated shop information
            user_id: userId, // Associated user ID
          },
        }),
      }
    );

    // Check if the response is not OK and throw an error
    if (!response.ok) {
      throw new Error("Failed to store the session in Directus");
    }

    return true; // Return true if the session is successfully stored
  } catch (error) {
    console.error(`Error storing session: ${error}`);
    return false; // Return false if there was an error
  }
};

/**
 * Loads the session data from the Directus database.
 *
 * @param {string} id - The session ID to be loaded.
 * @returns {Promise<Session | undefined>} - Returns the Shopify session object or undefined if not found.
 */
const loadSession = async (id: string): Promise<Session | undefined> => {
  try {
    // Send a GET request to Directus to retrieve the session data
    const response = await fetch(`${DIRECTUS_URL}/items/shopify_sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
        Authorization: `Bearer ${DIRECTUS_TOKEN}`, // Use Directus token for authorization
      },
      body: JSON.stringify({
        filter: { id }, // Filter to retrieve session by ID
      }),
    });

    // Check if the response is not OK and throw an error
    if (!response.ok) {
      throw new Error("Failed to load the session from Directus");
    }

    // Parse the response JSON data
    const sessionResult: { data: { content: string }[] } =
      (await response.json()) as { data: { content: string }[] };

    // Return undefined if no session data is found
    if (!sessionResult.data.length || !sessionResult.data[0].content) {
      return undefined;
    }

    // Decrypt the session content
    const decryptedContent = encryption.decrypt(sessionResult.data[0].content);
    if (decryptedContent) {
      // Parse the decrypted content into a session object and return it
      const sessionObj = JSON.parse(decryptedContent);
      return new Session(sessionObj);
    }

    return undefined; // Return undefined if decryption fails
  } catch (error) {
    console.error(`Error loading session: ${error}`);
    return undefined; // Return undefined if there was an error
  }
};

/**
 * Deletes the session data from the Directus database.
 *
 * @param {string} id - The session ID to be deleted.
 * @returns {Promise<boolean>} - Returns true if the operation was successful, otherwise returns false.
 */
const deleteSession = async (id: string): Promise<boolean> => {
  try {
    // Send a DELETE request to Directus to remove the session data
    const response = await fetch(`${DIRECTUS_URL}/items/shopify_sessions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
        Authorization: `Bearer ${DIRECTUS_TOKEN}`, // Use Directus token for authorization
      },
      body: JSON.stringify({
        filter: { id }, // Filter to delete session by ID
      }),
    });

    // Check if the response is not OK and throw an error
    if (!response.ok) {
      throw new Error("Failed to delete the session from Directus");
    }

    return true; // Return true if the session is successfully deleted
  } catch (error) {
    console.error(`Error deleting session: ${error}`);
    return false; // Return false if there was an error
  }
};

/**
 * Session handler object containing storeSession, loadSession, and deleteSession functions.
 */
const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;

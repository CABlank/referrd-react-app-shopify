/**
 * This file defines a function to handle fresh installations for a Shopify application.
 * It ensures that the shop is properly set up in the Directus database by upserting the store information.
 *
 * What This File Does:
 * 1. Defines Environment Variables: It sets up environment variables for Directus URL and token.
 * 2. Defines Interface for Function Parameters: It defines an interface for the function parameters to ensure type safety.
 * 3. Handles Fresh Installations: It defines an asynchronous function `freshInstallChecker` to handle the fresh installation process.
 * 4. Upserts Store Information: It upserts the store information in the Directus database, ensuring the shop is marked as active.
 * 5. Exports the Function: Finally, it exports the `freshInstallChecker` function for use in your application.
 */

import fetch from "node-fetch";
const DIRECTUS_URL = "https://api.referrd.com.au"; // Set up Directus URL environment variable
const DIRECTUS_TOKEN = "1zXm5k0Ii_wyWEXWxZWG9ZIxzzpTwzZs"; // Set up Directus token environment variable

// Define an interface for the function parameters to ensure type safety
interface FreshInstallCheckerParams {
  shop: string;
}

/**
 * Creates a new user in the Directus database.
 *
 * @async
 * @function createUser
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string>} The ID of the created user.
 * @throws {Error} If the user creation fails.
 */
const createUser = async (email: string, password: string): Promise<string> => {
  const response = await fetch(`${DIRECTUS_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: JSON.stringify({
      email: email,
      password: password,
      role: "brand", // Ensure this matches the correct role ID or key
      status: "active",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create the user in Directus");
  }

  const userData: any = await response.json();
  return userData.data.id;
};

/**
 * Handles fresh installations by upserting store information in the Directus database.
 *
 * @async
 * @function freshInstallChecker
 * @param {FreshInstallCheckerParams} params - The function parameters container.
 * @param {string} params.shop - The shop URL in the format '*.myshopify.com'.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 */
const freshInstallChecker = async ({
  shop,
}: FreshInstallCheckerParams): Promise<void> => {
  try {
    console.log("This is a fresh install, running onboarding functions");

    // Generate a unique email and password for the new user
    const email = `${shop.replace(".myshopify.com", "")}@example.com`;
    const password = Math.random().toString(36).slice(-8); // Generate a random password

    // Create the user
    const userId = await createUser(email, password);

    // Upsert the store and session information
    const response = await fetch(
      `${DIRECTUS_URL}/items/shopify_sessions/upsert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify({
          filter: { shop },
          update: { is_active: true, user_id: userId },
          create: { shop, is_active: true, user_id: userId },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upsert the store in Directus");
    }

    console.log(`Successfully upserted store for shop: ${shop}`);
  } catch (e: any) {
    console.error(
      `An error occurred in freshInstallChecker function: ${e.message}`,
      e
    );
  }
};

export default freshInstallChecker;

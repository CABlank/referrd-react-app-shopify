/**
 * This file defines a handler function for the APP_UNINSTALLED webhook.
 * It performs necessary database operations to clean up data when an app is uninstalled from a Shopify store.
 *
 * What This File Does:
 * 1. Defines Environment Variables: It sets up environment variables for Directus URL and token.
 * 2. Imports Necessary Types: It imports the APP_UNINSTALLED type.
 * 3. Defines the App Uninstall Handler Function: It defines an asynchronous function to handle the APP_UNINSTALLED webhook.
 * 4. Validates Webhook Topic: It checks if the webhook topic is "APP_UNINSTALLED".
 * 5. Performs Database Operations: It deletes session data and updates store status in the Directus database.
 * 6. Logs Success and Errors: It logs success and error messages for debugging purposes.
 * 7. Exports the Handler Function: Finally, it exports the `appUninstallHandler` function for use in the application.
 */

import { APP_UNINSTALLED } from "../../_developer/types/2023-10/webhooks"; // Import the APP_UNINSTALLED type

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055"; // Set up Directus URL environment variable
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "your_directus_token"; // Set up Directus token environment variable

/**
 * Handler function for the APP_UNINSTALLED webhook.
 *
 * @async
 * @function appUninstallHandler
 * @param {string} topic - The webhook topic.
 * @param {string} shop - The shop domain.
 * @param {string} webhookRequestBody - The webhook request body.
 * @returns {Promise<void>} A promise that resolves when the handler completes.
 */
const appUninstallHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string
): Promise<void> => {
  if (topic !== "APP_UNINSTALLED") {
    console.error(`Unexpected topic: ${topic}`);
    return;
  }

  try {
    // Ensure the request body is a valid APP_UNINSTALLED type
    JSON.parse(webhookRequestBody) as APP_UNINSTALLED;

    // Perform database operations
    const sessionDeleteResponse = await fetch(
      `${DIRECTUS_URL}/items/sessions`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify({ filter: { shop } }),
      }
    );

    const storeUpsertResponse = await fetch(
      `${DIRECTUS_URL}/items/stores/upsert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify({
          filter: { shop },
          update: { isActive: false },
          create: { shop, isActive: false },
        }),
      }
    );

    if (!sessionDeleteResponse.ok || !storeUpsertResponse.ok) {
      throw new Error("Failed to perform database operations");
    }

    console.log(`Successfully handled APP_UNINSTALLED for shop: ${shop}`);
  } catch (error) {
    // Improved error logging
    console.error(`Error handling APP_UNINSTALLED for shop: ${shop}`);
    console.error(`Webhook Request Body: ${webhookRequestBody}`);
    console.error(`Error: ${(error as Error).message}`);
  }
};

export default appUninstallHandler; // Export the handler function

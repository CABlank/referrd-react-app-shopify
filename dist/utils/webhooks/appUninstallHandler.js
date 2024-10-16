"use strict";
/*import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import { APP_UNINSTALLED } from "../../_developer/types/2023-10/webhooks"; // Import the APP_UNINSTALLED type

const prisma = new PrismaClient();

const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://api.referrd.com.au";
const DIRECTUS_TOKEN =
  process.env.DIRECTUS_TOKEN || "1zXm5k0Ii_wyWEXWxZWG9ZIxzzpTwzZs"; // Ensure Directus token is set in environment variables

/**
 * Handler function for the APP_UNINSTALLED webhook.
 *
 * @async
 * @function appUninstallHandler
 * @param {string} topic - The webhook topic.
 * @param {string} shop - The shop domain.
 * @param {string} webhookRequestBody - The webhook request body.
 * @returns {Promise<void>} A promise that resolves when the handler completes.
 */ /*
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

   // Perform database operations in Prisma
   const shopRecord = await prisma.shop.findUnique({
     where: { domain: shop },
   });

   if (shopRecord) {
     // Delete all related sessions
     await prisma.session.deleteMany({
       where: { shopId: shopRecord.id },
     });

     // Mark the store as inactive
     await prisma.shop.update({
       where: { domain: shop },
       data: { isActive: false },
     });
   }

   // Perform database operations in Directus
   const sessionDeleteResponse = await fetch(
     `${DIRECTUS_URL}/items/shopify_sessions`,
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
     `${DIRECTUS_URL}/items/shopify_sessions/upsert`,
     {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${DIRECTUS_TOKEN}`,
       },
       body: JSON.stringify({
         filter: { shop },
         update: { is_active: false },
         create: { shop, is_active: false },
       }),
     }
   );

   if (!sessionDeleteResponse.ok || !storeUpsertResponse.ok) {
     throw new Error("Failed to perform database operations in Directus");
   }

   console.log(`Successfully handled APP_UNINSTALLED for shop: ${shop}`);
 } catch (error: any) {
   // Improved error logging
   console.error(`Error handling APP_UNINSTALLED for shop: ${shop}`);
   console.error(`Webhook Request Body: ${webhookRequestBody}`);
   console.error(`Error: ${error.message}`);
 }
};

export default appUninstallHandler;
*/

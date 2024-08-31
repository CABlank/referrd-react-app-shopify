// pages/api/shopify/webhooks/orders-create.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createPayment } from "../../../../services/payments/payments";

// Define types for the data structures
interface LineItem {
  productName: string;
  quantity: number;
  price: string;
}

interface ImportantInfo {
  orderNumber: string;
  customerEmail: string;
  totalPrice: string;
  totalDiscounts: string;
  lineItems: LineItem[];
  discountsApplied: string | Array<{ code: string }>;
  referralUUID: string | null;
  status: string;
  campaign_uuid?: string;
  company_id?: string;
}

// Customer data type retrieved from the Directus API
interface CustomerData {
  conversion_count: number;
  id: any;
  campaign_uuid: string;
  company_id: string;
}

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.referrd.com.au";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Parse the body of the request to get the order data
      const orderData = req.body;

      // Extract important information from the order
      const importantInfo: ImportantInfo = {
        orderNumber: orderData.order_number,
        customerEmail: orderData.contact_email,
        totalPrice: orderData.current_total_price_set.shop_money.amount,
        totalDiscounts: orderData.current_total_discounts_set.shop_money.amount,
        lineItems: orderData.line_items.map((item: any) => ({
          productName: item.name,
          quantity: item.quantity,
          price: item.price_set.shop_money.amount,
        })),
        discountsApplied:
          orderData.discount_codes.length > 0
            ? orderData.discount_codes
            : "None",
        referralUUID: orderData.note
          ? orderData.note.match(/Referral UUID: ([\w-]+)/)?.[1]
          : null,
        status: "Pending",
      };

      // Log the important information to the console
      console.log(
        "Important Order Information:",
        JSON.stringify(importantInfo, null, 2)
      );

      let campaignUUID: string | null = null;
      let companyID: string | null = null;

      // If referralUUID exists, fetch the campaign ID and company ID
      if (importantInfo.referralUUID) {
        try {
          const customerResponse = await axios.get<{ data: CustomerData[] }>(
            `${API_URL}/items/customers?filter[uuid][_eq]=${importantInfo.referralUUID}`,
            {
              headers: {
                Authorization: `Bearer ${BOT_TOKEN}`,
              },
            }
          );
          console.log("Customer response:", customerResponse.data);
          const customerData = customerResponse.data.data[0];
          if (customerData) {
            campaignUUID = customerData.campaign_uuid;
            companyID = customerData.company_id;

            // Patch request to increment the conversion count
            const newConversionCount = customerData.conversion_count + 1;
            await axios.patch(
              `${API_URL}/items/customers/${customerData.id}`,
              { conversion_count: newConversionCount },
              {
                headers: {
                  Authorization: `Bearer ${BOT_TOKEN}`,
                },
              }
            );
            console.log(
              `Successfully updated conversion count to ${newConversionCount} for customer ID ${customerData.id}`
            );
          }
        } catch (error) {
          console.error("Error fetching or updating customer data:", error);
        }
      }

      // Create the payment record in Directus with the fetched campaignUUID and companyID
      const paymentInfo = {
        ...importantInfo,
        campaign_uuid: campaignUUID || "default-campaign-uuid", // Replace with a default or handle accordingly
        company_id: companyID || "default-company-id", // Replace with a default or handle accordingly
      };

      const payment = await createPayment(
        {
          order_number: paymentInfo.orderNumber.toString(),
          customer_email: paymentInfo.customerEmail,
          total_price: paymentInfo.totalPrice,
          total_discounts: paymentInfo.totalDiscounts,
          line_items: paymentInfo.lineItems,
          discounts_applied: paymentInfo.discountsApplied,
          referral_uuid: paymentInfo.referralUUID || undefined, // Change 'null' to 'undefined'
          status: paymentInfo.status,
          campaign_uuid: paymentInfo.campaign_uuid,
          company_id: paymentInfo.company_id,
          date_created: "",
        },
        BOT_TOKEN
      );

      if (payment) {
        console.log("Payment item created in Directus:", payment);
      } else {
        console.error("Failed to create payment in Directus.");
      }

      // Respond to Shopify with a 200 status to acknowledge receipt
      return res.status(200).send("Webhook processed");
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  // If the request method is not POST, respond with a 404 status
  res.status(404).send("Not found");
}

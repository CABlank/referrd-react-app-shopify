import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createPayment } from "../../../../services/payments/payments";
import { fetchCompanies } from "../../../../services/company/company";
import { fetchCampaignMetadata } from "../../../../services/campaign/campaign";
import { extend } from "lodash";

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
  company_id?: string | string[] | null;
}

interface CompanyCampaignTracker {
  companies: Array<{
    company_id: string;
    campaigns: Array<{
      campaign_id: string;
      discount_code: string | null;
    }>;
  }>;
}

// Customer data type retrieved from the Directus API
interface CustomerData {
  conversion_count: number;
  id: any;
  company_campaign_tracker: CompanyCampaignTracker;
}

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.referrd.com.au";

// Helper function to extract domain from a URL
const extractDomainFromUrl = (url: string): string | null => {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname; // Extract the domain (hostname) from the URL
  } catch (error) {
    console.error("Error extracting domain from URL:", error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Parse the body of the request to get the order data
      const orderData = req.body;

      // Extract the domain from the order_status_url
      const orderStatusUrl = orderData.order_status_url;
      const orderDomain = extractDomainFromUrl(orderStatusUrl);

      if (!orderDomain) {
        console.error("No valid domain could be extracted from the order_status_url.");
        return res.status(400).json({ error: "Invalid domain in order URL" });
      }

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

      // Fetch all companies
      const companies = await fetchCompanies(BOT_TOKEN);

      // Find the matching company based on the extracted domain
      const matchedCompany = companies.find(
        (company) => company.domain === orderDomain
      );

      if (!matchedCompany) {
        console.error("No matching company found for the extracted domain:", orderDomain);
        return res.status(404).json({ error: "No matching company found for the domain" });
      }

      // Fetch campaign metadata for the matched company
      const campaignMetadata = await fetchCampaignMetadata(BOT_TOKEN);

      // Find the live campaign associated with the matched company
      const liveCampaign = campaignMetadata.find(
        (campaign) =>
          campaign.company_id === matchedCompany.UUID && campaign.status === "Live"
      );

      if (!liveCampaign) {
        console.error("No live campaign found for the matched company.");
        return res.status(404).json({ error: "No live campaign found for the company" });
      }

      let campaignUUID: string | null = liveCampaign?.campaign_uuid || null;
      let companyID: string | null = matchedCompany ? matchedCompany.UUID : null;

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
          const customerData = customerResponse.data.data[0];
          if (customerData) {
            // Check if the customer data contains a valid company-campaign relationship
            const { companies } = customerData.company_campaign_tracker;

            let matchFound = false;
            for (const company of companies) {
              if (company.company_id === companyID) {
                const matchingCampaign = company.campaigns.find(
                  (campaign) => campaign.campaign_id === campaignUUID
                );
                if (matchingCampaign) {
                  matchFound = true;
                  break;
                }
              }
            }

            if (!matchFound) {
              console.error("No valid match found between the customer's company and campaign.");
              return res
                .status(400)
                .json({ error: "Invalid company or campaign for the customer." });
            }

            // Increment conversion count for the customer
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
          }
        } catch (error) {
          console.error("Error fetching or updating customer data:", error);
        }
      }

      // Step 1: Calculate the commission based on commissionType (Fix or Percentage)
      let commissionAmount: number;

      if (liveCampaign.commissionType === "Fix") {
        // Log the fixed commission calculation process

        commissionAmount = typeof liveCampaign.commission === 'number' ? liveCampaign.commission : 0;

        if (commissionAmount === 0) {
          console.warn(`[Commission Calculation] Invalid commission value. Defaulting to 0.`);
        }

      } else if (liveCampaign.commissionType === "Percentage") {
        // Log the percentage commission calculation process

        commissionAmount = (typeof liveCampaign.commission === 'number' ? liveCampaign.commission : 0) / 100 * parseFloat(importantInfo.totalPrice);

        if (isNaN(commissionAmount) || commissionAmount === 0) {
        }

      } else {
        console.error(`[Commission Calculation] Unsupported commission type: ${liveCampaign.commissionType}`);
        throw new Error("Unsupported commission type");
      }

      // Step 2: Calculate the 15% fee on the commission
      const ownerFee = commissionAmount * 0.15;



      // Total deduction: commission + owner's fee
      const totalDeduction = commissionAmount + ownerFee;



      // Step 3: Check if the campaign has enough funds to handle the deduction
      if (liveCampaign.amountFunded === undefined || liveCampaign.amountFunded < totalDeduction) {
        console.error(`[Insufficient Funds] Campaign ID: ${liveCampaign.id}. Available Funds: ${liveCampaign.amountFunded}, Required: ${totalDeduction}`);
        return res.status(400).json({ error: "Insufficient campaign funds" });
      }

      // Step 4: Deduct the total from the campaign's amountFunded
      const updatedAmountFunded = liveCampaign.amountFunded - totalDeduction;


      try {

        // PATCH request to update campaign's amountFunded
        const responseCampaign = await axios.patch(
          `${API_URL}/items/campaigns/${liveCampaign.id}`,
          { amountFunded: updatedAmountFunded },
          {
            headers: {
              Authorization: `Bearer ${BOT_TOKEN}`,
            },
          }
        );

        // PATCH request to update campaign_metadata (if applicable)
        const responseMetadata = await axios.patch(
          `${API_URL}/items/campaign_metadata/${liveCampaign.id}`,
          { amountFunded: updatedAmountFunded },
          {
            headers: {
              Authorization: `Bearer ${BOT_TOKEN}`,
            },
          }
        );

        // PATCH request to update campaign_public_page (if applicable)
        const responsePublicPage = await axios.patch(
          `${API_URL}/items/campaign_public_page/${liveCampaign.id}`,
          { amountFunded: updatedAmountFunded },
          {
            headers: {
              Authorization: `Bearer ${BOT_TOKEN}`,
            },
          }
        );


      } catch (error) {
        // Log any error that occurs during the patch request
        console.error(`[API Error] Failed to update campaign funds. Campaign ID: ${liveCampaign.id}. Error:`, error);

        // Return a 500 error response if the API request fails
        return res.status(500).json({ error: "Failed to update campaign funds" });
      }


      // Create the payment record in Directus with the fetched campaignUUID and companyID
      const paymentInfo = {
        ...importantInfo,
        campaign_uuid: campaignUUID || "default-campaign-uuid", // Replace with a default or handle accordingly
        company_id: matchedCompany.UUID || "default-company-id", // Use matchedCompany UUID directly
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

      if (!payment) {
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

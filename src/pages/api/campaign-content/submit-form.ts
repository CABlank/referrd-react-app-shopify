import type { NextApiRequest, NextApiResponse } from "next";
import { lookupGeoData } from "../../../lib/geoip";
import { fetchCompanyUrls } from "../../../services/company/company";
import {
  fetchCustomerByUUID,
  registerSignup,
  createCustomer,
  updateReferralDiscountCode,
} from "../../../services/referrals/referralTracking";
import { handleCors } from "./handlers/handle-cors";
import { createDirectusCustomer } from "../../../services/customers/customers";
import axios from "axios";

const BOT_TOKEN = process.env.BOT_TOKEN || "";

// Utility function to extract the hostname from a URL
function extractHostname(url: string): string {
  return new URL(url).hostname;
}

type ApiResponse = {
  success: boolean;
  message?: string;
  generatedUrl?: string;
};

/**
 * Checks for an existing discount code or creates a new one if not found.
 *
 * @param {string} referralUUID - The referral UUID to check for or create a discount code.
 * @param {any} campaignData - Campaign data for discount creation (discount type, value, product selection).
 * @param {string} shopDomain - The shop domain extracted from the full URL.
 * @returns {Promise<string | null>} - Returns the discount code or null in case of failure.
 */
async function handleDiscountCode(referralUUID: string, formData: any, shopDomain: string, BOT_TOKEN: string): Promise<string | null> {
  const graphqlUrl = `https://${shopDomain}/admin/api/2024-10/graphql.json`;
  const TOKEN = process.env.TOKEN;  // Store your API token securely

  console.log("Starting discount code creation process...");
  console.log("Campaign Data:", JSON.stringify(formData, null, 2));

  try {
    // Step 1: Fetch users from the external API to identify the user
    const usersResponse = await axios.get('https://api.referrd.com.au/users', {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const users = usersResponse.data.data;  // Access the 'data' field inside 'usersResponse.data'


    if (!Array.isArray(users)) {
      console.error("The usersResponse.data is not an array. Check the API response.");
      return null;
    }

    // Extract the users based on the shop domain from their email
    const matchedUsers = users.filter((user: any) => {
      if (user.email && user.email.includes('+')) {
        const emailDomain = user.email.split('+')[1]?.split('@')[0];
        return emailDomain === shopDomain;
      }
      return false;
    });

    console.log("Matched users based on domain:", JSON.stringify(matchedUsers, null, 2));

    if (matchedUsers.length === 0) {
      console.error(`No users found for the domain: ${shopDomain}`);
      return null;
    }

    // Step 2: Identify the user with a ShopifyToken
    const userWithShopifyToken = matchedUsers.find((user: any) => user.ShopifyToken);

    if (!userWithShopifyToken) {
      console.error(`No user with ShopifyToken found for the domain: ${shopDomain}`);
      return null;
    }

    console.log("User with Shopify token:", JSON.stringify(userWithShopifyToken, null, 2));

    // Step 5: Create a new discount code if none exists
    const discountType = formData.discountType || "percentage";
    const discountValue = formData.discountValue || 10;
    const selectedItems = formData.appliesTo?.selectedItems || [];
    const discountAppliesToAll = selectedItems.length === 0;
    const productsToApply = selectedItems.map((item: any) => `gid://shopify/Product/${item.id}`);

    console.log("Selected items for discount:", JSON.stringify(selectedItems, null, 2));

    // Correct discount value object based on the discount type
    const discountValueObject = discountType === "percentage"
      ? { percentage: discountValue / 100 }
      : {
        discountAmount: {
          amount: discountValue,
          appliesOnEachItem: false,
        },
      };

    const createDiscountResponse = await axios.post(
      graphqlUrl,
      {
        query: `
        mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
          discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
            codeDiscountNode {
              codeDiscount {
                ... on DiscountCodeBasic {
                  codes(first: 10) {
                    nodes {
                      code
                    }
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
        variables: {
          basicCodeDiscount: {
            title: `Referral Discount - ${referralUUID}`,
            code: `REF-${Date.now()}`,
            startsAt: new Date().toISOString(),
            endsAt: "2024-12-31T23:59:59Z",
            customerSelection: {
              all: true,
            },
            customerGets: {
              value: discountValueObject,
              items: discountAppliesToAll
                ? { all: true }
                : { products: { productsToApply: productsToApply } },
            },
            appliesOncePerCustomer: true,
          },
        },
      },
      {
        headers: {
          'X-Shopify-Access-Token': userWithShopifyToken.ShopifyToken,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Discount creation response:", JSON.stringify(createDiscountResponse.data, null, 2));

    const userErrors = createDiscountResponse.data?.data?.discountCodeBasicCreate?.userErrors;

    if (userErrors?.length) {
      console.error("User Errors from Shopify during discount creation:", JSON.stringify(userErrors, null, 2));
      return null;
    }

    const newDiscountCode = createDiscountResponse.data?.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount?.codes?.nodes?.[0]?.code;

    if (!newDiscountCode) {
      console.error("Discount code creation failed: No discount code data returned");
      return null;
    }

    console.log("New discount code created:", newDiscountCode);

    // Update the referral record with the new discount code
    await updateReferralDiscountCode(referralUUID, formData.campaign_uuid, newDiscountCode, BOT_TOKEN);

    return newDiscountCode;

  } catch (error) {
    console.error("Error while checking/creating discount code:", error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Handle CORS and preflight requests
  if (handleCors(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const formData = req.body;

  console.log("Received form data:", formData);

  if (!formData.name || !formData.email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required.",
    });
  }

  let metadatasubmit = null;

  try {
    metadatasubmit = formData.metadata ? JSON.parse(formData.metadata) : null;
  } catch (error) {
    console.error("Failed to parse metadata:", error);
  }

  console.log("Parsed metadata:", JSON.stringify(metadatasubmit, null, 2));

  let metadata;
  try {
    metadata =
      typeof formData.metadata === "string"
        ? JSON.parse(formData.metadata)
        : formData.metadata;
  } catch (error) {
    console.error("Failed to parse metadata:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid metadata format.",
    });
  }

  try {
    const companyUrls = await fetchCompanyUrls(BOT_TOKEN);

    if (!Array.isArray(companyUrls) || companyUrls.length === 0) {
      throw new Error("No company URLs found");
    }

    const origin = metadata?.origin || "https://default-domain.com";
    const originHostname = extractHostname(origin);

    const matchedDomain = companyUrls.find(
      (domain) => originHostname === domain
    );

    console.log("Matched domain:", matchedDomain);

    if (!matchedDomain) {
      return res.status(403).json({
        success: false,
        message: "Origin does not match any company's domain",
      });
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = ip ? lookupGeoData(ip as string) : null;

    const location = {
      country: geo?.country || "",
      city: geo?.city || "",
    };

    const locationData = location.country || location.city ? location : null;

    console.log("Location data:", JSON.stringify(locationData, null, 2));

    const newCustomer = {
      name: formData.name || "",
      email: formData.email || "",
      mobile: formData.phone || "",
      conversion_count: 0,
      click_count: 0,
      signup_count: 0,
      location: locationData,
      referred_by: metadatasubmit?.referrer || "",
      company_campaign_tracker: {
        companies: [
          {
            company_id: formData.company_id || "",
            campaigns: [
              {
                campaign_id: formData.campaign_uuid || "",
                discount_code: formData.discount_code || null,
              },
            ],
          },
        ],
      },
    };

    console.log("New customer data:", JSON.stringify(newCustomer, null, 2));

    const createdCustomer = await createCustomer(
      newCustomer,
      BOT_TOKEN,
      formData.company_id,
      formData.campaign_uuid,
      formData.discount_code
    );
    const customerUUID = createdCustomer.uuid;

    const nameSlug = formData.name
      ? formData.name.toLowerCase().replace(/\s+/g, "-")
      : "referral";

    const generatedUrl = `${origin}?referrd?-${customerUUID}&${encodeURIComponent(nameSlug)}`;

    console.log("Generated URL:", generatedUrl);

    console.log("campaignData.allowDiscounts", formData.allowDiscounts);
    // Handle discount code creation
    if (formData.allowDiscounts) {
      const discountCode = await handleDiscountCode(
        customerUUID as string,
        formData,
        originHostname,
        BOT_TOKEN
      );

      if (discountCode) {
        newCustomer.company_campaign_tracker.companies[0].campaigns[0].discount_code = discountCode;
        console.log("Discount code updated in customer tracker:", discountCode);
      }
    }

    const directusCustomer = await createDirectusCustomer({
      name: newCustomer.name,
      email: newCustomer.email,
      updatedData: { uuid: customerUUID },
    });

    if (metadatasubmit && metadatasubmit.referrer) {
      console.log("Referrer found in metadata:", metadatasubmit.referrer);
      console.log("customerUUID:", customerUUID);
      try {
        if (createdCustomer.uuid != metadata.referrer) {
          await registerSignup(metadatasubmit.referrer, createdCustomer, BOT_TOKEN);
          console.log("Signup successfully registered.");
        }
      } catch (error) {
        console.error("Error registering signup:", error);
      }
    } else {
      console.warn("No valid referrer found in metadata.");
    }

    return res.status(200).json({ success: true, generatedUrl });
  } catch (error) {
    console.error("Error processing form data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

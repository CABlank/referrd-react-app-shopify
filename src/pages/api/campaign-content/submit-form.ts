import type { NextApiRequest, NextApiResponse } from "next";
import { lookupGeoData } from "../../../lib/geoip";
import { fetchCompanyUrls } from "../../../services/company/company";
import {
  fetchCustomerByUUID,
  registerSignup,
  createCustomer,
} from "../../../services/referrals/referralTracking";
import { handleCors } from "./handlers/handleCors";
import { createDirectusCustomer } from "../../../services/customers/customers";

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
  console.log("Form data received:", formData);

  if (!formData.name || !formData.email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required.",
    });
  }

  let metadatasubmit = null;

  try {
    // Parse the metadata JSON string into an object
    metadatasubmit = formData.metadata ? JSON.parse(formData.metadata) : null;
  } catch (error) {
    console.error("Failed to parse metadata:", error);
  }

  // Parse metadata if it's a string
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
    console.log("Company URLs:", companyUrls);

    if (!Array.isArray(companyUrls) || companyUrls.length === 0) {
      throw new Error("No company URLs found");
    }

    const origin = metadata?.origin || "https://default-domain.com";
    const originHostname = extractHostname(origin);

    console.log("Origin:", origin);
    console.log("Extracted Hostname:", originHostname);

    const matchedDomain = companyUrls.find(
      (domain) => originHostname === domain
    );

    console.log("Matched Domain:", matchedDomain);

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

    console.log("Form Data Received:", formData);

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = ip ? lookupGeoData(ip as string) : null;

    console.log("Request IP:", ip);
    console.log("Request Location:", geo);

    // Prepare location data
    const location = {
      country: geo?.country || "",
      city: geo?.city || "",
    };

    // If neither country nor city is present, set location to null
    const locationData = location.country || location.city ? location : null;


    // Create the new customer object
    const newCustomer = {
      name: formData.name || "", // Ensure that name is always a string
      email: formData.email || "", // Ensure that email is always a string
      mobile: formData.phone || "", // Ensure that mobile is always a string
      conversion_count: 0,
      click_count: 0,
      signup_count: 0,
      location: locationData, // Add location data
      referred_by: metadatasubmit.referrer || "", // Add referred_by property if provided
      campaign_uuid: formData.campaign_uuid || "", // Add campaign_id property if provided
      company_id: formData.company_id || "", // Add company_id property if provided
    };

    // Log the customer data before creating it
    console.log("Creating customer with data:", newCustomer);

    // Create the customer in Directus and get the response which includes the UUID
    const createdCustomer = await createCustomer(newCustomer, BOT_TOKEN, formData.company_id);
    console.log("New customer created:", createdCustomer);

    // Fetch the UUID of the newly created customer from the response
    const customerUUID = createdCustomer.uuid;

    // Now that we have the Directus-generated UUID, generate the URL
    const nameSlug = formData.name
      ? formData.name.toLowerCase().replace(/\s+/g, "-")
      : "referral";

    // Updated URL format: ?referrd?-UUID&nameSlug
    const generatedUrl = `${origin}?referrd?-${customerUUID}&${encodeURIComponent(nameSlug)}`;

    console.log("Generated URL:", generatedUrl);

    // Create the customer in Directus using createDirectusCustomer
    const directusCustomer = await createDirectusCustomer({
      name: newCustomer.name,
      email: newCustomer.email,
      updatedData: {
        uuid: customerUUID,
      },
    });

    // Handle if the Directus customer already exists
    if (directusCustomer === null) {
      console.log("Customer already exists in Directus, continuing...");
      // You can proceed here without breaking the flow since the customer exists
    } else {
    }

    console.log("formdata from submit-form", formData);

    // Check if the metadata was parsed successfully and contains the referrer
    if (metadatasubmit && metadatasubmit.referrer) {
      try {
        await registerSignup(
          metadatasubmit.referrer, // Use the referrer from the parsed metadata
          createdCustomer, // Use the created customer object
          BOT_TOKEN
        );
        console.log("Signup registered for referrer:", metadatasubmit.referrer);
      } catch (error) {
        console.error("Error registering signup:", error);
      }
    } else {
      console.warn("No valid referrer found in metadata.");
    }

    return res.status(200).json({ success: true, generatedUrl });
  } catch (error) {
    console.error("Error processing form data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

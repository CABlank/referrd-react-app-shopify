const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interfaces for the data structures
export interface Customer {
  id?: number;
  uuid?: string;
  name: string;
  email: string;
  mobile?: string;
  referred_by?: string;
  conversion_count: number;
  click_count: number;
  signup_count: number;
  location?: {
    country?: string;
    city?: string;
  } | null;

  company_campaign_tracker: {
    companies: {
      company_id: string;
      campaigns: {
        campaign_id: string;
        discount_code: string | null;
      }[];
    }[];
  };
}

// Helper function to make API requests
const fetchFromAPI = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null; // Return null explicitly for 204 No Content
  }

  const responseText = await response.text();

  if (!responseText) {
    console.error(`Empty response from ${endpoint}`);
    throw new Error(`Empty response from ${endpoint}`);
  }

  try {
    const data = JSON.parse(responseText);
    return data.data;
  } catch (error) {
    console.error(`Error parsing JSON from ${endpoint}:`, error);
    console.error(`Response text: ${responseText}`);
    throw new Error(`Failed to parse JSON from ${endpoint}`);
  }
};

// Fetch a specific customer by UUID
export const fetchCustomerByUUID = async (
  uuid: string,
  token: string
): Promise<Customer | null> => {
  const customers = await fetchFromAPI<Customer[] | null>(
    `/items/customers?filter[uuid][_eq]=${uuid}`,
    token
  );

  if (!customers || customers.length === 0) {
    return null; // Return null if no customer is found
  }

  return customers[0];
};

// Create a new customer or update the company_campaign_tracker if the customer exists
export const createCustomer = async (
  customer: Customer,
  token: string,
  newCompanyId?: string,   // New company ID to add
  newCampaignId?: string,  // New campaign ID to add
  discountCode?: string    // New discount code for the campaign
): Promise<Customer> => {
  try {
    // Check if the customer exists using their email
    const customers = await fetchFromAPI<Customer[] | null>(
      `/items/customers?filter[email][_eq]=${customer.email}`,
      token
    );

    if (customers && customers.length > 0) {
      // Customer exists
      const existingCustomer = customers[0];
      console.log("Customer already exists:", existingCustomer);

      // Retrieve or initialize the company_campaign_tracker
      let tracker = existingCustomer.company_campaign_tracker || { companies: [] };

      // Check if the company already exists in the tracker
      let companyIndex = tracker.companies.findIndex(
        (company) => company.company_id === newCompanyId
      );

      if (companyIndex === -1 && newCompanyId) {
        // Company doesn't exist, and newCompanyId is valid, add it with the new campaign
        console.log(`Adding new company ${newCompanyId} with campaign ${newCampaignId}`);
        if (newCampaignId) {
          tracker.companies.push({
            company_id: newCompanyId,
            campaigns: [
              {
                campaign_id: newCampaignId,
                discount_code: discountCode ?? null,
              },
            ],
          });
        } else {
          console.error("Cannot add campaign, newCampaignId is undefined or invalid.");
        }
      } else if (companyIndex !== -1) {
        // Company exists, check if the campaign exists
        console.log(`Company ${newCompanyId} exists, checking campaigns...`);
        let campaignIndex = tracker.companies[companyIndex].campaigns.findIndex(
          (campaign) => campaign.campaign_id === newCampaignId
        );

        if (campaignIndex === -1 && newCampaignId) {
          // Campaign doesn't exist, and newCampaignId is valid, add it
          console.log(`Adding new campaign ${newCampaignId} to company ${newCompanyId}`);
          tracker.companies[companyIndex].campaigns.push({
            campaign_id: newCampaignId,
            discount_code: discountCode ?? null,
          });
        } else if (campaignIndex !== -1) {
          // Campaign already exists
          console.log(`Campaign ${newCampaignId} already exists for company ${newCompanyId}`);
        } else {
          console.error("Cannot add campaign, newCampaignId is undefined or invalid.");
        }
      } else {
        console.error("Cannot add company, newCompanyId is undefined or invalid.");
      }

      // Update the customer with the modified company_campaign_tracker
      const updatedCustomer = await fetchFromAPI<Customer | null>(
        `/items/customers/${existingCustomer.id}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify({
            company_campaign_tracker: tracker,
          }),
        }
      );

      if (!updatedCustomer) {
        throw new Error("Failed to update customer with new company and campaign.");
      }

      console.log("Customer updated successfully:", updatedCustomer);
      return updatedCustomer;
    }

    // Customer does not exist, create a new one
    console.log("Creating a new customer...");
    if (newCompanyId && newCampaignId) {
      const createdCustomer = await fetchFromAPI<Customer | null>(
        "/items/customers",
        token,
        {
          method: "POST",
          body: JSON.stringify({
            ...customer,
            company_campaign_tracker: {
              companies: [
                {
                  company_id: newCompanyId,
                  campaigns: [
                    {
                      campaign_id: newCampaignId,
                      discount_code: discountCode ?? null,
                    },
                  ],
                },
              ],
            },
          }),
        }
      );

      if (!createdCustomer) {
        throw new Error("Customer creation failed, no data returned.");
      }

      console.log("Customer created successfully:", createdCustomer);
      return createdCustomer;
    } else {
      throw new Error("Cannot create customer without a valid company and campaign ID.");
    }

  } catch (error) {
    console.error("Error creating or updating customer:", error);
    throw error;
  }
};




// Manually increment a customer field value
export const incrementCustomerField = async (
  customerId: number,
  fieldName: string,
  currentValue: number,
  token: string
): Promise<void> => {
  try {
    const newValue = currentValue + 1;
    await fetchFromAPI<void>(`/items/customers/${customerId}`, token, {
      method: "PATCH",
      body: JSON.stringify({
        [fieldName]: newValue,
      }),
    });

  } catch (error) {
    console.error(
      `Error incrementing field ${fieldName} for customer ID ${customerId}:`,
      error
    );
    throw error;
  }
};

// Register a click on a referral link (Ensuring Atomic Operation)
export const registerClick = async (
  referralUuid: string,
  token: string
): Promise<void> => {
  try {
    const customer = await fetchCustomerByUUID(referralUuid, token);
    if (customer) {
      await incrementCustomerField(
        customer.id!,
        "click_count",
        customer.click_count,
        token
      );
    }
  } catch (error) {
    console.error("Error registering click:", error);
  }
};

// Register a sign-up (registration) through a referral
export const registerSignup = async (
  referralUuid: string,
  newCustomer: Customer,
  token: string
): Promise<void> => {
  try {
    const referringCustomer = await fetchCustomerByUUID(referralUuid, token);

    // Create new customer with `referred_by` set to the referring customer's UUID
    await createCustomer(
      { ...newCustomer, referred_by: referringCustomer?.uuid },
      token
    );

    // Increment the signup count for the referring customer
    if (referringCustomer) {
      await incrementCustomerField(
        referringCustomer.id!,
        "signup_count",
        referringCustomer.signup_count,
        token
      );
    }
  } catch (error) {
    console.error("Error registering signup:", error);
  }
};

// Register a conversion (e.g., purchase) attributed to a referral
export const registerConversion = async (
  customerUuid: string,
  token: string
): Promise<void> => {
  try {
    const customer = await fetchCustomerByUUID(customerUuid, token);

    if (customer && customer.referred_by) {
      const referrer = await fetchCustomerByUUID(customer.referred_by, token);
      if (referrer) {
        await incrementCustomerField(
          referrer.id!,
          "conversion_count",
          referrer.conversion_count,
          token
        );
      }

    }
  } catch (error) {
    console.error("Error registering conversion:", error);
  }
};

// Fetch referrals and stats for a specific customer
export const fetchReferralsForCustomer = async (
  customerUuid: string,
  token: string
): Promise<Customer[]> => {
  try {
    const referrals = await fetchFromAPI<Customer[] | null>(
      `/items/customers?filter[referred_by][_eq]=${customerUuid}`,
      token
    );
    if (!referrals) {
      throw new Error(`No referrals found for customer UUID ${customerUuid}`);
    }

    return referrals;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
};

// Fetch stats for a specific customer
export const fetchReferralStats = async (
  customerUuid: string,
  token: string
): Promise<{ clicks: number; signups: number; conversions: number }> => {
  try {
    const customer = await fetchCustomerByUUID(customerUuid, token);
    return {
      clicks: customer ? customer.click_count : 0,
      signups: customer?.signup_count ?? 0,
      conversions: customer?.conversion_count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    throw error;
  }
};


// Update the referral record with the new discount code for a specific campaign
export const updateReferralDiscountCode = async (
  referralUUID: string,
  campaignId: string,
  discountCode: string,
  token: string
): Promise<void> => {
  try {
    const customers = await fetchFromAPI<Customer[] | null>(
      `/items/customers?filter[uuid][_eq]=${referralUUID}`,  // Fetch customer by UUID
      token
    );

    if (!customers || customers.length === 0) {
      throw new Error(`Customer with UUID ${referralUUID} not found.`);
    }

    const customer = customers[0];

    // Find the campaign and update the discount code in company_campaign_tracker
    let tracker = customer.company_campaign_tracker;

    let companyIndex = tracker?.companies.findIndex((company) =>
      company.campaigns.some((campaign) => campaign.campaign_id === campaignId)
    );

    if (companyIndex === -1 || !tracker) {
      throw new Error(`Campaign with ID ${campaignId} not found for customer.`);
    }

    let campaignIndex = tracker.companies[companyIndex].campaigns.findIndex(
      (campaign) => campaign.campaign_id === campaignId
    );

    if (campaignIndex === -1) {
      throw new Error(`Campaign not found in company tracker for UUID ${referralUUID}`);
    }

    // Update the discount code for the specific campaign
    tracker.companies[companyIndex].campaigns[campaignIndex].discount_code = discountCode;

    // Send the PATCH request to update the customer's company_campaign_tracker
    await fetchFromAPI<void>(
      `/items/customers/${customer.id}`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({
          company_campaign_tracker: tracker,  // Update the entire tracker with new discount code
        }),
      }
    );

  } catch (error) {
    console.error(`Error updating referral record for UUID ${referralUUID}:`, error);
    throw error;
  }
};

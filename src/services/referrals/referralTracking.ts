const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  company_id: object;
  location?: {
    country?: string;
    city?: string;
  } | null;
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
    console.log(`No content from ${endpoint}`);
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
    console.log(`Customer with UUID ${uuid} not found`);
    return null; // Return null if no customer is found
  }

  return customers[0];
};

// Create a new customer
// Create a new customer or update the company_id if the customer exists
export const createCustomer = async (
  customer: Customer,
  token: string,
  newCompanyId?: string // Renamed parameter for clarity
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
      console.log(`Customer with email ${customer.email} already exists`);

      // Check if the new company_id is different and not already present
      const existingCompanyIds = Array.isArray(existingCustomer.company_id)
        ? existingCustomer.company_id
        : [existingCustomer.company_id];

      if (!existingCompanyIds.includes(newCompanyId)) {
        // Add the new company_id to the array
        const updatedCompanyIds = [...existingCompanyIds, newCompanyId];

        // Update the customer with the new list of company IDs
        const updatedCustomer = await fetchFromAPI<Customer | null>(
          `/items/customers/${existingCustomer.id}`,
          token,
          {
            method: "PATCH",
            body: JSON.stringify({ company_id: updatedCompanyIds }),
          }
        );

        if (!updatedCustomer) {
          throw new Error("Failed to update customer with new company ID.");
        }

        console.log("Updated existing customer with new company ID:", updatedCustomer);
        return updatedCustomer;
      }

      // If the company_id already exists, return the existing customer
      return existingCustomer;
    }

    // Customer does not exist, create a new one
    const createdCustomer = await fetchFromAPI<Customer | null>(
      "/items/customers",
      token,
      {
        method: "POST",
        body: JSON.stringify({ ...customer, company_id: [newCompanyId] }), // Create new customer with the new company_id as an array
      }
    );

    if (!createdCustomer) {
      throw new Error("Customer creation failed, no data returned.");
    }

    console.log("Created new customer:", createdCustomer);
    return createdCustomer;

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
    console.log(
      `Incremented field ${fieldName} for customer ID ${customerId} to ${newValue}`
    );
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
    console.log(`Registered click for referral UUID ${referralUuid}`);
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
    console.log(`Registered signup for referrer UUID ${referralUuid}`);
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
      console.log(
        `Registered conversion for referrer UUID ${customer.referred_by}`
      );
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
    console.log(
      `Fetched referrals for customer UUID ${customerUuid}:`,
      referrals
    );
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
    console.log(`Fetched stats for customer UUID ${customerUuid}`);
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

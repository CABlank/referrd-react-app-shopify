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
): Promise<Customer> => {
  const customers = await fetchFromAPI<Customer[] | null>(
    `/items/customers?filter[uuid][_eq]=${uuid}`,
    token
  );
  if (!customers || customers.length === 0) {
    throw new Error(`Customer with UUID ${uuid} not found`);
  }
  return customers[0];
};

// Create a new customer
export const createCustomer = async (
  customer: Customer,
  token: string
): Promise<Customer> => {
  // Update the return type to Promise<Customer>
  try {
    console.log("Creating customer with data:", customer);
    console.log("Using token:", token);

    const createdCustomer = await fetchFromAPI<Customer | null>(
      "/items/customers",
      token,
      {
        method: "POST",
        body: JSON.stringify(customer),
      }
    );

    if (createdCustomer === null) {
      console.log("Customer created successfully but no content was returned.");
      throw new Error("Customer creation failed, no data returned.");
    } else {
      console.log("Created new customer:", createdCustomer);
      return createdCustomer; // Return the created customer object
    }
  } catch (error) {
    console.error("Error creating customer:", error);
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
    await incrementCustomerField(
      customer.id!,
      "click_count",
      customer.click_count,
      token
    );
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
      { ...newCustomer, referred_by: referringCustomer.uuid },
      token
    );

    // Increment the signup count for the referring customer
    await incrementCustomerField(
      referringCustomer.id!,
      "signup_count",
      referringCustomer.signup_count,
      token
    );
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

    if (customer.referred_by) {
      const referrer = await fetchCustomerByUUID(customer.referred_by, token);
      await incrementCustomerField(
        referrer.id!,
        "conversion_count",
        referrer.conversion_count,
        token
      );
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
      clicks: customer.click_count,
      signups: customer.signup_count,
      conversions: customer.conversion_count,
    };
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    throw error;
  }
};

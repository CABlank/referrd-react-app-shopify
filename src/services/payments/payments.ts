// services/payment.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.referrd.com.au";

export interface Payment {
  date_created: string | number | Date;
  id?: number;
  order_number: string;
  customer_email: string;
  total_price: string;
  total_discounts: string;
  line_items: Array<{
    productName: string;
    quantity: number;
    price: string;
  }>;
  discounts_applied: string | Array<{ code: string }>;
  referral_uuid?: string;
  status: string;
  campaign_uuid?: string;
  company_id?: string;
}

export interface Company {
  id: number;
  name: string;
  domain: string;
  UUID: string;
}

export interface Customer {
  uuid: string;
  name: string;
  email: string;
}

export interface CampaignMetadata {
  name: any;
  campaign_uuid: string;
  commission: number;
  commissionType: string;
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

// Function to fetch the company UUID
export const fetchCompanyUUID = async (
  token: string
): Promise<string | null> => {
  try {
    const companyData = await fetchFromAPI<Company[]>("/items/company", token);

    if (companyData && companyData.length > 0) {
      return companyData[0].UUID;
    } else {
      console.error("Company not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw error;
  }
};

// Function to fetch all payments related to a company UUID
export const fetchPaymentsByCompanyId = async (
  companyId: string,
  token: string
): Promise<Payment[] | null> => {
  try {
    const payments = await fetchFromAPI<Payment[]>(
      `/items/payments?filter[company_id][_eq]=${companyId}`,
      token
    );

    if (payments) {
      return payments;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching payments by company ID:", error);
    throw error;
  }
};

export const fetchPaymentsByReferralUUID = async (
  referralUUID: string,
  token: string
): Promise<Payment[] | null> => {
  try {
    const payments = await fetchFromAPI<Payment[]>(
      `/items/payments?filter[referral_uuid][_eq]=${referralUUID}`,
      token
    );

    if (payments) {
      return payments;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching payments by referral UUID:", error);
    throw error;
  }
};

// Create a new payment
export const createPayment = async (
  payment: Payment,
  token: string
): Promise<Payment | null> => {
  try {


    const createdPayment = await fetchFromAPI<Payment | null>(
      "/items/payments",
      token,
      {
        method: "POST",
        body: JSON.stringify(payment),
      }
    );

    if (!createdPayment) {
      return null; // Explicitly return null if no data is returned
    }

    return createdPayment; // Return the created payment object
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (
  paymentId: number,
  status: "Approved" | "Declined",
  token: string
): Promise<Payment | null> => {
  try {
    const response = await fetch(`${API_URL}/items/payments/${paymentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }), // Send the new status
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update payment status. Status code: ${response.status}`
      );
    }

    const updatedPayment = await response.json();
    return updatedPayment.data || null;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

export const fetchReferrer = async (
  referralUUID: string,
  token: string
): Promise<Customer | null> => {
  try {
    const referrerData = await fetchFromAPI<Customer[]>(
      `/items/customers?filter[uuid][_eq]=${referralUUID}`,
      token
    );

    if (referrerData && referrerData.length > 0) {
      return referrerData[0];
    } else {
      console.error("Referrer not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching referrer data:", error);
    throw error;
  }
};

export const fetchCampaignMetadata = async (
  campaignUUID: string,
  token: string
): Promise<CampaignMetadata | null> => {
  try {
    const campaignData = await fetchFromAPI<CampaignMetadata[]>(
      `/items/campaign_metadata?filter[campaign_uuid][_eq]=${campaignUUID}`,
      token
    );

    if (campaignData && campaignData.length > 0) {
      return campaignData[0];
    } else {
      console.error("Campaign metadata not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching campaign metadata:", error);
    throw error;
  }
};

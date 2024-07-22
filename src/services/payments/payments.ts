const API_URL = process.env.NEXT_PUBLIC_API_URL;

// interfaces for the data structures
export interface Payment {
  id?: number;
  status: string;
  referral_id: number;
  date_created: string;
}

export interface Referral {
  id: number;
  date_created: string;
  referrer: number;
  campaign: number;
  spend: number;
}

export interface Customer {
  id: number;
  name: string;
}

export interface Campaign {
  id: number;
  name: string;
}

// Helper function to make API requests
const fetchFromAPI = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  const data = await response.json();
  return data.data;
};

// Fetch all referrals
export const fetchReferrals = (token: string): Promise<Referral[]> =>
  fetchFromAPI<Referral[]>("/items/referrals", token);

// Fetch all customers
export const fetchCustomers = (token: string): Promise<Customer[]> =>
  fetchFromAPI<Customer[]>("/items/customers", token);

// Fetch all campaigns
export const fetchCampaigns = (token: string): Promise<Campaign[]> =>
  fetchFromAPI<Campaign[]>("/items/campaigns", token);

// Fetch all referral codes
export const fetchReferralCodes = (token: string): Promise<any[]> =>
  fetchFromAPI<any[]>("/items/referral_codes", token);

// Fetch all payments
export const fetchPayments = (token: string): Promise<Payment[]> =>
  fetchFromAPI<Payment[]>("/items/payments", token);

// Update payment status
export const updatePaymentStatus = (
  paymentId: number,
  status: string,
  token: string
): Promise<void> =>
  fetchFromAPI<void>(`/items/payments/${paymentId}`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

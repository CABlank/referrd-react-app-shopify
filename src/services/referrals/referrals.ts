const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to make API requests
const fetchFromAPI = async (endpoint: string, token: string) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  const data = await response.json();
  return data.data;
};

// Fetch all referrals
export const fetchReferrals = (token: string) =>
  fetchFromAPI("/items/referrals", token);

// Fetch all customers
export const fetchCustomers = (token: string) =>
  fetchFromAPI("/items/customers", token);

// Fetch all campaigns
export const fetchCampaigns = (token: string) =>
  fetchFromAPI("/items/campaigns", token);

// Fetch all referral codes
export const fetchReferralCodes = (token: string) =>
  fetchFromAPI("/items/referral_codes", token);

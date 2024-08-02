const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Payment {
  id: number;
  status: string;
  referral_id: number;
  date_created: string;
}

export interface Referral {
  test: string;
  referralCode: number;
  id: number;
  date_created: string;
  referrer: number;
  campaign: number;
  spend: number;
  conversion: string;
  location: string;
}

export interface Customer {
  id: number;
  email: string;
  name: string;
  mobile: string;
  referralCode: number;
}

export interface Campaign {
  date_updated: string | number | Date;
  imageSrc: string;
  test: string;
  price: any;
  openTo: string;
  closeDate: any;
  status: any;
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

// Fetch dashboard data
export const fetchDashboardData = async (
  token: string,
  userId: number | undefined
) => {
  const [
    paymentsData,
    customersData,
    campaignsData,
    referralsData,
    referralCodesData,
  ] = await Promise.all([
    fetchFromAPI<Payment[]>("/items/payments", token),
    fetchFromAPI<Customer[]>("/items/customers", token),
    fetchFromAPI<Campaign[]>("/items/campaigns", token),
    fetchFromAPI<Referral[]>("/items/referrals", token),
    fetchFromAPI<any[]>("/items/referral_codes", token),
  ]);

  return {
    payments: paymentsData,
    customers: customersData,
    campaigns: campaignsData,
    referrals: referralsData,
    referralCodes: referralCodesData,
  };
};

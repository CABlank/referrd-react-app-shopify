const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interfaces for the data structures
export interface Customer {
  id: number;
  date_created: string;
  date_updated: string | null;
  uuid: string;
  name: string;
  email: string;
  mobile: string;
  referred_by: string;
  conversion_count: number;
  signup_count: number;
  location: string;
  click_count: number;
  company_id: string;
  campaign_uuid: string;
}

export interface Company {
  id?: number;
  name: string;
  domain: string;
  logo: string | File | null;
  logoUrl?: string;
  date_created: string | number | Date;
  UUID: string;
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
  const headers: Record<string, string> = {
    "Content-Type":
      options.body instanceof FormData
        ? "multipart/form-data"
        : "application/json",
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
    return {} as T;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

// Fetch all customers (ignoring companyUUID filtering for now)
export const fetchCustomers = async (token: string, companyUUID: string) => {
  try {
    // Fetch all customers
    const allCustomers = await fetchFromAPI<Customer[]>('/items/customers', token);

    // Perform filtering based on companyUUID
    const filteredCustomers = allCustomers.filter((customer) => {
      // Use optional chaining and nullish coalescing to handle null or undefined values
      return Array.isArray(customer.company_id) && customer.company_id?.includes(companyUUID);
    });

    // Return the filtered list
    return filteredCustomers;

  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};




// Fetch all customers for a specific referral
export const fetchCustomersByUuidReferral = (
  token: string,
  referred_by: string
) =>
  fetchFromAPI<Customer[]>(
    `/items/customers?filter[referred_by][_eq]=${referred_by}`,
    token
  );

// Fetch all customer data for a specific referral
export const fetchMainCustomerByUuidReferral = (token: string, uuid: string) =>
  fetchFromAPI<Customer[]>(`/items/customers?filter[uuid][_eq]=${uuid}`, token);

// Fetch all companies
export const fetchCompanies = (token: string): Promise<Company[]> =>
  fetchFromAPI<Company[]>("/items/company", token);

// Fetch a specific company by UUID (you can adapt this if you fetch by ID)
export const fetchCompanyByUUID = (
  token: string,
  companyUUID: string
): Promise<Company> =>
  fetchFromAPI<Company>(
    `/items/company?filter[UUID][_eq]=${companyUUID}`,
    token
  );

// Fetch all campaigns
export const fetchCampaigns = (token: string): Promise<Campaign[]> =>
  fetchFromAPI<Campaign[]>("/items/campaigns", token);

// Fetch a specific campaign by ID
export const fetchCampaign = (id: number, token: string): Promise<Campaign> =>
  fetchFromAPI<Campaign>(`/items/campaigns/${id}`, token);

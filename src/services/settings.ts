const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface defining the shape of the Settings object
export interface Settings {
  id?: number;
  contactName: string;
  brandName: string;
  mobile: string;
  email: string;
  country: string;
  businessAddress: string;
  notify_referral_conversions: boolean | null;
  notify_payment_confirmation: boolean | null;
  notify_payment_notifications: boolean | null;
  no_payment_notifications: boolean | null;
  dateOfBirth: string;
  wiseEmail: string;
}

// Helper function to make API requests
const fetchFromAPI = async (
  endpoint: string,
  method: string,
  token: string,
  data?: any
): Promise<any> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(
      `Failed to ${method === "GET" ? "fetch" : "update"} ${endpoint}`
    );
  }

  const result = await response.json();
  return result.data;
};

// Function to fetch settings using the helper function
export const fetchSettings = (token: string): Promise<Settings> =>
  fetchFromAPI("/items/settings", "GET", token).then((data) => {
    return data[0];
  });

// Function to update settings using the helper function
export const updateSettings = (
  settings: Settings,
  token: string
): Promise<Settings> =>
  fetchFromAPI(`/items/settings/${settings.id}`, "PATCH", token, settings);

// Function to create settings using the helper function
export const createSettings = (
  settings: Settings,
  token: string
): Promise<Settings> =>
  fetchFromAPI("/items/settings", "POST", token, settings);

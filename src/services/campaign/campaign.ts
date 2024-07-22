const API_URL = process.env.NEXT_PUBLIC_API_URL;

// interfaces for the data structures
export interface Campaign {
  settingsTopbarState?: string;
  settingsPopupState?: string;
  commission: React.ReactNode;
  commissionType: "FixedAmount" | "Percentage";
  id?: number;
  status?: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string | null;
  date_updated?: string | null;
  name: string;
  startDate: string | null;
  closeDate: string | null;
  company: string | null;
  terms: string | null;
  discountType: "FixedAmount" | "Percentage";
  discountValue: string | null;
  appliesTo: string | null;
  format: "Popup" | "Topbar";
  serializedTopbarState?: string;
  serializedPopupState?: string;
  amountFunded?: number;
  url?: string;
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
    // No content to parse, return an empty object or undefined
    return {} as T;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  const data = await response.json();
  return data.data;
};

// Duplicate campaign data to the public page collection
const duplicateCampaignToPublicPage = async (
  campaign: Campaign,
  token: string
): Promise<void> => {
  const publicPageData = {
    campaign_id: campaign.id,
    closeDate: campaign.closeDate,
    discountType: campaign.discountType,
    discountValue: campaign.discountValue,
    format: campaign.format,
    amountFunded: campaign.amountFunded,
    settingsTopbarState: campaign.settingsTopbarState,
    settingsPopupState: campaign.settingsPopupState,
    serializedTopbarState: campaign.serializedTopbarState,
    serializedPopupState: campaign.serializedPopupState,
    status: campaign.status,
    commission: campaign.commission,
    commissionType: campaign.commissionType,
  };

  await fetchFromAPI("/items/campaign_public_page", token, {
    method: "POST",
    body: JSON.stringify(publicPageData),
  });
};

// Fetch all campaigns
export const fetchCampaigns = (token: string): Promise<Campaign[]> =>
  fetchFromAPI<Campaign[]>("/items/campaigns", token);

// Fetch a specific campaign by ID
export const fetchCampaign = (id: number, token: string): Promise<Campaign> =>
  fetchFromAPI<Campaign>(`/items/campaigns/${id}`, token);

// Create a new campaign
export const createCampaign = async (
  campaign: Campaign,
  token: string
): Promise<Campaign> => {
  const createdCampaign = await fetchFromAPI<Campaign>(
    "/items/campaigns",
    token,
    {
      method: "POST",
      body: JSON.stringify(campaign),
    }
  );

  // Duplicate the created campaign to the public page collection
  await duplicateCampaignToPublicPage(createdCampaign, token);

  return createdCampaign;
};

// Update an existing campaign
export const updateCampaign = async (
  campaign: Campaign,
  token: string
): Promise<void> => {
  await fetchFromAPI<void>(`/items/campaigns/${campaign.id}`, token, {
    method: "PATCH",
    body: JSON.stringify(campaign),
  });

  // Duplicate the updated campaign to the public page collection
  await duplicateCampaignToPublicPage(campaign, token);
};

// Update the status of a campaign
export const updateCampaignStatus = (
  id: number,
  status: string,
  token: string
): Promise<void> =>
  fetchFromAPI<void>(`/items/campaigns/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const updateCampaignStatusAndAmount = (
  id: number,
  amountFunded: number,
  token: string
): Promise<void> =>
  fetchFromAPI<void>(`/items/campaigns/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ amountFunded }),
  });

// Delete a campaign
export const deleteCampaign = (id: number, token: string): Promise<void> =>
  fetchFromAPI<void>(`/items/campaigns/${id}`, token, {
    method: "DELETE",
  });

// Upload a file
export const uploadFile = async (
  file: File,
  token: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const data = await response.json();
  return data.data.id;
};

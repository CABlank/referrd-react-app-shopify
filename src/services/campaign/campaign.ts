
// interfaces for the data structures
export interface Campaign {
  settingsTopbarState?: string;
  settingsPopupState?: string;
  commission: React.ReactNode;
  commissionType: "Fix" | "Percentage";
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
  allowDiscounts: boolean;
  discountType: "FixedAmount" | "Percentage";
  discountValue: string | null;
  appliesTo: string | null;
  format: "Popup" | "Both";
  serializedTopbarState?: string;
  serializedPopupState?: string;
  amountFunded?: number;
  url?: string;
  compiledHtml?: string;
  compiledHtmlTopBar?: string;
  company_id?: string;
  uuid?: string;
  campaign_uuid?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  token: string,
  isUpdate: boolean
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
    compiledHtml: campaign.compiledHtml,
    compiledHtmlTopBar: campaign.compiledHtmlTopBar,
    company_id: campaign.company_id,
    campaign_uuid: campaign.uuid,
    allowDiscounts: campaign.allowDiscounts,
    appliesTo: campaign.appliesTo,

  };

  const method = isUpdate ? "PATCH" : "POST";
  const endpoint = isUpdate
    ? `/items/campaign_public_page/${campaign.id}`
    : `/items/campaign_public_page`;

  try {
    await fetchFromAPI(endpoint, token, {
      method: method,
      body: JSON.stringify(publicPageData),
    });
  } catch (error) {
    console.error(
      `Failed to ${isUpdate ? "update" : "create"} public page data`,
      error
    );
  }
};

// Duplicate campaign data to the public page collection
const duplicateCampaignToMetaData = async (
  campaign: Campaign,
  token: string,
  isUpdate: boolean
): Promise<void> => {
  const publicPageData = {
    campaign_id: campaign.id,
    name: campaign.name,
    closeDate: campaign.closeDate,
    discountType: campaign.discountType,
    discountValue: campaign.discountValue,
    format: campaign.format,
    amountFunded: campaign.amountFunded,
    status: campaign.status,
    commission: campaign.commission,
    commissionType: campaign.commissionType,
    company_id: campaign.company_id,
    campaign_uuid: campaign.uuid,
    allowDiscounts: campaign.allowDiscounts,
    appliesTo: campaign.appliesTo,
  };

  const method = isUpdate ? "PATCH" : "POST";
  const endpoint = isUpdate
    ? `/items/campaign_metadata/${campaign.id}`
    : `/items/campaign_metadata`;

  try {
    await fetchFromAPI(endpoint, token, {
      method: method,
      body: JSON.stringify(publicPageData),
    });
  } catch (error) {
    console.error(
      `Failed to ${isUpdate ? "update" : "create"} public page data`,
      error
    );
  }
};

// Fetch all campaigns
export const fetchCampaigns = (token: string): Promise<Campaign[]> =>
  fetchFromAPI<Campaign[]>("/items/campaigns", token);

// Fetch all campaigns metadata
export const fetchCampaignMetadata = (token: string): Promise<Campaign[]> =>
  fetchFromAPI<Campaign[]>("/items/campaign_metadata", token);

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

  // Ensure the created campaign has a UUID
  if (!createdCampaign.uuid) {
    throw new Error("Failed to retrieve campaign UUID after creation.");
  }

  // Duplicate the created campaign to the public page collection with the UUID
  await duplicateCampaignToPublicPage(createdCampaign, token, false);

  // Duplicate the created campaign to the meta data collection with the UUID
  await duplicateCampaignToMetaData(createdCampaign, token, false);

  return createdCampaign;
};

// Update an existing campaign
export const updateCampaign = async (
  campaign: Campaign,
  token: string
): Promise<void> => {
  try {
    await fetchFromAPI<void>(`/items/campaigns/${campaign.id}`, token, {
      method: "PATCH",
      body: JSON.stringify(campaign),
    });

    // Duplicate the updated campaign to the public page collection
    await duplicateCampaignToPublicPage(campaign, token, true);

    // Duplicate the updated campaign to the meta data collection
    await duplicateCampaignToMetaData(campaign, token, true);
  } catch (error) {
    console.error("Failed to update campaign", error);
  }
};

// Update the status of a campaign
export const updateCampaignStatus = async (
  id: number,
  status: string,
  token: string
): Promise<void> => {
  // Update the campaign's status
  await fetchFromAPI<void>(`/items/campaigns/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  // Duplicate the action for `campaign_metadata`
  await fetchFromAPI<void>(`/items/campaign_metadata/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// Update the amount funded for a campaign
export const updateCampaignStatusAndAmount = async (
  id: number,
  amountFunded: number,
  token: string
): Promise<void> => {
  // Update the campaign's amount funded
  await fetchFromAPI<void>(`/items/campaigns/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ amountFunded }),
  });

  // Duplicate the action for `campaign_public_page`
  await fetchFromAPI<void>(`/items/campaign_public_page/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ amountFunded }),
  });

  // Duplicate the action for `campaign_metadata`
  await fetchFromAPI<void>(`/items/campaign_metadata/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ amountFunded }),
  });
};

// Delete a campaign
export const deleteCampaign = async (
  id: number,
  token: string
): Promise<void> => {
  await fetchFromAPI<void>(`/items/campaigns/${id}`, token, {
    method: "DELETE",
  });

  // Delete the public page data associated with the campaign
  try {
    await fetchFromAPI<void>(`/items/campaign_public_page/${id}`, token, {
      method: "DELETE",
    });

    await fetchFromAPI<void>(`/items/campaign_metadata/${id}`, token, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Failed to delete public page data", error);
  }
};

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

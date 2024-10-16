const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL; // Ensure correct environment variable is used

// Helper function for API calls
export const fetchFromAPI = async <T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<T> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Pass the Bearer token for auth
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    if (response.status === 204) {
        // No content, return an empty object
        return {} as T;
    }

    const data = await response.json();
    return data.data ?? data; // Safely return data or fallback to full response
};

// Update campaign status (Live, Draft, or Ended)
export const updateCampaignStatus = async (
    campaignId: number,
    status: "Live" | "Draft" | "Ended",
    token: string
): Promise<void> => {
    try {
        // Make a PATCH request to update the status field of the campaign
        await fetchFromAPI<void>(`/items/campaigns/${campaignId}`, token, {
            method: 'PATCH',
            body: JSON.stringify({ status }), // Only update the status
        });

        // Make another PATCH request to update the status in the campaign metadata
        await fetchFromAPI<void>(`/items/campaign_metadata/${campaignId}`, token, {
            method: 'PATCH',
            body: JSON.stringify({ status }), // Only update the status
        });

    } catch (error) {
        console.error(`Failed to update campaign status to ${status}`, error);
        // You could throw the error or handle it as needed, depending on your error handling strategy
    }
};

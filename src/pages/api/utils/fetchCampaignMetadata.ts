export async function fetchCampaignMetadata(
  companyId: string,
  BOT_TOKEN: string
) {
  const response = await fetch(
    `https://api.referrd.com.au/items/campaign_metadata?filter[company_id][_eq]=${companyId}`,
    {
      headers: {
        Authorization: `Bearer ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch campaign metadata: ${response.statusText}`
    );
  }

  const metadata = await response.json();
  if (!Array.isArray(metadata.data)) {
    throw new Error("Unexpected API response structure");
  }

  return metadata.data;
}

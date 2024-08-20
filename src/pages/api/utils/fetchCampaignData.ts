// Fetch campaign data from the API
export async function fetchCampaignData(
  id: string | string[],
  API_URL: string,
  BOT_TOKEN: string
) {
  const response = await fetch(
    `https://api.referrd.com.au/items/campaign_public_page?filter[id][_eq]=${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BOT_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch campaign data: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.data[0]; // Access the first element of the array
}

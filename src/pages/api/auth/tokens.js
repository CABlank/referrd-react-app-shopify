// File: pages/api/auth/tokens.js

export default async function handler(req, res) {
  const { shop, access_token } = req.query;

  if (!shop || !access_token) {
    return res.status(400).json({ error: "Required parameters missing" });
  }

  // Log the access token for testing purposes
  console.log(`Received access token for shop ${shop}:`, access_token);

  // In production, you should securely store the access token in a database

  // Send a response back to the browser or redirect to the main app page
  res.status(200).json({ message: "Access token received and logged" });
}

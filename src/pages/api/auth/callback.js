// File: pages/api/auth/callback.js

import axios from "axios";
import { URLSearchParams } from "url";

export default async function handler(req, res) {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).json({ error: "Required parameters missing" });
  }

  const accessTokenUrl = `https://${shop}/admin/oauth/access_token`;
  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code,
  });

  try {
    const response = await axios.post(accessTokenUrl, params);
    const { access_token: accessToken } = response.data;

    // Log the access token (for testing purposes)
    console.log("SHOPIFY_ACCESS_TOKEN:", accessToken);

    // Normally, store the access token securely in your database

    // Redirect to a success page or another endpoint
    res.redirect(`/api/auth/tokens?shop=${shop}&access_token=${accessToken}`);
  } catch (error) {
    console.error("Error exchanging token:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
}

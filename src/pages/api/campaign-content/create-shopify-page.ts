// pages/api/campaign-content/create-shopify-page.ts

import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shopifyToken, shopName, campaignUuid, pageTitle, pageBodyHtml } =
    req.body;

  const url = `https://${shopName}/admin/api/2024-07/pages.json`;

  const pageData = {
    page: {
      title: pageTitle,
      body_html: pageBodyHtml,
      handle: `referrd?${campaignUuid}`,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to create Shopify page: ${response.statusText}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error creating Shopify page:", error);
    console.error("Request body:", req.body);
    console.error("Page data:", pageData);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

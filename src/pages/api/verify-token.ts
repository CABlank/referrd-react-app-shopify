// /api/verify-token.ts
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const DIRECTUS_API_URL = process.env.API_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.TOKEN || ""; // Ensure your Directus admin token is available

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Fetch the user by registration_token from Directus
    const response = await fetch(
      `${DIRECTUS_API_URL}/users?filter[registration_token][_eq]=${token}`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as { data: any[] };

    // If no user is found or token has expired
    if (data?.data?.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const user = data.data[0];

    // Assuming Directus returns the email with the user object
    return res.status(200).json({ success: true, email: user.email });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

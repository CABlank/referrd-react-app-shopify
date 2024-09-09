// /api/complete-registration.ts
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";

const DIRECTUS_API_URL = process.env.API_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.TOKEN || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, fullName, mobile, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Token and password are required" });
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

    // If no user is found
    if (data?.data?.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const user = data.data[0];
    const userId = user.id;

    // Update the user in Directus
    const patchResponse = await fetch(`${DIRECTUS_API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: fullName,
        mobile: mobile,
        password: password, // Set the password
        status: "active", // Update the status to active
        registration_token: null, // Clear the registration token
        token_expiry: null, // Clear the token expiry
      }),
    });

    if (!patchResponse.ok) {
      const patchErrorText = await patchResponse.text();
      return res.status(500).json({
        success: false,
        message: `Failed to complete registration: ${patchErrorText}`,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error completing registration:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

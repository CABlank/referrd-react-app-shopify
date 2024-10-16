import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const DIRECTUS_API_URL = process.env.API_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.TOKEN || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, fullName, mobile, password, country } = req.body;


  if (!token || !password) {
    console.error("Token or password is missing.");
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

    if (data?.data?.length === 0) {
      console.error("No user found with the provided registration token.");
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
        password: password,
        status: "active",
        registration_token: null,
        token_expiry: null,
      }),
    });

    if (!patchResponse.ok) {
      const patchErrorText = await patchResponse.text();
      console.error("Failed to update user:", patchErrorText);
      return res.status(500).json({
        success: false,
        message: `Failed to complete registration: ${patchErrorText}`,
      });
    }


    // Login the user to get an access token
    const loginResponse = await fetch(`${DIRECTUS_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        password: password,
      }),
    });

    if (!loginResponse.ok) {
      const loginErrorText = await loginResponse.text();
      console.error("Failed to log in:", loginErrorText);
      return res.status(500).json({
        success: false,
        message: `Failed to log in: ${loginErrorText}`,
      });
    }

    const loginData: any = await loginResponse.json();
    const accessToken = loginData.data.access_token;
    const refreshToken = loginData.data.refresh_token;

    // Create or update the user's settings in Directus
    const settingsResponse = await fetch(`${DIRECTUS_API_URL}/items/settings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactName: fullName,
        mobile: mobile,
        country: country,
        email: user.email,
      }),
    });

    if (!settingsResponse.ok) {
      const settingsErrorText = await settingsResponse.text();
      console.error("Failed to create settings:", settingsErrorText);
      return res.status(500).json({
        success: false,
        message: `Failed to create settings: ${settingsErrorText}`,
      });
    }


    return res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error("Error completing registration:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

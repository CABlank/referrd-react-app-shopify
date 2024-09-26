import authService from "../../services/auth/auth"; // Add this import at the top
import { SetSessionFunction, Session } from "../sessionTypes"; // Import the necessary types
import { saveTokensToCookies } from "./sessionUtils"; // Ensure to import saveTokensToCookies function

interface TokenData {
  accessToken: string;
  refreshToken: string;
  sessionAccessTokenExpiresAt: string;
  expires: number; // Assuming the API returns token expiration duration in seconds
}

// Function to save new tokens to the database
export const saveTokensToDatabase = async (
  userId: number,
  tokenData: TokenData
): Promise<void> => {
  // Ensure the userId is a number
  if (typeof userId !== 'number') {
    console.error(`Invalid userId: ${userId}. Must be a number.`);
    return; // Exit early if userId is not valid
  }

  console.log(`Saving new tokens to database for user ID: ${userId}`);

  try {
    const response = await fetch("/api/database-access/save-refresh-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expires: tokenData.expires,
        sessionAccessTokenExpiresAt: tokenData.sessionAccessTokenExpiresAt,
      }),
    });

    if (!response.ok) {
      console.error("Failed to save tokens to database", await response.text());
      throw new Error("Failed to save tokens to database");
    }

    console.log("Tokens successfully saved to database.");
  } catch (error) {
    console.error("Error saving tokens to database:", error);
    throw error; // Re-throwing the error to be handled by the calling function
  }
};

// Function to fetch the session access token expiration and related tokens from the API
export const fetchSessionAccessTokenExpiration = async (
  userIdForApiCall: number
): Promise<TokenData | null> => {
  // Ensure the userId is a number
  if (typeof userIdForApiCall !== 'number') {
    console.error(`Invalid userId: ${userIdForApiCall}. Must be a number.`);
    return null; // Or handle the error based on your requirements
  }

  console.log(`Fetching session access token expiration for user ID: ${userIdForApiCall}`);

  try {
    const response = await fetch("/api/database-access/session-load-checker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiRequestUserId: userIdForApiCall }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Data from API:", data);

      // Returning the full set of token data
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        sessionAccessTokenExpiresAt: data.sessionAccessTokenExpiresAt,
        expires: data.expires,
      };
    } else {
      console.error(
        "Failed to fetch token expiration from API. Response status:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error fetching token expiration from API:", error);
  }
  return null;
};
// Function to request new tokens using the refresh token
export const requestNewTokens = async (refreshToken: string) => {
  console.log(`Requesting new tokens using refresh token: ${refreshToken}`);

  try {
    const { data } = await authService.refreshToken(refreshToken);
    const newTokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expires: data.expires,
      sessionAccessTokenExpiresAt: new Date(
        Date.now() + 1.5 * 60 * 60 * 1000
      ).toISOString(),
    };
    console.log("New tokens received:", newTokenData);
    return newTokenData;
  } catch (error) {
    console.error("Error requesting new tokens:", error);
    throw error; // Re-throwing error to be handled by the calling function
  }
};

// Function to update the session with new token data
export const updateSessionWithNewToken = async (
  newToken: {
    accessToken: string;
    refreshToken: string;
    expires: number;
    sessionAccessTokenExpiresAt?: string;
  },
  setSession: SetSessionFunction,
  setName: React.Dispatch<React.SetStateAction<string | undefined>>,
  apiRequestUserId?: number
) => {
  console.log("Updating session with new tokens:", newToken);

  try {
    const user = await authService.fetchUserData(newToken.accessToken);
    console.log("Fetched user data:", user);

    const role = await authService.fetchUserRole(
      newToken.accessToken,
      user.role
    );
    console.log("Fetched user role:", role);

    // Update the session state
    setSession((prevSession: Session | null) => ({
      ...prevSession,
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
      expires: newToken.expires,
      sessionAccessTokenExpiresAt: newToken.sessionAccessTokenExpiresAt || "",
      user: {
        id: apiRequestUserId || user.id,
        name: user.first_name,
        email: user.email,
        role: role.name,
      },
    }));

    // Set the user's name
    setName(user.first_name);

    // Save tokens to cookies
    saveTokensToCookies(
      newToken.accessToken,
      newToken.refreshToken,
      newToken.expires,
      newToken.sessionAccessTokenExpiresAt || ""
    );

    // Save tokens to the database
    if (apiRequestUserId) {
      await saveTokensToDatabase(apiRequestUserId, {
        accessToken: newToken.accessToken,
        refreshToken: newToken.refreshToken,
        sessionAccessTokenExpiresAt: newToken.sessionAccessTokenExpiresAt || "",
        expires: newToken.expires,
      });
    }

    console.log("Session successfully updated with new tokens.");
  } catch (error) {
    console.error("Error updating session with new tokens:", error);
    throw error; // Re-throwing error to be handled by the calling function
  }
};

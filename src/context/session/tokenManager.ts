import Cookies from "js-cookie";
import {
  fetchSessionAccessTokenExpiration,
  requestNewTokens,
  updateSessionWithNewToken,
  saveTokensToDatabase,
} from "./apiManager";
import { Session, SetSessionFunction } from "../sessionTypes";

// This function checks if the token is still valid based on its expiration date
export const checkTokenValidity = async (
  session: Session | null,
  userIdForApiCall: number,
  setSession: SetSessionFunction,
  setName: React.Dispatch<React.SetStateAction<string | undefined>>
): Promise<string | null> => {
  console.log("Starting token validity check...");

  // Get the session's access token expiration date from the current session state
  let sessionAccessTokenExpiresAt: string | null =
    session?.sessionAccessTokenExpiresAt || null;

  console.log(
    "Session expiration from current state:",
    sessionAccessTokenExpiresAt
  );

  // If the session has an expiration date and the token is still valid, return the access token
  if (
    sessionAccessTokenExpiresAt &&
    isTokenStillValid(sessionAccessTokenExpiresAt)
  ) {
    console.log("Token is still valid based on the current session state.");
    return session?.accessToken || null;
  }

  // If the session token expiration is not available or not valid, try fetching from the API
  if (userIdForApiCall) {

    // Fetch the session token expiration from the API
    const tokenData = await fetchSessionAccessTokenExpiration(userIdForApiCall);

    // Check if the newly fetched token expiration date is valid
    if (tokenData && isTokenStillValid(tokenData.sessionAccessTokenExpiresAt)) {
      console.log("Token is valid after checking with API.");

      // Update the session with the valid token data
      setSession &&
        setSession({
          user: {
            id: userIdForApiCall,
            name: "", // Update with appropriate user details
            email: "",
            role: "",
          },
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expires: tokenData.expires,
          sessionAccessTokenExpiresAt: tokenData.sessionAccessTokenExpiresAt,
        });

      return tokenData.accessToken; // Return the valid access token
    } else if (tokenData) {
      console.warn("Token from API is expired or invalid. Refreshing token...");

      // If the access token is invalid, use the refresh token to get a new access token
      const newTokenData = await requestNewTokens(tokenData.refreshToken);
      console.log("New tokens received after refresh:", newTokenData);

      // Update the session with the new tokens
      if (setSession !== undefined) {
        await updateSessionWithNewToken(
          newTokenData,
          setSession,
          setName,
          userIdForApiCall
        );
      }

      return newTokenData.accessToken; // Return the refreshed access token
    }
  }

  // If no valid session token is found, return null
  console.warn("No valid session token found after all checks.");
  return null;
};

export const isTokenStillValid = (
  sessionAccessTokenExpiresAt: string
): boolean => {
  // Convert both dates to UTC for comparison
  const expiresAtDate = new Date(sessionAccessTokenExpiresAt);
  const currentDate = new Date();

  // Log both dates for debugging
  console.log("Session expiration (UTC):", expiresAtDate.toISOString());
  console.log("Current date (UTC):", currentDate.toISOString());

  // Check if current date is before the expiration date
  const isValid = currentDate < expiresAtDate;
  console.log("Checking if token is still valid:", isValid);

  return isValid;
};

// Function to get session information from the URL, if available
export const getSessionFromUrl = (
  setSession: SetSessionFunction,
  setName: React.Dispatch<React.SetStateAction<string | undefined>>
): string | undefined => {
  console.log("Checking for session information in URL...");

  if (
    window.location.search &&
    new URLSearchParams(window.location.search).get("userId") !== null
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const sessionAccessTokenExpiresAt = urlParams.get(
      "sessionAccessTokenExpiresAt"
    );

    console.log("URL parameters found:", {
      userId,
      accessToken,
      refreshToken,
      sessionAccessTokenExpiresAt,
    });

    if (userId && accessToken && refreshToken && sessionAccessTokenExpiresAt) {
      const currentDate = new Date();
      const currentTime = currentDate.getTime();
      const expireTime = new Date(sessionAccessTokenExpiresAt).getTime();

      // If the current time is before the expiration time, use the token from the URL
      if (currentTime < expireTime) {
        console.log("Token from URL is still valid. Setting session...");
        setSession &&
          setSession({
            user: {
              id: parseInt(userId),
              name: "",
              email: "",
              role: "",
            },
            accessToken,
            refreshToken,
            expires: 0,
            sessionAccessTokenExpiresAt,
          });
        return accessToken;
      } else {
        console.warn("Token from URL has expired.");
      }
    } else {
      console.warn("Incomplete session data in URL.");
    }
  }

  console.log("No valid session information found in URL.");
  return undefined;
};

// Function to refresh the access token
export const refreshAccessToken = async (
  sessionUserId?: number,
  apiRequestUserId?: number,
  setSession?: SetSessionFunction,
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>,
  overrideToken?: string
): Promise<string | null> => {
  console.log("Attempting to refresh access token...");

  if (overrideToken) {
    console.log("Using override token.");
    return overrideToken;
  }

  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    console.error("No refresh token available in cookies.");
  }

  // If the session token expiration is not available or not valid, try fetching from the API
  if (apiRequestUserId) {
    console.log(
      "Session token is not valid or missing. Fetching from the API..."
    );

    // Fetch the session token expiration from the API
    const tokenData = await fetchSessionAccessTokenExpiration(apiRequestUserId);

    // Check if the newly fetched token expiration date is valid
    if (tokenData && isTokenStillValid(tokenData.sessionAccessTokenExpiresAt)) {
      console.log("Token is valid after checking with API.");

      // Update the session with the valid token data
      setSession &&
        setSession({
          user: {
            id: apiRequestUserId,
            name: "", // Update with appropriate user details
            email: "",
            role: "",
          },
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expires: tokenData.expires,
          sessionAccessTokenExpiresAt: tokenData.sessionAccessTokenExpiresAt,
        });

      return tokenData.accessToken; // Return the valid access token
    } else if (tokenData?.refreshToken) {
      console.warn("Token from API is expired or invalid. Refreshing token...");

      // If the access token is invalid, use the refresh token to get a new access token
      const newTokenData = await requestNewTokens(tokenData.refreshToken);
      console.log("New tokens received after refresh:", newTokenData);

      return newTokenData.accessToken; // Return the refreshed access token
    }
  }

  try {
    console.log("Requesting new tokens using refresh token...");
    const newTokenData = await requestNewTokens(refreshToken || "");

    console.log("New tokens received:", newTokenData);

    if (setSession && setName) {
      console.log("Updating session with new tokens...");
      await updateSessionWithNewToken(
        newTokenData,
        setSession,
        setName,
        apiRequestUserId
      );
    }

    return newTokenData.accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
};

// Function to handle token refresh within an API call
export const withTokenRefresh = async (
  makeApiCall: (token: string, userId?: number) => Promise<any>,
  session: Session | null,
  setSession: SetSessionFunction,
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>,  // Make setName optional
  userIdForApiCall?: number,
  overrideRefreshToken?: string
) => {
  console.log("Preparing to make API call with token refresh...");

  let tokenToUse: string | undefined;

  // First, check for a valid token in the URL parameters
  if (!tokenToUse) {
    console.log("Checking for token in URL...");
    // Check if setName is defined before passing it
    if (setName) {
      tokenToUse = getSessionFromUrl(setSession, setName);
    }
  }

  // If no override token or valid URL token, validate the current session token
  if (!tokenToUse) {
    console.log("Validating current session token...");
    // Check if setName is defined before passing it
    tokenToUse = (await checkTokenValidity(
      session,
      userIdForApiCall ?? 0,
      setSession,
      setName!  // Only pass setName if it exists
    )) || "";
  }

  // If no valid session token, attempt to refresh the token
  if (!tokenToUse) {
    console.log("Token invalid or expired, attempting to refresh...");
    // Check if setName is defined before passing it
    tokenToUse = (await refreshAccessToken(
      session?.user.id,
      userIdForApiCall ?? session?.user.id,
      setSession,
      setName ? setName : undefined  // Only pass setName if it exists
    )) ?? undefined;
  }

  // If we have a valid token at this point, proceed with the API call
  if (tokenToUse) {
    console.log("Making API call with token:", tokenToUse);
    return await makeApiCall(tokenToUse, userIdForApiCall ?? session?.user.id);
  } else {
    console.error("Failed to retrieve a valid token for API call.");
    throw new Error("Failed to retrieve a valid token");
  }
};

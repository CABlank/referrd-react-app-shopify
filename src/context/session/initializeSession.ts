import Cookies from "js-cookie"; // Helps us read and write cookies (small data stored in the browser)
import authService from "../../services/auth/auth"; // Service that helps us talk to the backend
import { handleFetchUserDataError } from "./sessionUtils"; // Function to handle errors when fetching user data
import { refreshAccessToken } from "./tokenManager"; // Function to refresh the session token
import { Session, SetSessionFunction } from "../sessionTypes"; // Types for the session

export const initializeSession = async ({
  setSession,
  setName,
  setLoading,
  hasInitialized,
}: {
  setSession: SetSessionFunction;
  setName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasInitialized: React.MutableRefObject<boolean>;
}) => {
  // Check if the session has already been initialized
  if (hasInitialized.current) {
    console.log("Session initialization skipped: already initialized.");
    return;
  }

  console.log("Initializing session...");

  setLoading(true); // Indicate that the session is being loaded

  // Retrieve tokens and expiration time from cookies
  const token = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");
  const sessionAccessTokenExpiresAt = Cookies.get(
    "session_access_token_expires_at"
  );

  console.log("Retrieved from cookies:", {
    token,
    refreshToken,
    sessionAccessTokenExpiresAt,
  });

  if (token) {
    console.log("Token found. Fetching user data...");
    try {
      // Fetch user data using the token
      const user = await authService.fetchUserData(token);
      console.log("User data fetched:", user);

      // Fetch the user's role
      const role = await authService.fetchUserRole(token, user.role);
      console.log("User role fetched:", role);

      // Update session state with the fetched user data and tokens
      setSession({
        user: {
          id: user.id,
          name: user.first_name,
          email: user.email,
          role: role.name,
        },
        token,
        refreshToken: refreshToken || "",
        expires: Number(Cookies.get("token_expiration")) || 0,
        sessionAccessTokenExpiresAt: sessionAccessTokenExpiresAt || "",
      });

      console.log("Session state updated with user data.");
      setName(user.first_name); // Update the user's name in the state
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error by attempting to refresh the token or show an error message
      await handleFetchUserDataError(
        error,
        refreshAccessToken,
        setSession,
        setName,
        null
      );
    }
  } else {
    console.log("No token found. Skipping user data fetch.");
  }

  setLoading(false); // Indicate that session loading is complete
  hasInitialized.current = true; // Mark the session as initialized
  console.log("Session initialization complete.");
};

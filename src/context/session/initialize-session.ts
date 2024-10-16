import Cookies from "js-cookie"; // Helps us read and write cookies (small data stored in the browser)
import authService from "../../services/auth/auth"; // Service that helps us talk to the backend
import { handleFetchUserDataError } from "./session-utils"; // Function to handle errors when fetching user data
import { refreshAccessToken } from "./token-manager"; // Function to refresh the session token
import { Session, SetSessionFunction } from "../session-types"; // Types for the session

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
    return;
  }


  setLoading(true); // Indicate that the session is being loaded

  // Retrieve tokens and expiration time from cookies
  const accessToken = Cookies.get("accessToken");
  const refreshToken =
    Cookies.get("refreshToken");
  const sessionAccessTokenExpiresAt =

    Cookies.get("sessionAccessTokenExpiresAt");


  if (accessToken) {
    try {
      // Fetch user data using the token
      const user = await authService.fetchUserData(accessToken);

      // Fetch the user's role
      const role = await authService.fetchUserRole(accessToken, user.role);

      // Update session state with the fetched user data and tokens
      setSession({
        user: {
          id: user.id,
          name: user.first_name,
          email: user.email,
          role: role.name,
        },
        accessToken,
        refreshToken: refreshToken || "",
        expires: Number(Cookies.get("token_expiration")) || 0,
        sessionAccessTokenExpiresAt: sessionAccessTokenExpiresAt || "",
      });

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
  }

  setLoading(false); // Indicate that session loading is complete
  hasInitialized.current = true; // Mark the session as initialized
};

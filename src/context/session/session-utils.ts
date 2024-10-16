import Cookies from "js-cookie";
import { SessionContextType, Session } from "../session-types";
import authService from "../../services/auth/auth";
import { getSessionExpirationTime } from "@/utils/sessionTimeUtils";

// Utility function to clear session data and cookies
export const clearSession = (
  setSession: (session: SessionContextType["session"]) => void,
  setName: (name: string | undefined) => void
) => {
  setSession(null);
  setName(undefined);
  Cookies.remove("accessToken");

  Cookies.remove("token_expiration");

  Cookies.remove("__stripe_mid");
  Cookies.remove("__stripe_sid");

  Cookies.remove("refreshToken");
  Cookies.remove("sessionAccessTokenExpiresAt");
};

// Utility function to save tokens to cookies
export const saveTokensToCookies = (
  accessToken: string,
  refreshToken: string,
  expires: number,
  sessionAccessTokenExpiresAt: string // Add the new parameter
) => {
  const expirationTime = Date.now() + expires * 1000;

  // Save the expiration time of the access token in cookies
  Cookies.set("token_expiration", String(expirationTime), {
    secure: true,
    sameSite: "Strict",
  });

  // Save the access token, refresh token, and session access token expiration time
  Cookies.set("accessToken", accessToken, { secure: true, sameSite: "Strict" });
  Cookies.set("refreshToken", refreshToken, {
    secure: true,
    sameSite: "Strict",
  });

  // Save the sessionAccessTokenExpiresAt as a cookie
  Cookies.set("sessionAccessTokenExpiresAt", sessionAccessTokenExpiresAt, {
    secure: true,
    sameSite: "Strict",
  });
};

// Utility function to handle logout
export const logout = async (
  setSession: (session: SessionContextType["session"]) => void,
  setName: (name: string | undefined) => void,
  session: SessionContextType["session"]
) => {
  try {
    const refreshToken = Cookies.get("refreshToken") || session?.refreshToken;
    if (refreshToken) await authService.logout(refreshToken);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearSession(setSession, setName);
  }
};

// Utility function to handle fetch user data errors
export const handleFetchUserDataError = async (
  error: any,
  refreshAccessToken: () => Promise<string | null>,
  setSession: (session: SessionContextType["session"]) => void,
  setName: (name: string | undefined) => void,
  session: SessionContextType["session"] | null
) => {
  if (error.response?.status === 401 || error.message === "Token expired") {
    const accessToken = await refreshAccessToken();
    if (accessToken) {
      try {
        const user = await authService.fetchUserData(accessToken);
        const role = await authService.fetchUserRole(accessToken, user.role);

        const sessionAccessTokenExpiresAt = getSessionExpirationTime();

        // Update the session state with the new token and expiration time
        setSession({
          user: {
            id: user.id,
            name: user.first_name,
            email: user.email,
            role: role.name,
          },
          accessToken,
          refreshToken: session?.refreshToken || "",
          expires: session?.expires || 0,
          sessionAccessTokenExpiresAt:
            sessionAccessTokenExpiresAt.toISOString(), // Include the new expiration time
        });

        setName(user.first_name);
        return;
      } catch (err) {
        console.error("Error fetching user data after refresh:", err);
      }
    }
    await logout(setSession, setName, session);
  } else {
    console.error("Error fetching user data:", error);
    await logout(setSession, setName, session);
  }
};

// The login function
export const login = async (
  credentials: { email: string; password: string },
  setLoading: (loading: boolean) => void,
  setSession: (session: Session | null) => void,
  setName: (name: string | undefined) => void
): Promise<void> => {
  setLoading(true);
  try {
    const { data } = await authService.login(credentials);
    const { access_token: accessToken, refresh_token: refreshToken, expires } = data;


    // Calculate the new session access token expiration time (1.5 hours from now)
    const sessionAccessTokenExpiresAt = getSessionExpirationTime();

    // Save the tokens and expiration to cookies, including the new session expiration time
    saveTokensToCookies(
      accessToken,
      refreshToken,
      expires,
      sessionAccessTokenExpiresAt.toISOString()
    );

    const user = await authService.fetchUserData(accessToken);
    const role = await authService.fetchUserRole(accessToken, user.role);



    // Set the session state, including the new session expiration time
    setSession({
      user: {
        id: user.id,
        name: user.first_name,
        email: user.email,
        role: role.name,
      },
      accessToken,
      refreshToken,
      expires,
      sessionAccessTokenExpiresAt: sessionAccessTokenExpiresAt.toISOString(), // Include this in the session
    });

    setName(user.first_name);
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};

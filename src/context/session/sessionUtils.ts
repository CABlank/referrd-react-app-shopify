import Cookies from "js-cookie";
import { SessionContextType, Session } from "../sessionTypes";
import authService from "../../services/auth/auth";

// Utility function to clear session data and cookies
export const clearSession = (
  setSession: (session: SessionContextType["session"]) => void,
  setName: (name: string | undefined) => void
) => {
  setSession(null);
  setName(undefined);
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("token_expiration");
  Cookies.remove("session_access_token_expires_at"); // Remove the new session expiration cookie
  Cookies.remove("__stripe_mid");
  Cookies.remove("__stripe_sid");
};

// Utility function to save tokens to cookies
export const saveTokensToCookies = (
  token: string,
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
  Cookies.set("access_token", token, { secure: true, sameSite: "Strict" });
  Cookies.set("refresh_token", refreshToken, {
    secure: true,
    sameSite: "Strict",
  });

  // Save the sessionAccessTokenExpiresAt as a cookie
  Cookies.set("session_access_token_expires_at", sessionAccessTokenExpiresAt, {
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
    const refreshToken = Cookies.get("refresh_token") || session?.refreshToken;
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
    const token = await refreshAccessToken();
    if (token) {
      try {
        const user = await authService.fetchUserData(token);
        const role = await authService.fetchUserRole(token, user.role);

        // Calculate the new session access token expiration time (1.5 hours from now)
        const sessionAccessTokenExpiresAt = new Date();
        sessionAccessTokenExpiresAt.setSeconds(
          sessionAccessTokenExpiresAt.getSeconds() + 1.5 * 60 * 60
        );

        console.log(
          " Updating session with new token and expiration time from handleFetchUserDataError"
        );

        // Update the session state with the new token and expiration time
        setSession({
          user: {
            id: user.id,
            name: user.first_name,
            email: user.email,
            role: role.name,
          },
          token,
          refreshToken: session?.refreshToken || "",
          expires: session?.expires || 0,
          sessionAccessTokenExpiresAt:
            sessionAccessTokenExpiresAt.toISOString(), // Include the new expiration time
        });

        setName(user.first_name);
        console.log("User data fetched after token refresh:", user);
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
    const { access_token: token, refresh_token: refreshToken, expires } = data;

    // Calculate the new session access token expiration time (1.5 hours from now)
    const sessionAccessTokenExpiresAt = new Date();
    sessionAccessTokenExpiresAt.setSeconds(
      sessionAccessTokenExpiresAt.getSeconds() + 1.5 * 60 * 60
    );

    // Save the tokens and expiration to cookies, including the new session expiration time
    saveTokensToCookies(
      token,
      refreshToken,
      expires,
      sessionAccessTokenExpiresAt.toISOString()
    );

    const user = await authService.fetchUserData(token);
    const role = await authService.fetchUserRole(token, user.role);

    console.log(
      "Updating session with new token and expiration time from login function inf sessionUtils.ts"
    );

    // Set the session state, including the new session expiration time
    setSession({
      user: {
        id: user.id,
        name: user.first_name,
        email: user.email,
        role: role.name,
      },
      token,
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

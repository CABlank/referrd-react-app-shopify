import Cookies from "js-cookie";
import { SessionContextType } from "./sessionTypes";
import authService from "../services/auth/auth";

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
  Cookies.remove("__stripe_mid");
  Cookies.remove("__stripe_sid");
};

// Utility function to save tokens to cookies
export const saveTokensToCookies = (
  token: string,
  refreshToken: string,
  expires: number
) => {
  const expirationTime = Date.now() + expires * 1000;
  Cookies.set("token_expiration", String(expirationTime), {
    secure: true,
    sameSite: "Strict",
  });
  Cookies.set("access_token", token, { secure: true, sameSite: "Strict" });
  Cookies.set("refresh_token", refreshToken, {
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

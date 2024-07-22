import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import authService from "../services/auth/auth";
import Cookies from "js-cookie";

interface User {
  name: string;
  email: string;
  role: string;
}

interface Session {
  user: User;
  token: string;
  refreshToken: string;
  expires: number;
}

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAccessToken: (propsRefreshToken?: string) => Promise<string | null>;
  withTokenRefresh: (
    apiCall: (token: string) => Promise<any>,
    propsRefreshToken?: string
  ) => Promise<any>;
  loading: boolean;
  name?: string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | undefined>(undefined);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await authService.login(credentials);
      const {
        access_token: token,
        refresh_token: refreshToken,
        expires,
      } = data;

      const expirationTime = Date.now() + expires * 1000;

      Cookies.set("token_expiration", String(expirationTime), {
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("access_token", token, {
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("refresh_token", refreshToken, {
        secure: true,
        sameSite: "Strict",
      });

      const user = await authService.fetchUserData(token);
      const role = await authService.fetchUserRole(token, user.role);

      setSession({
        user: { name: user.first_name, email: user.email, role: role.name },
        token,
        refreshToken,
        expires,
      });
      setName(user.first_name);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (session) {
        const refreshToken =
          Cookies.get("refresh_token") || session.refreshToken;
        if (refreshToken) {
          await authService.logout(refreshToken);
        } else {
          console.error("No refresh token available for logout.");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setSession(null);
      setName(undefined);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("token_expiration");
    }
  };

  const refreshAccessToken = async (
    propsRefreshToken?: string
  ): Promise<string | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const refreshTokenToUse =
          propsRefreshToken ||
          Cookies.get("refresh_token") ||
          session?.refreshToken;
        if (!refreshTokenToUse) throw new Error("No refresh token found");

        const { data } = await authService.refreshToken(refreshTokenToUse);
        const {
          access_token: token,
          refresh_token: newRefreshToken,
          expires,
        } = data;
        const newExpirationTime = Date.now() + expires * 1000;

        // Fetch user data with the new token
        const user = await authService.fetchUserData(token);
        const role = await authService.fetchUserRole(token, user.role);

        // Update session state with user data
        setSession((prev) =>
          prev
            ? {
                ...prev,
                token,
                refreshToken: newRefreshToken,
                expires,
                user: {
                  name: user.first_name,
                  email: user.email,
                  role: role.name,
                },
              }
            : {
                user: {
                  name: user.first_name,
                  email: user.email,
                  role: role.name,
                },
                token,
                refreshToken: newRefreshToken,
                expires,
              }
        );
        setName(user.first_name);

        // Update cookies
        Cookies.set("token_expiration", String(newExpirationTime), {
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("access_token", token, {
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("refresh_token", newRefreshToken, {
          secure: true,
          sameSite: "Strict",
        });

        return token;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        await logout();
        return null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    const token = await refreshPromise;
    refreshPromiseRef.current = null;
    return token;
  };

  const withTokenRefresh = async (
    apiCall: (token: string) => Promise<any>,
    propsRefreshToken?: string
  ) => {
    const token = await refreshAccessToken(propsRefreshToken);
    if (!token) {
      throw new Error("Failed to refresh token");
    }
    return await apiCall(token);
  };

  const handleFetchUserDataError = async (error: any) => {
    if (error.response?.status === 401 || error.message === "Token expired") {
      const token = await refreshAccessToken();
      if (token) {
        try {
          const user = await authService.fetchUserData(token);
          const role = await authService.fetchUserRole(token, user.role);
          setSession({
            user: { name: user.first_name, email: user.email, role: role.name },
            token,
            refreshToken: session?.refreshToken || "",
            expires: session?.expires || 0,
          });
          setName(user.first_name);
          return;
        } catch (err) {
          console.error("Error fetching user data after refresh:", err);
        }
      }
      await logout();
    } else {
      console.error("Error fetching user data:", error);
      await logout();
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      const token = session?.token || Cookies.get("access_token");
      if (token) {
        try {
          const user = await authService.fetchUserData(token);
          const role = await authService.fetchUserRole(token, user.role);
          setSession({
            user: { name: user.first_name, email: user.email, role: role.name },
            token,
            refreshToken:
              session?.refreshToken || Cookies.get("refresh_token") || "",
            expires:
              session?.expires || Number(Cookies.get("token_expiration")) || 0,
          });
          setName(user.first_name);
        } catch (error) {
          await handleFetchUserDataError(error);
        }
      } else {
        setLoading(false);
      }
    };

    initializeSession();
  }, [session?.token]); // Depend on session?.token to ensure it runs on session token change

  useEffect(() => {
    if (session) {
      setLoading(false);
    }
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        login,
        logout,
        refreshAccessToken,
        withTokenRefresh,
        loading,
        name,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

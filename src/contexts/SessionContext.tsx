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
import { PrismaClient } from "@prisma/client";
import { updateTokens } from "../pages/api/sessionLoadChecker";

const prisma = new PrismaClient();

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

interface Session {
  id?: number;
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
    apiCall: (token: string, userId?: number) => Promise<any>,
    propsRefreshToken?: string,
    userId?: number
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
  const hasInitialized = useRef(false);

  const saveTokensToCookies = (
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
    console.log("Tokens saved to cookies:", { token, refreshToken });
  };

  const clearSession = () => {
    setSession(null);
    setName(undefined);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("token_expiration");
    Cookies.remove("__stripe_mid");
    Cookies.remove("__stripe_sid");
    console.log("Session cleared and cookies removed");
  };

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await authService.login(credentials);
      const {
        access_token: token,
        refresh_token: refreshToken,
        expires,
      } = data;
      saveTokensToCookies(token, refreshToken, expires);

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
        refreshToken,
        expires,
      });
      setName(user.first_name);
      console.log("User logged in:", user);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken =
        Cookies.get("refresh_token") || session?.refreshToken;
      if (refreshToken) await authService.logout(refreshToken);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearSession();
    }
  };

  let isRefreshing = false;

  const withTokenRefresh = async (
    apiCall: (token: string, userId?: number) => Promise<any>, // Accept optional userId
    propsRefreshToken?: string,
    userId?: number
  ) => {
    console.log("user id SESSIONCONTEXT:", userId); // Log the userId

    const PrismaUserId = userId;
    console.log("Prisma user id:", PrismaUserId); // Log the userId

    const token = await refreshAccessToken(
      propsRefreshToken,
      session?.user.id,
      PrismaUserId
    ); // Pass userId if it exists

    if (!token) throw new Error("Failed to refresh token");

    console.log("Using access token for API call:", token);
    return await apiCall(token, session?.user.id); // Pass userId to the API call
  };

  const refreshAccessToken = async (
    propsRefreshToken?: string,
    userId?: number, // Optional userId parameter
    PrismaUserId?: number // Optional userId parameter
  ): Promise<string | null> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    const refreshPromise = (async () => {
      let refreshTokenToUse =
        propsRefreshToken ||
        Cookies.get("refresh_token") ||
        session?.refreshToken;

      if (!refreshTokenToUse && session?.token) {
        // If refreshTokenToUse is still not found, try to get it from the database using the access token
        const tokenRecord = await prisma.token.findFirst({
          where: {
            accessToken: session.token,
          },
        });

        if (tokenRecord) {
          refreshTokenToUse = tokenRecord.refreshToken;
        }
      }

      if (!refreshTokenToUse) {
        console.error("No refresh token found");
        return null;
      }

      console.log("Using refresh token:", refreshTokenToUse);

      try {
        console.log("PrismaUserId id:", PrismaUserId); // Log the userId
        const { data } = await authService.refreshToken(refreshTokenToUse);
        const {
          access_token: token,
          refresh_token: newRefreshToken,
          expires,
        } = data;

        console.log("New access token obtained:", token);
        console.log("New refresh token obtained:", newRefreshToken);

        const user = await authService.fetchUserData(token);
        const role = await authService.fetchUserRole(token, user.role);
        setSession((prev) =>
          prev
            ? {
                ...prev,
                token,
                refreshToken: newRefreshToken,
                expires,
                user: {
                  id: user.id,
                  name: user.first_name,
                  email: user.email,
                  role: role.name,
                },
              }
            : {
                user: {
                  id: user.id,
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
        saveTokensToCookies(token, newRefreshToken, expires);

        // Update the refresh token in the database using the API endpoint
        if (PrismaUserId) {
          await fetch("/api/sessionLoadChecker", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              PrismaUserId,
              accessToken: token,
              refreshToken: newRefreshToken,
              expires,
            }),
          });
        }

        console.log("Refreshed access token for user:", userId); // Log the userId
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

  const handleFetchUserDataError = async (error: any) => {
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
      await logout();
    } else {
      console.error("Error fetching user data:", error);
      await logout();
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      if (hasInitialized.current) return;

      setLoading(true);
      const token = Cookies.get("access_token");
      const refreshToken = Cookies.get("refresh_token");
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
            refreshToken: refreshToken || "",
            expires: Number(Cookies.get("token_expiration")) || 0,
          });
          setName(user.first_name);
        } catch (error) {
          await handleFetchUserDataError(error);
        }
      }
      setLoading(false);
      hasInitialized.current = true;
    };

    initializeSession();
  }, []);

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
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
};

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
import { User, Session, SessionContextType } from "./sessionTypes";
import {
  saveTokensToCookies,
  logout,
  handleFetchUserDataError,
} from "./sessionUtils";

const prisma = new PrismaClient();

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | undefined>(undefined);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
  const hasInitialized = useRef(false);

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
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const withTokenRefresh = async (
    apiCall: (token: string, userId?: number) => Promise<any>, // The API call that requires a valid token
    refreshTokenOverride?: string, // An optional refresh token provided to override the existing one
    userId?: number // The ID of the user making the request from prisa (optional to identify is comming from shopify app dashboard or in the browser app )
  ) => {
    console.log("User ID for the current operation:", userId);

    // Refresh the access token using either the override refresh token or the one from the session
    const token = await refreshAccessToken(
      refreshTokenOverride, // Use the provided refresh token if available
      session?.user.id, // The user ID from the session
      userId // The user ID associated with the current request
    );

    if (!token) throw new Error("Failed to refresh token");

    console.log("Using access token for API call:", token);

    // Make the API call with the refreshed token and the session user ID
    return await apiCall(token, session?.user.id);
  };

  const refreshAccessToken = async (
    overrideRefreshToken?: string, // Optional refresh token provided as an override
    sessionUserId?: number, // The ID of the user stored in the session
    requestUserId?: number // Optional user ID associated with the current request
  ): Promise<string | null> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    const refreshPromise = (async () => {
      let refreshTokenToUse: string | undefined;

      if (requestUserId) {
        // When requestUserId is provided, attempt to get the refresh token from the database
        try {
          const response = await fetch("/api/sessionLoadChecker", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: requestUserId }),
          });

          const result = await response.json();

          if (result.refreshToken) {
            refreshTokenToUse = result.refreshToken;
            console.log(
              `Refresh token retrieved from database for userId: ${requestUserId}`
            );
          } else {
            console.log(
              `No refresh token found in database for userId: ${requestUserId}`
            );
          }
        } catch (error) {
          console.error("Error fetching refresh token from database:", error);
        }

        // If no refresh token found in the database, fall back to the override token
        if (!refreshTokenToUse && overrideRefreshToken) {
          refreshTokenToUse = overrideRefreshToken;
          console.log("Using override refresh token");
        }
      } else {
        // When requestUserId is not provided, use the override token, cookies, or session
        refreshTokenToUse =
          overrideRefreshToken ||
          Cookies.get("refresh_token") ||
          session?.refreshToken;

        console.log("Using refresh token from override, cookies, or session");
      }

      if (!refreshTokenToUse) {
        console.error("No refresh token found");
        return null;
      }

      console.log("Using refresh token:", refreshTokenToUse);

      try {
        console.log("PrismaUserId id:", requestUserId); // Log the userId
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
        if (requestUserId) {
          await fetch("/api/sessionLoadChecker", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestUserId,
              accessToken: token,
              refreshToken: newRefreshToken,
              expires,
            }),
          });
        }

        console.log("Refreshed access token for user:", sessionUserId); // Log the userId
        return token;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        await logout(setSession, setName, session);
        return null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    const token = await refreshPromise;
    refreshPromiseRef.current = null;
    return token;
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
          await await handleFetchUserDataError(
            error,
            refreshAccessToken,
            setSession,
            setName,
            session
          );
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
        logout: () => logout(setSession, setName, session),
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

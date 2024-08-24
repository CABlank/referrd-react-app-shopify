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
import { User, Session, SessionContextType } from "./sessionTypes";
import {
  saveTokensToCookies,
  logout,
  handleFetchUserDataError,
  login,
} from "./session/sessionUtils";

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | undefined>(undefined);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
  const refreshQueue: (() => void)[] = [];
  const hasInitialized = useRef(false);

  const checkTokenValidity = async (
    userIdForApiCall: number
  ): Promise<boolean> => {
    console.log("Checking token validity...");

    // Step 2: Check if sessionAccessTokenExpiresAt is available in session
    let sessionAccessTokenExpiresAt: string | null =
      session?.sessionAccessTokenExpiresAt || null;

    if (sessionAccessTokenExpiresAt) {
      console.log(
        "Found sessionAccessTokenExpiresAt in session:",
        sessionAccessTokenExpiresAt
      );

      // Step 3: If available, check if the token is still valid
      if (isTokenStillValid(sessionAccessTokenExpiresAt)) {
        console.log("Token is still valid.");
        return true;
      } else {
        console.warn("Token found in session has expired.");
      }
    } else {
      console.log(
        "sessionAccessTokenExpiresAt not found in session. Fetching from API..."
      );
    }

    // Step 4: If not available in session, fetch it from the API
    if (userIdForApiCall) {
      sessionAccessTokenExpiresAt =
        await fetchSessionAccessTokenExpiration(userIdForApiCall);
      console.log(
        "Fetched sessionAccessTokenExpiresAt from API:",
        sessionAccessTokenExpiresAt
      );

      // Step 5: If fetched, check if the token is still valid
      if (
        sessionAccessTokenExpiresAt &&
        isTokenStillValid(sessionAccessTokenExpiresAt)
      ) {
        console.log("Token fetched from API is still valid.");
        return true;
      } else {
        console.warn("Token fetched from API has expired or was not found.");
      }
    } else {
      console.error(
        "No user ID found in session. Cannot fetch token expiration."
      );
    }

    // Step 6: If all checks fail, treat the token as expired
    console.warn(
      "sessionAccessTokenExpiresAt is not available or token has expired."
    );
    return false;
  };
  // Helper function to check if the token is still valid
  const isTokenStillValid = (sessionAccessTokenExpiresAt: string): boolean => {
    const expiresAtDate = new Date(sessionAccessTokenExpiresAt);
    const currentTime = new Date();

    return currentTime < expiresAtDate;
  };

  // Helper function to fetch the session access token expiration time from the API
  const fetchSessionAccessTokenExpiration = async (
    userIdForApiCall: number
  ): Promise<string | null> => {
    try {
      const response = await fetch("/api/sessionLoadChecker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiRequestUserId: userIdForApiCall }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.sessionAccessTokenExpiresAt || null;
      } else {
        console.error("Failed to fetch token expiration from API");
        return null;
      }
    } catch (error) {
      console.error("Error fetching token expiration from API:", error);
      return null;
    }
  };

  const withTokenRefresh = async (
    makeApiCall: (token: string, userId?: number) => Promise<any>,
    overrideRefreshToken?: string,
    userIdForApiCall?: number
  ) => {
    console.log("Current User ID:", userIdForApiCall);

    // Check for session information in the URL parameters
    if (
      window.location.search &&
      new URLSearchParams(window.location.search).get("userId") !== null
    ) {
      const urlParams = new URLSearchParams(window.location.search);
      console.log("URL parameters:", urlParams.toString());
      console.log("User ID from URL parameters:", urlParams.get("userId"));
      console.log("Token from URL parameters:", urlParams.get("token"));

      // Extract parameters from the URL
      const userId = urlParams.get("userId");
      const token = urlParams.get("token");
      const refreshToken = urlParams.get("refreshToken");
      const sessionAccessTokenExpiresAt = urlParams.get(
        "sessionAccessTokenExpiresAt"
      );

      // If userId is present in the URL, update userIdForApiCall
      if (userId) {
        userIdForApiCall = parseInt(userId);
        console.log("User ID from URL parameters:", userIdForApiCall);
      }

      // Check if the token, refreshToken, and expiration time are present in the URL
      if (token && refreshToken && sessionAccessTokenExpiresAt) {
        const currentDate = new Date();
        const currentTime = currentDate.getTime();
        const expireTime = new Date(sessionAccessTokenExpiresAt).getTime();

        setSession({
          user: {
            id: userIdForApiCall ?? 0,
            name: "",
            email: "",
            role: "",
          },
          token,
          refreshToken,
          expires: 0,
          sessionAccessTokenExpiresAt,
        });

        // If the current time is before the expiration time, use the token from the URL
        if (currentTime < expireTime) {
          console.log("Using token from URL parameters");
          console.log("Token for API call from url", token);
          return await makeApiCall(token, userIdForApiCall);
        }
      }
    } else {
      // If no valid token is found in the URL, proceed with existing session or refresh logic
      const isTokenValid = await checkTokenValidity(userIdForApiCall ?? 0);

      let tokenToUse: string | null = null;

      if (isTokenValid) {
        tokenToUse = session?.token ?? null;
      } else {
        // Token is not valid or doesn't exist, refresh the token
        const newToken = await refreshAccessToken(
          overrideRefreshToken,
          session?.user.id,
          userIdForApiCall
        );

        if (!newToken) {
          throw new Error("Could not refresh the token");
        }

        tokenToUse = newToken;

        // Update session with the new token and extended expiration time
        setSession((prevSession) =>
          prevSession
            ? {
                ...prevSession,
                token: newToken,
                sessionAccessTokenExpiresAt: new Date(
                  Date.now() + 60 * 1000
                ).toISOString(), // Extend expiration by 4 hours
                user: {
                  ...prevSession.user,
                  id: userIdForApiCall ?? prevSession.user.id, // Use userIdForApiCall if it exists, otherwise keep the existing user.id
                },
              }
            : null
        );

        // Log the updated session user ID
        console.log(
          "Updated session user ID:",
          userIdForApiCall ?? session?.user.id
        );
      }

      console.log("Token for API call from database", tokenToUse);

      return await makeApiCall(
        tokenToUse!,
        userIdForApiCall ?? session?.user.id
      );
    }
  };

  // Updated refreshAccessToken function in SessionContext.tsx
  const refreshAccessToken = async (
    overrideToken?: string,
    sessionUserId?: number,
    apiRequestUserId?: number
  ): Promise<string | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = new Promise<string | null>(
      async (resolve, reject) => {
        try {
          let tokenToUse = await getRefreshToken(
            overrideToken,
            apiRequestUserId
          );

          if (!tokenToUse) {
            console.error("No refresh token found");
            resolve(null);
            return;
          }

          try {
            const newToken = await requestNewTokens(tokenToUse);

            console.log("API Request User ID:", apiRequestUserId);
            console.log("New Token:", newToken);

            if (apiRequestUserId) {
              // Send a request to the API route to update tokens in the database
              await fetch("/api/saveRefreshUpdate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: apiRequestUserId,
                  accessToken: newToken.access_token,
                  refreshToken: newToken.refresh_token,
                  expires: newToken.expires,
                  sessionAccessTokenExpiresAt:
                    newToken.sessionAccessTokenExpiresAt, // Pass the sessionAccessTokenExpiresAt
                }),
              });
            }

            await updateSessionWithNewToken(newToken, apiRequestUserId);
            resolve(newToken.access_token);
          } catch (error) {
            console.error("Failed to refresh access token:", error);
            await logout(setSession, setName, session);
            resolve(null);
          }
        } catch (error) {
          console.error("Error during token refresh:", error);
          reject(null);
        } finally {
          refreshPromiseRef.current = null;
          // Process the next request in the queue
          if (refreshQueue.length > 0) {
            const nextInQueue = refreshQueue.shift();
            nextInQueue && nextInQueue();
          }
        }
      }
    );

    return new Promise<string | null>((resolve) => {
      refreshQueue.push(() => {
        resolve(refreshPromiseRef.current);
      });

      // If we're the only item in the queue, execute immediately
      if (refreshQueue.length === 1) {
        refreshQueue[0]();
      }
    });
  };

  const getRefreshToken = async (
    overrideToken?: string,
    apiRequestUserId?: number
  ): Promise<string | undefined> => {
    if (apiRequestUserId) {
      try {
        const response = await fetch("/api/sessionLoadChecker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiRequestUserId }),
        });

        const result = await response.json();
        if (result.refreshToken) {
          console.log("Found refresh token in the database");
          return result.refreshToken;
        }
      } catch (error) {
        console.error("Error fetching refresh token from database:", error);
      }
    }

    return (
      overrideToken || Cookies.get("refresh_token") || session?.refreshToken
    );
  };

  const requestNewTokens = async (refreshToken: string) => {
    const { data } = await authService.refreshToken(refreshToken);

    // Calculate the sessionAccessTokenExpiresAt timestamp
    const sessionAccessTokenExpiresAt = new Date(
      Date.now() + 60 * 1000
    ).toISOString();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires: data.expires,
      sessionAccessTokenExpiresAt: sessionAccessTokenExpiresAt, // Return as an ISO string for consistency
    };
  };

  const updateSessionWithNewToken = async (
    newToken: {
      access_token: string;
      refresh_token: string;
      expires: number;
      sessionAccessTokenExpiresAt?: string; // Make this new field optional
    },
    apiRequestUserId?: number // Add the optional userId parameter here
  ) => {
    console.log("Starting updateSessionWithNewToken"); // Log the start of the function

    // Log the new token details
    console.log("New Token:", newToken);

    const user = await authService.fetchUserData(newToken.access_token);
    console.log("Fetched User Data:", user); // Log the fetched user data

    const role = await authService.fetchUserRole(
      newToken.access_token,
      user.role
    );
    console.log("Fetched User Role:", role); // Log the fetched user role

    // Use the apiRequestUserId if provided, otherwise fallback to user.id from the fetched user data
    const userId = apiRequestUserId || user.id;
    console.log("Determined User ID:", userId); // Log the determined user ID

    setSession((prevSession) => {
      const updatedSession = {
        ...prevSession,
        token: newToken.access_token,
        refreshToken: newToken.refresh_token,
        expires: newToken.expires,
        sessionAccessTokenExpiresAt: newToken.sessionAccessTokenExpiresAt || "", // Include the new field if available
        user: {
          id: userId, // Use the userId determined above
          name: user.first_name,
          email: user.email,
          role: role.name,
        },
      };
      console.log("Updated Session:", updatedSession); // Log the updated session details
      return updatedSession;
    });

    setName(user.first_name);
    console.log("Set user name to:", user.first_name); // Log the set name operation

    saveTokensToCookies(
      newToken.access_token,
      newToken.refresh_token,
      newToken.expires,
      newToken.sessionAccessTokenExpiresAt || "" // Provide a default value for sessionAccessTokenExpiresAt
    );
    console.log("Tokens saved to cookies"); // Log the cookie saving operation

    console.log("Finished updateSessionWithNewToken"); // Log the end of the function
  };

  useEffect(() => {
    const initializeSession = async () => {
      if (hasInitialized.current) return;

      setLoading(true);

      const token = Cookies.get("access_token");
      const refreshToken = Cookies.get("refresh_token");
      const sessionAccessTokenExpiresAt = Cookies.get(
        "session_access_token_expires_at"
      );

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
            sessionAccessTokenExpiresAt: sessionAccessTokenExpiresAt || "", // Include the new value in the session
          });

          setName(user.first_name);
        } catch (error) {
          await handleFetchUserDataError(
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
        login: (credentials) =>
          login(credentials, setLoading, setSession, setName),
        logout: () => logout(setSession, setName, session),
        refreshAccessToken,
        withTokenRefresh,
        loading,
        name,
        sessionAccessTokenExpiresAt: session?.sessionAccessTokenExpiresAt ?? "",
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

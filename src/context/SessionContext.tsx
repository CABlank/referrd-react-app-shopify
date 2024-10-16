import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";

import { initializeSession } from "./session/initialize-session";
import {
  refreshAccessToken as importedRefreshAccessToken,
  withTokenRefresh as importedWithTokenRefresh,
} from "./session/token-manager";
import { login as importedLogin, logout as importedLogout } from "./session/session-utils";
import { Session, SessionContextType } from "./session-types";

// Creating the session context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | undefined>(undefined);
  const hasInitialized = useRef(false);

  // Ensure session is initialized when the component is mounted
  useEffect(() => {
    initializeSession({ setSession, setName, setLoading, hasInitialized });
  }, []);

  // Ensure that the session is properly updated after login
  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      await importedLogin(credentials, setLoading, setSession, setName);

      // Log the session state after login to check if the role and session data are set correctly
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        login,
        logout: () => importedLogout(setSession, setName, session),
        refreshAccessToken: (propsRefreshToken?: string | undefined) =>
          importedRefreshAccessToken(
            session?.user.id,
            undefined,
            setSession,
            setName,
            propsRefreshToken
          ),
        withTokenRefresh: (apiCall, propsRefreshToken, userId) =>
          importedWithTokenRefresh(
            apiCall,
            session,
            setSession,
            setName,
            userId,
            propsRefreshToken
          ),
        loading,
        name,
        sessionAccessTokenExpiresAt: session?.sessionAccessTokenExpiresAt ?? "",
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Provide a hook for using the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within a SessionProvider");
  return context;
};

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

import { initializeSession } from "./session/initializeSession";
import {
  refreshAccessToken as importedRefreshAccessToken,
  withTokenRefresh as importedWithTokenRefresh,
} from "./session/tokenManager";
import {
  login as importedLogin,
  logout as importedLogout,
} from "./session/sessionUtils";
import { Session, SessionContextType } from "./sessionTypes";

// Creating the session context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | undefined>(undefined);
  const hasInitialized = useRef(false);

  // Re-export functions so other files can import them from this file
  const refreshAccessToken = importedRefreshAccessToken;
  const withTokenRefresh = importedWithTokenRefresh;
  const login = importedLogin;
  const logout = importedLogout;

  useEffect(() => {
    initializeSession({ setSession, setName, setLoading, hasInitialized });

    const withTokenRefresh = importedWithTokenRefresh;
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        login: (credentials) =>
          importedLogin(credentials, setLoading, setSession, setName),
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
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
};

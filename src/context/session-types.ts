export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

export interface Session {
  id?: number;
  user: User;
  accessToken: string;
  refreshToken: string;
  expires: number;
  sessionAccessTokenExpiresAt: string; // Add the new property
}

export type SetSessionFunction = React.Dispatch<
  React.SetStateAction<Session | null>
>;

export interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAccessToken: (propsRefreshToken?: string) => Promise<string | null>;
  withTokenRefresh: (
    apiCall: (accessToken: string, userId?: number) => Promise<any>,
    propsRefreshToken?: string,
    userId?: number
  ) => Promise<any>;
  loading: boolean;
  name?: string;
  sessionAccessTokenExpiresAt: string; // Add the new property
}

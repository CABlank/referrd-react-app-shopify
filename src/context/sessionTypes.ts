export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

export interface Session {
  id?: number;
  user: User;
  token: string;
  refreshToken: string;
  expires: number;
}

export interface SessionContextType {
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

import fetchMock from "jest-fetch-mock";
import auth from "./auth"; // Adjust the import path as necessary

const API_URL = process.env.NEXT_PUBLIC_API_URL;

describe("Auth API functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("login", () => {
    it("should successfully login with correct credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };
      const responseData = { token: "fake-jwt-token" };

      fetchMock.mockResponseOnce(JSON.stringify(responseData));

      const response = await auth.login(credentials);

      expect(response).toEqual(responseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/auth/login`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })
      );
    });

    it("should throw an error if login fails", async () => {
      const credentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      const errorMessage = { message: "Invalid credentials" };

      fetchMock.mockResponseOnce(JSON.stringify(errorMessage), { status: 401 });

      await expect(auth.login(credentials)).rejects.toThrow(
        "Login failed: Invalid credentials"
      );
    });
  });

  describe("refreshToken", () => {
    it("should successfully refresh the token", async () => {
      const refreshToken = "fake-refresh-token";
      const responseData = { token: "new-fake-jwt-token" };

      fetchMock.mockResponseOnce(JSON.stringify(responseData));

      const response = await auth.refreshToken(refreshToken);

      expect(response).toEqual(responseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/auth/refresh`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      );
    });

    it("should throw an error if token refresh fails", async () => {
      const refreshToken = "fake-refresh-token";
      const errorMessage = { message: "Invalid refresh token" };

      fetchMock.mockResponseOnce(JSON.stringify(errorMessage), { status: 401 });

      await expect(auth.refreshToken(refreshToken)).rejects.toThrow(
        "Token refresh failed: Invalid refresh token"
      );
    });
  });

  describe("logout", () => {
    it("should successfully logout", async () => {
      const refreshToken = "fake-refresh-token";
      const mode = "json";
      fetchMock.mockResponseOnce(JSON.stringify({}));

      const response = await auth.logout(refreshToken, mode);

      expect(response).toEqual({});
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/auth/logout`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken, mode }),
        })
      );
    });

    it("should throw an error if logout fails with expected response", async () => {
      const refreshToken = "fake-refresh-token";
      const mode = "json";
      const errorMessage = { message: "Logout failed" };

      fetchMock.mockResponseOnce(JSON.stringify(errorMessage), { status: 400 });

      await expect(auth.logout(refreshToken, mode)).rejects.toThrow(
        "Logout failed: Logout failed"
      );
    });

    it("should throw an error if logout fails with unexpected response", async () => {
      const refreshToken = "fake-refresh-token";
      const mode = "json";

      fetchMock.mockResponseOnce("Unexpected response", { status: 400 });

      await expect(auth.logout(refreshToken, mode)).rejects.toThrow(
        "Logout failed with unexpected response"
      );
    });
  });

  describe("fetchUserData", () => {
    it("should successfully fetch user data", async () => {
      const token = "fake-jwt-token";
      const userData = { id: 1, name: "John Doe" };

      fetchMock.mockResponseOnce(JSON.stringify({ data: userData }));

      const response = await auth.fetchUserData(token);

      expect(response).toEqual(userData);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/users/me`,
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should throw an error if fetching user data fails", async () => {
      const token = "fake-jwt-token";
      const errorMessage = {
        message: "Invalid token",
        errors: [{ extensions: { code: "TOKEN_EXPIRED" } }],
      };

      fetchMock.mockResponseOnce(JSON.stringify(errorMessage), { status: 401 });

      await expect(auth.fetchUserData(token)).rejects.toThrow("Token expired");
    });
  });

  describe("fetchUserRole", () => {
    it("should successfully fetch user role", async () => {
      const token = "fake-jwt-token";
      const roleId = "role-id-123";
      const roleData = { id: roleId, name: "Admin" };

      fetchMock.mockResponseOnce(JSON.stringify({ data: roleData }));

      const response = await auth.fetchUserRole(token, roleId);

      expect(response).toEqual(roleData);
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/roles/${roleId}`,
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should throw an error if fetching user role fails", async () => {
      const token = "fake-jwt-token";
      const roleId = "role-id-123";
      const errorMessage = { message: "Role not found" };

      fetchMock.mockResponseOnce(JSON.stringify(errorMessage), { status: 404 });

      await expect(auth.fetchUserRole(token, roleId)).rejects.toThrow(
        "Failed to fetch user role: Role not found"
      );
    });
  });
});

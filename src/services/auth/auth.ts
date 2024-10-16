const API_URL = process.env.NEXT_PUBLIC_API_URL;

const login = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  // Check if the response is not OK (e.g., 401 Unauthorized)
  if (!response.ok) {
    const error = await response.json();
    console.error("Login failed:", error);
    throw new Error(`Login failed: ${error.message}`);
  }

  const data = await response.json();
  return data;
};

const refreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Token refresh failed:", error);
      throw new Error(
        `Token refresh failed: ${error.message || "No error message returned"}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

const logout = async (refreshToken: string, mode: string = "json") => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: refreshToken, mode }),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      console.error("Logout failed:", error);
      throw new Error(`Logout failed: ${error.message}`);
    } catch (err) {
      console.error("Unexpected response during logout");
      throw new Error("Logout failed with unexpected response");
    }
  }

  try {
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn("Logout response was not JSON, treating as success");
    return {}; // Assuming empty response body is still a success
  }
};

export const fetchUserData = async (token: string) => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.errors[0].extensions.code === "TOKEN_EXPIRED") {
      console.error("Token expired:", error);
      throw new Error("Token expired");
    }
    console.error("Failed to fetch user data:", error);
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }

  const data = await response.json();
  return data.data; // Assuming the user data is under a "data" key
};

export const updateUserData = async (
  token: string,
  userIdDirectus: string,
  updatedData: object
) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/users/${userIdDirectus}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      if (
        error.errors &&
        error.errors[0]?.extensions?.code === "TOKEN_EXPIRED"
      ) {
        console.error("Token expired:", error);
        throw new Error("Token expired");
      }
      console.error("Failed to update user data:", error);
      throw new Error(`Failed to update user data: ${error.message}`);
    }

    const data = await response.json();
    return data.data; // Assuming the updated user data is under a "data" key
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error; // Re-throw the error after logging it
  }
};

const fetchUserRole = async (token: string, roleId: string) => {
  const response = await fetch(`${API_URL}/roles/${roleId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to fetch user role:", error);
    throw new Error(`Failed to fetch user role: ${error.message}`);
  }

  const data = await response.json();
  return data.data;
};

const createUser = async (userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to create user:", error);
    throw new Error(`Failed to create user: ${error.message}`);
  }

  const data = await response.json();
  return data.data;
};

export default {
  login,
  refreshToken,
  updateUserData,
  logout,
  fetchUserData,
  fetchUserRole,
  createUser,
};

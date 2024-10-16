import authService from "../../../../services/auth/auth";

export const createDirectusUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string // plaintext or hashed password
): Promise<void> => {
  authService.createUser({
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });
};

export const loginDirectusUser = async (
  email: string,
  password: string // plaintext or hashed password
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const loginData = await authService.login({ email, password });

    if (!loginData || !loginData.data) {
      throw new Error("Login response is undefined or missing data.");
    }


    return {
      accessToken: loginData.data.access_token,
      refreshToken: loginData.data.refresh_token,
    };
  } catch (error) {
    console.error("Failed to log in to Directus:", error);
    throw new Error("Directus login failed.");
  }
};

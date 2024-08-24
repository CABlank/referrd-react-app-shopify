import authService from "../../../../services/auth/auth";

export const createOrLoginDirectusUser = async (
  email: string,
  firstName: string,
  lastName: string,
  ShopifyToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const credentials = { email, password: email };

  try {
    const loginData = await authService.login(credentials);
    return {
      accessToken: loginData.data.access_token,
      refreshToken: loginData.data.refresh_token,
    };
  } catch {
    try {
      await authService.createUser({
        email,
        password: email,
        first_name: firstName,
        last_name: lastName,
        ShopifyToken: ShopifyToken,
      });

      const loginData = await authService.login(credentials);
      return {
        accessToken: loginData.data.access_token,
        refreshToken: loginData.data.refresh_token,
      };
    } catch (error) {
      console.error("Failed to create or log in user in Directus", error);
      throw new Error("Directus user handling failed");
    }
  }
};

import prisma from "../database/prismaClient";
import { directusClient } from "./directusClient";
import { encrypt, decrypt } from "../security/encryption";

export const registerUser = async (email: string, role: string) => {
  const response = await directusClient.post("/users", {
    email,
    role,
  });

  const directusId = response.data.data.id;

  const user = await prisma.user.create({
    data: {
      email,
      directusId,
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  return user;
};

export const saveToken = async (
  userId: number,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date
) => {
  await prisma.token.create({
    data: {
      userId,
      accessToken: encrypt(accessToken),
      refreshToken: encrypt(refreshToken),
      expiresAt,
    },
  });
};

export const getToken = async (userId: number) => {
  const token = await prisma.token.findFirst({
    where: { userId },
    orderBy: { expiresAt: "desc" },
  });

  if (!token) {
    throw new Error("Token not found");
  }

  // Check if the token is expired
  if (new Date() > token.expiresAt) {
    return await refreshUserToken(userId, decrypt(token.refreshToken));
  }

  return decrypt(token.accessToken);
};

export const refreshUserToken = async (
  userId: number,
  refreshToken: string
) => {
  const response = await directusClient.post("/auth/refresh", {
    refresh_token: refreshToken,
  });

  const newAccessToken = response.data.data.access_token;
  const newRefreshToken = response.data.data.refresh_token;
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + response.data.data.expires_in);

  // Update the token in Prisma
  await prisma.token.create({
    data: {
      userId,
      accessToken: encrypt(newAccessToken),
      refreshToken: encrypt(newRefreshToken),
      expiresAt,
    },
  });

  return newAccessToken;
};

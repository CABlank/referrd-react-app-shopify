import { prisma } from "../../../../lib/prisma";

export const storeTokensInDatabase = async (
  userId: number,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date,
  sessionAccessTokenExpiresAt: string = ""
) => {
  try {
    const existingToken = await prisma.token.findFirst({ where: { userId } });

    if (existingToken) {
      await prisma.token.update({
        where: { id: existingToken.id },
        data: {
          accessToken,
          refreshToken,
          expiresAt,
          sessionAccessTokenExpiresAt,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.token.create({
        data: {
          userId,
          accessToken,
          refreshToken,
          expiresAt,
          sessionAccessTokenExpiresAt,
        },
      });
    }
  } catch (error) {
    console.error("Error saving tokens in the database", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

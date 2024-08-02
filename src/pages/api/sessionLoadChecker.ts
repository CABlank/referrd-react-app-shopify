import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/database/prismaClient";

export const updateTokens = async ({
  PrismaUserId,
  accessToken,
  refreshToken,
  expires,
}: {
  PrismaUserId: number;
  accessToken: string;
  refreshToken: string;
  expires: number;
}) => {
  try {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires);
    await prisma.token.updateMany({
      where: {
        userId: PrismaUserId,
      },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        updatedAt: new Date(),
      },
    });
    console.log("Updated tokens in Prisma for user:", PrismaUserId);
  } catch (error) {
    console.error("Error updating tokens in Prisma:", error);
    throw error;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { PrismaUserId, accessToken, refreshToken, expires } = req.body;

    try {
      await updateTokens({ PrismaUserId, accessToken, refreshToken, expires });
      res.status(200).json({ message: "Tokens updated successfully" });
    } catch (error) {
      console.error("Error updating tokens:", error);
      res.status(500).json({ error: "Failed to update tokens" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

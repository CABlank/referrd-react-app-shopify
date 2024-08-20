import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateTokens = async ({
  userId,
  accessToken,
  refreshToken,
  expires,
}: {
  userId: number;
  accessToken: string;
  refreshToken: string;
  expires: number;
}) => {
  try {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires);
    await prisma.token.updateMany({
      where: {
        userId: userId,
      },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        updatedAt: new Date(),
      },
    });
    console.log("Updated tokens in Prisma for user:", userId);
  } catch (error) {
    console.error("Error updating tokens in Prisma:", error);
    throw error;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { userId, accessToken, refreshToken, expires } = req.body;

    try {
      if (accessToken && refreshToken && expires) {
        await updateTokens({ userId, accessToken, refreshToken, expires });
        res.status(200).json({ message: "Tokens updated successfully" });
      } else {
        const tokenRecord = await prisma.token.findFirst({
          where: {
            userId: userId,
          },
        });
        if (tokenRecord) {
          res.status(200).json({ refreshToken: tokenRecord.refreshToken });
        } else {
          res
            .status(404)
            .json({ error: "No token found for the provided userId" });
        }
      }
    } catch (error) {
      console.error("Error updating tokens:", error);
      res.status(500).json({ error: "Failed to update tokens" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

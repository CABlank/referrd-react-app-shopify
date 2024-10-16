import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma"; // Ensure this is the correct path to your singleton Prisma client

// Function to update tokens in the database
const updateTokens = async ({
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
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expires);

  try {
    const existingToken = await prisma.token.findFirst({
      where: { userId },
    });

    if (!existingToken) {
      throw new Error(`No token found for the provided userId: ${userId}`);
    }

    await prisma.token.update({
      where: { id: existingToken.id },
      data: {
        accessToken,
        refreshToken,
        expiresAt,
        updatedAt: new Date(),
      },
    });

  } catch (error) {
    console.error(`Error updating tokens for userId: ${userId}`, error);
    throw error;
  }
};

// Function to get the refresh token from the database
const getRefreshToken = async (userId: number) => {
  try {
    const tokenRecord = await prisma.token.findFirst({
      where: { userId },
    });

    if (!tokenRecord) {
      throw new Error(`No token found for the provided userId: ${userId}`);
    }

    return tokenRecord.refreshToken;
  } catch (error) {
    console.error(`Error fetching refresh token for userId: ${userId}`, error);
    throw error;
  }
};

// API handler
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId, accessToken, refreshToken, expires } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid or missing userId" });
    }

    if (accessToken && refreshToken && expires) {
      await updateTokens({
        userId,
        accessToken,
        refreshToken,
        expires,
      });
      return res.status(200).json({ message: "Tokens updated successfully" });
    } else {
      const token = await getRefreshToken(userId);
      return res.status(200).json({ refreshToken: token });
    }
  } catch (error) {
    console.error("Error handling token update:", error);
    return res
      .status(500)
      .json({ error: (error as any).message || "Internal Server Error" });
  } finally {
    // Ensure the Prisma client is disconnected after handling the request
    await prisma.$disconnect();
  }
};

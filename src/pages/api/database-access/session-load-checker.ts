import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getSessionExpirationTime } from "@/utils/sessionTimeUtils";

// Update tokens for a specific user in the database
const updateTokens = async ({
  apiRequestUserId,
  accessToken,
  refreshToken,
  expires,
  sessionAccessTokenExpiration,
}: {
  apiRequestUserId: number;
  accessToken: string;
  refreshToken: string;
  expires: number;
  sessionAccessTokenExpiration: number;
}) => {
  const expiresAt = new Date(Date.now() + expires * 1000); // Calculate the expiration time
  const sessionAccessTokenExpiresAt = getSessionExpirationTime();

  try {

    const result = await prisma.token.updateMany({
      where: { userId: apiRequestUserId },
      data: {
        accessToken,
        refreshToken,
        expiresAt,
        sessionAccessTokenExpiresAt, // Update session access token expiration
        updatedAt: new Date(),
      },
    });



    return { accessToken, refreshToken, sessionAccessTokenExpiresAt }; // Return updated tokens and expiration date
  } catch (error) {
    console.error(
      `Error updating tokens for userId: ${apiRequestUserId}`,
      error
    );
    throw error;
  }
};

// Retrieve all token information from the database for a specific user
const getTokenData = async (apiRequestUserId: number) => {
  try {

    const tokenRecord = await prisma.token.findFirst({
      where: { userId: apiRequestUserId },
    });

    if (!tokenRecord) {
      throw new Error(`No token found for userId: ${apiRequestUserId}`);
    }

    return {
      accessToken: tokenRecord.accessToken,
      refreshToken: tokenRecord.refreshToken,
      sessionAccessTokenExpiresAt: tokenRecord.sessionAccessTokenExpiresAt,
      expires: tokenRecord.expiresAt,
    };
  } catch (error) {
    console.error(
      `Error fetching token data for userId: ${apiRequestUserId}`,
      error
    );
    throw error;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      apiRequestUserId,
      accessToken,
      refreshToken,
      expires,
      sessionAccessTokenExpiration,
    } = req.body;


    if (!apiRequestUserId || isNaN(apiRequestUserId)) {
      console.error("Invalid or missing userId:", apiRequestUserId);
      return res.status(400).json({ error: "Invalid or missing userId" });
    }

    // If all necessary fields are provided, update the tokens
    if (
      accessToken &&
      refreshToken &&
      expires &&
      sessionAccessTokenExpiration
    ) {
      const updatedTokens = await updateTokens({
        apiRequestUserId,
        accessToken,
        refreshToken,
        expires,
        sessionAccessTokenExpiration,
      });

      return res.status(200).json({
        message: "Tokens updated successfully",
        accessToken: updatedTokens.accessToken,
        refreshToken: updatedTokens.refreshToken,
        sessionAccessTokenExpiration: updatedTokens.sessionAccessTokenExpiresAt,
      });
    } else {
      // Otherwise, retrieve and return all token data
      const tokenData = await getTokenData(apiRequestUserId);
      return res.status(200).json(tokenData);
    }
  } catch (error) {
    console.error("Error handling token update:", error);
    return res
      .status(500)
      .json({ error: (error as any).message || "Internal Server Error" });
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected after the operation
  }
};

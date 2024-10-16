import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

// Function to create a new user
export const createUser = async (
  email: string,
  firstName: string,
  lastName: string,
  shopDomain?: string
): Promise<null | {
  id: number;
  email: string;
  shopDomain: string | null;
  hashedPassword: string;
}> => {
  try {
    // Hash the email to create a password
    const hashedPassword = await bcrypt.hash(email, 10);

    // Create the new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        directusId: "1637e8a5-22f9-4e1b-b378-97828291ef8a",
        shopDomain,
      },
    });

    return { ...user, hashedPassword }; // Return the user object with the hashed password
  } catch (error) {
    console.error("Error creating user in the database", error);
    return null; // Ensure we return null in case of an error
  } finally {
    await prisma.$disconnect();
  }
};

// Function to update an existing user
export const updateUser = async (
  email: string,
  firstName: string,
  lastName: string,
  shopDomain?: string
): Promise<null | {
  id: number;
  email: string;
  shopDomain: string | null;
  hashedPassword: string;
}> => {
  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      return null; // Return null if the user doesn't exist
    }

    // Update the user data
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        shopDomain: shopDomain || user.shopDomain,
        updatedAt: new Date(),
      },
    });

    return { ...updatedUser, hashedPassword: user.password }; // Return the updated user object with the existing hashed password
  } catch (error) {
    console.error("Error updating user in the database", error);
    return null; // Ensure we return null in case of an error
  } finally {
    await prisma.$disconnect();
  }
};

// Function to store tokens in the database
export const storeTokensInDatabase = async (
  userId: number,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date,
  sessionAccessTokenExpiresAt: Date
): Promise<void> => {
  try {
    // Check if a token entry already exists for this user
    const existingToken = await prisma.token.findFirst({
      where: { userId },
    });

    if (existingToken) {
      // Update the existing token
      await prisma.token.update({
        where: { id: existingToken.id }, // Use the token's unique ID
        data: {
          accessToken,
          refreshToken,
          expiresAt,
          sessionAccessTokenExpiresAt,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create a new token entry
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
    console.error("Failed to store tokens in the database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { logAndReturnError } from "../ErrorModule";

export const createOrUpdateUser = async (
  email: string,
  firstName: string,
  lastName: string,
  shopDomain?: string
): Promise<null | { id: number; email: string; shopDomain: string | null }> => {
  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(email, 10);
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          directusId: "1637e8a5-22f9-4e1b-b378-97828291ef8a",
          shopDomain,
        },
      });
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          firstName,
          lastName,
          shopDomain: shopDomain || user.shopDomain,
          updatedAt: new Date(),
        },
      });
    }
    return user;
  } catch (error) {
    console.error("Error registering user in the database", error);
    return null; // Ensure we return null in case of an error
  } finally {
    await prisma.$disconnect();
  }
};

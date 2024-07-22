import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
  } catch (e) {
    console.error("Error connecting to the database", e);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

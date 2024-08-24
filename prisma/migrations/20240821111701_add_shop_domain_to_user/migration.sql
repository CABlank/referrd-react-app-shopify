/*
  Warnings:

  - You are about to drop the column `shopId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_shopId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "shopId",
ADD COLUMN     "shopDomain" TEXT;

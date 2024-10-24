
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_shopId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "shopId",
ADD COLUMN     "shopDomain" TEXT;

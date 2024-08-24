/*
  Warnings:

  - Added the required column `sessionAccessTokenExpiresAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "sessionAccessTokenExpiresAt" TIMESTAMP(3) NOT NULL;

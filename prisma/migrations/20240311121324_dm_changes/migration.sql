/*
  Warnings:

  - You are about to drop the `UserLogin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLogin" DROP CONSTRAINT "UserLogin_userId_fkey";

-- DropTable
DROP TABLE "UserLogin";

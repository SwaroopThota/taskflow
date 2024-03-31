/*
  Warnings:

  - You are about to drop the column `userEmail` on the `UserLogin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserLogin` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserLogin" DROP CONSTRAINT "UserLogin_userId_userEmail_fkey";

-- DropIndex
DROP INDEX "User_id_email_key";

-- AlterTable
ALTER TABLE "UserLogin" DROP COLUMN "userEmail";

-- CreateIndex
CREATE UNIQUE INDEX "UserLogin_userId_key" ON "UserLogin"("userId");

-- AddForeignKey
ALTER TABLE "UserLogin" ADD CONSTRAINT "UserLogin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

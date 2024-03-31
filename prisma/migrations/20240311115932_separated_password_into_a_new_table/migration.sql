/*
  Warnings:

  - A unique constraint covering the columns `[id,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Panel" DROP CONSTRAINT "Panel_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_panelId_fkey";

-- DropForeignKey
ALTER TABLE "UserBoardJoin" DROP CONSTRAINT "UserBoardJoin_boardId_fkey";

-- DropForeignKey
ALTER TABLE "UserBoardJoin" DROP CONSTRAINT "UserBoardJoin_userId_fkey";

-- DropIndex
DROP INDEX "User_email_password_key";

-- CreateTable
CREATE TABLE "UserLogin" (
    "id" UUID NOT NULL,
    "password" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "UserLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_key" ON "User"("id", "email");

-- AddForeignKey
ALTER TABLE "UserLogin" ADD CONSTRAINT "UserLogin_userId_userEmail_fkey" FOREIGN KEY ("userId", "userEmail") REFERENCES "User"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoardJoin" ADD CONSTRAINT "UserBoardJoin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoardJoin" ADD CONSTRAINT "UserBoardJoin_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panel" ADD CONSTRAINT "Panel_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

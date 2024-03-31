-- AlterTable
ALTER TABLE "Panel" ADD COLUMN     "sortOrder" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "sortOrder" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "UserBoardJoin" ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false;

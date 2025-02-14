/*
  Warnings:

  - You are about to drop the column `rank` on the `Leaderboard` table. All the data in the column will be lost.
  - Added the required column `budget` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "rank";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "AppState" (
    "id" SERIAL NOT NULL,
    "currentGameweekId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppState_pkey" PRIMARY KEY ("id")
);

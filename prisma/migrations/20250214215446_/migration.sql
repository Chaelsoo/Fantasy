/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "logoUrl";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "logoUrl" TEXT;

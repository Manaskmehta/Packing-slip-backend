/*
  Warnings:

  - You are about to drop the column `dcLink` on the `PackingSlip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PackingSlip" DROP COLUMN "dcLink";

-- AlterTable
ALTER TABLE "PackingSlipItem" ADD COLUMN     "dcLink" TEXT;

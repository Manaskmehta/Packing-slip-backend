/*
  Warnings:

  - You are about to drop the column `areaSqMtr` on the `InwardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `paintApplicable` on the `InwardEntry` table. All the data in the column will be lost.
  - Made the column `poId` on table `InwardEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InwardEntry" DROP CONSTRAINT "InwardEntry_poId_fkey";

-- AlterTable
ALTER TABLE "InwardEntry" DROP COLUMN "areaSqMtr",
DROP COLUMN "paintApplicable",
ALTER COLUMN "poId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "InwardEntry" ADD CONSTRAINT "InwardEntry_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

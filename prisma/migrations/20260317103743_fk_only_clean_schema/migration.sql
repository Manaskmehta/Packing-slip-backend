/*
  Warnings:

  - You are about to drop the column `partyName` on the `InwardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `pendingChallanQty` on the `InwardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `po` on the `InwardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `productCode` on the `InwardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `InwardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `InwardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `partyName` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `productCode` on the `PackingSlipItem` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `PackingSlipItem` table. All the data in the column will be lost.
  - Made the column `partyId` on table `InwardEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `InwardEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `partyId` on table `PackingSlip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `PackingSlipItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InwardEntry" DROP CONSTRAINT "InwardEntry_partyId_fkey";

-- DropForeignKey
ALTER TABLE "InwardEntry" DROP CONSTRAINT "InwardEntry_productId_fkey";

-- DropForeignKey
ALTER TABLE "PackingSlip" DROP CONSTRAINT "PackingSlip_partyId_fkey";

-- DropForeignKey
ALTER TABLE "PackingSlipItem" DROP CONSTRAINT "PackingSlipItem_productId_fkey";

-- AlterTable
ALTER TABLE "InwardEntry" DROP COLUMN "partyName",
DROP COLUMN "pendingChallanQty",
DROP COLUMN "po",
DROP COLUMN "productCode",
DROP COLUMN "productName",
DROP COLUMN "projectName",
ALTER COLUMN "partyId" SET NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PackingSlip" DROP COLUMN "partyName",
DROP COLUMN "projectName",
ALTER COLUMN "partyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PackingSlipItem" DROP COLUMN "productCode",
DROP COLUMN "productName",
ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "InwardEntry" ADD CONSTRAINT "InwardEntry_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InwardEntry" ADD CONSTRAINT "InwardEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingSlip" ADD CONSTRAINT "PackingSlip_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingSlipItem" ADD CONSTRAINT "PackingSlipItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

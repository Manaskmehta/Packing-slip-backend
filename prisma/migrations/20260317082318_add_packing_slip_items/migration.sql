/*
  Warnings:

  - You are about to drop the column `businessLine` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `kg` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `productCode` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `PackingSlip` table. All the data in the column will be lost.
  - You are about to drop the column `specification` on the `PackingSlip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PackingSlip" DROP CONSTRAINT "PackingSlip_productId_fkey";

-- AlterTable
ALTER TABLE "PackingSlip" DROP COLUMN "businessLine",
DROP COLUMN "kg",
DROP COLUMN "productCode",
DROP COLUMN "productId",
DROP COLUMN "productName",
DROP COLUMN "qty",
DROP COLUMN "specification";

-- CreateTable
CREATE TABLE "PackingSlipItem" (
    "id" SERIAL NOT NULL,
    "packingSlipId" INTEGER NOT NULL,
    "productCode" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "specification" TEXT,
    "businessLine" TEXT,
    "qty" INTEGER NOT NULL,
    "kg" DOUBLE PRECISION,
    "productId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackingSlipItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackingSlipItem" ADD CONSTRAINT "PackingSlipItem_packingSlipId_fkey" FOREIGN KEY ("packingSlipId") REFERENCES "PackingSlip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingSlipItem" ADD CONSTRAINT "PackingSlipItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

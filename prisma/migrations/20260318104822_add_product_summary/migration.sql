-- AlterTable
ALTER TABLE "InwardEntry" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PO" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PackingSlip" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "packagingQty" INTEGER,
ADD COLUMN     "packagingWeightPerPc" DOUBLE PRECISION,
ADD COLUMN     "vehicleNo" TEXT;

-- AlterTable
ALTER TABLE "PackingSlipItem" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "finalBillableWeight" DOUBLE PRECISION,
ADD COLUMN     "slipWeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PackingSlipProductSummary" (
    "id" SERIAL NOT NULL,
    "packingSlipId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "slipWeight" DOUBLE PRECISION,
    "packagingWeightPerPc" DOUBLE PRECISION,
    "packagingQty" INTEGER,
    "finalBillableWeight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingSlipProductSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackingSlipProductSummary_packingSlipId_productId_key" ON "PackingSlipProductSummary"("packingSlipId", "productId");

-- AddForeignKey
ALTER TABLE "PackingSlipProductSummary" ADD CONSTRAINT "PackingSlipProductSummary_packingSlipId_fkey" FOREIGN KEY ("packingSlipId") REFERENCES "PackingSlip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingSlipProductSummary" ADD CONSTRAINT "PackingSlipProductSummary_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

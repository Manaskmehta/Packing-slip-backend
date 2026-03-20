-- AlterTable
ALTER TABLE "PackingSlip" ADD COLUMN     "finalBillableWeight" DOUBLE PRECISION,
ADD COLUMN     "slipWeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PackingSlipItem" ADD COLUMN     "bundleQty" INTEGER,
ADD COLUMN     "noOfBundles" INTEGER,
ADD COLUMN     "packagingQty" INTEGER,
ADD COLUMN     "packagingWeightPerPc" DOUBLE PRECISION;

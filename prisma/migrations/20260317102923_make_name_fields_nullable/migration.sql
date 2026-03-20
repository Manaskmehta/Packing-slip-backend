-- AlterTable
ALTER TABLE "InwardEntry" ALTER COLUMN "productCode" DROP NOT NULL,
ALTER COLUMN "partyName" DROP NOT NULL,
ALTER COLUMN "productName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PackingSlip" ALTER COLUMN "partyName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PackingSlipItem" ALTER COLUMN "productCode" DROP NOT NULL,
ALTER COLUMN "productName" DROP NOT NULL;

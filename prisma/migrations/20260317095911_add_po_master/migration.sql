-- AlterTable
ALTER TABLE "InwardEntry" ADD COLUMN     "poId" INTEGER;

-- AlterTable
ALTER TABLE "PackingSlip" ADD COLUMN     "poId" INTEGER;

-- CreateTable
CREATE TABLE "PO" (
    "id" SERIAL NOT NULL,
    "poNumber" TEXT NOT NULL,
    "imageLink" TEXT,
    "date" TIMESTAMP(3),
    "partyId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PO_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PO_poNumber_key" ON "PO"("poNumber");

-- AddForeignKey
ALTER TABLE "PO" ADD CONSTRAINT "PO_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InwardEntry" ADD CONSTRAINT "InwardEntry_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingSlip" ADD CONSTRAINT "PackingSlip_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

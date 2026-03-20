-- DropForeignKey
ALTER TABLE "InwardEntry" DROP CONSTRAINT "InwardEntry_poId_fkey";

-- AlterTable
ALTER TABLE "InwardEntry" ALTER COLUMN "poId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "InwardEntry" ADD CONSTRAINT "InwardEntry_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

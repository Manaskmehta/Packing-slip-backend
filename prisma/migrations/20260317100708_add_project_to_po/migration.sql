-- AlterTable
ALTER TABLE "PO" ADD COLUMN     "projectId" INTEGER;

-- AddForeignKey
ALTER TABLE "PO" ADD CONSTRAINT "PO_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

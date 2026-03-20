-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InwardEntry" (
    "id" SERIAL NOT NULL,
    "srNo" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "challan" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "inwardQty" INTEGER NOT NULL,
    "partyName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "specification" TEXT,
    "projectName" TEXT,
    "kg" DOUBLE PRECISION,
    "pendingChallanQty" INTEGER,
    "challanDays" INTEGER,
    "dcLink" TEXT,
    "po" TEXT,
    "remarks" TEXT,
    "paintApplicable" BOOLEAN NOT NULL DEFAULT false,
    "areaSqMtr" DOUBLE PRECISION,
    "year" TEXT,
    "businessLine" TEXT,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InwardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackingSlip" (
    "id" SERIAL NOT NULL,
    "slipNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "partyName" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "specification" TEXT,
    "qty" INTEGER NOT NULL,
    "kg" DOUBLE PRECISION,
    "projectName" TEXT,
    "dcLink" TEXT,
    "remarks" TEXT,
    "businessLine" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "printedAt" TIMESTAMP(3),
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingSlip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PackingSlip_slipNo_key" ON "PackingSlip"("slipNo");

-- AddForeignKey
ALTER TABLE "InwardEntry" ADD CONSTRAINT "InwardEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingSlip" ADD CONSTRAINT "PackingSlip_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ServiceOrder" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceOrder_companyId_idx" ON "ServiceOrder"("companyId");

-- CreateIndex
CREATE INDEX "ServiceOrder_status_idx" ON "ServiceOrder"("status");

-- CreateIndex
CREATE INDEX "ServiceOrder_priority_idx" ON "ServiceOrder"("priority");

-- CreateIndex
CREATE INDEX "ServiceOrder_createdAt_idx" ON "ServiceOrder"("createdAt");

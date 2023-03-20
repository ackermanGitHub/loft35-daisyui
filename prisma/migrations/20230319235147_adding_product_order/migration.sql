/*
  Warnings:

  - A unique constraint covering the columns `[priority]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "priority" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_priority_key" ON "Product"("priority");
